<template>
  <div class="bg-transparent text-center"  style="padding-top: 75px;">
    <span style="font-size:x-large"> Enhorabuena!</span>
    <p>Gracias por usar nuestra AppTienda!</p>
    <div class="bannerlogout">
      <q-icon name="important_devices" color="primary" style="font-size: 100px;" />
    </div>
    <div class="text-center"  style="margin:20px;">
      <q-btn
        label="Ir a Login"
        type="buttom"
        color="dark"
        @click="gotoIndex()"/>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
/// import moment from 'moment'

export default defineComponent({
  methods: {
    gotoIndex () {
      this.$router.push('/')
    }
  },
  created () {
    console.log(this.$q.localStorage.getItem('mantener'))
    this.$q.localStorage.set('salida', true)
    if (!this.$q.localStorage.getItem('mantener')) {
      // this.$q.localStorage.clear()
      this.$q.localStorage.remove('holds')
      this.$q.localStorage.remove('itemsholds')
      this.$q.localStorage.remove('productos')
      this.$q.localStorage.remove('vendedores')
      this.$q.localStorage.remove('usuarios')
      this.$q.localStorage.remove('clientes')
      this.$q.localStorage.remove('idrol')
      this.$q.localStorage.remove('idsucursal')
      this.$q.localStorage.remove('idcliente')
      this.$q.localStorage.remove('nombreusuario')
      this.$q.localStorage.remove('clave')
      this.$q.localStorage.remove('idusuario')
      this.$q.localStorage.remove('mantener')
      this.$q.localStorage.remove('salida')
      this.$q.localStorage.remove('cuentasxc')
      this.$q.localStorage.remove('feultget')
      this.$q.localStorage.remove('usuario')
      this.$q.localStorage.remove('categorias')
      this.$q.localStorage.remove('fechareporte')
      this.$q.localStorage.remove('basedatosnueva')
    } else {
      this.gotoIndex()
    }
  }
})
</script>

<style lang="scss">
  .bannerlogout{
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
