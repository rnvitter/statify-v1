import 'vuetify/dist/vuetify.min.css'
import 'vue-awesome/icons'
import 'tachyons/css/tachyons.min.css'

import Vue from 'vue'
import Vuetify from 'vuetify'

import App from './App.vue'

import router from './router'

import Icon from 'vue-awesome/components/Icon'

Vue.use(Vuetify)

Vue.component('icon', Icon)

new Vue({ // eslint-disable-line no-new
  el: '#app',
  render: h => h(App),
  router
})
