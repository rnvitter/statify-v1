import 'vuetify/dist/vuetify.min.css'
import 'tachyons/css/tachyons.min.css'

import Vue from 'vue'
import Vuetify from 'vuetify'

import App from './App.vue'

import router from './router'

Vue.use(Vuetify)

new Vue({ // eslint-disable-line no-new
  el: '#app',
  render: h => h(App),
  router
})
