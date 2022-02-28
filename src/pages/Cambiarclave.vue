<template>
  <div class="bg-transparent">
    <div class="headerItem">
      <div class="subHeaderItem">
        Cambiar clave
      </div>
    </div>
  </div>
  <div class="q-pa-md text-dark bg-primary formCambiar">
    <form
      @submit.prevent="enviarLogin">
      <q-input
        borderless
        standout
        dense
        class="login bg-white"
        label-color="dark"
        v-model="usuario"
        label="Usuario"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Por favor ingrese usuario']">
        <template v-slot:prepend>
          <q-icon name="account_box" color="dark" />
        </template>
      </q-input>
      <q-input
        borderless
        standout
        dense
        class="login bg-white"
        color="dark"
        label-color="dark"
        v-model="claveactual"
        type="password"
        label="Contraseña actual"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Por favor ingrese contraseña'
        ]">
          <template v-slot:prepend>
            <q-icon name="no_encryption" color="dark" />
          </template>
      </q-input>
      <q-input
        borderless
        standout
        dense
        class="login bg-white"
        color="dark"
        label-color="dark"
        v-model="nuevaclave"
        type="password"
        label="Nueva contraseña"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Por favor ingrese contraseña'
        ]">
          <template v-slot:prepend>
            <q-icon name="lock" color="dark" />
          </template>
      </q-input>
      <div class="text-center"  style="margin-bottom:20px;">
        <q-btn
          style="width: -webkit-fill-available;"
          label="Enviar"
          type="submit"
          color="dark"/>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue'
import auth from '../logic/auth'
/// import moment from 'moment'

export default defineComponent({
  setup () {
    return {
      usuario: ref(''),
      claveactual: ref(''),
      nuevaclave: ref(''),
      mantener: false
    }
  },
  methods: {
    gotoIndex () {
      this.$router.push('/index')
    },
    async enviarLogin () {
      try {
        const resp = await auth.cambiarclave(this.usuario, this.claveactual, this.nuevaclave)
        if (resp.data.status === 500) {
          // SI HAY ALGUN ERROR EN LAS CONSULTAS
          this.$q.dialog({
            title: 'Advertencia!',
            message: resp.data.message,
            cancel: true,
            persistent: true
          })
        } else {
          if (resp.data.length > 0) {
            // SI LAS CREDENCIALES SON VALIDAS
            this.$q.dialog({
              title: 'Clave actualizada con éxito!',
              message: 'Ingrese con su nueva clave a la aplicación!',
              persistent: true
            })
            this.$router.push('/')
          } else {
            // SI LAS CREDENCIALES NO SON VALIDAS
            this.$q.dialog({
              title: 'Oops! Advertencia!',
              message: 'Credenciales no válidas!',
              cancel: true,
              persistent: true
            })
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
})
</script>
<style lang="scss">
  .login {
    margin-bottom: 20px;
    border-radius: 5px;
    padding: 0 10px;
  }
  .q-btn {
    text-transform: inherit;
    border-radius: 5px;
  }
  .q-field--with-bottom {
    padding-bottom: 0;
  }
  .testbox {
    margin: 20px auto;
    -webkit-border-radius: 8px/7px;
    -moz-border-radius: 8px/7px;
    border-radius: 8px/7px;
    background-color: #ebebeb;
    -webkit-box-shadow: 1px 2px 5px rgba(0,0,0,.31);
    -moz-box-shadow: 1px 2px 5px rgba(0,0,0,.31);
    box-shadow: 1px 2px 5px rgba(0,0,0,.31);
    border: solid 1px #cbc9c9;
  }
  .bannerCambiar{
    height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: x-large;
  }
  .formCambiar {
    padding: 20px;
    position: absolute;
    top: 155px;
    left: 0;
    right: 0;
    height: 100%;
  }
  .headerItem{
    margin: 20px;
    display: flex;
    align-items: center;
  }
  .menuitem {
    height: 60px;
    width: 60px;
    border: 1px solid #36d6f6;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: xx-large;
  }
  .subHeaderItem{
    text-align: center;
    width: 100%;
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
  }
</style>
