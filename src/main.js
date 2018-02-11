import 'vuetify/dist/vuetify.min.css'
import 'tachyons/css/tachyons.min.css'

import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'

import App from './App.vue'

import router from './router'

import store from './store'

Vue.use(Vuex)
Vue.use(Vuetify)

new Vue({ // eslint-disable-line no-new
  el: '#app',
  render: h => h(App),
  router,
  store
})
