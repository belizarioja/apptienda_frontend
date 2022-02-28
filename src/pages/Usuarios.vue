<template>
  <q-page class="text-center">
    <div class="headerItem">
       <div
          class="menuitem"
          @click="gotoIndex()">
          <q-icon name="keyboard_return"/>
        </div>
        <div class="subHeaderItem">
          Usuarios
        </div>
        <q-btn
          class="menuitem2"
          type="buttom"
          :loading="loading"
          icon="add"
          @click="loading = !loading; openAddUser()">
          <template v-slot:loading>
            <q-spinner-facebook />
          </template>
        </q-btn>
    </div>
    <q-table
      grid
      :rows="serverData"
      :columns="columns"
      row-key="id"
      :filter="filter"
      hide-header
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
    >
      <template v-slot:top>
        <q-btn size="md" color="secondary" round dense @click="actualizar" icon="refresh"></q-btn>
        <span style="font-size: 12px;margin-left: 6px;">Actualizar</span>
        <q-space />
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Buscar">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card>
            <q-card-section style="height: 115px;">
              <div style="float: left; margin-right:10px;">
                <div style="text-align: left;">{{ props.row.usuario }} {{ props.row.nombre }}</div>
                <div style="text-align: left;font-weight: bold;">Útimo acceso : {{ props.row.fe_ult_acceso }}</div>
                <div style="text-align: left;font-weight: bold;">Útimo update : {{ props.row.fe_ult_get }}</div>
                <div style="text-align: left;">Dispositivo : {{ props.row.uuid }}</div>
              </div>
              <div style="display: grid;justify-content: end;">
                <q-icon
                 v-show="props.row.status"
                 class="iconApp"
                 name="check_circle"
                 color="positive"
                 style=""
                 @click="hideShow(props.row.status, props.row.id, props.row.nombre)"
                />
                <q-icon
                 v-show="!props.row.status"
                 class="iconApp"
                 name="disabled_by_default"
                 color="negative"
                 style=""
                 @click="hideShow(props.row.status, props.row.id, props.row.nombre)"
                />
                <q-icon
                 v-show="props.row.uuid !== 'S/Inf'"
                 class="iconApp"
                 name="phonelink_erase"
                 color="negative"
                 style="margin-top: 20px;"
                 @click="resetDevice(props.row.id, props.row.nombre)"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
    <q-dialog v-model="layoutModalAdd">
      <q-layout view="Lhh lpR fff" container class="bg-white borderdetailt" style="height:90%;">
        <q-header class="bg-primary">
          <q-toolbar>
            <q-toolbar-title style="font-size: inherit;display: grid;">
              <span style=""> AGREGAR CLIENTE COMO USUARIO </span>
            </q-toolbar-title>
            <q-btn flat v-close-popup round dense icon="close" />
          </q-toolbar>
        </q-header>
        <q-page-container>
          <q-page padding>
            <q-table
              grid
              :rows="serverDataClientes"
              row-key="id"
              :filter="filter"
              v-model:pagination="pagination"
              :rows-per-page-options="[0]"
              hide-header
              hide-bottom
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
                    <q-item
                      @click="addUser(props.row.idcliente, props.row.nombrecliente)"
                      clickable v-ripple>
                      <q-item-section avatar>
                        <q-avatar color="primary" text-color="white">
                          {{ iniciales(props.row.nombrecliente) }}
                        </q-avatar>
                      </q-item-section>
                      <q-item-section style="text-align: left;">
                        <q-item-label>{{ props.row.nombrecliente }}</q-item-label>
                        <q-item-label caption>ID {{ props.row.idcliente }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-card>
                </div>
              </template>
            </q-table>
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, defineComponent } from 'vue'
import authLib from '../logic/auth'
import moment from 'moment'
// const config = require('../config/endpoints.js')
// const ENDPOINT_PATH = config.endpoint_path

export default defineComponent({
  name: 'Usuarios',
  data () {
    return {
      idrol: this.$q.localStorage.getItem('idrol'),
      serverData: [],
      serverDataClientes: [],
      loading: false
    }
  },
  setup () {
    const filter = ref('')
    const layoutModalAdd = ref(false)
    return {
      filter,
      layoutModalAdd,
      pagination: {
        page: 1,
        rowsPerPage: 0 // 0 means all rows
      },
      columns: [
        { name: 'nombre', label: 'Nombre', field: 'nombre' },
        { name: 'usuario', label: 'Usuario', field: 'usuario' }
      ],
      columns2: [
        { name: 'nombre', label: 'Nombre', field: 'nombre' },
        { name: 'rif', label: 'Rif', field: 'rif' }
      ]
    }
  },
  methods: {
    gotoIndex () {
      this.$router.push('/index')
    },
    openAddUser () {
      // this.loading = true
      // console.log(this.loading)
      this.layoutModalAdd = true
      this.loading = false
      // console.log(this.loading)
    },
    iniciales (nombre) {
      const primer = nombre.split(' ')[0].charAt(0)
      const segundo = nombre.split(' ').length > 1 ? nombre.split(' ')[1].charAt(0) : ''
      return primer + segundo
    },
    async addUser (idcliente, nombrecliente) {
      const respnet = await this.checkNet()
      if (respnet > 1) {
        this.mensajeError(respnet)
        return
      }
      this.$q.dialog({
        title: 'CONFIRMACIÓN!',
        message: 'Desea agregar a ' + nombrecliente + ', como usuario del sistema?',
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
        await authLib.addUser(idcliente, nombrecliente).then(
          this.getUsuarios()
        )
        // console.log(resp)
        this.layoutModalAdd = false
      })
    },
    listarClientes () {
      this.serverDataClientes = this.$q.localStorage.getItem('clientes') ? this.$q.localStorage.getItem('clientes') : []
    },
    listarUsuarios () {
      this.serverData = this.$q.localStorage.getItem('usuarios') ? this.$q.localStorage.getItem('usuarios') : []
    },
    async actualizar () {
      const respnet = await this.checkNet()
      if (respnet > 1) {
        this.mensajeError(respnet)
        return
      }
      this.getUsuarios()
    },
    async getUsuarios () {
      this.serverData = []
      if (this.idrol === 1) {
        const resp = await authLib.usuarios()
        const datos = resp.data
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
          this.serverData.push(obj)
        }
        this.$q.localStorage.remove('usuarios')
        this.$q.localStorage.set('usuarios', this.serverData)
      }
    },
    async hideShow (val, id, nombre) {
      const respnet = await this.checkNet()
      if (respnet > 1) {
        this.mensajeError(respnet)
        return
      }
      const valor = val === 1 ? 0 : 1
      const msg = val === 0 ? 'HABILITAR' : 'INHABILITAR'
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
        await authLib.hideShowUsuarios(valor, id).then(
          this.getUsuarios()
        )
      })
    },
    async resetDevice (id, nombre) {
      const respnet = await this.checkNet()
      if (respnet > 1) {
        this.mensajeError(respnet)
        return
      }
      this.$q.dialog({
        title: 'Confirmación!',
        message: 'Desea RESETEAR el dispositivo de la cuenta de ' + nombre + '?',
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
        await authLib.resetDevice(id).then(
          this.getUsuarios()
        )
      })
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
    }
  },
  mounted () {
    this.idusuario = this.$q.localStorage.getItem('idusuario')
    this.listarUsuarios()
    this.listarClientes()
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
  .menuitem2 {
    height: 40px;
    width: 45px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: bold;
    background: #36d6f6;
    color: white;
  }
  .subHeaderItem{
    text-align: center;
    width: 80%;
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
  }
  .done{
    background: aquamarine;
  }
  .iconApp{
    font-size: 30px;
  }
  .borderdetailt {
    border-radius: 12px;
  }
</style>
