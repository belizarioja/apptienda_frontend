<template>
  <q-page class="text-center">
    <div class="headerItem">
       <div
          v-if="idrol !== 4"
          class="menuitem"
          @click="gotoClientes()">
          <q-icon name="keyboard_return"/>
        </div>
        <div
          v-if="idrol === 4"
          class="menuitem"
          @click="updateProductos()">
          <q-icon name="system_update"/>
        </div>
        <div class="subHeaderItem">
          <span>Productos</span>
          <span style="color: darkgray;font-size: 10px;">Ultima actualización : {{ feultget }} </span>
        </div>
    </div>
    <div class="buscartop">
      <div style="height: 50px;">
        <q-btn
          style="float: left;"
          label="Categorias"
          type="buttom"
          color="primary"
          icon="filter_alt"
          @click="layoutModalFilter = !layoutModalFilter"
          v-close-popup
        />
        <q-btn
          style="float: right;"
          label="Ordenar"
          type="buttom"
          color="primary"
          icon="sort"
          @click="layoutModalOrder = !layoutModalOrder"
          v-close-popup
        />
      </div>
      <q-input borderless dense debounce="300" v-model="filter" placeholder="Buscar">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <q-table
      grid
      :rows="serverData"
      :columns="columns"
      row-key="id"
      :filter="filter"
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
      hide-header
      hide-bottom
      :loading="loading"
    >
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card>
            <q-card-section>
              <div style="display:grid;">
                <div
                  style="display: flex;"
                  class="text-left">
                  <div
                    v-if="idrol === 3"
                    class="menuitem"
                    @click="openSetItems( props.row.id, props.row.nombre, props.row.precio, props.row.preciocaj, props.row.unixcaja, props.row.costoactu, props.row.porciva, props.row.porkilos , props.row.disponible, props.row.imagen)"
                  >
                    <q-icon name="save_alt"/>
                  </div>
                  <strong style="font-size: 13px; margin-left: 10px; width: fit-content;">{{props.row.id + '  ' + props.row.nombre }}</strong>
                </div>
                <div  style="display:flex;">
                  <div
                   style="display:flex; width: 150px;align-items: center;justify-content: center;"
                  >
                    <div
                      class="subtitleimagen"
                      v-if="props.row.imagen"
                      @click="openImagen(props.row.id, props.row.nombre, props.row.precio, props.row.imagen)">
                      <q-icon name="zoom_in" style="font-size: 24px;" /> ver imagen
                    </div>
                    <img
                      v-if="props.row.imagen"
                      :src="'data:image/png;base64, ' + props.row.imagen"
                      height="95"
                    />
                    <img
                      v-else
                      src="../assets/default.svg"
                      height="40"
                    />
                  </div>
                  <div style="display:contents;">
                    <table style="width:100%;">
                      <tr class="headerTableItems">
                        <td style="width:50%;">
                          Precio caja
                        </td>
                        <td>
                          Unidad x caja
                        </td>
                      </tr>
                      <tr class="rowTableItemsPrecio">
                        <td>
                           $ {{ (props.row.precio * props.row.unixcaja).toFixed(2)}}
                        </td>
                        <td>
                          {{ props.row.unixcaja }}
                        </td>
                      </tr>
                      <tr class="headerTableItems">
                        <td style="width:50%;">
                          Precio unidad
                        </td>
                        <td>
                          Disponible
                        </td>
                      </tr>
                      <tr class="rowTableItemsPrecio">
                        <td>
                          $ {{props.row.precio.toFixed(2)}}
                        </td>
                        <td>
                          {{props.row.disponible}}
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
    <q-dialog v-model="layoutModal" persistent>
      <q-card class="my-card" flat bordered style="border-radius: 15px">
        <q-item>
          <q-item-section avatar>
            <div>
              <img v-if="imagenproducto" :src="imagenproducto"  height="46">
              <img v-else src="../assets/default.svg" height="46">
            </div>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ nombreproducto }}</q-item-label>
            <q-item-label caption>
              <span style="color: #014201;background: #7dbf82;border-radius: 10px;padding: 4px 7px;margin-right: 5px;"> ${{ precioproducto.toFixed(2) }} </span>
              <span style="color: #6c4000;background: #F2C037;border-radius: 10px;padding: 4px 7px;margin-right: 5px;">Disp: {{ disponibleproducto }}</span>
              <span style="color: #004174;background: #a5c3db;border-radius: 10px;padding: 4px 7px;">UniXcaja: {{ unixcaja }} </span>
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-card-section horizontal>
          <q-card-section>
            <q-input dense v-model="cantidad" autofocus type="number" label="Cantidad" min ="1"/>
          </q-card-section>

          <q-separator vertical />

          <q-card-section>
             <q-input dense v-model="subtotal" type="number" label="Subtotal" readonly/>
          </q-card-section>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn
            style="font-size: 11px;"
            label="Cancelar"
            type="buttom"
            icon="close"
            color="secondary"
            v-close-popup
          />
          <q-btn
            style="font-size: 11px;"
            label="Agregar al carrito"
            color="dark"
            v-close-popup
            icon="add_shopping_cart"
            @click="setCarrito()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="layoutModalimg" persistent>
      <q-card class="my-card" flat bordered style="width: 100%;">
        <q-card-section style="display: flex;height: 350px; justify-content: center; align-items: center;height: 350px;text-align: center;">
          <q-spinner
            color="primary"
            size="3em"
            v-if="loaderimg"
          />
          <img v-if="noimg" src="../assets/default.svg" style="height: 50%;">
          <img v-if="imagenproductoimg" :src="'data:image/png;base64, ' + imagenproductoimg" style="height: 90%;">
          <div v-if="subtituloimg" class="subtitleimagenPopup">
            {{ nombreproductoimg }}
          </div>
          <div v-if="subtituloimg" class="precioimagenPopup">
            <q-icon name="sell" />
            Precio ${{ precioproductoimg.toFixed(2) }}
          </div>
        </q-card-section>
        <q-card-actions align="center" class="text-primary">
          <!-- <q-btn
            style=""
            label="Compartir"
            type="buttom"
            color="info"
            icon="share"
            v-close-popup
          /> -->
          <q-btn
            style=""
            label="Aceptar"
            type="buttom"
            color="dark"
            icon="close"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- MODAL DE FILTROS POR CATEGORIA -->
    <q-dialog v-model="layoutModalFilter" persistent transition-show="flip-down" transition-hide="flip-up">
      <q-card class="borderdetailt" style="width: 100%;height:90%;">
        <q-bar  class="bg-primary text-white" style="position: sticky;top: 0px;z-index: 999;">
          <q-icon name="speaker_notes" />
          <div>Filtrar por categorías</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section class="q-pt-none" style="margin-top: 120px;">
          <div class="q-pa-md q-gutter-sm">
            <div class="buscadorFixed">
              <q-btn
                style=""
                label="Limpiar"
                type="buttom"
                color="primary"
                icon="search_off"
                @click="unselectAll"
              />
              <div style="margin-top: 10px;">
                <div class="divselections" v-for="group in selection" :key="group">
                  {{nameCategoria(group)}}
                </div>
              </div>
            </div>
            <div class="divitemgroups" v-for="group in serverDataGroups" :key="group.id">
              <q-checkbox
                keep-color
                :value="group"
                v-model="selection"
                :label="group.nombre"
                color="primary"
                :val="group.id"
                @click="clickHandler"
                />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="center" class=" bg-white text-primary" style="position: sticky;bottom: 0;z-index: 999;">
          <q-btn
            style=""
            label="Aceptar"
            type="buttom"
            color="dark"
            icon="close"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- MODAL DE OEDENAR -->
    <q-dialog v-model="layoutModalOrder" persistent transition-show="flip-down" transition-hide="flip-up">
      <q-card class="borderdetailt" style="width: 100%;">
        <q-bar  class="bg-primary text-white" style="position: sticky;;top: 0;z-index: 999;">
          <q-icon name="speaker_notes" />
          <div>Ordenar productos</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section class="q-pt-none" style="">
          <div class="q-pa-md q-gutter-sm">
            Ordenar de forma:
            <q-radio v-model="orderBy" val="nameAsc" label="Ascendente por nombre de producto (A...Z)" @input="clickHandlerOrder" />
            <q-radio v-model="orderBy" val="nameDesc" label="Descendente por nombre de producto (Z...A)" />
            <q-radio v-model="orderBy" val="codeAsc" label="Ascendente por código de producto (A...Z)(0...9)" />
            <q-radio v-model="orderBy" val="codeDesc" label="Descendente por código de producto (Z...A)(9...0)" />
          </div>
        </q-card-section>
        <q-card-actions align="center" class=" bg-white text-primary" style="position: sticky;bottom: 0;z-index: 999; border-top: 1px solid #ccc;">
          <q-btn
            style=""
            label="Aceptar"
            type="buttom"
            color="dark"
            icon="close"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div v-if="loader" class="procesando">
      <span style="display: grid"
        >Actualizando, espere...
        <q-linear-progress indeterminate />
      </span>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="arrow_upward" color="primary" @click="gotoUp" style="border-radius: 50%;"/>
    </q-page-sticky>
  </q-page>
</template>

<script>

import {
  ref
  // computed,
  // watch,
  , defineComponent
} from 'vue'
// import VueSocialSharing from 'vue-social-sharing'
import categoriasLib from '../logic/categorias'
import productosLib from '../logic/productos'
import authLib from '../logic/auth'
const config = require('../config/endpoints.js')
const ENDPOINT_PATH = config.endpoint_path
const DB_NAME = 'productosdb'
const DB_VERSION = 1
export default defineComponent({
  name: 'PageIndex',
  data () {
    return {
      serverData: [],
      serverDataGroups: [],
      db: null,
      categoria: null,
      idusuario: this.$q.localStorage.getItem('idusuario'),
      usuario: this.$q.localStorage.getItem('usuario'),
      idrol: this.$q.localStorage.getItem('idrol'),
      feultget: this.$q.localStorage.getItem('feultget'),
      pagination: {
        page: 1,
        rowsPerPage: 0 // 0 means all rows
      },
      selection: []

    }
  },
  setup () {
    const layoutModal = ref(false)
    const layoutModalimg = ref(false)
    const layoutModalOrder = ref(false)
    const layoutModalFilter = ref(false)
    const noimg = ref(false)
    const loaderimg = ref(false)
    const imagenproducto = ref(false)
    const imagenproductoimg = ref(false)
    const loading = ref(false)
    const loader = ref(false)
    const subtituloimg = ref(false)
    const filter = ref('')
    const nombreproducto = ref('')
    const nombreproductoimg = ref('')
    const precioproducto = ref(0)
    const precioproductoimg = ref(0)
    const disponibleproducto = ref(0)
    const cantidad = ref(1)
    const unixcaja = ref(1)
    const orderBy = ref('nameAsc')
    return {
      filter,
      orderBy,
      cantidad,
      nombreproducto,
      nombreproductoimg,
      precioproducto,
      precioproductoimg,
      noimg,
      loaderimg,
      subtituloimg,
      imagenproducto,
      disponibleproducto,
      unixcaja,
      layoutModal,
      layoutModalimg,
      layoutModalOrder,
      layoutModalFilter,
      imagenproductoimg,
      loading,
      loader,
      columns: [
        { name: 'nombre', label: 'Nombre', field: 'nombre' },
        { name: 'id', label: 'Código', field: 'id' },
        { name: 'precio', label: 'Precio', field: 'precio' },
        { name: 'disponible', label: 'Disponible', field: 'disponible' }
      ]
    }
  },
  methods: {
    checkImage (id) {
      const resp = productosLib.getfile(id)
      if (resp.status === 200) {
        return ENDPOINT_PATH + 'files/' + id + '.png'
      }
    },
    gotoUp () {
      this.$router.push('/productos')
    },
    clickHandlerOrder (val) {
      console.log('this.selectionOrder')
      console.log(val)
    },
    clickHandler () {
      this.listarProductos(this.selection)
    },
    unselectAll () {
      this.selection = []
      this.listarProductos(this.selection)
    },
    gotoClientes () {
      if (this.idrol === 1 || this.idrol === 4) {
        this.$router.push('/index')
      } else {
        this.$router.push('/clientes')
      }
    },
    async openImagen (id, nombre, precio, imagen) {
      this.layoutModalimg = true
      this.loaderimg = true
      this.noimg = false
      this.subtituloimg = false
      this.imagenproductoimg = imagen
      this.loaderimg = false
      this.idproductoimg = id
      this.nombreproductoimg = nombre
      this.precioproductoimg = precio
      this.subtituloimg = true
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
    openSetItems (id, nombre, precio, preciocaj, unixcaja, costoactu, porciva, porkilos, disponible, imagen) {
      if (this.idrol === 3) {
        this.idproducto = id
        this.nombreproducto = nombre
        this.precioproducto = precio
        this.disponibleproducto = disponible
        this.preciocaj = preciocaj
        this.unixcaja = unixcaja
        this.costoactu = costoactu
        this.porciva = porciva
        this.porkilos = porkilos
        this.imagenproducto = imagen
        this.cantidad = 1
        this.layoutModal = true
      }
    },
    async updateCarrito () {
      const totalItemHold = document.querySelector('.totalItemHold')
      totalItemHold.classList.remove('invisible')
      const holds = this.$q.localStorage.getItem('holds')
      const data = holds.find(obj => obj.status === 1)
      this.totalitemspedido = data.cantitemscarrito
      const circuloTotalItem = document.querySelector('.totalItemBlack')
      circuloTotalItem.textContent = this.totalitemspedido
    },
    async setCarrito () {
      // const resp = await clientesLib.getholds(this.idusuario)
      const holds = this.$q.localStorage.getItem('holds') ? this.$q.localStorage.getItem('holds') : []
      const itemscarrito = this.$q.localStorage.getItem('itemsholds') ? this.$q.localStorage.getItem('itemsholds') : []
      // const itemscarrito = this.$q.localStorage.getItem('itemsholds')
      const index = holds.findIndex(obj => obj.status === 1)
      if (index !== -1) {
        // console.log(holds[index].indice, this.idproducto)
        const index2 = itemscarrito.findIndex(obj => obj.indice === holds[index].indice && obj.idproducto === this.idproducto)
        // console.log(index2)
        if (index2 === -1) {
          const obj = {}
          obj.id = null
          obj.idhold = holds[index].id
          obj.indice = holds[index].indice
          obj.idproducto = this.idproducto
          obj.nombreproducto = this.nombreproducto
          obj.precio = this.precioproducto
          obj.cantidad = this.cantidad
          obj.subtotal = this.subtotal
          obj.preciocaj = this.preciocaj
          obj.unixcaja = this.unixcaja
          obj.costoactu = this.costoactu
          obj.porciva = this.porciva
          obj.porkilos = this.porkilos
          itemscarrito.push(obj)
          holds[index].cantitemscarrito += parseInt(1)
        } else {
          itemscarrito[index2].cantidad = parseInt(itemscarrito[index2].cantidad) + parseInt(this.cantidad)
          itemscarrito[index2].subtotal += parseFloat(this.subtotal)
        }
        this.$q.localStorage.remove('itemsholds')
        this.$q.localStorage.set('itemsholds', itemscarrito)
        holds[index].subtotal += parseFloat(this.subtotal)
        this.$q.localStorage.remove('holds')
        this.$q.localStorage.set('holds', holds)
        this.updateCarrito()
      } else {
        this.$q.dialog({
          title: 'Oops!',
          message: 'Debe seleccionar cliente!',
          persistent: true
        })
        this.gotoClientes()
      }
    },
    listarCategorias () {
      this.serverDataGroups = this.$q.localStorage.getItem('categorias') ? this.$q.localStorage.getItem('categorias') : []
    },
    nameCategoria (item) {
      const find = this.serverDataGroups.find(obj => obj.id === item)
      return find.nombre
    },
    esCategoria (elemento) {
      const find = this.selection.filter(function (item) {
        // console.log(item, elemento)
        return item === elemento.idcategoria
      })
      return find.length > 0
    },
    getproductsFromDb () {
      return new Promise((resolve, reject) => {
        const trans = this.db.transaction(['productos'], 'readonly')
        trans.oncomplete = e => {
          resolve(products)
        }
        const store = trans.objectStore('productos')
        const products = []
        store.openCursor().onsuccess = e => {
          const cursor = e.target.result
          if (cursor) {
            products.push(cursor.value)
            cursor.continue()
          }
        }
      })
    },
    async listarProductos (categorias) {
      this.loading = true
      if (categorias.length > 0) {
        this.serverData = this.productosStore.filter(this.esCategoria)
      } else {
        this.serverData = this.productosStore
      }
      // console.log(this.serverData)
      this.loading = false
    },
    async updateProductos () {
      const respnet = await this.checkNet()
      if (respnet > 1) {
        this.mensajeError(respnet)
        return
      }
      this.loader = true
      const resp = await productosLib.listar(null)
      // const serverData = []
      const datos = resp.data
      const serverData = datos.map(function (item) {
        const precio = item.precio
        item.precio =
          item.porkilos === 1
            ? precio
            : parseFloat(precio / item.unixcaja)
        return item
      })
      this.$q.localStorage.remove('productos')
      this.$q.localStorage.set('productos', serverData)
      const resp3 = await categoriasLib.listarcategorias()
      this.$q.localStorage.remove('categorias')
      this.$q.localStorage.set('categorias', resp3.data)
      this.getProductosImg()
      this.listarProductos([])
      this.listarCategorias()
      this.loader = false
    },
    async getProductosImg () {
      const datos = this.$q.localStorage.getItem('productos')
      for (const i in datos) {
        const item = datos[i]
        const resp = await productosLib.getfile(item.id)
        if (resp.status === 200) {
          const producto = {
            imagen: item.id,
            base: resp.data.imgbase64
          }
          this.addProdToDb(producto)
        }
      }
    },
    addProdToDb (item) {
      // console.log('addProdToDb ', item)
      return new Promise((resolve, reject) => {
        const trans = this.db.transaction(['productos'], 'readwrite')
        trans.oncomplete = e => {
          resolve()
        }
        const store = trans.objectStore('productos')
        store.put(item)
        // store.add(item)
      })
    },
    async getDb () {
      return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION)
        request.onerror = e => {
          console.log('Error opening db', e)
          reject('Error')
        }

        request.onsuccess = e => {
          resolve(e.target.result)
        }

        request.onupgradeneeded = e => {
          console.log('onupgradeneeded')
          const db = e.target.result
          const objectStore = db.createObjectStore('productos', { autoIncrement: true, keyPath: 'id' })
          objectStore.createIndex('idx_imagen', 'imagen', { unique: true })
          // console.log(objectStore)
        }
      })
    }
  },
  computed: {
    subtotal () {
      return (this.cantidad * this.precioproducto).toFixed(2)
    }
  },
  watch: {
    orderBy () {
      const order = this.orderBy
      this.serverData.sort(function (a, b) {
        if (order === 'nameAsc') {
          if (a.nombre > b.nombre) {
            return 1
          }
          if (a.nombre < b.nombre) {
            return -1
          }
        }
        if (order === 'nameDesc') {
          if (a.nombre < b.nombre) {
            return 1
          }
          if (a.nombre > b.nombre) {
            return -1
          }
        }
        if (order === 'codeAsc') {
          if (a.id > b.id) {
            return 1
          }
          if (a.id < b.id) {
            return -1
          }
        }
        if (order === 'codeDesc') {
          if (a.id < b.id) {
            return 1
          }
          if (a.id > b.id) {
            return -1
          }
        }
        // a must be equal to b
        return 0
      })
    }
  },
  async mounted () {
    this.loading = true
    this.db = await this.getDb()
    this.products = await this.getproductsFromDb()
    // console.log(this.products)
    this.productosStore = this.$q.localStorage.getItem('productos') ? this.$q.localStorage.getItem('productos') : []
    this.serverData = []
    for (const i in this.productosStore) {
      const item = this.productosStore[i]
      const imagen = this.products.filter(obj => obj.imagen === item.id)
      item.imagen = imagen.length > 0 ? imagen[0].base : false
      this.serverData.push(item)
    }
    this.listarProductos([])
    this.listarCategorias()
    this.loading = false
  }
})
</script>
<style scoped>
  .headerItem{
    margin: 20px;
    display: flex;
    align-items: center;
  }
  .menuitem {
    height: 40px;
    width: 45px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    background: #36d6f6;
    color: white;
  }
  .subHeaderItem{
    text-align: center;
    width: 100%;
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
    display: grid;
  }
  .headerTableItems{
    background: #e7e3e3;
    color: #033faf;
    /* font-weight: bold; */
    height: 23px;
    font-size: 12px;
  }
  .rowTableItems{
    font-weight: bold;
    font-size: x-small;
    height: 23px;
  }
  .rowTableItemsPrecio{
    font-weight: bold;
    height: 23px;
    color: #36d6f6;
    font-weight: bold;
  }
  .subtitleimagen {
    text-align: center;
    pointer-events: all;
    position: absolute;
    padding: 0px;
    color: #fff;
    background: rgba(0, 0, 0, 0.47);
    font-size: 12px;
    bottom: 20px;
    width: 100px;
  }
  .subtitleimagenPopup {
    text-align: center;
    pointer-events: all;
    padding: 10px;
    color: #fff;
    background: rgba(0, 0, 0, 0.47);
    font-size: 12px;
    position: absolute;
    top: 10px;
    right: 10px;
    left: 10px;
  }
  .precioimagenPopup {
    text-align: center;
    pointer-events: all;
    padding: 5px;
    color: #fff;
    background: #033faf;
    font-size: 12px;
    position: absolute;
    bottom: 2px;
    right: 50px;
    left: 50px;
    border-radius: 10px;
  }
  .buscartop {
    padding: 12px 16px;
    position: sticky;
    top: 85px;
    z-index: 1000;
    background: aliceblue;
    border-bottom: 1px solid #757575;
  }
  .divitemgroups {
    height: 30px;
  }
  .buscadorFixed {
    position: fixed;
    top: 85px;
    background: white;
    z-index: 999;
    padding: 10px;
    width: 72%;
    border-bottom: 1px solid #9e9e9e;
  }
  .divselections {
    border-radius: 10px;
    background: #e7e3e3;
    color: #033faf;
    font-size: 10px;
    /* border: 1px solid #707271; */
    width: -webkit-fit-content;
    width: -moz-fit-content;
    width: fit-content;
    padding: 3px 7px;
    margin: 3px;
    float: left;
    font-weight: bold;
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
</style>
