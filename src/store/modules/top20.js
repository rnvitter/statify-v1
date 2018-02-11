const state = {
  topMusicData: null,
  topMusicUsername: null,
  topMusicDialogState: null
}

const mutations = {
  'SAVE_TOP20_DATA' (currentState, data) {
    currentState.topMusicData = data
  },
  'SAVE_TOP20_USERNAME' (currentState, data) {
    currentState.topMusicUsername = data
  },
  'SAVE_TOP20_DIALOG_STATE' (currentState, data) {
    currentState.topMusicDialogState = data
  }
}

const actions = {
  savetopMusicData ({ commit }, data) {
    commit('SAVE_TOP20_DATA', data)
  },
  savetopMusicUsername ({ commit }, data) {
    commit('SAVE_TOP20_USERNAME', data)
  },
  savetopMusicDialogState ({ commit }, data) {
    commit('SAVE_TOP20_DIALOG_STATE', data)
  }
}

const getters = {
  topMusicData (currentState) {
    return currentState.topMusicData
  },
  topMusicUsername (currentState) {
    return currentState.topMusicUsername
  },
  topMusicDialogState (currentState) {
    return currentState.topMusicDialogState
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
