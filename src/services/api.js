import { API_URL } from '../constants'

import axios from 'axios'

export default () => {
  return axios.create({
    baseURL: API_URL
  })
}
