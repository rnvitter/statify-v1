const state = {
  topMusicData: null,
  topMusicUsername: null,
  topMusicType: null,
  topMusicLimit: null,
  topMusicDialogState: null
}

const mutations = {
  'SAVE_TOP_MUSIC_DATA' (currentState, data) {
    currentState.topMusicData = data
  },
  'SAVE_TOP_MUSIC_USERNAME' (currentState, data) {
    currentState.topMusicUsername = data
  },
  'SAVE_TOP_MUSIC_TYPE' (currentState, data) {
    currentState.topMusicType = data
  },
  'SAVE_TOP_MUSIC_LIMIT' (currentState, data) {
    currentState.topMusicLimit = data
  },
  'SAVE_TOP_MUSIC_DIALOG_STATE' (currentState, data) {
    currentState.topMusicDialogState = data
  }
}

const actions = {
  savetopMusicData ({ commit }, data) {
    commit('SAVE_TOP_MUSIC_DATA', data)
  },
  savetopMusicUsername ({ commit }, data) {
    commit('SAVE_TOP_MUSIC_USERNAME', data)
  },
  savetopMusicType({ commit }, data) {
    commit('SAVE_TOP_MUSIC_TYPE', data)
  },
  savetopMusicLimit({ commit }, data) {
    commit('SAVE_TOP_MUSIC_LIMIT', data)
  },
  savetopMusicDialogState ({ commit }, data) {
    commit('SAVE_TOP_MUSIC_DIALOG_STATE', data)
  }
}

const getters = {
  topMusicData (currentState) {
    return currentState.topMusicData
  },
  topMusicUsername (currentState) {
    return currentState.topMusicUsername
  },
  topMusicType (currentState) {
    return currentState.topMusicType
  },
  topMusicLimit (currentState) {
    return currentState.topMusicLimit
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
