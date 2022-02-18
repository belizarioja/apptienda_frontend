<template>
  <q-page class="text-center">
    <div class="headerItem">
      <div class="subHeaderItem">BIENVENIDO</div>
    </div>
    <q-card class="my-card borderdetailt" style="margin: 20px">
      <q-card-section
        style="
          padding: 7px;
          height: 250px;
        "
      >
        <div class="menuitem" v-show="idrol === 3" @click="gotoClientes()">
          <q-icon class="iconApp" name="point_of_sale" color="primary" />
          <div class="tituloApp">PEDIDOS</div>
        </div>
        <div class="menuitem" v-show="idrol === 1" @click="gotoClientes()">
          <q-icon class="iconApp" name="assignment_ind" color="primary" />
          <div class="tituloApp">CLIENTES</div>
        </div>
        <div
          class="menuitem "
          v-show="idrol === 1"
          @click="gotoUsuarios()">
          <q-icon class="iconApp" name="account_circle" color="primary" />
          <div class="tituloApp">USUARIOS</div>
        </div>
        <div class="menuitem" v-show="idrol === 1" @click="gotoVendedores()">
          <q-icon class="iconApp" name="manage_accounts" color="primary" />
          <div class="tituloApp">VENDEDORES</div>
        </div>
        <div class="menuitem" v-show="idrol === 1 || idrol === 3" @click="gotoProductos()">
          <q-icon class="iconApp" name="price_change" color="primary" />
          <div class="tituloApp">PRODUCTOS</div>
        </div>
        <div class="menuitem" v-show="idrol === 1 || idrol === 3" @click="gotoCxc()">
          <q-icon class="iconApp" name="paid" color="primary" />
          <div class="tituloApp">CTAS X COBRAR</div>
        </div>
        <div class="menuitem" v-show="idrol === 1 || idrol === 3" @click="gotoReportePedidos()">
          <q-icon class="iconApp" name="view_list" color="primary" />
          <div class="tituloApp">REPORTE</div>
        </div>

      </q-card-section>
      <q-separator />
      <q-item>
        <div @click="getSincronized()">
          <q-icon class="iconApp" name="system_update" color="primary" />
        </div>
        <q-item-section>
          <q-item-label style="font-size: 24px">Sincronizar</q-item-label>
          <q-item-label caption>
            Último <span id="feultgetId">{{ feultget }}</span>
          </q-item-label>
        </q-item-section>
        <div @click="viewSincronized()">
          <q-icon class="iconApp" name="send_to_mobile" color="secondary">
            <q-badge color="primary" floating>!</q-badge>
          </q-icon>
        </div>
      </q-item>
    </q-card>
    <div v-if="loader" class="procesando">
      <span style="display: grid"
        >Sincronizando, espere...
        <q-linear-progress indeterminate />
      </span>
    </div>
    <q-dialog v-model="layoutModal" persistent transition-show="flip-down" transition-hide="flip-up">
      <q-card class="borderdetailt">
        <q-bar  class="bg-primary text-white">
          <q-icon name="speaker_notes" />
          <div>RESUMEN PARA ENVIAR</div>
          <q-space />

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section class="q-pt-none">
          <q-list
           bordered
           padding
           style="margin-top: 15px"
           v-if="enviados === 0 && eliminados === 0 && guardados === 0 && carrito === 0"
           >
            <q-item style=" display: grid;">
              <q-icon name="verified" style="color: #8fc969;font-size: 190px;"/>
              <span style="text-align: center; color: #707271;">NADA PENDIENTE POR ENVIAR</span>
            </q-item>
          </q-list>
          <q-list v-else bordered padding style="margin-top: 15px">
            <q-item>
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" icon="production_quantity_limits" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Enviados a ejecutar: </q-item-label>
                <q-item-label caption lines="2">{{ enviados }} pedidos</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced inset="item" />

            <q-item>
              <q-item-section top avatar>
                <q-avatar color="info" text-color="white" icon="add_shopping_cart" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Guardados para revisar:</q-item-label>
                <q-item-label caption lines="2">{{ guardados }} pedidos</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced inset="item" />

            <q-item>
              <q-item-section top avatar>
                <q-avatar color="dark" text-color="white" icon="remove_shopping_cart" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Eliminados :</q-item-label>
                <q-item-label caption lines="2">{{ eliminados }} pedidos</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced inset="item" />

            <q-item>
              <q-item-section top avatar>
                <q-avatar color="secondary" text-color="white" icon="shopping_cart" />
              </q-item-section>

              <q-item-section>
                <q-item-label>Dejado en el carrito:</q-item-label>
                <q-item-label caption lines="2">{{ carrito }} pedido</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-card-actions class="justify-center">
            <q-btn
              style="font-size: 10px;padding: 7px 10px;"
              label="Cancelar"
              type="buttom"
              color="secondary"
              icon="close"
              v-close-popup
            />
            <q-btn
              style="font-size: 10px;margin-right: 10px;padding: 7px 10px;"
              label="Enviar"
              type="buttom"
              color="primary"
              icon="send"
              :disable="btndisableb"
              @click="setSincronized()"
            />
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import productosLib from '../logic/productos'
import categoriasLib from '../logic/categorias'
import clientesLib from '../logic/clientes'
import vendedorLib from '../logic/vendedores'
import authLib from '../logic/auth'
import pedidosLib from '../logic/pedidos'
import moment from 'moment'
// const config = require('../config/endpoints.js')
// const ENDPOINT_PATH = config.endpoint_path

export default defineComponent({
  name: 'PageIndex',
  data () {
    const layoutModal = ref(false)
    const btndisableb = ref(true)
    const enviados = ref(0)
    const guardados = ref(0)
    const eliminados = ref(0)
    const carrito = ref(0)
    return {
      idrol: this.$q.localStorage.getItem('idrol'),
      usuario: this.$q.localStorage.getItem('usuario'),
      idusuario: this.$q.localStorage.getItem('idusuario'),
      idsucursal: this.$q.localStorage.getItem('idsucursal'),
      feultget: this.$q.localStorage.getItem('feultget'),
      // loader: false,
      loaderproductos: false,
      loaderclientes: false,
      loadercxc: false,
      layoutModal,
      guardados,
      enviados,
      eliminados,
      btndisableb,
      carrito
    }
  },
  methods: {
    gotoClientes () {
      const datos = this.$q.localStorage.getItem('clientes') ? this.$q.localStorage.getItem('clientes') : []
      if (datos.length > 0) {
        this.$router.push('/clientes')
      } else {
        this.$q.dialog({
          title: 'No tiene CLIENTES!',
          message: 'Debe sincronizar!',
          persistent: true
        })
      }
    },
    gotoUsuarios () {
      const datos = this.$q.localStorage.getItem('usuarios') ? this.$q.localStorage.getItem('usuarios') : []
      if (datos.length > 0) {
        this.$router.push('/usuarios')
      } else {
        this.$q.dialog({
          title: 'No tiene USUARIOS!',
          message: 'Debe sincronizar!',
          persistent: true
        })
      }
    },
    gotoVendedores () {
      const datos = this.$q.localStorage.getItem('vendedores') ? this.$q.localStorage.getItem('vendedores') : []
      if (datos.length > 0) {
        this.$router.push('/vendedores')
      } else {
        this.$q.dialog({
          title: 'No tiene VENDEDORES!',
          message: 'Debe sincronizar!',
          persistent: true
        })
      }
    },
    gotoCxc () {
      this.$q.localStorage.remove('usuarioreporte')
      this.$q.localStorage.remove('nombrereporte')
      const datos = this.$q.localStorage.getItem('cuentasxc') ? this.$q.localStorage.getItem('cuentasxc') : []
      if (datos.length > 0) {
        this.$router.push('/cuentasxcobrar')
      } else {
        this.$q.dialog({
          title: 'No tiene CUENTAS POR COBRAR!',
          message: 'Debe sincronizar!',
          persistent: true
        })
      }
    },
    gotoReportePedidos () {
      this.$q.localStorage.remove('usuarioreporte')
      this.$q.localStorage.remove('nombrereporte')
      this.$q.localStorage.remove('fechareporte')
      const datos = this.$q.localStorage.getItem('pedidos') ? this.$q.localStorage.getItem('pedidos') : []
      if (datos.length > 0) {
        this.$router.push('/reportepedidos')
      } else {
        this.$q.dialog({
          title: 'No tiene PEDIDOS!',
          message: 'Debe sincronizar!',
          persistent: true
        })
      }
    },
    gotoProductos () {
      const datos = this.$q.localStorage.getItem('productos') ? this.$q.localStorage.getItem('productos') : []
      if (datos.length > 0) {
        this.$router.push('/productos')
      } else {
        this.$q.dialog({
          title: 'No tiene PRODUCTOS!',
          message: 'Debe sincronizar!',
          persistent: true
        })
      }
    },
    mensajeError (resp) {
      const message = resp === 2 ? 'No hay ENLACE con BLOQUE 7' : 'No tiene INTERNET'
      this.$q.dialog({
        title: '¡Problemas de CONEXION!',
        message: message,
        persistent: true
      })
    },
    async checkNet () {
      try {
        const resp = await authLib.bloque7()
        return resp.status === 200 ? 1 : 2
      } catch (error) {
        return 3
      }
    },
    viewSincronized () {
      const holds = this.$q.localStorage.getItem('holds') ? this.$q.localStorage.getItem('holds') : []

      const enviados = holds.filter(obj => obj.status === 3)
      this.enviados = enviados.length

      const guardados = holds.filter(obj => obj.status === 0)
      this.guardados = guardados.length

      const eliminados = holds.filter(obj => obj.status === 2)
      this.eliminados = eliminados.length

      const carrito = holds.filter(obj => obj.status === 1)
      this.carrito = carrito.length

      this.layoutModal = true
      this.btndisableb = true
      if (this.enviados > 0 || this.guardados > 0 || this.eliminados > 0 || this.carrito > 0) {
        this.btndisableb = false
      }
    },
    async getItemsHolds () {
      if (this.idrol !== 1) {
        const resp = await clientesLib.getitemsholds(this.idusuario)
        // console.log('Aqui get itemhols')
        const holds = this.$q.localStorage.getItem('holds')
        const itemsholds = resp.data
        let cantsaves = 0
        for (const i in holds) {
          let cantitemscarrito = 0
          let subtotal = 0
          itemsholds.forEach(function (item) {
            if (holds[i].id === item.idhold) {
              item.indice = holds[i].indice
              cantitemscarrito = parseInt(cantitemscarrito) + 1
              subtotal += parseFloat(item.subtotal)
            }
          })
          holds[i].cantitemscarrito = cantitemscarrito
          holds[i].subtotal = subtotal
          if (holds[i].status === 1) {
            this.$q.localStorage.set('idcliente', holds[i].idcliente)

            const circuloTotalItem = document.querySelector('.totalItemBlack')
            const totalItemHold = document.querySelector('.totalItemHold')

            if (totalItemHold.classList.contains('invisible')) {
              totalItemHold.classList.remove('invisible')
            }
            if (circuloTotalItem) {
              circuloTotalItem.textContent = cantitemscarrito
            }
            const cuentasxc = this.$q.localStorage.getItem('cuentasxc')
            // console.log('cuentasxc')
            if (cuentasxc) {
              const find = cuentasxc.filter(
                (obj) => obj.idcliente === holds[i].idcliente
              )
              if (find.length > 0) {
                const totalItemCxc = document.querySelector('.totalItemCxc')
                const circuloCxcItem = document.querySelector('.totalItemRed')
                totalItemCxc.classList.remove('invisible')
                circuloCxcItem.textContent = find[0].details.length
              }
            }
          }
          if (holds[i].status === 0) {
            cantsaves = parseInt(cantsaves) + 1
          }
        }
        this.$q.localStorage.remove('holds')
        this.$q.localStorage.set('holds', holds)
        this.$q.localStorage.remove('itemsholds')
        this.$q.localStorage.set('itemsholds', itemsholds)
        const idTotalSaves = document.querySelector('#idTotalSaves')
        const totalItemSaves = document.querySelector('.totalItemSaves')
        const circuloTotalSaves = document.querySelector('.totalItemBlue')
        if (idTotalSaves) {
          idTotalSaves.textContent = 'Total : $' + this.totalsaves.toFixed(2)
        }
        if (circuloTotalSaves) {
          circuloTotalSaves.textContent = cantsaves
        }
        if (cantsaves > 0) {
          if (totalItemSaves.classList.contains('invisible')) {
            totalItemSaves.classList.remove('invisible')
          }
        }
      }
    },
    async getHolds () {
      const serverData = []
      const resp = await clientesLib.getholds(this.idusuario)
      // console.log('Aqui get hols')
      for (const i in resp.data) {
        const item = resp.data[i]
        item.indice = i
        serverData.push(item)
      }
      this.$q.localStorage.remove('holds')
      this.$q.localStorage.set('holds', serverData)
    },
    async getClientes () {
      const serverData = []
      const resp = await vendedorLib.listarVendedorClientes(this.usuario, this.idrol)
      // console.log('getClientes')
      // console.log(resp)
      const datos = resp.data
      for (const i in datos) {
        const item = datos[i]
        const obj = {}
        obj.idcliente = item.idcliente
        obj.nombrecliente = item.nombrecliente
        obj.rifcliente = item.rifcliente
        obj.telefonocliente = item.telefonocliente
        obj.direccioncliente = item.direccioncliente
        obj.nombrevendedor = item.nombrevendedor
        serverData.push(obj)
      }
      this.$q.localStorage.remove('clientes')
      this.$q.localStorage.set('clientes', serverData)
    },
    async getUsuarios () {
      const serverData = []
      if (this.idrol === 1) {
        const resp = await authLib.usuarios()
        const datos = resp.data
        // console.log('getUsuarios')
        for (const i in datos) {
          const item = datos[i]
          const obj = {}
          obj.id = item.id
          obj.usuario = item.usuario
          obj.clave = item.clave
          obj.nombre = item.nombre
          obj.idrol = item.idrol
          obj.rol = item.rol
          obj.uuid = item.uuid ? item.uuid : 'S/Inf'
          obj.fe_ult_acceso = item.fe_ult_acceso
            ? moment(item.fe_ult_acceso).format('DD/MM/YYYY HH:mm:ss')
            : 'S/Inf'
          obj.fe_ult_get = item.fe_ult_get
            ? moment(item.fe_ult_get).format('DD/MM/YYYY HH:mm:ss')
            : 'S/Inf'
          obj.status = item.status
          serverData.push(obj)
        }
        this.$q.localStorage.remove('usuarios')
        this.$q.localStorage.set('usuarios', serverData)
      }
    },
    async getVendedores () {
      if (this.idrol === 1) {
        const resp = await vendedorLib.listarVendedores()
        // console.log('getVendedores')
        const serverData = resp.data
        this.$q.localStorage.remove('vendedores')
        this.$q.localStorage.set('vendedores', serverData)
      }
    },
    async getCategorias () {
      const resp = await categoriasLib.listarcategorias()
      // console.log('getCategorias')
      const serverData = resp.data
      this.$q.localStorage.remove('categorias')
      this.$q.localStorage.set('categorias', serverData)
    },
    async getProductos () {
      const resp = await productosLib.listar(null)
      const serverData = []
      const datos = resp.data
      for (const i in datos) {
        const item = datos[i]
        const obj = {}
        obj.id = item.id
        obj.nombre = item.nombre
        obj.precio =
          item.porkilos === 1
            ? item.precio
            : parseFloat(item.precio / item.unixcaja)
        obj.disponible = item.disponible
        obj.preciocaj = item.preciocaj
        obj.unixcaja = item.unixcaja
        obj.idcategoria = item.idcategoria
        obj.costoactu = item.costoactu
        obj.porciva = item.porciva
        obj.porkilos = item.porkilos
        obj.imagen = false
        const resp2 = await productosLib.getfile(item.id)
        if (resp2.status === 200) {
          // console.log(resp2)
          obj.imagen = resp2.data.imgbase64
        }
        serverData.push(obj)
      }
      console.log(serverData)
      this.loaderproductos = false
      this.$q.localStorage.remove('productos')
      this.$q.localStorage.set('productos', serverData)
    },
    async getCxc () {
      const serverData = []
      const resp = await clientesLib.getcxc(this.usuario, this.idrol)
      // console.log('getCxc')
      const datos = resp.data
      for (const i in datos) {
        const item = datos[i]
        const obj2 = {}
        obj2.id = item.id
        obj2.tipodoc = item.tipodoc
        obj2.fecha = moment(item.fecha).format('YYYY-MM-DD')
        obj2.dias = this.calcDiffHours(item.fecha)
        obj2.monto = '$' + item.monto.toFixed(2)
        obj2.saldo = '$' + item.saldo.toFixed(2)
        const index = serverData.findIndex(
          (obj) => obj.idcliente === item.idcliente
        )
        if (index === -1) {
          const obj = {}
          obj.totalcxc = 0
          obj.details = []
          obj.idcliente = item.idcliente
          obj.nombrecliente = item.nombrecliente
          obj.nombrevendedor = item.nombrevendedor
          obj.idvendedor = item.idvendedor
          obj.rifcliente = item.rifcliente
          obj.nombrevendedor = item.nombrevendedor
          if (item.tipodoc === 'PA') {
            obj.totalcxc -= parseFloat(item.saldo)
          } else {
            obj.totalcxc += parseFloat(item.saldo)
          }
          obj.cantidadcxc = 1
          obj.details.push(obj2)
          serverData.push(obj)
        } else {
          if (item.tipodoc === 'PA') {
            serverData[index].totalcxc -= parseFloat(item.saldo)
          } else {
            serverData[index].totalcxc += parseFloat(item.saldo)
          }
          serverData[index].details.push(obj2)
          serverData[index].cantidadcxc += parseInt(1)
        }
      }
      this.loadercxc = false
      this.$q.localStorage.remove('cuentasxc')
      this.$q.localStorage.set('cuentasxc', serverData)
    },
    async getPedidos () {
      const serverData = this.$q.localStorage.getItem('pedidos') ? this.$q.localStorage.getItem('pedidos') : []
      const vendedores = this.$q.localStorage.getItem('vendedores') ? this.$q.localStorage.getItem('vendedores') : []
      let ultnumedocu = this.$q.localStorage.getItem('ultnumedocu') ? this.$q.localStorage.getItem('ultnumedocu') : null
      const resp = await pedidosLib.reportePedidos(this.usuario, ultnumedocu, this.idrol)
      const datos = resp.data
      // console.log(' Aqui get pedidos')
      for (const i in datos) {
        const item = datos[i]
        const obj2 = {}
        // obj2.idproducto = item.idproducto
        obj2.nombreproducto = item.idproducto + ' - ' + item.nombreproducto
        obj2.precio = '$' + item.precio.toFixed(2)
        obj2.cantidad = item.cantidad
        obj2.subtotal = '$' + item.subtotal.toFixed(2)
        const index = serverData.findIndex(obj => obj.numedocu === item.numedocu)
        if (index === -1) {
          const obj = {}
          // obj.totalcxc = 0
          obj.details = []
          obj.id = item.id
          obj.numedocu = item.numedocu
          ultnumedocu = item.numedocu
          obj.usuario = item.usuario
          const find = vendedores.filter(obj => obj.id.toUpperCase().trim() === item.usuario.toUpperCase().trim())
          if (find.length > 0) {
            // console.log(find[0].nombre)
            obj.nombrevendedor = find[0].nombre
          } else {
            obj.nombrevendedor = 'INDETERMINADO'
          }
          obj.nombrecliente = item.idcliente + ' - ' + item.nombrecliente
          obj.fecha = moment(item.fecha).format('YYYY/MM/DD')
          obj.hora = moment(item.fecha).format('HH:mm:ss')
          obj.status = true
          // obj.totalcxc += parseFloat(item.saldo)
          obj.details.push(obj2)
          serverData.unshift(obj)
        } else {
          // this.serverData[index].totalcxc += parseFloat(item.saldo)
          serverData[index].details.push(obj2)
        }
        ultnumedocu = serverData.length > 0 ? serverData[0].numedocu : null
        this.$q.localStorage.remove('ultnumedocu')
        this.$q.localStorage.set('ultnumedocu', ultnumedocu)
        this.$q.localStorage.remove('pedidos')
        this.$q.localStorage.set('pedidos', serverData)
      }
    },
    calcDiffHours (fecha) {
      const now = moment()
      const end = moment(fecha, 'YYYY-MM-DD')
      const duration = moment.duration(now.diff(end))
      return duration.asDays().toFixed(0)
    },
    falloCallback () {
      console.log('Error sincronizando')
    },
    async setPedidos () {
      const holds = this.$q.localStorage.getItem('holds') ? this.$q.localStorage.getItem('holds') : []
      const itemspedido = this.$q.localStorage.getItem('itemsholds') ? this.$q.localStorage.getItem('itemsholds') : []
      const pedidos = holds.filter((obj) => obj.status === 3)
      // console.log('Set pedidos')
      const idusuario = this.idusuario
      const usuario = this.usuario
      const idsucursal = this.idsucursal
      pedidos.forEach(async function (item) {
        // console.log(item)
        const idcliente = item.idcliente
        const nombrecliente = item.nombrecliente
        const rifcliente = item.rifcliente
        const comentario = 'PEDIDO DESDE APP'
        const arregloOriginal = itemspedido.filter(
          (obj) => obj.indice === item.indice
        )
        const arregloDeArreglos = []
        const LONGITUD_PEDAZOS = 13
        for (let i = 0; i < arregloOriginal.length; i += LONGITUD_PEDAZOS) {
          const pedazo = arregloOriginal.slice(i, i + LONGITUD_PEDAZOS)
          arregloDeArreglos.push(pedazo)
        }
        for (const j in arregloDeArreglos) {
          const arreglopedido = arregloDeArreglos[j]
          let totalcarrito = 0
          arreglopedido.forEach(function (elemento) {
            totalcarrito = parseFloat(totalcarrito) + parseFloat(elemento.subtotal)
          })
          await pedidosLib.setpedido(idusuario, usuario, idcliente, nombrecliente, rifcliente, totalcarrito, idsucursal, arreglopedido, comentario)
          // const resp = await pedidosLib.setpedido(idusuario, usuario, idcliente, nombrecliente, rifcliente, totalcarrito, idsucursal, arreglopedido, comentario)
          // console.log(resp.status)
        }
      })
    },
    async setEliminados () {
      const holds = this.$q.localStorage.getItem('holds') ? this.$q.localStorage.getItem('holds') : []
      const pedidos = holds.filter((obj) => obj.status === 2 || obj.status === 3)
      // console.log('Set eliminados')
      for (const i in pedidos) {
        const item = pedidos[i]
        await pedidosLib.deletecarrito(item.id)
      }
    },
    async setGuardados () {
      const holds = this.$q.localStorage.getItem('holds') ? this.$q.localStorage.getItem('holds') : []
      const pedidos = holds.filter((obj) => obj.status === 1 || obj.status === 0)
      const itemspedido = this.$q.localStorage.getItem('itemsholds') ? this.$q.localStorage.getItem('itemsholds') : []
      // console.log('Set guardados')
      for (const i in pedidos) {
        const item = pedidos[i]
        const arreglopedido = itemspedido.filter(
          (obj) => obj.indice === item.indice
        )
        pedidosLib.savePedido(item, arreglopedido)
      }
    },
    async setUpdateFecha () {
      this.$q.localStorage.remove('holds')
      this.$q.localStorage.remove('itemsholds')
      await authLib.updateFechaUltGet(this.idusuario)
    },
    async setSincronized () {
      const respnet = await this.checkNet()
      if (respnet > 1) {
        this.mensajeError(respnet)
        return
      }
      this.layoutModal = false
      this.loaderproductos = true
      await this.setPedidos()
      await this.setGuardados()
      await this.setEliminados()
      await this.setUpdateFecha().then(() => {
        // console.log('Enviado de pedidos finalizó sin problema')
        this.feultget = moment().format('YYYY-MM-DD HH:mm:ss')
        this.$q.localStorage.remove('feultget')
        this.$q.localStorage.set('feultget', this.feultget)
        this.loaderproductos = false
        const totalItemSaves = document.querySelector('.totalItemSaves')
        totalItemSaves.classList.add('invisible')
        const totalItemHold = document.querySelector('.totalItemHold')
        totalItemHold.classList.add('invisible')
        const totalItemCxc = document.querySelector('.totalItemCxc')
        totalItemCxc.classList.add('invisible')
      }).catch(this.falloCallback)
    },
    async getSincronized () {
      const respnet = await this.checkNet()
      if (respnet > 1) {
        this.mensajeError(respnet)
        return
      }
      this.loaderproductos = true
      this.loaderclientes = true
      this.loadercxc = true
      // this.loader = true
      await this.setPedidos()
      await this.setGuardados()
      await this.setEliminados()
      await this.setUpdateFecha()
      await this.getProductos()
      await this.getVendedores()
      await this.getUsuarios()
      await this.getCxc()
      await this.getPedidos()
      await this.getHolds()
      await this.getItemsHolds()
      await this.getCategorias()
      await this.getClientes().then(() => {
        // console.log('Sincronizado finalizó sin problema')
        this.feultget = moment().format('YYYY-MM-DD HH:mm:ss')
        this.$q.localStorage.remove('feultget')
        this.$q.localStorage.set('feultget', this.feultget)
        this.loaderclientes = false
        // this.layoutModal = false
      }).catch(this.falloCallback)
    },
    /* async migrarproductos () {
      const resp = await productosLib.migrarproductos()
      console.log(resp)
      for (const i in resp.data) {
        const item = resp.data[i]
        if (item.imagen) {
          console.log(item.id, item.imagen)
          const resp2 = await productosLib.getimagenproducto(item.id)
          // console.log(resp2)
          // const imagen = this.dataUrl(resp2.data[0].imagen)
          // const file = new File([resp2.data[0].imagen], 'name')
          const theBlob = resp2.data[0].imagen
          const file = new File([theBlob], item.id + '.png', { lastModified: new Date().getTime(), type: theBlob.type })
          // const resp3 = await productosLib.updateimagenproducto(item.id, imagen)
          console.log(file)
        }
        // const resp2 = await productosLib.listaTemp()
        // console.log('getImagesProductos')
      }
    }, */
    dataUrl (img) {
      return 'data:image/jpeg;base64,' + btoa(
        new Uint8Array(img.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      )
    }
  },
  computed: {
    loader () {
      if (this.loaderproductos || this.loaderclientes || this.loadercxc) {
        return true
      } else {
        return false
      }
    }
  },
  mounted () {
    // pedidosLib.corregirClientesNull()
    // this.migrarproductos()
    if (this.$q.localStorage.getItem('feultget') === 'null') {
      console.log('Aqui fecha ult null')
    }
    this.feultget =
      this.$q.localStorage.getItem('feultget') !== 'null'
        ? this.$q.localStorage.getItem('feultget')
        : 'S/Inf'
    if (this.idrol === 4) {
      this.getProductos().then(() => {
        console.log('Sincronizado finalizó sin problema')
        this.$q.localStorage.set('feultget', this.feultget)
        this.gotoProductos()
      })
    }
  }
})
</script>
<style scoped>
.headerItem {
  margin: 20px;
  display: flex;
  align-items: center;
}
.menuitem {
  height: 86px;
  width: 27%;
  border: 1px solid green;
  border-radius: 12px;
  display: block;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: bold;
  margin: 9px;
  padding-top: 5px;
  line-height: 12px;
  float: left;
}
.subHeaderItem {
  text-align: center;
  width: 100%;
  font-size: 16px;
}
.iconApp {
  font-size: 50px;
}
.procesando {
  background: #3a4142cc;
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 99999;
  top: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  color: white;
}
.borderdetailt {
    border-radius: 12px;
  }
</style>
