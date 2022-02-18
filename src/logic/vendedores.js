import axios from 'axios'
const config = require('../config/endpoints.js')
const ENDPOINT_PATH = config.endpoint_path

export default {
  listarVendedores () {
    return axios.get(ENDPOINT_PATH + 'listarVendedores')
  },
  listarVendedorClientes (idvendedor, idrol) {
    const data = { idvendedor, idrol }
    return axios.post(ENDPOINT_PATH + 'listarVendedorClientes', data)
  }
}
