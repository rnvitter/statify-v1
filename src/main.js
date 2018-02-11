import 'vuetify/dist/vuetify.min.css'
import 'tachyons/css/tachyons.min.css'

import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import VueClipboard from 'vue-clipboard2'

import App from './App.vue'

import router from './router'

import store from './store'

Vue.use(Vuex)
Vue.use(Vuetify)
Vue.use(VueClipboard)

new Vue({ // eslint-disable-line no-new
  el: '#app',
  render: h => h(App),
  router,
  store
})
