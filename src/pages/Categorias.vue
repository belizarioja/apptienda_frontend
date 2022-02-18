<template>
  <q-page class="text-center">
    <div class="headerItem">
       <div
          class="menuitem"
          @click="gotoClientes()">
          <q-icon name="keyboard_return" color="info" />
        </div>
        <div class="subHeaderItem">
          Categorías
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
              @click="gotoProductos( props.row.categoria )">
              <strong>{{ props.row.nombre }}</strong>
              <div>Grupo {{ props.row.categoria }}</div>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
  </q-page>
</template>

<script>

import { ref, computed, watch, defineComponent } from 'vue'
import categoriasLib from '../logic/categorias'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'Categorias',
  data () {
    return {
      serverData: []
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
        { name: 'nombre', label: 'Nombre', field: 'nombre' },
        { name: 'categoria', label: 'Grupo', field: 'categoria' }
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
    gotoProductos (categoria) {
      this.$q.localStorage.set('categoria', categoria)
      this.$router.push('/productos')
    },
    gotoClientes () {
      this.$router.push('/clientes')
    },
    async listarCategorias () {
      const resp2 = await categoriasLib.listar()
      this.serverData = []
      const datos = resp2.data
      console.log(datos)
      for (const i in datos) {
        const item = datos[i]
        // console.log(item)
        const obj = {}
        obj.id = item.id
        obj.nombre = item.nombre
        obj.categoria = item.id
        // if (item.cantidad > 0) {
        this.serverData.push(obj)
        // }
      }
    }
  },
  mounted () {
    this.idusuario = this.$q.localStorage.getItem('idusuario')
    console.log(this.idusuario)
    this.listarCategorias()
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
</style>
