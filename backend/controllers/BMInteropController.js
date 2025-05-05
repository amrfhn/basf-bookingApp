const LDAPClient = require('basf-gtu-utils/client/LDAP')
const SiteController = require('./SiteController')
const BuildingController = require('./BuildingController')
const FloorController = require('./FloorController')
const AreaController = require('./AreaController')
const HoodController = require('./HoodController')
const InteropStagingDAO = require('../model/dao/InteropStagingDAO')
const AmenitiesController = require('./AmenitiesController')
const BookingsMetaController = require('./BookingsMetaController')
const Errors = require('./errors/CustomErrorTypes')
const axios = require('axios')
const {
  OP_CREATE,
  OP_UPDATE,
  getCurrentUnixTimestamp,
  BM_BOOKING_CANCELATION,
  getCurrentDateAsStringYYYYMMDD,
  getStringBinarySize,
  decodeBase64,
  decodeSlashFromHexNCRToUTF
} = require('../common/Utils')
const { startDate, endDate } = require('../model/migrations/common/index')
const { SeatDAO, SiteDAO, BuildingDAO, FloorDAO, BookingDAO, CalendarDAO, BookingsMetaDAO} = require('../model/dao')
const { ungzip } = require('node-gzip')

const MIDDLEWARE_CPI_TEST_CONN_ENDPOINT =
  'https://' + process.env.BASEURL + '/connectivity_middleware_resolver/api/future_of_work/test'
const WORKSPACE_LAYOUT_EVENTSCHEMA = 'com.buildingminds.core.userandcustomerexperience.WorkspaceLayout'
const WORKSPACE_EVENTSCHEMA = 'com.buildingminds.core.userandcustomerexperience.Workspace'
const NEIGHBOURHOOD_EVENTSCHEMA = 'com.buildingminds.core.userandcustomerexperience.Neighbourhood'
const SITE_EVENTSCHEMA = 'com.buildingminds.core.digitaltwin.Site'
const BUILDING_EVENTSCHEMA = 'com.buildingminds.core.digitaltwin.Building'
const FLOOR_EVENTSCHEMA = 'com.buildingminds.core.digitaltwin.Floor'

const MIDDLEWARE_CPI_CONNECTION_BOOKING_ENDPOINT = process.env.CPI_ENDPOINT
const TOKEN_INFO_ENDPOINT = process.env.TOKEN_INFO_ENDPOINT
const TIME_FOR_DATE_VALIDFROM_VIDIL = 'T00:00:00'
const TIME_FOR_DATE_VALIDUNTIL_VIDIL = 'T23:59:59'
const TIME_FOR_DATE_VALIDFROM_DBT = 'T00:00:00Z'
const TIME_FOR_DATE_VALIDUNTIL_DBT = 'T23:59:59Z'
const CHECK_IN_TIME_DBT = 'T08:00:00Z'
const CHECK_OUT_TIME_DBT = 'T17:00:00Z'
const CHECK_IN_TIME_VIDIL = '08:00:00'
const CHECK_OUT_TIME_VIDIL = '17:00:00'
const DATE_SIZE_LIMIT = 10
const DATE_WITH_TIME_SIZE_LIMIT = 19
const FIVE_MB_IN_BYTES = 5242880
const DBT = 'DBT'
const VIDIL = 'VIDIL'

const { BM_BOOKING_COMPLETED } = require('../common/Utils')

module.exports = {
  async workspaceSitesTopicSite(body, operation) {
    console.log('Receiving request from BMInterop to ', operation, ' site...')
    if (operation === OP_CREATE) await createSite(body)
    else await registerWorkspaceSiteEventsInStaging(body)
  },
  async workspaceSitesTopicBuilding(body, operation) {
    console.log('Receiving request from BMInterop to ', operation, ' building...')
    if (operation === OP_CREATE) await createBuilding(body)
    else await registerWorkspaceBuildingEventsInStaging(body)
  },
  async workspaceSitesTopicFloor(body, operation) {
    console.log('Receiving request from BMInterop to ', operation, ' floor...')
    if (operation === OP_CREATE) await createFloor(body)
    else await registerWorkspaceFloorEventsInStaging(body)
  },

  async workSpacesTopicCommon(body, operation) {
    console.log('Receiving request from BMInterop to ', operation, ' workspace...')
    if (operation === OP_CREATE) await createSeat(body)
    else await registerWorkspaceEventsInStaging(body)
  },
  async workSpacesTopicNeighbourhood(body, operation) {
    console.log('Receiving request from BMInterop to ', operation, ' neighbourhood...')
    if (operation === OP_CREATE) await createNeighbourhood(body)
    else await registerNeighbourhoodEventsInStaging(body)
  },
  async workSpaceLayoutTopic(data, operation) {
    console.log('Receiving request from BMInterop to ', operation, ' workSpaceLayout...')
    await createWorkspaceLayoutInArea(data)
  },
  // async workSpaceBookingTopicSingleEvent({ type, bookingPayload }) {
  //   if (bookingPayload) {
  //     await sendBookingEventToCPISingleData({ type, bookingPayload }, DBT)
  //     await sendBookingEventToCPISingleData({ type, bookingPayload }, VIDIL)
  //   }
  // },
  async workSpaceBookingTopicBulkEvent() {
    const type = BM_BOOKING_COMPLETED
    let enhancedBooks = []

    const bookingsMeta = await BookingsMetaDAO.getAll({ statusId: 2 })
    const bookingIds = bookingsMeta.map((b) => b.bookingId)

    const bookings = await BookingDAO.getAll({ ids: bookingIds })
    enhancedBooks = bookings.slice(0, 30)

    console.log(enhancedBooks.length + ' bookings data to be sent to CPI, out of ' + bookings.length)

    if (enhancedBooks.length > 0) {
      try {
        await sendBookingEventToCPIBulkData({ type, bookingPayload: enhancedBooks }, DBT)
      } catch (e) {
        console.error('Error sending bulk data for ' + VIDIL)
        return { exception: e.toString() }
      }

      try {
        await sendBookingEventToCPIBulkData({ type, bookingPayload: enhancedBooks }, VIDIL)

      } catch (e) {
        console.error('Error sending bulk data for ' + VIDIL)
        return { exception: e.toString() }
      }

      await BookingsMetaController.bulkUpdateBookingsMeta(enhancedBooks)
    }
  },
  async foWCPIConnectivityTest(data) {
    try {
      const postInstance = axios.create()
      console.debug('Middleware request execution...')
      const { data: postRes } = await postInstance.post(
        MIDDLEWARE_CPI_TEST_CONN_ENDPOINT,
        { auth: data.auth },
        {
          headers: {
            'X-Gitlab-Token': process.env.GITLAB_TOKEN,
          },
        }
      )
      const res = { response: postRes }
      return res
    } catch (e) {
      return { exception: e.toString() }
    }
  },
  async executeStagingUpdates() {
    console.log('Executing executeStagingUpdates method...')
    const stagingElems = await InteropStagingDAO.getAll({ tenSecFromNowTimestamp: true }) // Take 10 seconds before to avoid any uncommitted reading that may cause inconsistency issues
    if (!stagingElems.length) {
      return
    }
    const latestElems = {
      latestLayoutCreate: [],
      latestLayoutUpdate: [],
      latestLayoutDelete: [],
      latestSeatUpdate: [],
      latestSeatDelete: [],
      latestSiteUpdate: [],
      latestSiteDelete: [],
      latestBuildingUpdate: [],
      latestBuildingDelete: [],
      latestFloorUpdate: [],
      latestFloorDelete: [],
      latestNeighbourhoodUpdate: [],
      latestNeighbourhoodDelete: [],
    }
    // eslint-disable-next-line array-callback-return
    stagingElems.map((elem) => {
      const eventInstance = JSON.parse(elem.eventSchemaInstance)
      switch (elem.eventSchema) {
        case WORKSPACE_LAYOUT_EVENTSCHEMA:
          workspaceLayoutStagingAccumulation(latestElems, eventInstance, elem)
          break
        case WORKSPACE_EVENTSCHEMA:
          workspaceStagingAccumulation(latestElems, eventInstance, elem)
          break
        case SITE_EVENTSCHEMA:
          siteStagingAccumulation(latestElems, eventInstance, elem)
          break
        case BUILDING_EVENTSCHEMA:
          buildingStagingAccumulation(latestElems, eventInstance, elem)
          break
        case FLOOR_EVENTSCHEMA:
          floorStagingAccumulation(latestElems, eventInstance, elem)
          break
        case NEIGHBOURHOOD_EVENTSCHEMA:
          neighbourhoodStagingAccumulation(latestElems, eventInstance, elem)
          break
        default:
          throw new Errors.InternalServerError('Unknown elem type.')
      }
    })

    await processEvents(latestElems)

    /** Staging table clean up ***/
    await InteropStagingDAO.bulkDelete(
      stagingElems.map((elem) => {
        return elem.id
      })
    )
  },
  async isAccessTokenValid(accessToken) {
    if (accessToken) {
      try {
        const getInstance = axios.create()
        console.debug('Access token validation...')
        const { data: getRes } = await getInstance.get(TOKEN_INFO_ENDPOINT, {
          headers: {
            Authorization: accessToken,
          },
        })
        const res = { response: getRes }
        if (res.response.expires_in) return res.response.expires_in > 0
        else {
          console.debug('Response failure: ', res)
          return false
        }
      } catch (e) {
        console.debug('Access token validation. Exception: ', e.toString())
        return false
      }
    }
    return false
  },
}

async function sendToCPI(data, endpoint) {
  try {
    const postInstance = axios.create()
    console.debug('Middleware request execution...')
    const postRes = await postInstance.post(endpoint, JSON.stringify(data.payload), {
      headers: {
        'Content-Type': 'application/json',
        'X-Gitlab-Token': process.env.GITLAB_TOKEN,
      },
    })
    const res = { response: postRes }
    return res
  } catch (e) {
    return { exception: e.toString() }
  }
}

/** * METHOD PRE-CONDITIONS: the following attributes are assumed to be part of the parameter "body": floorId, workspaceId, validFrom (not mandatory) ***/
async function createSeat(body) {
  try {
    const floor = await FloorController.getAll({ buildingMindsID: body.floorId })
    if (floor.length === 0)
      throw new Errors.BadRequestError(
        'Cannot create workspace because it does not exist the floor where it has to be assigned on'
      )
    const building = await BuildingController.get(floor[0].buildingId)
    const data = {}
    let seat = await SeatDAO.getAll({ buildingMindsID: body.workspaceId }) // Warning: Accessing non-existent property 'getAll' of module exports inside circular dependency
    if (seat.length) throw new Errors.BadRequestError('Already exists a seat with this workspaceId')
    data.code = body.name
    data.endDate = body.bookable ? null : endDate
    data.startDate = dateProcessing(body.validFrom, startDate)
    const area = await AreaController.getAll({ buildingMindsID: body.floorId }) // floorId and AreaId are the same
    if (area.length === 0)
      throw new Errors.ConflictError(
        'Cannot create workspace because it does not exist an area associated to the floor where it has to be assigned on'
      )
    seat = await SeatDAO.getAll({ code: body.name, areaId: area[0].id })
    if (seat.length) throw new Errors.BadRequestError('Already exists a seat with this name in the same floor')
    data.areaId = area[0].id
    data.buildingMindsID = body.workspaceId
    seat = await SeatDAO.create(data)
    const allSites = await SiteDAO.getAll({})
    const BMSites = allSites.filter((s) => s.buildingMindsID)
    const amenities = []
    for (const site of BMSites) {
      body.availableResources.forEach((a) =>
        amenities.push({
          filtrable: true,
          type: 'MULTI',
          key: a.name,
          siteId: site.id,
          amenityValues: [{ value: a.name }],
        })
      )
    }
    await AmenitiesController.createMassive(amenities)
    const seatAmenities = amenities.filter((a) => a.siteId === building.siteId)
    for (const amenity of seatAmenities) {
      amenity.id = (await AmenitiesController.getAll({ key: amenity.key, siteId: building.siteId })).flatMap(
        (a) => a.id
      )[0]
    }
    const dataMassive = [
      {
        seatId: seat.id,
        values: seatAmenities.map(function (d) {
          return { amenityId: d.id, value: d.key }
        }),
      },
    ]
    await AmenitiesController.massive(dataMassive)
  } catch (e) {
    console.warn(e)
    throw e
  }
}

/** * METHOD PRE-CONDITIONS: the following attributes are assumed to be part of the parameter "body": floorId, workspaceId, validFrom (not mandatory) ***/
async function updateSeat(body) {
  try {
    console.log('Processing updateSeat. Specific eventSchemaInstance: ', body)
    const floor = await FloorController.getAll({ buildingMindsID: body.floorId })
    if (floor.length === 0)
      throw new Errors.BadRequestError(
        'Cannot update workspace because it does not exist a floor with the floorId received in the data'
      )
    const building = await BuildingController.get(floor[0].buildingId)
    const seat = await SeatDAO.getAll({ buildingMindsID: body.workspaceId, disabled: 'true' }) // Warning: Accessing non-existent property 'getAll' of module exports inside circular dependency
    if (seat.length === 0) throw new Errors.ConflictError('Cannot update workspace because it does not exist')
    const data = {}
    const area = await AreaController.getAll({ buildingMindsID: body.floorId })
    if (area.length === 0)
      throw new Errors.ConflictError(
        'Cannot update seat because it does not exist an area associated to the floor where it has to be assigned on'
      )
    const seatInFloor = await SeatDAO.getAll({ code: body.name, areaId: area[0].id })
    if (
      seatInFloor.length &&
      seat[0].code === seatInFloor[0].code &&
      seat[0].buildingMindsID !== seatInFloor[0].buildingMindsID
    )
      throw new Errors.BadRequestError('Already exists a seat with this name in the same floor')
    data.areaId = area[0].id
    data.code = body.name
    data.startDate = dateProcessing(body.validFrom, startDate)
    data.endDate = body.bookable ? null : endDate
    await require('./SeatController').update(seat[0].id, data)
    const allSites = await SiteDAO.getAll({})
    const BMSites = allSites.filter((s) => s.buildingMindsID)
    const amenities = []
    for (const site of BMSites) {
      body.availableResources.forEach((a) =>
        amenities.push({
          filtrable: true,
          type: 'MULTI',
          key: a.name,
          siteId: site.id,
          amenityValues: [{ value: a.name }],
        })
      )
    }
    await AmenitiesController.createMassive(amenities)
    const seatAmenities = amenities.filter((a) => a.siteId === building.siteId)
    for (const amenity of seatAmenities) {
      amenity.id = (await AmenitiesController.getAll({ key: amenity.key, siteId: building.siteId })).flatMap(
        (a) => a.id
      )[0]
    }
    const dataMassive = [
      {
        seatId: seat[0].id,
        values: seatAmenities.map(function (d) {
          return { amenityId: d.id, value: d.key }
        }),
      },
    ]
    await AmenitiesController.deleteSeatAmenities(seat[0].id)
    await AmenitiesController.massive(dataMassive)
  } catch (e) {
    console.error(e)
  }
}

async function deleteSeat(workspaceId) {
  try {
    const seat = await require('./SeatController').getAll({ buildingMindsID: workspaceId, disabled: 'true' })
    if (seat.length === 0)
      throw new Errors.NotFoundError(
        'The workspace could not be deleted because there was not any with the buildingMindsID provided'
      )
    await require('./SeatController').delete(seat[0].id)
  } catch (e) {
    console.error(e)
  }
}

/** * METHOD PRE-CONDITIONS: the following attributes are assumed to be part of the parameter "body": neighbourhoodId, workspaceIds, name, tags, siteId ***/
async function createNeighbourhood(body) {
  const hood = await HoodController.getAll({ buildingMindsID: body.neighbourhoodId })
  if (hood.length) throw new Errors.BadRequestError('Already exists a hood with this neighbourhoodId')
  if (body.workspaceIds.length) {
    const seat = await require('./SeatController').getAll({ buildingMindsID: body.workspaceIds[0], disabled: 'true' })
    if (seat.length === 0)
      throw new Errors.BadRequestError(
        'Cannot create neighbourhood because it does not exist a workspace with the workspaceId received in the data'
      )
  }
  const site = await SiteController.getAll({ buildingMindsID: body.siteId })
  if (!site.length)
    throw new Errors.BadRequestError(
      'Cannot create neighbourhood because it does not exist a site with the siteId received in the data'
    )
  const siteId = site[0].id
  const orgCodes = []
  for (const orgCode of body.tags) {
    const isValid = await LDAPClient.orgCodeExists(encodeURIComponent(decodeSlashFromHexNCRToUTF(orgCode)))
    if (isValid) {
      orgCodes.push(decodeSlashFromHexNCRToUTF(orgCode))
    } else {
      throw new Errors.BadRequestError(
        'The creation of the neighbourhood cannot receive invalid tags (associated internally to the orgCodes)' +
          ' ' +
          orgCode
      )
    }
  }
  const newHood = await HoodController.create({ name: body.name, siteId, buildingMindsID: body.neighbourhoodId })
  await HoodController.addOrgCodes(newHood.id, orgCodes)
  const seats = await require('./SeatController').getAll({ buildingMindsIDs: body.workspaceIds, disabled: 'true' })
  for (const seat of seats) {
    seat.seatHoods.push(newHood.toJSON())
  }
  await require('./SeatController').updateSeatHoods(seats)
}

/** * METHOD PRE-CONDITIONS: the following attributes are assumed to be part of the parameter "body": neighbourhoodId, workspaceIds, name, tags ***/
async function updateNeighbourhood(body) {
  try {
    console.log('Processing updateNeighbourhood. Specific eventSchemaInstance: ', body)
    const hood = await HoodController.getAll({ buildingMindsID: body.neighbourhoodId })
    if (hood.length === 0) throw new Errors.BadRequestError('Cannot update neighbourhoodId because it does not exist')
    const orgCodes = (await HoodController.getOrgCodes({ hoodId: hood[0].id })).map((o) => o.orgCode)
    await HoodController.removeOrgCodes(hood[0].id, orgCodes)
    const newOrgCodes = []
    for (const orgCode of body.tags) {
      const isValid = await LDAPClient.orgCodeExists(encodeURIComponent(decodeSlashFromHexNCRToUTF(orgCode)))
      if (isValid) {
        newOrgCodes.push(decodeSlashFromHexNCRToUTF(orgCode))
      } else {
        throw new Errors.BadRequestError(
          'The creation of the neighbourhood cannot receive invalid tags (associated internally to the orgCodes)' +
            ' ' +
            orgCode
        )
      }
    }
    await HoodController.addOrgCodes(hood[0].id, newOrgCodes)
    const newSeats = await require('./SeatController').getAll({ buildingMindsIDs: body.workspaceIds, disabled: 'true' })
    await require('./SeatController').updateSeatsHoods(hood[0].id, newSeats)
    const hoodData = { name: body.name }
    if (newSeats.length) {
      hoodData.siteId = newSeats[0].area.floor.building.site.id
    }
    await HoodController.update(hood[0].id, hoodData)
  } catch (e) {
    console.error(e)
  }
}
async function deleteNeighbourhood(neighbourhoodId) {
  try {
    const hood = await HoodController.getAll({ buildingMindsID: neighbourhoodId })
    if (hood.length === 0)
      throw new Errors.NotFoundError(
        'The neighbourhood could not be deleted because there was not any with the buildingMindsID provided'
      )
    await HoodController.delete(hood[0].id)
  } catch (e) {
    console.error(e)
  }
}

/** * METHOD PRE-CONDITIONS: the following attributes are assumed to be part of the parameter "body": floorId, name, validFrom (not mandatory), validUntil (not mandatory), buildingId ***/
async function createFloor(body) {
  const data = {}
  const floor = await FloorController.getAll({ buildingMindsID: body.floorId })
  if (floor.length > 0)
    throw new Errors.BadRequestError(
      'Already exists a floor with this floorId (associated internally to the buildingMindsID)'
    )
  const floorsWithSameName = await FloorController.getAll({ number: body.name })
  if (floorsWithSameName.length > 0)
    throw new Errors.BadRequestError('Already exists a floor with this name. Assign other name to the floor.')
  data.buildingMindsID = body.floorId
  data.number = body.name

  data.startDate = dateProcessing(body.validFrom, startDate)
  data.endDate = dateProcessing(body.validUntil, null)

  const building = await BuildingController.getAll({ buildingMindsID: body.buildingId })
  if (building.length === 0)
    throw new Errors.BadRequestError(
      'Cannot create floor because it does not exist the building where it has to be assigned on'
    )
  data.buildingId = building[0].id
  data.map = ''
  const floorCreated = await FloorController.create(data)
  await AreaController.create({
    code: '-',
    map: '',
    floorId: floorCreated.dataValues.id,
    startDate: data.startDate,
    endDate: data.endDate,
    buildingMindsID: body.floorId,
  })
}

/** * METHOD PRE-CONDITIONS: the following attributes are assumed to be part of the parameter "body": floorId, name, validFrom (not mandatory), validUntil (not mandatory), buildingId ***/
async function updateFloor(body) {
  try {
    console.log('Processing updateFloor. Specific eventSchemaInstance: ', body)
    const floor = await FloorController.getAll({ buildingMindsID: body.floorId })
    if (floor.length === 0) throw new Errors.BadRequestError('Cannot update floor because it does not exist')
    const area = await AreaController.getAll({ buildingMindsID: body.floorId })
    if (area.length === 0)
      throw new Errors.InternalServerError('Cannot update floor because it does not exist an area. It must be created')
    const data = {}
    const building = await BuildingController.getAll({ buildingMindsID: body.buildingId })
    if (building.length === 0)
      throw new Errors.BadRequestError('Cannot update floor because the buildingId received does not exist')
    data.buildingId = building[0].id
    data.number = body.floorNumber
    data.startDate = dateProcessing(body.validFrom, startDate)
    data.endDate = dateProcessing(body.validUntil, null)
    await FloorController.update(floor[0].id, data)
    const dataArea = {
      startDate: body.validFrom.slice(0, DATE_SIZE_LIMIT),
      endDate: body.validUntil.slice(0, DATE_SIZE_LIMIT),
    }
    await AreaController.update(area[0].id, dataArea)
  } catch (e) {
    console.error(e)
  }
}

async function deleteFloor(floorId) {
  try {
    const floor = await FloorController.getAll({ buildingMindsID: floorId })
    if (floor.length === 0)
      throw new Errors.NotFoundError(
        'The floor could not be deleted because there was not any with the buildingMindsID provided'
      )
    await FloorController.delete(floor[0].id)
  } catch (e) {
    console.error(e)
  }
}

/** * METHOD PRE-CONDITIONS: the following attributes are assumed to be part of the parameter "body": buildingId, name, validFrom (not mandatory), validUntil (not mandatory), siteId ***/
async function createBuilding(body) {
  const data = {}
  const building = await BuildingController.getAll({ buildingMindsID: body.buildingId })
  if (building.length > 0)
    throw new Errors.BadRequestError(
      'Already exists a building with this buildingId (associated internally to the buildingMindsID)'
    )
  data.buildingMindsID = body.buildingId
  data.name = body.name

  data.startDate = dateProcessing(body.validFrom, startDate)
  data.endDate = dateProcessing(body.validUntil, null)

  const site = await SiteController.getAll({ buildingMindsID: body.siteId })
  if (site.length === 0)
    throw new Errors.BadRequestError(
      'Cannot create building because it does not exist the site where it has to be assigned on'
    )
  data.siteId = site[0].id

  data.address = body.addressIds && body.addressIds.length > 0 ? body.addressIds[0] : '' // VALIDATE IF THIS DATA IS EFFECTIVELY THE ONE THAT HAS TO BE ASSOCIATED TO THE ADDRESS
  data.reservationDays = 7 // HARDCODED VALUE
  data.managerReservationDays = 7 // HARDCODED VALUE
  data.cancellationHours = 0 // HARDCODED VALUE
  data.gmt = 0 // HARDCODED VALUE
  data.reservationCancellationHours = 0 // HARDCODED VALUE
  await BuildingController.create(data)
}

/** * METHOD PRE-CONDITIONS: the following attributes are assumed to be part of the parameter "body": buildingId, name, validFrom (not mandatory), validUntil (not mandatory), siteId ***/
async function updateBuilding(body) {
  try {
    console.log('Processing updateBuilding. Specific eventSchemaInstance: ', body)
    const building = await BuildingController.getAll({ buildingMindsID: body.buildingId })
    if (building.length === 0) throw new Errors.BadRequestError('Cannot update building because it does not exist')
    const data = {}
    const site = await SiteController.getAll({ buildingMindsID: body.siteId })
    if (site.length === 0)
      throw new Errors.BadRequestError('Cannot update building because the siteId received does not exist')
    data.siteId = site[0].id
    data.name = body.name
    data.startDate = dateProcessing(body.validFrom, startDate)
    data.endDate = dateProcessing(body.validUntil, null)
    data.address = body.addressIds && body.addressIds.length > 0 ? body.addressIds[0] : ''
    await BuildingController.update(building[0].id, data)
  } catch (e) {
    console.error(e)
  }
}

async function deleteBuilding(buildingId) {
  try {
    const building = await BuildingController.getAll({ buildingMindsID: buildingId })
    if (building.length === 0)
      throw new Errors.NotFoundError(
        'The building could not be deleted because there was not any with the buildingMindsID provided'
      )
    await BuildingController.delete(building[0].id)
  } catch (e) {
    console.error(e)
  }
}

/** * METHOD PRE-CONDITIONS: the following attributes are assumed to be part of the parameter "body": siteId, name, validFrom (not mandatory), validUntil (not mandatory) ***/
async function createSite(body) {
  const data = {}
  const site = await SiteController.getAll({ buildingMindsID: body.siteId })
  if (site.length > 0)
    throw new Errors.BadRequestError(
      'Already exists a site with this siteId (associated internally to the buildingMindsID)'
    )
  data.buildingMindsID = body.siteId
  data.name = body.name
  data.startDate = dateProcessing(body.validFrom, startDate)
  data.endDate = dateProcessing(body.validUntil, null)
  data.country = '-' // missing
  data.city = '-' // missing
  data.managerRoleId = 0 // missing
  data.adminRoleId = 0 // missing
  // data.feedbackContact = body.contactIds.join('; ') // TODO: Validate if this is the right information we need
  data.feedbackContact = '-'
  await SiteController.create(data)
}

/** * METHOD PRE-CONDITIONS: the following attributes are assumed to be part of the parameter "body": siteId, name, validFrom (not mandatory), validUntil (not mandatory) ***/
async function updateSite(body) {
  try {
    console.log('Processing updateSite. Specific eventSchemaInstance: ', body)
    const site = await SiteController.getAll({ buildingMindsID: body.siteId })
    if (site.length === 0) throw new Errors.ConflictError('Cannot update site because it does not exist')
    const data = {}
    data.name = body.name
    data.startDate = dateProcessing(body.validFrom, startDate)
    data.endDate = dateProcessing(body.validUntil, null)
    await SiteController.update(site[0].id, 'BMInteropSchedulerRunner', data)
  } catch (e) {
    console.error(e)
  }
}

async function deleteSite(siteId) {
  try {
    const site = await SiteController.getAll({ buildingMindsID: siteId })
    if (site.length === 0)
      throw new Errors.NotFoundError(
        'The site could not be deleted because there was not any with the buildingMindsID provided'
      )
    await SiteController.delete(site[0].id)
  } catch (e) {
    console.error(e)
  }
}
function isValidDate(d) {
  const regex = /^\d{4}-\d{2}-\d{2}$/

  if (d.match(regex) === null) {
    return false
  }

  const date = new Date(d)

  const timestamp = date.getTime()

  if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
    return false
  }

  return date.toISOString().startsWith(d)
}

function dateProcessing(date, defaultDate) {
  if (date) {
    if (date.length >= DATE_SIZE_LIMIT) {
      const actualDate = date.slice(0, DATE_SIZE_LIMIT)
      if (isValidDate(actualDate)) return actualDate
      else
        throw new Errors.BadRequestError(
          'Could not process the date because its format in not the correct one. Date received: ' + date
        )
    } else
      throw new Errors.BadRequestError(
        'Could not process the date because its format in not the correct one. Date received: ' + date
      )
  } else return defaultDate
}

async function registerWorkspaceSiteEventsInStaging(body) {
  const site = await SiteDAO.getAll({ buildingMindsID: body.siteId })
  if (site.length) {
    await InteropStagingDAO.create({
      eventSchema: SITE_EVENTSCHEMA,
      eventSchemaInstance: JSON.stringify(body),
      eventTimestamp: getCurrentUnixTimestamp(),
    })
  } else {
    throw new Errors.NotFoundError('There is no site associated with that siteId.')
  }
}
async function registerWorkspaceBuildingEventsInStaging(body) {
  const building = await BuildingDAO.getAll({ buildingMindsID: body.buildingId })
  if (building.length) {
    await InteropStagingDAO.create({
      eventSchema: BUILDING_EVENTSCHEMA,
      eventSchemaInstance: JSON.stringify(body),
      eventTimestamp: getCurrentUnixTimestamp(),
    })
  } else {
    throw new Errors.NotFoundError('There is no building associated with that buildingId.')
  }
}
async function registerWorkspaceFloorEventsInStaging(body) {
  const floor = await FloorDAO.getAll({ buildingMindsID: body.floorId })
  if (floor.length) {
    await InteropStagingDAO.create({
      eventSchema: FLOOR_EVENTSCHEMA,
      eventSchemaInstance: JSON.stringify(body),
      eventTimestamp: getCurrentUnixTimestamp(),
    })
  } else {
    throw new Errors.NotFoundError('There is no floor associated with that floorId.')
  }
}
async function registerNeighbourhoodEventsInStaging(body) {
  const hood = await HoodController.getAll({ buildingMindsID: body.neighbourhoodId })
  if (hood.length) {
    await InteropStagingDAO.create({
      eventSchema: NEIGHBOURHOOD_EVENTSCHEMA,
      eventSchemaInstance: JSON.stringify(body),
      eventTimestamp: getCurrentUnixTimestamp(),
    })
  } else {
    throw new Errors.NotFoundError('There is no hood associated with that neighbourhoodId.')
  }
}
async function registerWorkspaceEventsInStaging(body) {
  const seat = await SeatDAO.getAll({ buildingMindsID: body.workspaceId, disabled: 'true' })
  if (seat.length) {
    await InteropStagingDAO.create({
      eventSchema: WORKSPACE_EVENTSCHEMA,
      eventSchemaInstance: JSON.stringify(body),
      eventTimestamp: getCurrentUnixTimestamp(),
    })
  } else {
    throw new Errors.NotFoundError('There is no workspace associated with that workspaceId.')
  }
}

/** * METHOD PRE-CONDITIONS: the following attributes are assumed to be part of the parameter "latestLayout": floorId, scalableVectorGraphic ***/
async function layoutUpdate(latestLayout, map = null) {
  try {
    console.log('Processing layoutUpdate...')
    const layoutSchemaInstance = JSON.parse(latestLayout.eventSchemaInstance)
    console.log('Specific floorId: ', layoutSchemaInstance.floorId)
    const area = await AreaController.getAll({ buildingMindsID: layoutSchemaInstance.floorId })
    if (!area.length) throw new Errors.BadRequestError('The floorId received does not exist.')
    else if (!map && getStringBinarySize(layoutSchemaInstance.scalableVectorGraphic) > FIVE_MB_IN_BYTES) {
      throw new Errors.BadRequestError(
        'The size of the SVG received cannot be greater than 5 MB. Actual size: ' +
          getStringBinarySize(layoutSchemaInstance.scalableVectorGraphic)
      )
    } else {
      await AreaController.update(area[0].id, {
        map: !map
          ? (
              await ungzip(decodeBase64(layoutSchemaInstance.scalableVectorGraphic.replace('-', '+').replace('_', '/')))
            ).toString()
          : map, // The replaces are done because the layout comes in base64 url safe format
      })
    }
  } catch (e) {
    console.error(e)
  }
}

async function createWorkspaceLayoutInArea(body) {
  const areas = await AreaController.getAll({ buildingMindsID: body.floorId })
  if (areas.length) {
    await InteropStagingDAO.create({
      eventSchema: WORKSPACE_LAYOUT_EVENTSCHEMA,
      eventSchemaInstance: JSON.stringify(body),
      eventTimestamp: getCurrentUnixTimestamp(),
    })
  } else {
    throw new Errors.NotFoundError('There is no area associated with that floorId.')
  }
}

function updateLatestElems(lastestElem, eventInstance, elem) {
  const repeatedStagingElem = compareEachWithIdentifier(lastestElem, eventInstance, elem.eventSchema)
  if (repeatedStagingElem.length > 0) {
    const index = lastestElem.indexOf(repeatedStagingElem[0])
    lastestElem[index] = getLatestElemLayout(elem, lastestElem[index])
  } else lastestElem.push(elem)
}

function compareEachWithIdentifier(lastestElem, eventInstance, eventSchema) {
  switch (eventSchema) {
    case WORKSPACE_LAYOUT_EVENTSCHEMA:
    case FLOOR_EVENTSCHEMA:
      return lastestElem.filter((e) => JSON.parse(e.eventSchemaInstance).floorId === eventInstance.floorId)
    case WORKSPACE_EVENTSCHEMA:
      return lastestElem.filter((e) => JSON.parse(e.eventSchemaInstance).workspaceId === eventInstance.workspaceId)
    case NEIGHBOURHOOD_EVENTSCHEMA:
      return lastestElem.filter(
        (e) => JSON.parse(e.eventSchemaInstance).neighbourhoodId === eventInstance.neighbourhoodId
      )
    case SITE_EVENTSCHEMA:
      return lastestElem.filter((e) => JSON.parse(e.eventSchemaInstance).siteId === eventInstance.siteId)
    case BUILDING_EVENTSCHEMA:
      return lastestElem.filter((e) => JSON.parse(e.eventSchemaInstance).buildingId === eventInstance.buildingId)
    default:
      console.error('Not identified event schema arrived. Event schema arriving: ', eventSchema)
  }
}

function getLatestElemLayout(elem, latestLayout) {
  return !latestLayout ? elem : elem.eventTimestamp > latestLayout.eventTimestamp ? elem : latestLayout
}

/** * It's important that the deletion is executed after the creation and update events ***/
async function processEvents(latestElems) {
  if (latestElems.latestLayoutCreate.length > 0) {
    latestElems.latestLayoutCreate.map(async (elem) => await layoutUpdate(elem).catch())
  }
  if (latestElems.latestLayoutUpdate.length > 0) {
    latestElems.latestLayoutUpdate.map(async (elem) => await layoutUpdate(elem).catch())
  }
  if (latestElems.latestLayoutDelete.length > 0) {
    latestElems.latestLayoutDelete.map(async (elem) => await layoutUpdate(elem, '-').catch())
  }
  if (latestElems.latestSeatUpdate.length > 0) {
    latestElems.latestSeatUpdate.map(async (elem) => await updateSeat(JSON.parse(elem.eventSchemaInstance)).catch())
  }
  if (latestElems.latestSeatDelete.length > 0) {
    latestElems.latestSeatDelete.map(async (elem) => {
      await deleteSeatProcessing(elem)
    })
  }
  if (latestElems.latestSiteUpdate.length > 0) {
    latestElems.latestSiteUpdate.map(async (elem) => await updateSite(JSON.parse(elem.eventSchemaInstance)).catch())
  }
  if (latestElems.latestSiteDelete.length > 0) {
    latestElems.latestSiteDelete.map(async (elem) => {
      await deleteSiteProcessing(elem)
    })
  }
  if (latestElems.latestBuildingUpdate.length > 0) {
    latestElems.latestBuildingUpdate.map(
      async (elem) => await updateBuilding(JSON.parse(elem.eventSchemaInstance)).catch()
    )
  }
  if (latestElems.latestBuildingDelete.length > 0) {
    latestElems.latestBuildingDelete.map(async (elem) => {
      await deleteBuildingProcessing(elem)
    })
  }
  if (latestElems.latestFloorUpdate.length > 0) {
    latestElems.latestFloorUpdate.map(async (elem) => await updateFloor(JSON.parse(elem.eventSchemaInstance)).catch())
  }
  if (latestElems.latestFloorDelete.length > 0) {
    latestElems.latestFloorDelete.map(async (elem) => {
      await deleteFloorProcessing(elem)
    })
  }
  if (latestElems.latestNeighbourhoodUpdate.length > 0) {
    latestElems.latestNeighbourhoodUpdate.map(
      async (elem) => await updateNeighbourhood(JSON.parse(elem.eventSchemaInstance)).catch()
    )
  }
  if (latestElems.latestNeighbourhoodDelete.length > 0) {
    latestElems.latestNeighbourhoodDelete.map(async (elem) => {
      await deleteNeighbourhoodProcessing(elem)
    })
  }
}

async function deleteSeatProcessing(elem) {
  console.log('Processing deleteSeat...')
  const latestSeatDeleteInstance = JSON.parse(elem.eventSchemaInstance)
  console.log('Specific eventSchemaInstance: ', latestSeatDeleteInstance)
  await deleteSeat(latestSeatDeleteInstance.workspaceId).catch()
}

async function deleteSiteProcessing(elem) {
  console.log('Processing deleteSite...')
  const latestSiteDeleteInstance = JSON.parse(elem.eventSchemaInstance)
  console.log('Specific eventSchemaInstance: ', latestSiteDeleteInstance)
  await deleteSite(latestSiteDeleteInstance.siteId).catch()
}

async function deleteBuildingProcessing(elem) {
  console.log('Processing deleteBuilding...')
  const latestBuildingDeleteInstance = JSON.parse(elem.eventSchemaInstance)
  console.log('Specific eventSchemaInstance: ', latestBuildingDeleteInstance)
  await deleteBuilding(latestBuildingDeleteInstance.buildingId).catch()
}

async function deleteFloorProcessing(elem) {
  console.log('Processing deleteFloor...')
  const latestFloorDeleteInstance = JSON.parse(elem.eventSchemaInstance)
  console.log('Specific eventSchemaInstance: ', latestFloorDeleteInstance)
  await deleteFloor(latestFloorDeleteInstance.floorId).catch()
}

async function deleteNeighbourhoodProcessing(elem) {
  console.log('Processing deleteNeighbourhood...')
  const latestNeighbourhoodDeleteInstance = JSON.parse(elem.eventSchemaInstance)
  console.log('Specific eventSchemaInstance: ', latestNeighbourhoodDeleteInstance)
  await deleteNeighbourhood(latestNeighbourhoodDeleteInstance.neighbourhoodId).catch()
}

async function sendBookingEventToCPIBulkData({ type, bookingPayload }, projectToSendInfo) {
  let schema = []
  let bookingIds = []
  let toInsert

  bookingPayload.map(async (payload) => {
    if (projectToSendInfo === VIDIL) {
      toInsert = {
        eventType: type,
        workspaceIds: [payload.seat.buildingMindsID],
        bookingId: payload.id.toString(),
        validFrom: payload.calendar.date + TIME_FOR_DATE_VALIDFROM_VIDIL,
        validUntil: payload.calendar.date + TIME_FOR_DATE_VALIDUNTIL_VIDIL,
        bookingDate: getCurrentDateAsStringYYYYMMDD(DATE_WITH_TIME_SIZE_LIMIT),
        cancelled: false, //type === BM_BOOKING_CANCELATION,
        bookedCapacity: 1,
        checkedInTime: CHECK_IN_TIME_VIDIL,
        checkedOutTime: CHECK_OUT_TIME_VIDIL,
      }
    }
    // DBT
    else {
      toInsert = {
        eventType: type,
        workspaceIds: [payload.seat.buildingMindsID],
        bookingId: payload.id.toString(),
        validFrom: payload.calendar.date + TIME_FOR_DATE_VALIDFROM_DBT,
        validUntil: payload.calendar.date + TIME_FOR_DATE_VALIDUNTIL_DBT,
        bookingDate: getCurrentDateAsStringYYYYMMDD(DATE_WITH_TIME_SIZE_LIMIT) + 'Z',
        cancelled: false, //type === BM_BOOKING_CANCELATION,
        checkInTime: payload.calendar.date + CHECK_IN_TIME_DBT,
        checkOutTime: payload.calendar.date + CHECK_OUT_TIME_DBT,
      }
    }
    schema.push(toInsert)
  })

  const testSchema = schema.slice(0, 2) //to be deleted

  console.log('DEBUG: SEND TO CPI ENDPOINT:', MIDDLEWARE_CPI_CONNECTION_BOOKING_ENDPOINT + projectToSendInfo)
  console.log('DEBUG: TEST SCHEMA:', testSchema)

  const res = await sendToCPI({ payload: schema }, MIDDLEWARE_CPI_CONNECTION_BOOKING_ENDPOINT + projectToSendInfo)
  const getCleanResponse = (res) => {
    return (
      '; Response status code: ' +
      res.response.status.toString() +
      '; Response data: ' +
      JSON.stringify(res.response.data)
    )
  }

  bookingIds = schema.map((b) => b.bookingId)
  console.log('DEBUG BOOKING IDS', bookingIds)
  console.log('DEBUG BOOKING IDS LENGTH', bookingIds.length)

  try {
    console.debug(
      'Response for Booking topic request to CPI-BM. Booking IDs = ',
      bookingIds,
      res.response ? getCleanResponse(res) : '; Response: ' + res.exception
    )
  } catch (e) {
    console.log(
      'Error while reading response from middleware. Most probable reason: the response data is not a JSON. Actual response status code: ',
      res.response.status.toString()
    )
    console.error('Actual exception: ', e)
  }
}

async function sendBookingEventToCPISingleData({ type, bookingPayload }, projectToSendInfo) {
  bookingPayload.map(async (payload) => {
    let schema = []
    let toInsert
    if (projectToSendInfo === DBT)
      toInsert = {
          eventType: type,
          workspaceIds: [payload.seat.buildingMindsID],
          bookingId: payload.id.toString(),
          validFrom: payload.calendar.date + TIME_FOR_DATE_VALIDFROM_DBT,
          validUntil: payload.calendar.date + TIME_FOR_DATE_VALIDUNTIL_DBT,
          bookingDate: getCurrentDateAsStringYYYYMMDD(DATE_WITH_TIME_SIZE_LIMIT) + 'Z',
          cancelled: type === BM_BOOKING_CANCELATION,
          checkInTime: payload.calendar.date + CHECK_IN_TIME_DBT,
          checkOutTime: payload.calendar.date + CHECK_OUT_TIME_DBT,
      }
    // VIDIL
    else
      toInsert = {
        eventType: type,
        workspaceIds: [payload.seat.buildingMindsID],
        bookingId: payload.id.toString(),
        validFrom: payload.calendar.date + TIME_FOR_DATE_VALIDFROM_VIDIL,
        validUntil: payload.calendar.date + TIME_FOR_DATE_VALIDUNTIL_VIDIL,
        bookingDate: getCurrentDateAsStringYYYYMMDD(DATE_WITH_TIME_SIZE_LIMIT),
        cancelled: type === BM_BOOKING_CANCELATION,
        bookedCapacity: 1,
        checkedInTime: CHECK_IN_TIME_VIDIL,
        checkedOutTime: CHECK_OUT_TIME_VIDIL,
      }

    schema.push(toInsert)

    console.debug('MIDDLEWARE_CPI_CONNECTION_BOOKING_ENDPOINT', MIDDLEWARE_CPI_CONNECTION_BOOKING_ENDPOINT)
    const res = await sendToCPI({ payload: schema }, MIDDLEWARE_CPI_CONNECTION_BOOKING_ENDPOINT + projectToSendInfo)
    const getCleanResponse = (res) => {
      return (
        '; Response status code: ' +
        res.response.status.toString() +
        '; Response data: ' +
        JSON.stringify(res.response.data)
      )
    }
    try {
      console.debug(
        'Response for Booking topic request to CPI-BM. BookingId = ',
        payload.id,
        res.response ? getCleanResponse(res) : '; Response: ' + res.exception
      )
    } catch (e) {
      console.log(
        'Error while reading response from middleware. Most probable reason: the response data is not a JSON. Actual response status code: ',
        res.response.status.toString()
      )
      console.error('Actual exception: ', e)
    }
  })
}

/** * BEGIN Staging acummulation methods ***/

function workspaceLayoutStagingAccumulation(latestElems, eventInstance, currentStagingElem) {
  if (eventInstance.operation === OP_CREATE)
    updateLatestElems(latestElems.latestLayoutCreate, eventInstance, currentStagingElem)
  else if (eventInstance.operation === OP_UPDATE)
    updateLatestElems(latestElems.latestLayoutUpdate, eventInstance, currentStagingElem)
  else updateLatestElems(latestElems.latestLayoutDelete, eventInstance, currentStagingElem)
}
function workspaceStagingAccumulation(latestElems, eventInstance, elem) {
  if (eventInstance.operation === OP_UPDATE) updateLatestElems(latestElems.latestSeatUpdate, eventInstance, elem)
  else updateLatestElems(latestElems.latestSeatDelete, eventInstance, elem)
}
function siteStagingAccumulation(latestElems, eventInstance, elem) {
  if (eventInstance.operation === OP_UPDATE) updateLatestElems(latestElems.latestSiteUpdate, eventInstance, elem)
  else updateLatestElems(latestElems.latestSiteDelete, eventInstance, elem)
}
function buildingStagingAccumulation(latestElems, eventInstance, elem) {
  if (eventInstance.operation === OP_UPDATE) updateLatestElems(latestElems.latestBuildingUpdate, eventInstance, elem)
  else updateLatestElems(latestElems.latestBuildingDelete, eventInstance, elem)
}
function floorStagingAccumulation(latestElems, eventInstance, elem) {
  if (eventInstance.operation === OP_UPDATE) updateLatestElems(latestElems.latestFloorUpdate, eventInstance, elem)
  else updateLatestElems(latestElems.latestFloorDelete, eventInstance, elem)
}
function neighbourhoodStagingAccumulation(latestElems, eventInstance, elem) {
  if (eventInstance.operation === OP_UPDATE)
    updateLatestElems(latestElems.latestNeighbourhoodUpdate, eventInstance, elem)
  else updateLatestElems(latestElems.latestNeighbourhoodDelete, eventInstance, elem)
}

/** * END Staging acummulation methods ***/
