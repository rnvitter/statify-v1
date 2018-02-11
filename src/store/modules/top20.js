const state = {
  top20Data: null,
  top20Username: null,
  top20DialogState: null
}

const mutations = {
  'SAVE_TOP20_DATA' (currentState, data) {
    currentState.top20Data = data
  },
  'SAVE_TOP20_USERNAME' (currentState, data) {
    currentState.top20Username = data
  },
  'SAVE_TOP20_DIALOG_STATE' (currentState, data) {
    currentState.top20DialogState = data
  }
}

const actions = {
  savetop20Data ({ commit }, data) {
    commit('SAVE_TOP20_DATA', data)
  },
  saveTop20Username ({ commit }, data) {
    commit('SAVE_TOP20_USERNAME', data)
  },
  saveTop20DialogState ({ commit }, data) {
    commit('SAVE_TOP20_DIALOG_STATE', data)
  }
}

const getters = {
  top20Data (currentState) {
    return currentState.top20Data
  },
  top20Username (currentState) {
    return currentState.top20Username
  },
  top20DialogState (currentState) {
    return currentState.top20DialogState
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
