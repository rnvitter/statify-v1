import api from './api'

export default {
  hello () {
    return api().get('api')
  },
  login () {
    return api().get('login')
  },
  logout () {
    return api().get('logout')
  },
  callback (data) {
    return api().get('callback', data)
  }
}
