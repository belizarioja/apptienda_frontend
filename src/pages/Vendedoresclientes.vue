<template>
  <q-page class="text-center">
    <div class="headerItem">
       <div
          class="menuitem"
          @click="gotoIndex()">
          <q-icon name="keyboard_return" color="info" />
        </div>
        <div class="subHeaderItem">
          Clientes de <br><span style="font-weigth: bold;">{{ nombreVendedor }}</span>
        </div>
    </div>
    <q-table
      grid
      :card-container-class="cardContainerClass"
      :rows="serverData"
      :columns="columns"
      row-key="id"
      :filter="filter"
      hide-header
      v-model:pagination="pagination"
      :rows-per-page-options="rowsPerPageOptions"
    >
      <template v-slot:top-right>
        <q-btn
          color="secondary"
          icon-right="add"
          @click="listarClientes"
          style="margin-right: 50px;"
        />
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Buscar">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card>
            <q-card-section style="display:block; height: 48px;">
              <div style="float: left; margin-right:10px;">{{ props.row.rifcliente }}</div>
              <div style="float: left; font-weight: bold;">{{ props.row.nombrecliente }}</div>
              <div style="float: right;">
                <q-icon
                  class="iconApp"
                  name="delete"
                  color="negative"
                  style="font-size: x-large;"
                  @click="eliminarClienteVendedor(props.row.id, props.row.nombrecliente)"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
    <q-dialog v-model="layoutModal">
      <q-layout view="Lhh lpR fff" container class="bg-white">
        <q-header class="bg-primary">
          <q-toolbar>
            <q-toolbar-title style="font-size: inherit;">
              Asignar clientes a<br>{{ nombreVendedor }}
            </q-toolbar-title>
            <q-btn flat v-close-popup round dense icon="close" />
          </q-toolbar>
        </q-header>
        <q-page-container>
          <q-page padding>
            <div>
              <q-table
                grid
                :card-container-class="cardContainerClass"
                :rows="serverDataClientes"
                :columns="columns"
                row-key="id"
                :filter="filter"
                hide-header
                v-model:pagination="pagination"
                :rows-per-page-options="rowsPerPageOptions"
              >
                <template v-slot:top-right>
                  <q-input borderless dense debounce="300" v-model="filter" placeholder="Buscar">
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </template>

                <template v-slot:item="props">
                  <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
                    <q-card>
                      <q-card-section
                        :class="{'done' : props.row.chk }"
                        @click="agregarClienteVendedor(props.row.id, props.row.nombre, props.row.rif)"
                      >
                        <strong>{{ props.row.nombre }}</strong>
                        <div>RIF {{ props.row.rif }}</div>
                      </q-card-section>
                    </q-card>
                  </div>
                </template>
              </q-table>
            </div>
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, computed, watch, defineComponent } from 'vue'
import vendedorLib from '../logic/vendedores'
import clientesLib from '../logic/clientes'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'Usuarios',
  data () {
    return {
      serverData: [],
      serverDataClientes: [],
      nombreVendedor: this.$q.localStorage.getItem('nombreVendedor'),
      idVendedor: this.$q.localStorage.getItem('idVendedor'),
      layoutModal: false
    }
  },
  setup () {
    const $q = useQuasar()
    function getItemsPerPage () {
      if ($q.screen.lt.sm) {
        return 12
      }
      if ($q.screen.lt.md) {
        return 24
      }
      return 36
    }
    const filter = ref('')
    const pagination = ref({
      page: 1,
      rowsPerPage: getItemsPerPage()
    })

    watch(() => $q.screen.name, () => {
      pagination.value.rowsPerPage = getItemsPerPage()
    })

    return {
      filter,
      pagination,

      columns: [
        { name: 'id', label: 'ID', field: 'id' },
        { name: 'rif', label: 'RIF', field: 'rif' },
        { name: 'nombre', label: 'Nombre', field: 'nombre' }
      ],

      cardContainerClass: computed(() => {
        return $q.screen.gt.xs
          ? 'grid-masonry grid-masonry--' + ($q.screen.gt.sm ? '3' : '2')
          : null
      }),

      rowsPerPageOptions: computed(() => {
        return $q.screen.gt.xs
          ? $q.screen.gt.sm ? [3, 6, 9] : [3, 6]
          : [3]
      })
    }
  },
  methods: {
    async listarClientes () {
      this.layoutModal = true
      const chk = 0
      this.serverDataClientes = []
      const resp = await clientesLib.listar()
      console.log(resp)
      const datos = resp.data
      for (const i in datos) {
        const item = datos[i]
        const obj = {}
        obj.id = item.CLIEV_IDCLIENTE
        obj.nombre = item.CLIEV_NOMBFISCAL
        obj.rif = item.CLIEV_RIF
        obj.chk = false
        // console.log(chk, item.id)
        if (chk === item.CLIEV_IDCLIENTE) {
          obj.chk = true
        }
        this.serverDataClientes.push(obj)
      }
    },
    eliminarClienteVendedor (id, nombre) {
      this.$q.dialog({
        title: 'Confirmación!',
        message: 'Desea eliminar el cliente ' + nombre + ' al vendedor ' + this.nombreVendedor + '?',
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
        await vendedorLib.eliminarClienteVendedor(id)
        this.$router.go(0)
      })
    },
    agregarClienteVendedor (id, nombre, rif) {
      this.$q.dialog({
        title: 'Confirmación!',
        message: 'Desea agregar el cliente ' + nombre + ' al vendedor ' + this.nombreVendedor + '?',
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
        // console.log('Aqui', this.idVendedor, id, nombre, rif)
        await vendedorLib.agregarClienteVendedor(this.idVendedor, this.nombreVendedor, id, nombre, rif)
        this.$router.go(0)
      })
    },
    hideShow (val, id, nombre) {
      let msg = 'HABILITAR'
      if (val) {
        msg = 'INHABILITAR'
      }
      this.$q.dialog({
        title: 'Confirmación!',
        message: 'Desea ' + msg + ' a ' + nombre + '?',
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
        console.log('Aqui', !val, id, nombre)
        const resp = await vendedorLib.hideShowVendedores(!val, id, nombre)
        console.log(resp)
      })
    },
    gotoIndex () {
      this.$router.push('/vendedores')
    },
    async listarVendedorClientes () {
      this.serverData = []
      const resp = await vendedorLib.listarVendedorClientes(this.idVendedor)
      console.log(resp.data)
      this.serverData = resp.data
    }
  },
  mounted () {
    this.idusuario = this.$q.localStorage.getItem('idusuario')
    console.log(this.idusuario)
    this.listarVendedorClientes()
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
    height: 60px;
    width: 60px;
    border: 1px solid green;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: xx-large;
  }
  .subHeaderItem{
    text-align: center;
    width: 100%;
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
  }
  .done{
    background: aquamarine;
  }
</style>
