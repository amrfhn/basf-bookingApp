export default ({ app, $axios, store }, inject) => {
  const handleError = (e) => {
    if (e?.response?.data?.type) {
      window.$nuxt.$console.error(e.response.data.message)
    } else {
      window.$nuxt.$console.error('Unexpected error')
      console.error(e)
    }
    throw e
  }

  // const extractPaginationData = (r) => { return { data: r.data, total: r.headers['x-total'], totalPages: r.headers['x-total-pages'], countPerPage: r.headers['x-per-page'], page: r.headers['x-page'] } }

  const getAuthorization = () => {
    const token = store.getters['auth/token']
    if (process.env.GITLAB_TOKEN) {
      return { 'X-Gitlab-Token': process.env.GITLAB_TOKEN }
    } else if (token) {
      return { Authorization: 'Bearer ' + token }
    } else {
      // Verify that x-ms-proxy-userprincipalname header came
      return {}
    }
  }

  // Create a custom axios instance
  const a = () => $axios.create({
    headers: {
      common: {
        ...getAuthorization(),
        Accept: 'application/json, */*'
      }
    }
  })

  inject('api', {
    auth () {
      return a().$get('/auth/')
    },
    site: {
      get (filter) {
        return a().$get('/sites/', { params: filter }).catch(handleError)
      },
      update (id, body) {
        return a().$put(`/sites/${id}`, body).catch(handleError)
      },
      buildings (id) {
        return a().$get(`/sites/${id}/buildings`).catch(handleError)
      }
    },
    area: {
      get (filter) {
        return a().$get('/areas/', { params: filter }).catch(handleError)
      },
      getById (id) {
        return a().$get(`/areas/${id}`).catch(handleError)
      },
      create (body) {
        return a().$post('/areas/', body).catch(handleError)
      },
      update (id, body) {
        return a().$put(`/areas/${id}`, body).catch(handleError)
      },
      delete (id) {
        return a().$delete(`/areas/${id}`).catch(handleError)
      },
      getMap (id) {
        return a().$get(`/areas/${id}/map`).catch(handleError)
      },
      seats (id, filter) {
        return a().$get(`/areas/${id}/seats`, { params: filter }).catch(handleError)
      },
      seat (id, seatCode) {
        return a().$get(`/areas/${id}/seat/${seatCode}`).catch(handleError)
      }
    },
    amenities: {
      get (filter) {
        return a().$get('/amenities/', { params: filter }).catch(handleError)
      },
      create (body) {
        return a().$post('/amenities/', body).catch(handleError)
      },
      update (id, body) {
        return a().$put(`/amenities/${id}`, body).catch(handleError)
      },
      massive (body) {
        return a().$put('/amenities/massive', body).catch(handleError)
      },
      delete (id) {
        return a().$delete(`/amenities/${id}`).catch(handleError)
      }
    },
    booking: {
      get (filter) {
        return a().$get('/bookings/', { params: filter }).catch(handleError)
      },
      getById (id) {
        return a().$get(`/bookings/${id}`).catch(handleError)
      },
      create (data) {
        return a().$post('/bookings/book/', data).catch(handleError)
      },
      delete (id) {
        return a().$delete(`/bookings/${id}`).catch(handleError)
      },
      deleteMultipleBooks (data) {
        return a().$post('/bookings/cancellations', data).catch(handleError)
      },
      deleteByAdmin (data) {
        return a().$post('/bookings/cancellations-admin', data).catch(handleError)
      },
      mine () {
        return a().$get('/bookings/user').catch(handleError)
      },
      areaOnDates (areaId, initialDate, finalDate) {
        return a().$get('/bookings/area-on-dates', { params: { areaId, initialDate, finalDate } })
          .catch(handleError)
      },
      getPreBookings () {
        return a().$get('/bookings/user/reservations/').catch(handleError)
      },
      deletePreBooks (id) {
        return a().$delete(`/bookings/${id}/reservation/`).catch(handleError)
      },
      getTeamBookings () {
        return a().$get('bookings/team/').catch(handleError)
      },
      createPreBooks (data) {
        return a().$post('bookings/reserve', data).catch(handleError)
      },
      getMaxAllowedPreBooks (initialDate, finalDate) {
        return a().$get('/bookings/user/max-reservations-on-dates', { params: { initialDate, finalDate } })
          .catch(handleError)
      },
      createParkingBooksAdmin (data) {
        return a().$post('/bookings/book-parkings-admin', data).catch(handleError)
      },
      getParkingBookingsAdmin (siteId) {
        return a().$get('/bookings/user/parking-bookings-admin/', { params: { siteId } }).catch(handleError)
      },
      deleteMultipleParkingBookingsAdmin (data) {
        return a().$post('/bookings/cancellations-parkings-admin', data).catch(handleError)
      },
      quickbook (data) {
        return a().$post('/bookings/quickbook/', data).catch(handleError)
      },
      getMyQuickbook () {
        return a().$get('/bookings/quickbook/user').catch(handleError)
      },
      deleteMultipleQuickBooks (data) {
        return a().$post('/bookings/quickbook/cancellations', data).catch(handleError)
      }
    },
    building: {
      get (filter) {
        return a().$get('/buildings/', { params: filter }).catch(handleError)
      },
      getById (id) {
        return a().$get(`/buildings/${id}`).catch(handleError)
      },
      getQuantityPerFloor (id, days) {
        return a().$get(`/buildings/${id}/floorsSeats`, { params: { days } }).catch(handleError)
      },
      create (body) {
        return a().$post('/buildings/', body).catch(handleError)
      },
      update (id, body) {
        return a().$put(`/buildings/${id}`, body).catch(handleError)
      },
      delete (id) {
        return a().$delete(`/buildings/${id}`).catch(handleError)
      },
      // Fixme - remove
      mine () {
        return a().$get('/bookings/user').catch(handleError)
      },
      floors (id) {
        return a().$get(`/buildings/${id}/floors`).catch(handleError)
      },
      floor (id, floorNumber) {
        return a().$get(`/buildings/${id}/floor/${floorNumber}`).catch(handleError)
      },
      userLatest () {
        return a().$get('/buildings/user/latest').catch(_ => null)
      }
    },
    floor: {
      get (filter) {
        return a().$get('/floors/', { params: filter }).catch(handleError)
      },
      getById (id) {
        return a().$get(`/floors/${id}`).catch(handleError)
      },
      create (body) {
        return a().$post('/floors/', body).catch(handleError)
      },
      update (id, body) {
        return a().$put(`/floors/${id}`, body).catch(handleError)
      },
      delete (id) {
        return a().$delete(`/floors/${id}`).catch(handleError)
      },
      getMap (id) {
        return a().$get(`/floors/${id}/map`).catch(handleError)
      },
      areas (id) {
        return a().$get(`/floors/${id}/areas`).catch(handleError)
      },
      area (id, areaCode) {
        return a().$get(`/floors/${id}/area/${areaCode}`).catch(handleError)
      },
      getParking (filter) {
        return a().$get('/floors/parking', { params: filter }).catch(handleError)
      }
    },
    brigadier: {
      get (params) {
        return a().$get('/brigadiers/', { params }).catch(handleError)
      },
      getById (id) {
        return a().$get(`/brigadiers/${id}`).catch(handleError)
      },
      create (body) {
        return a().$post('/brigadiers/', body).catch(handleError)
      },
      update (id, body) {
        return a().$put(`/brigadiers/${id}`, body).catch(handleError)
      },
      delete (id) {
        return a().$delete(`/brigadiers/${id}`).catch(handleError)
      }
    },
    workStream: {
      get (filter) {
        return a().$get('/workStream/', { params: filter }).catch(handleError)
      },
      getById (id) {
        return a().$get(`/workStream/${id}`).catch(handleError)
      },
      create (body) {
        return a().$post('/workStream/', body).catch(handleError)
      },
      update (id, body) {
        return a().$put(`/workStream/${id}`, body).catch(handleError)
      },
      delete (id) {
        return a().$delete(`/workStream/${id}`).catch(handleError)
      }
    },
    hood: {
      get (filter) {
        return a().$get('/hood/', { params: filter }).catch(handleError)
      },
      getById (id) {
        return a().$get(`/hood/${id}`).catch(handleError)
      },
      create (body) {
        return a().$post('/hood/', body).catch(handleError)
      },
      update (id, body) {
        return a().$put(`/hood/${id}`, body).catch(handleError)
      },
      delete (id) {
        return a().$delete(`/hood/${id}`).catch(handleError)
      },
      getOrgCodes (filter) {
        return a().$get('/hood/org_codes', { params: filter }).catch(handleError)
      },
      getLocations (id) {
        return a().$get(`/hood/locations/${id}`).catch(handleError)
      },
      removeOrgCodes (id, body) {
        return a().post(`/hood/removeOrgCodes/${id}`, body).catch(handleError)
      },
      addOrgCodes (id, body) {
        return a().post(`/hood/addOrgCodes/${id}`, body).catch(handleError)
      },
      validateOrgCode (orgCode) {
        return a().$get(`/hood/validate/${encodeURIComponent(orgCode)}`).catch(handleError)
      }
    },
    feedback: {
      create (data) {
        const formData = new FormData()
        Object.keys(data).forEach(k => formData.append(k, data[k]))

        return a().post('/feedbacks/',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        )
      }
    },
    report: {
      lackOfSeatReport (params) {
        return a().$get('/reports/lack-of-seat', { params }).catch(handleError)
      },
      cancellationReport (params) {
        return a().$get('/reports/cancellation-report', { params }).catch(handleError)
      },
      myBookingHistory (params) {
        return a().$get('/reports/my-bookings', { params }).catch(handleError)
      },
      myTeamHistory (params) {
        return a().$get('/reports/team-bookings-history', { params }).catch(handleError)
      },
      bookingsAdminHistory (params) {
        return a().$get('/reports/admin-bookings-history', { params }).catch(handleError)
      },
      firstAidersReport (params) {
        return a().$get('/reports/first-aiders-report', { params }).catch(handleError)
      },
      workStreamDashboard (data) {
        return a().$get('/reports/work-stream-dashboard-report', { params: data }).catch(handleError)
      },
      landingZonesOccupation (data) {
        return a().$get('/reports/landing-zones-occupation-report', { params: data }).catch(handleError)
      },
      buildingOccupation (data) {
        return a().$get('/reports/occupation', { params: data }).catch(handleError)
      },
      downloadOutOfSeat (params) {
        return a().$get('/reports/make/out-of-seat', { params }).then((res) => { window.$nuxt.$console.success(res) })
          .catch(handleError)
      },
      downloadCancellationReport (params) {
        return a().$get('/reports/make/cancellation', { params }).then((res) => { window.$nuxt.$console.success(res) })
          .catch(handleError)
      },
      downloadBookingHistory (params) {
        return a().$get('/reports/make/booking-history', { params }).then((res) => { window.$nuxt.$console.success(res) })
          .catch(handleError)
      },
      downloadWorkStreamDashboard (params) {
        return a().$get('/reports/make/workstream-dashboard', { params }).then((res) => { window.$nuxt.$console.success(res) })
          .catch(handleError)
      },
      downloadLandingZonesOccupation (params) {
        return a().$get('/reports/make/landingzones-occupation', { params }).then((res) => { window.$nuxt.$console.success(res) })
          .catch(handleError)
      },
      downloadFirstAiders (params) {
        return a().$get('/reports/make/first-aiders', { params }).then((res) => { window.$nuxt.$console.success(res) })
          .catch(handleError)
      },
      downloadSeatBookingHistoryDay (params) {
        return a().$get('/reports/make/seat-booking-report-day', { params }).then((res) => { window.$nuxt.$console.success(res) })
          .catch(handleError)
      },
      downloadSeatBookingHistoryPeriod (params) {
        return a().$get('/reports/make/seat-booking-report-period', { params }).then((res) => { window.$nuxt.$console.success(res) })
          .catch(handleError)
      }
    },
    seat: {
      updateSeats (data) {
        return a().$post('/seats/config/', data).catch(handleError)
      },
      updateSeatHoods (data) {
        return a().$put('/seats/hoods/update-seat-hood', { data }).catch(handleError)
      },
      getSeatsHoods (params) {
        return a().$get('/seats/getSeatsHoods', { params }).catch(handleError)
      },
      updateSeatsHoods (data) {
        return a().$post('/seats/updateSeatsHoods', { data }).catch(handleError)
      },
      getSeatQuantityByHood (params) {
        return a().$get('/seats/get-quantity-by-hood', { params }).catch(handleError)
      },
      getParkingLotsWithoutSeatOwner (params) {
        return a().$get('/seats/get-seats-without-seatowners', { params }).catch(handleError)
      },
      getParkingLotsOwners (params) {
        return a().$get('/seats/get-seats-with-seatowners', { params }).catch(handleError)
      },
      getParkingsByBuilding (params) {
        return a().$get('/seats/get-parkings-by-building', { params }).catch(handleError)
      }
    },
    userParkingAccess: {
      get (filter) {
        return a().$get('/userParkingAccesses/', { params: filter }).catch(handleError)
      },
      getById (id) {
        return a().$get(`/userParkingAccesses/${id}`).catch(handleError)
      },
      create (body) {
        return a().$post('/userParkingAccesses/', body).catch(handleError)
      },
      userCreate (body) {
        return a().$post('/userParkingAccesses/user-create', body).catch(handleError)
      },
      update (id, body) {
        return a().$put(`/userParkingAccesses/${id}`, body).catch(handleError)
      },
      delete (id) {
        return a().$delete(`/userParkingAccesses/${id}`).catch(handleError)
      },
      mine () {
        return a().$get('/userParkingAccesses/user').catch(handleError)
      },
      getUserInfo (userId, buildingId) {
        return a().$get(`/userParkingAccesses/getUserInfo/${userId}/${buildingId}`).catch(handleError)
      },
      deleteUserInfo (body) {
        return a().$post('/userParkingAccesses/delete-user-info', body).catch(handleError)
      }
    },
    seatOwner: {
      getSeatOwners (params) {
        return a().$get('/seat-owner/get-seat-owners', { params }).catch(handleError)
      },
      create (body) {
        return a().$post('/seat-owner/', body).catch(handleError)
      },
      bulkDelete (body) {
        return a().$post('/seat-owner/delete', body).catch(handleError)
      }
    }
  })
}
