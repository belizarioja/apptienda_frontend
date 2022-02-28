<template>
  <q-page class="text-center">
    <div class="headerItem">
       <div
          class="menuitem"
          @click="gotoIndex()">
          <q-icon name="keyboard_return"/>
        </div>
        <div class="subHeaderItem">
          Clientes <span id="idNombreReporte" v-if="nombrereporte"> de {{ nombrereporte }}</span> con deudas
        </div>
    </div>
    <!-- INICIO NUEVA TABLA EXPANSIVA -->
    <q-table
      :rows="serverData"
      :columns="columns"
      ref="myTable"
      dense
      row-key="idcliente"
      :filter="filter"
      hide-header
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
      :loading="loading"
    >
      <template v-slot:top>
        <q-btn size="md" color="secondary" round dense @click="toggleExpansions" :icon="expansionsToggled ? 'remove' : 'add'"></q-btn>
        <span style="font-size: 12px;margin-left: 6px;">{{ hideShowAll }}</span>
        <q-space />
        <q-input borderless dense debounce="300" color="primary" v-model="filter" placeholder="Buscar">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th
            v-for="col in props.cols"
            style="text-align: left;"
            :key="col.name"
            :props="props"          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn size="xs" color="primary" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
          </q-td>
          <q-td
            auto-width
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%" style="padding-left: 4px;">
            <q-table
              style="background: #f5f5f5;"
              :rows="props.row.details"
              dense
              :columns="columns2"
              row-key="id"
              v-model:pagination="pagination"
              :rows-per-page-options="[0]"
            >
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                    style="font-size: 10px;"
                    class="text-italic text-secondary"
                  >
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>
              <template v-slot:pagination="scope">
                <q-btn
                 style="font-size: 10px;font-weight: bold;"
                  color="primary"
                  :label="'Vendedor: ' + props.row.nombrevendedor"
                  round
                  dense
                  flat
                  :disable="scope.isFirstPage"
                  @click="scope.prevPage"
                />
              </template>
            </q-table>
          </q-td>
        </q-tr>
      </template>

    </q-table>
    <!-- FIN NUEVA TABLA EXPANSIVA -->
  </q-page>
</template>

<script>
import { ref, defineComponent } from 'vue'

export default defineComponent({
  name: 'Clientes',
  data () {
    return {
      expansionsToggled: false,
      hideShowAll: 'Mostrar todos',
      serverData: [],
      nombrereporte: false,
      usuario: this.$q.localStorage.getItem('usuario').toString().toUpperCase(),
      idusuario: this.$q.localStorage.getItem('idusuario'),
      idrol: this.$q.localStorage.getItem('idrol'),
      pagination: {
        page: 1,
        rowsPerPage: 0 // 0 means all rows
      }
    }
  },
  setup () {
    const filter = ref('')
    const loading = ref(false)
    return {
      filter,
      loading,
      columns: [
        { name: 'idcliente', label: 'ID', field: 'idcliente', style: 'text-align: left;font-size: 10px;font-weight: bold;' },
        { name: 'nombrecliente', label: 'Nombre', field: 'nombrecliente', style: 'white-space: pre-wrap;text-align: left;font-size: 10px;font-weight: bold;' },
        { name: 'cantidadcxc', format: val => val > 1 ? `${val + ' facturas'}` : `${val + ' factura'}`, label: 'Cantidad', field: 'cantidadcxc', style: 'text-align: left;font-size: 10px;font-weight: bold;' },
        { name: 'totalcxc', format: val => `${'$' + val.toFixed(2)}`, label: 'Total', field: 'totalcxc', style: 'text-align: left;font-size: 10px;font-weight: bold;' }
      ],
      columns2: [
        { name: 'id', label: '# Control', field: 'id', style: 'text-align: rigth;font-size: 10px;font-weight: bold;' },
        { name: 'tipodoc', label: 'Tipo', field: 'tipodoc', style: 'color: #5eb228;text-align: rigth;font-size: 10px;font-weight: bold;' },
        { name: 'fecha', label: 'Fecha', field: 'fecha', style: 'text-align: rigth;font-size: 10px;font-weight: bold;' },
        { name: 'dias', label: 'Días', field: 'dias', style: 'color: red;text-align: center;font-size: 10px;font-weight: bold;' },
        { name: 'monto', label: 'Monto', field: 'monto', style: 'text-align: rigth;font-size: 10px;font-weight: bold;' },
        { name: 'saldo', label: 'Saldo', field: 'saldo', style: 'text-align: rigth;font-size: 10px;font-weight: bold;' }
      ]
    }
  },
  methods: {
    toggleExpansions () {
      this.expansionsToggled = !this.expansionsToggled
      let rowArray = []
      if (this.expansionsToggled) {
        this.hideShowAll = 'Ocultar todos'
        rowArray = this.serverData.map(row => row.idcliente)
        // depends on what your key is set up to be - here it is row.name
      } else {
        this.hideShowAll = 'Mostrar todos'
        rowArray = []
      }
      this.$refs.myTable.setExpanded(rowArray)
    },
    async listarCxc () {
      console.log(this.idrol)
      this.serverData = []
      this.loading = true
      if (this.idrol === 1) {
        this.nombrereporte = this.$q.localStorage.getItem('nombrereporte')
        this.usuarioreporte = this.$q.localStorage.getItem('usuarioreporte')
        console.log(this.usuarioreporte, this.nombrereporte)

        const idNombreReporte = document.querySelector('#idNombreReporte')
        if (idNombreReporte) {
          idNombreReporte.textContent = 'de : ' + this.nombrereporte
        }
        if (this.usuarioreporte) {
          this.serverData = this.$q.localStorage.getItem('cuentasxc').filter(obj => obj.idvendedor === this.usuarioreporte)
        } else {
          this.serverData = this.$q.localStorage.getItem('cuentasxc') ? this.$q.localStorage.getItem('cuentasxc') : []
        }
      } else {
        this.serverData = this.$q.localStorage.getItem('cuentasxc') ? this.$q.localStorage.getItem('cuentasxc') : []
      }
      console.log(this.serverData)
      this.loading = false
    },
    gotoIndex () {
      this.$q.localStorage.remove('nombrereporte')
      if (this.idrol === 1) {
        this.$router.push('/vendedores')
      } else {
        this.$router.push('/index')
      }
    }
  },
  mounted () {
    this.listarCxc()
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
  .done{
    background: aquamarine;
  }
  table td:first-child {
    padding-left: 10px;
  }
</style>
