<template>
  <q-page class="text-center">
    <div class="headerItem">
       <div
          class="menuitem"
          @click="gotoIndex()">
          <q-icon name="keyboard_return" />
        </div>
        <div class="subHeaderItem" style="display: grid;">
          <span>Reporte pedidos</span>
          <span id="idNombreReporte" v-if="nombrereporte"> de {{ nombrereporte }}</span>
        </div>
    </div>
    <div style="font-size: 14px;display: flex;justify-content: flex-start;align-items: center;">
      <span style="margin-left: 20px;margin-right: 20px;">Fecha del pedido : </span>
      <q-input borderless dense
          style="font-size:12px;width: 120px;"
          v-model="fechaReporte"
        >
          <template v-slot:append style="padding: none;">
            <q-icon name="event" class="cursor-pointer" size="sm" color="primary">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date
                  v-model="fechaReporte"
                  @change="getReporte()"
                  first-day-of-week="1"
                  today-btn
                  :locale="myLocale"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="negative" style="margin-right: 20px;" />
                    <q-btn v-close-popup label="Buscar" color="primary" @click="getReporte()" />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

        </q-input>
    </div>
    <!-- INICIO NUEVA TABLA EXPANSIVA -->
    <q-table
      :rows="serverData"
      :columns="columns"
      ref="myTable"
      dense
      row-key="numedocu"
      :filter="filter"
      hide-header
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
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

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th
            v-for="col in props.cols"
            style="text-align: left;"
            :key="col.name"
            :props="props">
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
          <q-td colspan="100%">
            <q-table
              style="background: #f5f5f5;"
              :rows="props.row.details"
              dense
              :columns="columns2"
              row-key="idproducto"
              v-model:pagination="pagination"
              :rows-per-page-options="[0]"
            >
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                    class="text-italic text-aecondary"
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
import moment from 'moment'

export default defineComponent({
  name: 'Reportepedidos',
  data () {
    return {
      expansionsToggled: false,
      hideShowAll: 'Mostrar todos',
      serverData: [],
      nombrereporte: false,
      fechaReporte: moment().format('YYYY/MM/DD'),
      idrol: this.$q.localStorage.getItem('idrol'),
      usuario: this.$q.localStorage.getItem('usuario'),
      pagination: {
        page: 1,
        rowsPerPage: 0 // 0 means all rows
      }
    }
  },
  setup () {
    const layoutModal = ref(false)
    const filter = ref('')
    return {
      filter,
      layoutModal,
      nombrecliente: 'Cliente Público',
      numedocu: '',
      myLocale: {
        /* starting with Sunday */
        days: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
        daysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
        months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
        monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
        firstDayOfWeek: 1
      },
      visibleColumns: ref(['numedocu', 'nombrecliente', 'fecha', 'hora']),
      columns: [
        { name: 'numedocu', label: '# documento', field: 'numedocu', style: 'text-align: rigth;font-size: 10px;font-weight: bold;' },
        { name: 'nombrecliente', label: 'Cliente', field: 'nombrecliente', style: 'width: 75px;white-space: pre-wrap;text-align: left;font-size: 10px;font-weight: bold;' },
        { name: 'fecha', label: 'Fecha', field: 'fecha', style: 'text-align: rigth;font-size: 10px;font-weight: bold;' },
        { name: 'hora', label: 'Hora', field: 'hora', style: 'text-align: rigth;font-size: 10px;font-weight: bold;' }
      ],
      columns2: [
        { name: 'nombreproducto', label: 'Producto', field: 'nombreproducto', style: 'white-space: pre-wrap;text-align: left;font-size: 10px;font-weight: bold;' },
        { name: 'precio', label: 'Precio', field: 'precio', style: 'text-align: center;font-size: 10px;font-weight: bold;' },
        { name: 'cantidad', label: 'Cantidad', field: 'cantidad', style: 'text-align: rigth;font-size: 10px;font-weight: bold;' },
        { name: 'subtotal', label: 'Subtotal', field: 'subtotal', style: 'text-align: rigth;font-size: 10px;font-weight: bold;' }
      ]
    }
  },
  methods: {
    toggleExpansions () {
      this.expansionsToggled = !this.expansionsToggled
      let rowArray = []
      if (this.expansionsToggled) {
        this.hideShowAll = 'Ocultar todos'
        rowArray = this.serverData.map(row => row.numedocu)
        // depends on what your key is set up to be - here it is row.name
      } else {
        this.hideShowAll = 'Mostrar todos'
        rowArray = []
      }
      this.$refs.myTable.setExpanded(rowArray)
    },
    gotoIndex () {
      this.$q.localStorage.remove('usuarioreporte')
      this.$q.localStorage.remove('nombrereporte')
      this.$q.localStorage.remove('fechareporte')
      if (this.idrol === 1) {
        this.$router.push('/vendedores')
      } else {
        this.$router.push('/index')
      }
    },
    getReporte () {
      this.$q.localStorage.set('fechareporte', moment(this.fechaReporte).format('YYYY-MM-DD'))
      this.listarReporte()
    },
    async listarReporte () {
      const pedidos = this.$q.localStorage.getItem('pedidos') ? this.$q.localStorage.getItem('pedidos') : []
      let usuarioreporte = this.usuario
      if (this.idrol === 1) {
        usuarioreporte = this.$q.localStorage.getItem('usuarioreporte')
        this.nombrereporte = this.$q.localStorage.getItem('nombrereporte')
        this.fechaReporte = this.$q.localStorage.getItem('fechareporte')
        console.log(usuarioreporte, this.fechaReporte, this.nombrereporte)
        const idNombreReporte = document.querySelector('#idNombreReporte')
        if (idNombreReporte) {
          idNombreReporte.textContent = 'de : ' + this.nombrereporte
        }
        if (!this.fechaReporte) {
          this.fechaReporte = moment().format('YYYY-MM-DD')
        }
        if (usuarioreporte) {
          this.serverData = pedidos.filter(obj => obj.usuario === usuarioreporte && obj.fecha === moment(this.fechaReporte).format('YYYY/MM/DD'))
        } else {
          this.serverData = pedidos.filter(obj => obj.fecha === moment(this.fechaReporte).format('YYYY/MM/DD'))
        }
      } else {
        this.serverData = pedidos.filter(obj => obj.fecha === moment(this.fechaReporte).format('YYYY/MM/DD'))
      }
    }
  },
  mounted () {
    this.listarReporte()
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
    background: #5eb228;
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
</style>
