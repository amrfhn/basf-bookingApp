const { returning, startDate, endDate } = require('./common')
const { promises: fs } = require('fs')
const BerlinData = require('./data/20220915154500-data-OBC04-update.json')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction({ autocommit: false }).then(() => {})
    const options = { transaction, returning }

    const BerlinSiteId = (await queryInterface.sequelize.query(`SELECT id FROM sites WHERE name = 'HUB Berlin'`))[0][0]
      .id

    /** * Amenities ***/
    /** * Amenities Ids ***/
    /** * Monitor ***/
    const monitorAmenityId = (
      await queryInterface.sequelize.query(`SELECT * FROM amenities as a WHERE a.key = 'monitors'`)
    )[0][0].id

    /** * Desk ***/
    const deskAmenityId = (
      await queryInterface.sequelize.query(`SELECT * FROM amenities as a WHERE a.key = 'desk'`)
    )[0][0].id

    /** * Dock ***/
    const dockAmenityId = (
      await queryInterface.sequelize.query(`SELECT * FROM amenities as a WHERE a.key = 'dock'`)
    )[0][0].id

    /** * Boolean Amenities ***/
    const oldChargingCableAmenityId = (
      await queryInterface.bulkInsert(
        'amenities',
        [
          {
            type: 'BOOLEAN',
            filterable: true,
            key: 'Charging cable for old HP laptops',
            siteId: BerlinSiteId,
          },
        ],
        options
      )
    )[0].id
    /** * END Boolean Amenities ***/

    const amenitiesIds = { monitorAmenityId, deskAmenityId, dockAmenityId, oldChargingCableAmenityId }
    /** * END Amenities Ids ***/

    /** * Amenities values ***/
    const electricDeskAmenityValueId = (
      await queryInterface.sequelize.query(
        `SELECT * FROM "amenityValues" WHERE "amenityId" = ${deskAmenityId} and "value" = 'electric'`
      )
    )[0][0].id

    const universalDock = await queryInterface.bulkInsert(
      'amenityValues',
      [{ amenityId: dockAmenityId, value: 'universal Docking Station' }],
      options
    )

    const amenityValuesIds = { electricDeskAmenityValueId, universalDockId: universalDock[0].id }
    /** * END Amenities values ***/
    /** END Amenities ***/

    const areaMaps = {
      f1a13: await fs.readFile('./model/migrations/maps/de/OBC04/1/13.svg', 'utf8'),
      f1a14: await fs.readFile('./model/migrations/maps/de/OBC04/1/14.svg', 'utf8'),
      f1a15: await fs.readFile('./model/migrations/maps/de/OBC04/1/15.svg', 'utf8'),
      f4a13: await fs.readFile('./model/migrations/maps/de/OBC04/4/13.svg', 'utf8'),
      f4a14: await fs.readFile('./model/migrations/maps/de/OBC04/4/14.svg', 'utf8'),
      f4a15: await fs.readFile('./model/migrations/maps/de/OBC04/4/15.svg', 'utf8'),
      f5a13: await fs.readFile('./model/migrations/maps/de/OBC04/5/13.svg', 'utf8'),
      f5a14: await fs.readFile('./model/migrations/maps/de/OBC04/5/14.svg', 'utf8'),
      f5a15: await fs.readFile('./model/migrations/maps/de/OBC04/5/15.svg', 'utf8'),
      f5a16: await fs.readFile('./model/migrations/maps/de/OBC04/5/16.svg', 'utf8'),
    }
    const areasIds = {}
    areasIds.f1a13 = (
      await queryInterface.sequelize.query(
        `SELECT a.id FROM areas a inner join floors f on f.id = a."floorId" inner join buildings b on b.id = f."buildingId" WHERE name = 'OBC04' and f.number = '1' and a.code = '13'`
      )
    )[0][0].id
    areasIds.f1a14 = (
      await queryInterface.sequelize.query(
        `SELECT a.id FROM areas a inner join floors f on f.id = a."floorId" inner join buildings b on b.id = f."buildingId" WHERE name = 'OBC04' and f.number = '1' and a.code = '14'`
      )
    )[0][0].id
    areasIds.f1a15 = (
      await queryInterface.sequelize.query(
        `SELECT a.id FROM areas a inner join floors f on f.id = a."floorId" inner join buildings b on b.id = f."buildingId" WHERE name = 'OBC04' and f.number = '1' and a.code = '15'`
      )
    )[0][0].id
    areasIds.f4a13 = (
      await queryInterface.sequelize.query(
        `SELECT a.id FROM areas a inner join floors f on f.id = a."floorId" inner join buildings b on b.id = f."buildingId" WHERE name = 'OBC04' and f.number = '4' and a.code = '13'`
      )
    )[0][0].id
    areasIds.f4a14 = (
      await queryInterface.sequelize.query(
        `SELECT a.id FROM areas a inner join floors f on f.id = a."floorId" inner join buildings b on b.id = f."buildingId" WHERE name = 'OBC04' and f.number = '4' and a.code = '14'`
      )
    )[0][0].id
    areasIds.f4a15 = (
      await queryInterface.sequelize.query(
        `SELECT a.id FROM areas a inner join floors f on f.id = a."floorId" inner join buildings b on b.id = f."buildingId" WHERE name = 'OBC04' and f.number = '4' and a.code = '15'`
      )
    )[0][0].id
    areasIds.f5a13 = (
      await queryInterface.sequelize.query(
        `SELECT a.id FROM areas a inner join floors f on f.id = a."floorId" inner join buildings b on b.id = f."buildingId" WHERE name = 'OBC04' and f.number = '5' and a.code = '13'`
      )
    )[0][0].id
    areasIds.f5a14 = (
      await queryInterface.sequelize.query(
        `SELECT a.id FROM areas a inner join floors f on f.id = a."floorId" inner join buildings b on b.id = f."buildingId" WHERE name = 'OBC04' and f.number = '5' and a.code = '14'`
      )
    )[0][0].id
    areasIds.f5a15 = (
      await queryInterface.sequelize.query(
        `SELECT a.id FROM areas a inner join floors f on f.id = a."floorId" inner join buildings b on b.id = f."buildingId" WHERE name = 'OBC04' and f.number = '5' and a.code = '15'`
      )
    )[0][0].id
    areasIds.f5a16 = (
      await queryInterface.sequelize.query(
        `SELECT a.id FROM areas a inner join floors f on f.id = a."floorId" inner join buildings b on b.id = f."buildingId" WHERE name = 'OBC04' and f.number = '5' and a.code = '16'`
      )
    )[0][0].id
    await queryInterface.bulkUpdate('areas', { map: areaMaps.f1a13 }, { id: areasIds.f1a13 }, options)
    await queryInterface.bulkUpdate('areas', { map: areaMaps.f1a14 }, { id: areasIds.f1a14 }, options)
    await queryInterface.bulkUpdate('areas', { map: areaMaps.f1a15 }, { id: areasIds.f1a15 }, options)
    await queryInterface.bulkUpdate('areas', { map: areaMaps.f4a13 }, { id: areasIds.f4a13 }, options)
    await queryInterface.bulkUpdate('areas', { map: areaMaps.f4a14 }, { id: areasIds.f4a14 }, options)
    await queryInterface.bulkUpdate('areas', { map: areaMaps.f4a15 }, { id: areasIds.f4a15 }, options)
    await queryInterface.bulkUpdate('areas', { map: areaMaps.f5a13 }, { id: areasIds.f5a13 }, options)
    await queryInterface.bulkUpdate('areas', { map: areaMaps.f5a14 }, { id: areasIds.f5a14 }, options)
    await queryInterface.bulkUpdate('areas', { map: areaMaps.f5a15 }, { id: areasIds.f5a15 }, options)
    await queryInterface.bulkUpdate('areas', { map: areaMaps.f5a16 }, { id: areasIds.f5a16 }, options)

    for (const elem of BerlinData) {
      let seatId
      const areaId = getAreaId(elem, areasIds)
      if (elem.currentSeatCodeMapping) {
        /** * Seat needs update of the seatCode ***/
        seatId = await queryInterface.sequelize.query(
          `SELECT s.id FROM seats s inner join areas a on a.id = s."areaId" WHERE a.id = ${areaId} and s.code = '${elem.currentSeatCodeMapping}'`
        )
        if (seatId[0].length === 0)
          seatId = (
            await queryInterface.bulkInsert(
              'seats',
              [
                {
                  code: elem.currentSeatCodeMapping.toString(),
                  areaId,
                  startDate,
                  endDate: elem.available ? null : endDate,
                },
              ],
              options
            )
          )[0].id
        else seatId = seatId[0][0].id
        if (
          elem.floor === 5 &&
          elem.area === '15' &&
          (elem.currentSeatCodeMapping === '10' ||
            elem.currentSeatCodeMapping === '11' ||
            elem.currentSeatCodeMapping === '12')
        ) {
          /** * These seats need to be deleted because they do not occur anymore in the new maps ***/
          await queryInterface.bulkDelete('seats', { id: seatId }, options).catch((e) => {})
        } else {
          await checkAndCreateAmenitiesForSeat(
            seatId,
            amenitiesIds,
            {
              monitors: elem.monitors,
              dock: elem.dock,
              desk: elem.desk,
              oldChargingCable: elem.charging_cable_for_old_HP_generation_laptops,
            },
            amenityValuesIds,
            queryInterface,
            options
          )
          const existsSeat = await checkIfSeatAlreadyExists(areaId, elem.seat, queryInterface)
          if (existsSeat[0].length !== 0 && elem.currentSeatCodeMapping !== elem.seat.toString()) {
            await queryInterface.bulkDelete('seats', { id: existsSeat[0][0].id }, options).catch((e) => {})
          }
          await queryInterface.bulkUpdate(
            'seats',
            { code: elem.seat.toString(), startDate, endDate: elem.available ? null : endDate },
            { id: seatId },
            options
          )
        }
      } else {
        /** * Seat creation needed***/
        const existsSeat = await checkIfSeatAlreadyExists(areaId, elem.seat, queryInterface)
        if (existsSeat[0].length === 0) {
          seatId = (
            await queryInterface.bulkInsert(
              'seats',
              [{ code: elem.seat.toString(), areaId, startDate, endDate: elem.available ? null : endDate }],
              options
            )
          )[0].id
        } else {
          seatId = existsSeat[0][0].id
          await queryInterface.bulkUpdate(
            'seats',
            { code: elem.seat.toString(), startDate, endDate: elem.available ? null : endDate },
            { id: seatId },
            options
          )
        }
        await checkAndCreateAmenitiesForSeat(
          seatId,
          amenitiesIds,
          {
            monitors: elem.monitors,
            dock: elem.dock,
            desk: elem.desk,
            oldChargingCable: elem.charging_cable_for_old_HP_generation_laptops,
          },
          amenityValuesIds,
          queryInterface,
          options
        )
      }
    }
  },
  down: async (queryInterface, Sequelize) => {},
}

function getAreaId(elem, areasIds) {
  switch (elem.floor) {
    case 1:
      return elem.area === '13' ? areasIds.f1a13 : elem.area === '14' ? areasIds.f1a14 : areasIds.f1a15
    case 4:
      return elem.area === '13' ? areasIds.f4a13 : elem.area === '14' ? areasIds.f4a14 : areasIds.f4a15
    case 5:
      return elem.area === '13'
        ? areasIds.f5a13
        : elem.area === '14'
        ? areasIds.f5a14
        : elem.area === '15'
        ? areasIds.f5a15
        : areasIds.f5a16
  }
}

async function checkAndCreateAmenitiesForSeat(seatId, amenityIds, amenity, amenityValuesIds, queryInterface, options) {
  if (amenity.monitors)
    await checkAndCreateSeatAmenity(
      seatId,
      amenityIds.monitorAmenityId,
      'monitors',
      amenity.monitors,
      amenityValuesIds,
      queryInterface,
      options
    )
  if (amenity.desk)
    await checkAndCreateSeatAmenity(
      seatId,
      amenityIds.deskAmenityId,
      'desk',
      amenity.desk,
      amenityValuesIds,
      queryInterface,
      options
    )
  if (amenity.dock)
    await checkAndCreateSeatAmenity(
      seatId,
      amenityIds.dockAmenityId,
      'dock',
      amenity.dock,
      amenityValuesIds,
      queryInterface,
      options
    )
  if (amenity.oldChargingCable) {
    await checkAndCreateSeatAmenity(
      seatId,
      amenityIds.oldChargingCableAmenityId,
      'oldChargingCableAmenityId',
      amenity.oldChargingCable,
      amenityValuesIds,
      queryInterface,
      options
    )
  }
}

async function checkAndCreateSeatAmenity(
  seatId,
  amenityId,
  amenityType,
  amenityValue,
  amenityValuesIds,
  queryInterface,
  options
) {
  let seatAmenityId = await queryInterface.sequelize.query(
    `SELECT * FROM "seatAmenities" WHERE "seatId" = ${seatId} and "amenityId" = ${amenityId}`
  )
  if (seatAmenityId[0].length === 0) {
    const seatAmenity = await queryInterface
      .bulkInsert('seatAmenities', [{ seatId: seatId, amenityId: amenityId }], options)
      .catch(async (e) => {
        await options.transaction.rollback()
      })
    if (seatAmenity !== undefined) {
      if (amenityType === 'desk' || amenityType === 'dock') {
        await queryInterface.bulkInsert(
          'seatAmenityMultiValues',
          [
            {
              seatAmenityId: seatAmenity[0].id,
              amenityValueId:
                amenityType === 'desk' ? amenityValuesIds.electricDeskAmenityValueId : amenityValuesIds.universalDockId,
            },
          ],
          options
        )
      } else if (amenityType === 'monitors') {
        await queryInterface
          .bulkInsert('seatAmenityNumericValues', [{ seatAmenityId: seatAmenity[0].id, value: amenityValue }], options)
          .catch((e) => {})
      } else {
        await queryInterface.bulkInsert(
          'seatAmenityBooleanValues',
          [{ seatAmenityId: seatAmenity[0].id, value: amenityValue }],
          options
        )
      }
    }
  } else {
    seatAmenityId = seatAmenityId[0][0].id
    /** * amenityType === 'oldChargingCableAmenityId' not considered in this else because is a new amenity***/
    if (amenityType === 'desk' || amenityType === 'dock') {
      const multivalueSeatAmenityId = (
        await queryInterface.sequelize.query(
          `SELECT *
           FROM "seatAmenityMultiValues"
           WHERE "seatAmenityId" = ${seatAmenityId}`
        )
      )[0]
      if (multivalueSeatAmenityId.length === 0) {
        await queryInterface.bulkInsert(
          'seatAmenityMultiValues',
          [
            {
              seatAmenityId: seatAmenityId,
              amenityValueId:
                amenityType === 'desk' ? amenityValuesIds.electricDeskAmenityValueId : amenityValuesIds.universalDockId,
            },
          ],
          options
        )
      }
    } else if (amenityType === 'monitors')
      await queryInterface.bulkUpdate('seatAmenityNumericValues', { value: amenityValue }, { seatAmenityId }, options)
  }
}

async function checkIfSeatAlreadyExists(areaId, seatCode, queryInterface) {
  return await queryInterface.sequelize.query(
    `SELECT s.id
             FROM seats s
                    inner join areas a on a.id = s."areaId"
             WHERE a.id = ${areaId}
               and s.code = '${seatCode}'`
  )
}
