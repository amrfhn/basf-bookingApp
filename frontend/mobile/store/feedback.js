export const state = () => ({
  _text: '',
  _file: null,
  _anonymous: false,
  _dates: { from: null, to: null },
  _type: null,
  _showAnonymous: false,
  _sites: [],
  _selectedSite: null
})

/**
 * Mutations must be used only by actions
 *
 * by calling commit('mutator', data)
 */
export const mutations = {
  setText (state, text) {
    state._text = text
  },
  setFile (state, file) {
    state._file = file
  },
  setDates (state, dates) {
    state._dates = dates
  },
  setAnonymous (state, anonymous) {
    state._anonymous = anonymous
  },
  setType (state, type) {
    state._type = type
  },
  setShowAnonymous (state, showAnonymous) {
    state._showAnonymous = showAnonymous
  },
  setSites (state, sites) {
    state._sites = sites
  },
  setSelectedSite (state, selectedSite) {
    state._selectedSite = selectedSite
  }
}

/**
 * Getters should be used by computed properties
 *
 * by returning  this.$store.getters['module/getter']
 */
export const getters = {
  getText (state) {
    return state._text
  },
  getFile (state) {
    return state._file
  },
  getDates (state) {
    return state._dates
  },
  getAnonymous (state) {
    return state._anonymous
  },
  getType (state) {
    return state._type
  },
  getShowAnonymous (state) {
    return state._showAnonymous
  },
  getSites (state) {
    return state._sites
  },
  getSelectedSite (state) {
    return state._selectedSite
  }
}

/**
 * Actions could be used in pages when page is created
 *
 * calling this.$store.dispatch('module/action')
 */
export const actions = {
  async sendFeedback ({ getters, dispatch }) {
    let data = null
    switch (getters.getType) {
      case 'Error':
        data = {
          type: 'Error Report Feedback',
          text: getters.getText,
          file: getters.getFile,
          anonymous: getters.getAnonymous,
          site: getters.getSelectedSite
        }
        if (!getters.getSelectedSite) {
          data.site = ''
        } else {
          data.site = getters.getSelectedSite.name
        }
        break
      case 'SeatUnavailable':
        data = {
          type: 'Seat Unavailable Feedback',
          dateFrom: getters.getDates.from,
          dateTo: getters.getDates.to,
          anonymous: getters.getAnonymous,
          site: getters.getSelectedSite
        }
        if (!getters.getSelectedSite) {
          data.site = ''
        } else {
          data.site = getters.getSelectedSite.name
        }
        break
      case 'Comment':
        data = {
          type: 'Send Comment Feedback',
          text: getters.getText,
          anonymous: getters.getAnonymous,
          site: getters.getSelectedSite
        }
        if (!getters.getSelectedSite) {
          data.site = ''
        } else {
          data.site = getters.getSelectedSite.name
        }
        break
    }
    await this.$api.feedback.create(data).then(() => dispatch('clean'))
  },
  updateText ({ commit }, text) {
    commit('setText', text)
  },
  updateFile ({ commit }, file) {
    commit('setFile', file)
  },
  updateDates ({ commit }, dates) {
    commit('setDates', dates)
  },
  updateAnonymous ({ commit }, anonymous) {
    commit('setAnonymous', anonymous)
  },
  changeType ({ commit }, type) {
    commit('setType', type)
    switch (type) {
      case 'Error':
        commit('setAnonymous', false)
        commit('setShowAnonymous', false)
        break
      case 'SeatUnavailable':
        commit('setAnonymous', false)
        commit('setShowAnonymous', false)
        break
      case 'Comment':
        commit('setShowAnonymous', true)
        break
    }
  },
  async loadSites ({ commit, dispatch }) {
    await dispatch('clean')
    const [sites, l] = await Promise.all([this.$api.site.get(), this.$api.building.userLatest(), dispatch('auth/waitAuth', null, { root: true })])
    commit('setSites', sites)
    if (l) {
      const site = sites.find(site => site.id === l.site.id)
      await dispatch('selectSite', site)
    }
  },
  selectSite ({ commit, dispatch }, site) {
    commit('setSelectedSite', site)
  },
  clean ({ commit }) {
    commit('setText', '')
  }
}
