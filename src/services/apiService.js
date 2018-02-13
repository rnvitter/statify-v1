import api from './api'

export default {
  login () {
    return api().get('login')
  },
  getShortUrl (longUrl) {
    return api().get('short_url', {
      params: {
        url: longUrl
      }
    })
  }
}
