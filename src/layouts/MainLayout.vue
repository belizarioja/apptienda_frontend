<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-primary text-white">
      <q-toolbar style="height: 90px;padding-top:30px;">
        <!-- <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        /> -->

        <q-toolbar-title>
          <div style="font-size: 12px;font-weight: bold;">Móvil Pedido - V{{ VERSION }}</div>
          <div style="font-size: 12px;font-weight: bold;">{{ nombreusuario }}</div>
        </q-toolbar-title>
        <!-- PEDIDOS GUARDADOS SIN ENVIAR DEL VENDEDOR -->
        <q-dialog v-model="layoutModalSaves">
          <q-layout view="Lhh lpR fff" container class="bg-white borderdetailt" style="height:90%;">
            <q-header class="bg-primary">
              <q-toolbar>
                <q-toolbar-title style="font-size: inherit;display: grid;">
                  <span style=""> PEDIDOS GUARDADOS </span>
                </q-toolbar-title>
                <q-btn flat v-close-popup round dense icon="close" />
              </q-toolbar>
            </q-header>
            <q-page-container>
              <q-page padding>
                <div>
                  <table style="width: -webkit-fill-available;">
                    <tr style="font-size: 9px;">
                      <td style="border-bottom: 1px dashed #757575;">
                        #
                      </td>
                      <td style="border-bottom: 1px dashed #757575;width: 50px;">
                        Fecha
                      </td>
                      <td style="border-bottom: 1px dashed #757575;">
                        Cliente
                      </td>
                      <td style="border-bottom: 1px dashed #757575;">
                        Items
                      </td>
                      <td style="border-bottom: 1px dashed #757575;">
                        Subtotal
                      </td>
                      <td style="border-bottom: 1px dashed #757575;">
                        Acciones
                      </td>
                    </tr>
                    <tr v-for="row in serverDataSaves" :key="row.id" style="font-size: 9px;">
                      <td>
                        {{ row.i }}
                      </td>
                      <td>
                        {{ row.fecha }}
                      </td>
                      <td>
                        {{ row.idcliente }} {{ row.nombrecliente }}
                      </td>
                      <td>
                        {{ row.cantidad }}
                      </td>
                      <td>
                        {{ row.subtotal }}
                      </td>
                      <td style="display: flex;">
                        <q-icon
                         name="add_shopping_cart"
                         color="primary"
                         style="font-size:20px;"
                         @click="checkoutSaves(row.indice)"
                        />
                        <q-icon
                         name="delete"
                         color="red"
                         style="font-size:20px;margin-left: 10px;"
                         @click="deleteSaves(row.indice)"
                        />
                      </td>
                    </tr>
                  </table>
                </div>
              </q-page>
            </q-page-container>
            <q-footer class="bg-primary text-white">
              <q-toolbar inset style="width: 100%;justify-content: center;">
                  <div id="idTotalSaves" style="margin: 0 20px;width: -webkit-fill-available;">
                    Total : {{ totalsaves.toFixed(2) }}
                  </div>
              </q-toolbar>
            </q-footer>
          </q-layout>
        </q-dialog>
        <!-- CUENTA POR COBRAR DEL CLIENTE -->
        <q-dialog v-model="layoutModalPays">
          <q-layout view="Lhh lpR fff" container class="bg-white borderdetailt" style="height:90%;">
            <q-header class="bg-primary">
              <q-toolbar>
                <q-toolbar-title style="font-size: inherit;display: grid;">
                  <span style=""> Deuda pendiente de: </span>
                  <span style="">{{ nombrecliente }}</span>
                </q-toolbar-title>
                <q-btn flat v-close-popup round dense icon="close" />
              </q-toolbar>
            </q-header>
            <q-page-container>
              <q-page padding>
                <div>
                  <table style="width: -webkit-fill-available;font-size: 12px;">
                    <tr>
                      <td style="border-bottom: 1px dashed #757575;">
                        # Control
                      </td>
                      <td style="border-bottom: 1px dashed #757575;">
                        Tipo
                      </td>
                      <td style="border-bottom: 1px dashed #757575;">
                        Fecha
                      </td>
                      <td style="border-bottom: 1px dashed #757575;text-align: center;color: red;">
                        Dias
                      </td>
                      <td style="border-bottom: 1px dashed #757575;">
                        Monto
                      </td>
                      <td style="border-bottom: 1px dashed #757575;">
                        Saldo
                      </td>
                    </tr>
                    <tr v-for="row in serverDataCxc" :key="row.id">
                      <td>
                        {{ row.id }}
                      </td>
                      <td style="text-align: center;color: blue;">
                        {{ row.tipodoc }}
                      </td>
                      <td>
                        {{ row.fecha }}
                      </td>
                      <td style="text-align: center;color: red;">
                        {{ row.dias }}
                      </td>
                      <td>
                        {{ row.monto }}
                      </td>
                      <td>
                        {{ row.saldo }}
                      </td>
                    </tr>
                  </table>
                </div>
              </q-page>
            </q-page-container>
            <q-footer class="bg-primary text-white">
              <q-toolbar inset style="width: 100%;justify-content: center;">
                  <div id="idTotalCxc" style="margin: 0 20px;width: -webkit-fill-available;">
                    Total : {{ totalcxc.toFixed(2) }}
                  </div>
              </q-toolbar>
            </q-footer>
          </q-layout>
        </q-dialog>
        <!-- CARRITO DE COMPRA PEDIDO DEL CLIENTE -->
        <q-dialog v-model="layoutModal">
          <q-layout view="Lhh lpR fff" container class="bg-white borderdetailt" style="height:90%;">
            <q-header class="bg-primary">
              <q-toolbar>
                <q-toolbar-title style="font-size: inherit;display: grid;">
                  <span style=""> Detalle del pedido de: </span>
                  <span style="">{{ nombrecliente }}</span>
                </q-toolbar-title>
                <q-btn flat v-close-popup round dense icon="close" />
              </q-toolbar>
            </q-header>
            <q-page-container>
              <q-page padding>
                <div>
                  <table style="width: -webkit-fill-available;">
                    <tr style="font-size: x-small;">
                      <td style="border-bottom: 1px dashed #757575;">
                        #
                      </td>
                      <td style="border-bottom: 1px dashed #757575;width: 50px;">
                        Código
                      </td>
                      <td style="border-bottom: 1px dashed #757575;width: 111px;">
                        Producto
                      </td>
                      <td style="border-bottom: 1px dashed #757575;">
                        Cant
                      </td>
                      <td style="border-bottom: 1px dashed #757575;">
                        Precio
                      </td>
                      <td style="border-bottom: 1px dashed #757575;">
                        Subtotal
                      </td>
                      <td style="border-bottom: 1px dashed #757575;">
                        Editar
                      </td>
                    </tr>
                    <tr
                      v-for="row in serverData"
                      :key="row.id"
                      :class="{'otropedido' : row.i > 13 }"
                      style="font-size: smaller;"
                    >
                      <td :class="{'bordeotropedido' : row.i === 14 }" style="font-size: x-small;">
                        {{ row.i }}
                      </td>
                      <td :class="{'bordeotropedido' : row.i === 14 }" style="font-size: x-small;">
                        {{ row.idproducto }}
                      </td>
                      <td :class="{'bordeotropedido' : row.i === 14 }" style="font-size: x-small;">
                        {{ row.nombreproducto }}
                      </td>
                      <td :class="{'bordeotropedido' : row.i === 14 }">
                        {{ row.cantidad }}
                      </td>
                      <td :class="{'bordeotropedido' : row.i === 14 }">
                        {{ row.precio }}
                      </td>
                      <td :class="{'bordeotropedido' : row.i === 14 }">
                        {{ row.subtotal }}
                      </td>
                      <td :class="{'bordeotropedido' : row.i === 14 }">
                        <q-icon name="delete" color="red" style="font-size:x-large;" @click="deleteItem(row.indice, row.idproducto)" />
                      </td>
                    </tr>
                    <tr
                      v-if="serverData.length === 0"
                    >
                      <td colspan="8" style="text-align: center;padding-top: 100px;">
                        <span>
                          <q-icon name="production_quantity_limits" style="font-size:200px;color: #a3a5a4;" />
                        </span>
                      </td>
                    </tr>
                  </table>
                </div>
              </q-page>
            </q-page-container>
            <q-footer class="bg-primary text-white">
              <q-toolbar inset style="width: 100%;justify-content: center;">
                  <q-btn
                    style="font-size: 10px;margin-right: 10px;padding: 7px 10px;"
                    label="Guardar"
                    type="buttom"
                    color="info"
                    icon="save"
                    @click="savePedido()"
                  />
                  <q-btn
                    style="font-size: 10px;margin-right: 10px;padding: 7px 10px;"
                    label="Enviar"
                    type="buttom"
                    color="dark"
                    icon="send"
                    @click="createPedido()"
                  />
                  <q-btn
                    style="font-size: 10px;padding: 7px 10px;"
                    label="Eliminar"
                    type="buttom"
                    color="secondary"
                    icon="close"
                    @click="deletePedido()"
                  />
              </q-toolbar>
            </q-footer>
          </q-layout>
        </q-dialog>
        <div
          class="totalItem invisible totalItemSaves"
          @click="hideShowSaves(); layoutModalSaves = !layoutModalSaves">
          <div class="circuloTotalItem totalItemBlue">
            {{ totalitemsaves }}
          </div>
          <q-icon name="point_of_sale" color="info" style="font-size:35px;" />
        </div>
        <div
          class="totalItem invisible totalItemCxc"
          @click="hideShowCxc(); layoutModalPays = !layoutModalPays">
          <div class="circuloTotalItem totalItemRed">
            {{ totalitemscxc }}
          </div>
          <q-icon name="receipt"  color="secondary" style="font-size:35px;" />
        </div>
        <div
          class="totalItem invisible totalItemHold"
          @click="hideShowCarrito(); layoutModal = !layoutModal">
          <div class="circuloTotalItem totalItemBlack">
            {{ totalitemspedido }}
          </div>
          <q-icon name="shopping_cart" color="dark" style="font-size:35px;" />
        </div>
        <div style="display:grid;margin-left: 10px;">
          <q-icon
            @click="gotoSalir()"
            name="logout"
            style="font-size: 30px;"
          />
          <span style="font-size: 12px;">Salir</span>
        </div>
      </q-toolbar>
    </q-header>
    <q-footer  style="border-radius: 15px 15px 0 0;">
      <q-toolbar>
        <q-toolbar inset style="width: 100%;justify-content: space-around;font-size:35px;height: 65px;">
          <div v-show="idrol !== 4" class="divMenuAbajo">
            <span class="iconMenuAbajo">
                <q-icon
                @click="gotoIndex()"
                name="home"
                style=""
              />
            </span>
            <span class="textoMenuAbajo">Inicio</span>
          </div>
          <div v-show="idrol === 1" class="divMenuAbajo">
            <span class="iconMenuAbajo">
              <q-icon
                @click="gotoUsuarios()"
                name="account_circle"
                style=""
              />
            </span>
            <span class="textoMenuAbajo">Usuarios</span>
          </div>
          <div v-show="idrol === 1" class="divMenuAbajo">
            <span class="iconMenuAbajo">
              <q-icon
                @click="gotoVendedores()"
                name="manage_accounts"
                style=""
              />
            </span>
            <span class="textoMenuAbajo">Vendedores</span>
          </div>
          <div v-show="idrol === 1 || idrol === 3 || idrol === 4" class="divMenuAbajo">
            <span class="iconMenuAbajo">
              <q-icon
                @click="gotoProductos()"
                name="price_change"
                style=""
              />
            </span>
            <span class="textoMenuAbajo">Precios</span>
          </div>
          <div v-show="idrol === 3" class="divMenuAbajo">
            <span class="iconMenuAbajo">
              <q-icon
                @click="gotoClientes()"
                name="point_of_sale"
                style=""
              />
            </span>
            <span class="textoMenuAbajo">Pedidos</span>
          </div>
          <div v-show="idrol === 3" class="divMenuAbajo">
            <span class="iconMenuAbajo">
              <q-icon
                @click="gotoCxc()"
                name="paid"
                style=""
              />
            </span>
            <span class="textoMenuAbajo">Deudores</span>
          </div>
          <div v-show="idrol === 3" class="divMenuAbajo">
            <span class="iconMenuAbajo">
              <q-icon
                @click="gotoReportePedidos()"
                name="view_list"
                style=""
              />
            </span>
            <span class="textoMenuAbajo">Reporte</span>
          </div>
          <div v-show="idrol === 1 || idrol === 3 || idrol === 4" class="divMenuAbajo">
            <span class="iconMenuAbajo">
              <q-icon
                @click="gotoCambiarclave()"
                name="lock_clock"
                style=""
              />
            </span>
            <span class="textoMenuAbajo">Cambio clave</span>
          </div>
          <div v-show="idrol === 4" class="divMenuAbajo">
            <span class="iconMenuAbajo">
              <q-icon
                @click="gotoAyuda()"
                name="help"
                style=""
              />
            </span>
            <span class="textoMenuAbajo">Ayuda</span>
          </div>
        </q-toolbar>
      </q-toolbar>
    </q-footer>
    <q-page-container style="background: aliceblue;">
      <router-view />
    </q-page-container>
  </q-layout>
  <div v-if="loader" class="procesando">
    <span style="display:grid;">Enviando pedido...
    <q-linear-progress indeterminate />
    </span>
  </div>
</template>

<script>

import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'
// import clientesLib from '../logic/clientes'
// import pedidosLib from '../logic/pedidos'
import authLib from '../logic/auth'
import moment from 'moment'
const config = require('../config/endpoints.js')

export default defineComponent({
  name: 'MainLayout',
  data () {
    return {
      serverData: [],
      serverDataCxc: [],
      serverDataSaves: [],
      loader: false,
      nombreusuario: this.$q.localStorage.getItem('nombreusuario'),
      usuario: this.$q.localStorage.getItem('usuario'),
      idusuario: this.$q.localStorage.getItem('idusuario'),
      idsucursal: this.$q.localStorage.getItem('idsucursal'),
      idrol: this.$q.localStorage.getItem('idrol')
    }
  },
  setup () {
    const $q = useQuasar()
    $q.addressbarColor.set('#36d6f6')
    const leftDrawerOpen = ref(false)
    // const hidecarrito = ref(false)
    // const hidecxc = ref(false)
    const layoutModal = ref(false)
    const layoutModalPays = ref(false)
    const layoutModalSaves = ref(false)
    const idhold = ref(false)
    const VERSION = config.version
    return {
      leftDrawerOpen,
      totalcarrito: 0,
      totalitemspedido: 0,
      totalitemsaves: 0,
      totalitemscxc: 0,
      // hidecarrito,
      totalcxc: 0,
      totalsaves: 0,
      // hidecxc,
      idhold,
      layoutModal,
      layoutModalPays,
      layoutModalSaves,
      nombrecliente: 'Cliente Público',
      comentario: '',
      VERSION,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  },
  methods: {
    gotoIndex () {
      this.$router.push('/index')
    },
    gotoClientes () {
      const datos = this.$q.localStorage.getItem('clientes') ? this.$q.localStorage.getItem('clientes') : []
      if (datos.length > 0) {
        this.$router.push('/clientes')
      } else {
        this.$q.dialog({
          title: 'No tiene CLIENTES para realizar pedidos!',
          message: 'Debe sincronizar!',
          persistent: true
        })
      }
    },
    gotoUsuarios () {
      const holds = this.$q.localStorage.getItem('usuarios') ? this.$q.localStorage.getItem('usuarios') : []
      if (holds.length > 0) {
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
      const holds = this.$q.localStorage.getItem('vendedores') ? this.$q.localStorage.getItem('vendedores') : []
      if (holds.length > 0) {
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
      const holds = this.$q.localStorage.getItem('productos') ? this.$q.localStorage.getItem('productos') : []
      if (holds.length > 0) {
        this.$router.push('/productos')
      } else {
        this.$q.dialog({
          title: 'No tiene PRODUCTOS!',
          message: 'Debe sincronizar!',
          persistent: true
        })
      }
    },
    async gotoCambiarclave () {
      const respnet = await this.checkNet()
      if (respnet > 1) {
        this.mensajeError(respnet)
        return
      }
      this.$router.push('/cambiarclave')
    },
    gotoAyuda () {
      this.$router.push('/ayuda')
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
        const enviar = resp.status === 200 ? 1 : 2
        return enviar
      } catch (error) {
        return 3
      }
    },
    gotoSalir () {
      this.$q.dialog({
        title: 'CONFIRMACIÓN!',
        message: '¿Seguro que desea SALIR de la aplicación?',
        ok: {
          color: 'dark',
          label: 'Sí'
        },
        cancel: {
          color: 'secondary',
          label: 'No'
        },
        persistent: true
      }).onOk(async () => {
        this.$router.push('/logout')
      })
    },
    checkoutSaves (indice) {
      this.$q.dialog({
        title: 'Seguro de ENVIAR este PEDIDO al CARRITO?',
        message: 'Al aceptar, si existe un pedido en el carrito, lo guardará y lo sustituirá por este!',
        ok: {
          color: 'primary',
          label: 'Sí'
        },
        cancel: {
          color: 'secondary',
          label: 'No'
        },
        persistent: true
      }).onOk(async () => {
        this.cleanCarrito()
        // console.log(indice)
        const holds = this.$q.localStorage.getItem('holds')
        const index = holds.findIndex(obj => obj.status === 1)
        // console.log(index)
        if (index !== -1) {
          holds[index].status = 0
        }
        const index2 = holds.findIndex(obj => obj.indice === indice)
        // console.log(index2)
        holds[index2].status = 1
        this.$q.localStorage.remove('holds')
        this.$q.localStorage.set('holds', holds)
        this.$q.localStorage.set('idcliente', holds[index2].idcliente)
        this.hideShowSaves()
        this.hideShowCarrito()
        this.layoutModalSaves = false
        this.$router.push('/productos')
      })
    },
    deleteSaves (indice) {
      this.$q.dialog({
        title: 'CONFIRMACIÓN!',
        message: 'Seguro de ELIMINAR este PEDIDO de GUARDADOS?',
        ok: {
          color: 'primary',
          label: 'Sí'
        },
        cancel: {
          color: 'secondary',
          label: 'No'
        },
        persistent: true
      }).onOk(async () => {
        const holds = this.$q.localStorage.getItem('holds')
        const index = holds.findIndex(obj => obj.indice === indice)
        // console.log(index)
        holds[index].status = 2
        this.$q.localStorage.remove('holds')
        this.$q.localStorage.set('holds', holds)
        // this.cleanCarrito()
        this.hideShowSaves()
        this.layoutModalSaves = false
        this.$router.push('/index')
      })
    },
    savePedido () {
      this.$q.dialog({
        title: 'CONFIRMACIÓN!',
        message: 'Está seguro de GUARDAR este PEDIDO?',
        ok: {
          color: 'primary',
          label: 'Sí'
        },
        cancel: {
          color: 'secondary',
          label: 'No'
        },
        persistent: true
      }).onOk(async () => {
        const holds = this.$q.localStorage.getItem('holds')
        const index = holds.findIndex(obj => obj.status === 1)
        // console.log(index)
        if (index >= 0) {
          holds[index].status = 0
        }
        this.$q.localStorage.remove('holds')
        this.$q.localStorage.set('holds', holds)
        this.cleanCarrito()
        this.hideShowSaves()
        this.$router.push('/index')
      })
    },
    createPedido () {
      this.$q.dialog({
        title: 'CONFIRMACIÓN!',
        message: 'Está seguro de ENVIAR este PEDIDO?',
        ok: {
          color: 'primary',
          label: 'Sí'
        },
        cancel: {
          color: 'secondary',
          label: 'No'
        },
        persistent: true
      }).onOk(async () => {
        const holds = this.$q.localStorage.getItem('holds')
        const index = holds.findIndex(obj => obj.status === 1)
        // console.log(index)
        holds[index].status = 3
        this.$q.localStorage.remove('holds')
        this.$q.localStorage.set('holds', holds)
        this.confirmarEnvioPedido()
      })
    },
    calcDiffHours (fecha) {
      const now = moment()
      const end = moment(fecha, 'YYYY-MM-DD')
      const duration = moment.duration(now.diff(end))
      return duration.asDays().toFixed(0)
    },
    async hideShowCxc () {
      const idcliente = this.$q.localStorage.getItem('idcliente')
      this.serverDataCxc = []
      this.totalcxc = 0
      // console.log(idcliente)
      const cuentasxc = this.$q.localStorage.getItem('cuentasxc') ? this.$q.localStorage.getItem('cuentasxc') : []
      const find = cuentasxc.filter(obj => obj.idcliente === idcliente)
      if (find.length > 0) {
        this.totalitemscxc = find[0].details.length
        this.totalcxc = find[0].totalcxc
        this.nombrecliente = find[0].nombrecliente
        this.serverDataCxc = find[0].details
        const idTotalCxc = document.querySelector('#idTotalCxc')
        const circuloCxcItem = document.querySelector('.totalItemRed')
        const totalItemCxc = document.querySelector('.totalItemCxc')
        totalItemCxc.classList.remove('invisible')
        if (idTotalCxc) {
          idTotalCxc.textContent = 'Total : $' + this.totalcxc.toFixed(2)
        }
        circuloCxcItem.textContent = this.totalitemscxc
      }
    },
    async hideShowCarrito () {
      this.serverData = []
      this.totalcarrito = 0
      const holds = this.$q.localStorage.getItem('holds') ? this.$q.localStorage.getItem('holds') : []
      const itemsholds = this.$q.localStorage.getItem('itemsholds') ? this.$q.localStorage.getItem('itemsholds') : []
      const find = holds.find(obj => obj.status === 1)
      // console.log('Find 1 ', find)
      this.nombrecliente = find.nombrecliente
      const indice = find.indice
      const datos = itemsholds.filter(obj => obj.indice === indice)
      this.totalitemspedido = datos.length
      // console.log('Find 2 ', datos)
      for (const i in datos) {
        const item = datos[i]
        const obj = {}
        obj.i = parseInt(i) + 1
        obj.id = item.id
        obj.idproducto = item.idproducto
        obj.indice = item.indice
        obj.nombreproducto = item.nombreproducto
        obj.precio = parseFloat(item.precio).toFixed(2)
        obj.cantidad = item.cantidad
        obj.subtotal = parseFloat(item.subtotal).toFixed(2)
        obj.preciocaj = item.preciocaj
        obj.unixcaja = item.unixcaja
        obj.costoactu = item.costoactu
        obj.porciva = item.porciva
        obj.porkilos = item.porkilos
        this.totalcarrito += parseFloat(obj.subtotal)
        this.serverData.push(obj)
      }
      const idTotalCarrito = document.querySelector('#idTotalCarrito')
      const circuloTotalItem = document.querySelector('.totalItemBlack')
      const totalItemHold = document.querySelector('.totalItemHold')
      if (totalItemHold.classList.contains('invisible')) {
        totalItemHold.classList.remove('invisible')
      }
      if (idTotalCarrito) {
        idTotalCarrito.textContent = 'Total : $' + this.totalcarrito.toFixed(2)
      }
      if (circuloTotalItem) {
        circuloTotalItem.textContent = this.totalitemspedido
      }
      // this.hideShowCxc()
    },
    async hideShowSaves (idusuario) {
      this.serverDataSaves = []
      this.totalsaves = 0
      const holds = this.$q.localStorage.getItem('holds') ? this.$q.localStorage.getItem('holds') : []
      const datos = holds.filter(obj => obj.status === 0)
      // console.log('Find 2 ', datos)
      this.totalitemsaves = datos.length
      for (const i in datos) {
        const item = datos[i]
        const obj = {}
        obj.i = parseInt(i) + 1
        obj.id = item.id
        obj.indice = item.indice
        obj.fecha = moment(item.fecha).format('YYYY-MM-DD')
        obj.idcliente = item.idcliente
        obj.nombrecliente = item.nombrecliente
        obj.cantidad = item.cantitemscarrito
        obj.subtotal = item.subtotal.toFixed(2)
        this.totalsaves += parseFloat(obj.subtotal)
        this.serverDataSaves.push(obj)
      }
      const idTotalSaves = document.querySelector('#idTotalSaves')
      const totalItemSaves = document.querySelector('.totalItemSaves')
      const circuloTotalSaves = document.querySelector('.totalItemBlue')
      if (idTotalSaves) {
        idTotalSaves.textContent = 'Total : $' + this.totalsaves.toFixed(2)
      }
      if (circuloTotalSaves) {
        circuloTotalSaves.textContent = this.totalitemsaves
      }
      if (this.totalitemsaves > 0) {
        if (totalItemSaves.classList.contains('invisible')) {
          totalItemSaves.classList.remove('invisible')
        }
      } else {
        totalItemSaves.classList.add('invisible')
      }
    },
    deletePedido () {
      this.$q.dialog({
        title: 'CONFIRMACIÓN!',
        message: 'Seguro que desea ELIMINAR este PEDIDO?',
        ok: {
          color: 'primary',
          label: 'Sí'
        },
        cancel: {
          color: 'secondary',
          label: 'No'
        },
        persistent: true
      }).onOk(() => {
        this.deleteCarrito()
        this.cleanCarrito()
        // this.$router.go(0)
      })
    },
    async deleteCarrito () {
      const holds = this.$q.localStorage.getItem('holds')
      const index = holds.findIndex(obj => obj.status === 1)
      // console.log(index)
      if (index >= 0) {
        holds[index].status = 2
      }
      this.$q.localStorage.remove('holds')
      this.$q.localStorage.set('holds', holds)
    },
    cleanCarrito () {
      this.layoutModal = false
      this.idhold = null
      const totalItemCxc = document.querySelector('.totalItemCxc')
      totalItemCxc.classList.add('invisible')

      const circuloCxcItem = document.querySelector('.totalItemRed')
      circuloCxcItem.textContent = 0

      const totalItemHold = document.querySelector('.totalItemHold')
      totalItemHold.classList.add('invisible')

      const circuloTotalItem = document.querySelector('.totalItemBlack')
      circuloTotalItem.textContent = 0

      this.$q.localStorage.remove('idcliente')
    },
    confirmarEnvioPedido () {
      this.layoutModal = false
      this.$q.dialog({
        title: 'ENHORABUENA!',
        message: 'Pedido creado y enviado con éxito!',
        ok: {
          color: 'primary',
          label: 'Aceptar'
        },
        persistent: true
      }).onOk(() => {
        this.deleteCarrito()
        this.cleanCarrito()
        this.$router.push('/index')
      })
    },
    deleteItem (indice, idproducto) {
      this.$q.dialog({
        title: 'CONFIRMACIÓN!',
        message: 'Desea eliminar este item al pedido?',
        ok: {
          color: 'primary',
          label: 'Sí'
        },
        cancel: {
          color: 'secondary',
          label: 'No'
        },
        persistent: true
      }).onOk(() => {
        // pedidosLib.deleteitemcarrito(id)
        // console.log(indice, idproducto)
        const itemsholds = this.$q.localStorage.getItem('itemsholds')
        const index = itemsholds.findIndex(obj => obj.indice === indice && obj.idproducto === idproducto)
        // console.log(index)
        itemsholds.splice(index, 1)
        this.$q.localStorage.remove('itemsholds')
        this.$q.localStorage.set('itemsholds', itemsholds)
        this.hideShowCarrito()
      })
    }
  }
})
</script>

<style scoped>
  .invisible{
    display: none;
  }
  .totalItem{
    display: flex;
    align-items: center;
  }
  .circuloTotalItem{
    width: 25px;
    height: 25px;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: -7px;
  }
  .totalItemBlack{
    background: black;
    color: white;
  }
  .totalItemRed{
    background: #707271;
    color: white;
  }
  .totalItemBlue{
    background: #225401;
    color: white;
  }
  .q-toolbar--inset {
    padding-left: 5px;
  }
  .otropedido {
    color: cornflowerblue
  }
  .bordeotropedido {
    border-top: 1px dashed #757575;
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
    font-size: 29px;
    color: white;
  }
  .borderdetailt {
    border-radius: 12px;
  }
  .divMenuAbajo {
    display: grid;
  }
  .textoMenuAbajo {
    text-align: center;
    font-size: 10px;
  }
  .iconMenuAbajo {
    align-items: center;
    display: flex;
    justify-content: center;
  }
</style>
