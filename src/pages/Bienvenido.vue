<template>
  <q-page class="text-center">
    <div style="margin: 20px">Saludos</div>
    <q-card class="my-card" style="margin: 20px">
      <q-card-section style="display: grid;">
        <span>Bienvenido a AppTienda.</span>
        <span><q-icon name="important_devices" color="primary" style="font-size: 100px;" /></span>
        <span>Obtenga la información del producto de su preferencia en tiempo real.</span>
        <span>Para mas información, contacte al equipo de soporte de AppTienda</span>
      </q-card-section>
      <q-card-actions class="justify-center">
        <q-btn
        label="Ver catálogo de productos"
        type="buttom"
        color="dark"
        @click="gotoProductos()"/>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Bienvenido',
  methods: {
    gotoProductos () {
      this.$router.push('/productos')
    }
  }
})
</script>
