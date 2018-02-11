let API_URL = null
let BASE_URL = null

if (process.env.NODE_ENV === 'production') {
  API_URL = `${window.location.protocol}//${window.location.hostname}`
  BASE_URL = `${window.location.protocol}//${window.location.hostname}`
} else {
  const API_HOST = `${window.location.protocol}//${window.location.hostname}`
  API_URL = `${API_HOST}:${process.env.API_PORT}/`
  BASE_URL = `${API_HOST}:8081/`
}

export { API_URL, BASE_URL }
