<template>
  <q-page class="text-center">
    <div class="headerItem">
       <div
          class="menuitem"
          @click="gotoIndex()">
          <q-icon name="keyboard_return"/>
        </div>
        <div class="subHeaderItem">
          Vendedores
        </div>
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
            <q-card-section style="height: 93px;">
              <div style="display: flex;float: left;">
                <q-item-section avatar style="float: left;">
                  <q-avatar color="primary" text-color="white">
                    {{ iniciales(props.row.nombre) }}
                  </q-avatar>
                </q-item-section>
                <div style="float: left; margin-right:10px;">
                  <div style="text-align: left;">{{ props.row.id }}</div>
                  <div style="text-align: left; font-weight: bold;">{{ props.row.nombre }}</div>
                  <div style="text-align: left;">Ultimo pedido {{ ultimopedido(props.row.fecha) }}</div>
                </div>
              </div>
              <div style="display: grid;justify-content: end;">
                <q-icon
                 class="iconApp"
                 name="paid"
                 color="secondary"
                 style=""
                 @click="gotoReporteCxc(props.row.id, props.row.nombre)"
                />
                <q-icon
                 v-if="props.row.fecha"
                 class="iconApp"
                 name="view_list"
                 color="info"
                 style=""
                 @click="gotoReportePedidos(props.row.id, props.row.nombre, props.row.fecha)"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { ref, defineComponent } from 'vue'
import moment from 'moment'

export default defineComponent({
  name: 'Usuarios',
  data () {
    return {
      serverData: [],
      idusuario: this.$q.localStorage.getItem('idusuario'),
      pagination: {
        page: 1,
        rowsPerPage: 0 // 0 means all rows
      }
    }
  },
  setup () {
    const filter = ref('')
    return {
      filter,
      columns: [
        { name: 'id', label: 'ID', field: 'id' },
        { name: 'nombre', label: 'Nombre', field: 'nombre' },
        { name: 'fecha', label: 'Fecha', field: 'fecha' }
      ]
    }
  },
  methods: {
    iniciales (nombre) {
      const primer = nombre.split(' ')[0].charAt(0)
      const segundo = nombre.split(' ').length > 1 ? nombre.split(' ')[1].charAt(0) : ''
      return primer + segundo
    },
    gotoIndex () {
      this.$router.push('/index')
    },
    gotoReporteCxc (usuarioreporte, nombrereporte) {
      this.$q.localStorage.set('usuarioreporte', usuarioreporte)
      this.$q.localStorage.set('nombrereporte', nombrereporte)
      this.$router.push('/cuentasxcobrar')
    },
    gotoReportePedidos (usuarioreporte, nombrereporte, fechareporte) {
      this.$q.localStorage.set('usuarioreporte', usuarioreporte)
      this.$q.localStorage.set('nombrereporte', nombrereporte)
      this.$q.localStorage.set('fechareporte', moment(fechareporte).format('YYYY-MM-DD'))
      this.$router.push('/reportepedidos')
    },
    async listarVendedores () {
      this.serverData = this.$q.localStorage.getItem('vendedores') ? this.$q.localStorage.getItem('vendedores') : []
    },
    ultimopedido (fecha) {
      return fecha ? moment(fecha).format('YYYY-MM-DD') : 'S/Inf'
    }

  },
  mounted () {
    this.listarVendedores()
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
  }
  .iconApp{
    font-size: 33px;
  }
</style>
