import axios from 'axios'
const config = require('../config/endpoints.js')
const ENDPOINT_PATH = config.endpoint_path

class Producto {
  listar (categoria) {
    const data = { categoria }
    return axios.post(ENDPOINT_PATH + 'listarproductos', data)
  }

  migrarproductos () {
    return axios.get(ENDPOINT_PATH + 'migrarproductos')
  }

  getimagenproducto (idproducto) {
    const data = { idproducto }
    return axios.post(ENDPOINT_PATH + 'getimagenproducto', data)
  }

  getfile (id) {
    return axios.get(ENDPOINT_PATH + 'files/' + id + '.png')
  }
}
export default new Producto()
