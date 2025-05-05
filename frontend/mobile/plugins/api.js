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
      seats (id) {
        return a().$get(`/areas/${id}/seats`).catch(handleError)
      },
      seat (id, seatCode) {
        return a().$get(`/areas/${id}/seat/${seatCode}`).catch(handleError)
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
      update (id, body) {
        return a().$put(`/bookings/${id}`, body).catch(handleError)
      },
      delete (id) {
        return a().$delete(`/bookings/${id}`).catch(handleError)
      },
      deleteMultipleBooks (data) {
        return a().$post('/bookings/cancellations', data).catch(handleError)
      },
      mine () {
        return a().$get('/bookings/user').catch(handleError)
      },
      areaOnDates (areaId, initialDate, finalDate) {
        return a().$get('/bookings/area-on-dates', { params: { areaId, initialDate, finalDate } }).catch(handleError)
      },
      getPreBookings () {
        return a().$get('/bookings/user/reservations/').catch(handleError)
      },
      deletePreBooks (id) {
        return a().$delete(`/bookings/${id}/reservation/`).catch(handleError)
      },
      getTeamBookings () {
        return a().$get('/bookings/team/').catch(handleError)
      },
      createPreBooks (data) {
        return a().$post('/bookings/reserve', data).catch(handleError)
      },
      getMaxAllowedPreBooks (initialDate, finalDate) {
        return a().$get('/bookings/user/max-reservations-on-dates', { params: { initialDate, finalDate } })
          .catch(handleError)
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
    seat: {
      getParkingLotsWithoutSeatOwner (params) {
        return a().$get('/seats/get-seats-without-seatowners', { params }).catch(handleError)
      },
      getParkingLotsOwners (params) {
        return a().$get('/seats/get-seats-with-seatowners', { params }).catch(handleError)
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
    hood: {
      get (filter) {
        return a().$get('/hood/', { params: filter }).catch(handleError)
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
    userParkingAccess: {
      mine () {
        return a().$get('/userParkingAccesses/user').catch(handleError)
      },
      getUserInfo (userId, buildingId) {
        return a().$get(`/userParkingAccesses/getUserInfo/${userId}/${buildingId}`).catch(handleError)
      },
      deleteUserInfo (body) {
        return a().$post('/userParkingAccesses/delete-user-info', body).catch(handleError)
      }
    }
  })
}
