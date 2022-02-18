import axios from 'axios'
const config = require('../config/endpoints.js')
const ENDPOINT_PATH = config.endpoint_path

class Cliente {
  getholds (idusuario) {
    const data = { idusuario }
    return axios.post(ENDPOINT_PATH + 'getholds', data)
  }

  getitemsholds (idusuario) {
    const data = { idusuario }
    return axios.post(ENDPOINT_PATH + 'getitemsholds', data)
  }

  getcxc (idusuario, idrol) {
    const data = { idusuario, idrol }
    return axios.post(ENDPOINT_PATH + 'getcxc', data)
  }
}
export default new Cliente()
