const state = {
    tipsSetting: true
}

const mutations = {
    'SAVE_TIPS_SETTING'(currentState, data) {
        currentState.tipsSetting = data
    }
}

const actions = {
    saveTipsSetting({ commit }, data) {
        commit('SAVE_TIPS_SETTING', data)
    }
}

const getters = {
    tipsSetting(currentState) {
        return currentState.tipsSetting
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}