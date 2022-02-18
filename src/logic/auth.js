import axios from 'axios'
const config = require('../config/endpoints.js')
const ENDPOINT_PATH = config.endpoint_path

export default {
  login (usuario, clave, uuid) {
    const data = { usuario, clave, uuid }
    return axios.post(ENDPOINT_PATH + 'login', data)
  },
  cambiarclave (usuario, claveactual, nuevaclave) {
    const data = { usuario, claveactual, nuevaclave }
    return axios.post(ENDPOINT_PATH + 'cambiarclave', data)
  },
  bloque7 () {
    return axios.get(ENDPOINT_PATH)
  },
  usuarios () {
    return axios.get(ENDPOINT_PATH + 'usuarios')
  },
  hideShowUsuarios (val, id) {
    const data = { val, id }
    return axios.post(ENDPOINT_PATH + 'hideShowUsuarios', data)
  },
  resetDevice (id) {
    const data = { id }
    return axios.post(ENDPOINT_PATH + 'resetDevice', data)
  },
  updateFechaUltGet (id) {
    const data = { id }
    return axios.post(ENDPOINT_PATH + 'updateFechaUltGet', data)
  },
  addUser (usuario, nombre) {
    const data = { usuario, nombre }
    return axios.post(ENDPOINT_PATH + 'addUser', data)
  }
}
