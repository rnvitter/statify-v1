const state = {
  spotifyToken: null
}

const mutations = {
  'SAVE_SPOTIFY_TOKEN' (currentState, data) {
    currentState.spotifyToken = data
  }
}

const actions = {
  saveSpotifyToken ({ commit }, data) {
    commit('SAVE_SPOTIFY_TOKEN', data)
  }
}

const getters = {
  spotifyToken (currentState) {
    return currentState.spotifyToken
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
