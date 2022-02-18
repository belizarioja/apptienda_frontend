<template>
  <div class="bg-primary headerlogin text-white">
    <div class="">
      BIENVENIDO A MÓVIL PEDIDO
    </div>
  </div>
  <div class="bg-transparent">
    <div class="bannerlogin">
      <img src="favicon.ico" height="115"/>
    </div>
  </div>
  <div class="q-pa-md  text-white bg-primary formLogin">
    <form
      @submit.prevent="enviarLogin">
      <div class="text-weight-bold text-center  text-white" style="height:40px;">LOGIN</div>
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
        v-model="clave"
        type="password"
        label="Contraseña"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Por favor ingrese contraseña'
        ]">
          <template v-slot:prepend>
            <q-icon name="lock" color="dark" />
          </template>
      </q-input>
      <div class="q-gutter-sm">
        <q-checkbox v-model="mantener" label="Guardar acceso" />
      </div>
      <div class="text-center"  style="margin-bottom:20px;">
        <q-btn
          style="width: -webkit-fill-available;"
          label="Login"
          type="submit"
          :loading="loading"
          :disable="isDisabled"
          color="dark">
          <template v-slot:loading>
            <q-spinner-facebook />
          </template>
        </q-btn>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue'
import auth from '../logic/auth'
import productosLib from '../logic/productos'
import categoriasLib from '../logic/categorias'
import moment from 'moment'

export default defineComponent({
  setup () {
    const imei = ref(
      window.device === void 0
        ? '11111111111111111111'
        : window.device.uuid
    )
    const loading = ref(false)
    return {
      imei,
      loading,
      usuario: ref(''),
      clave: ref(''),
      isDisabled: ref(false),
      mantener: ref(false)
    }
  },
  methods: {
    async getProductos () {
      const resp = await productosLib.listar(null)
      const datos = resp.data
      const serverData = []
      for (const i in datos) {
        const item = datos[i]
        const obj = {}
        obj.id = item.id
        obj.nombre = item.nombre
        obj.precio =
          item.porkilos === 1
            ? item.precio
            : parseFloat(item.precio / item.unixcaja)
        obj.disponible = item.disponible
        obj.preciocaj = item.preciocaj
        obj.unixcaja = item.unixcaja
        obj.idcategoria = item.idcategoria
        obj.costoactu = item.costoactu
        obj.porciva = item.porciva
        obj.porkilos = item.porkilos
        obj.imagen = false
        const resp2 = await productosLib.getfile(item.id)
        if (resp2.status === 200) {
          // console.log(resp2)
          obj.imagen = resp2.data.imgbase64
        }
        serverData.push(obj)
      }
      this.$q.localStorage.remove('productos')
      this.$q.localStorage.set('productos', serverData)
      const resp3 = await categoriasLib.listarcategorias()
      this.$q.localStorage.remove('categorias')
      this.$q.localStorage.set('categorias', resp3.data)
    },
    async enviarLogin () {
      this.loading = true
      this.isDisabled = true
      try {
        const respnet = await this.checkNet()
        if (respnet > 1) {
          this.mensajeError(respnet)
          this.loading = false
          this.isDisabled = false
          return
        }
        const resp = await auth.login(this.usuario, this.clave, this.imei)
        if (resp.data.status === 500) {
          // SI HAY ALGUN ERROR EN LAS CONSULTAS
          this.$q.dialog({
            title: 'Advertencia!',
            message: resp.data.message,
            persistent: true,
            ok: {
              color: 'dark',
              label: 'Aceptar'
            }
          })
          this.loading = false
          this.isDisabled = false
        } else {
          if (resp.data.length > 0) {
            // SI LAS CREDENCIALES SON VALIDAS
            const idusuario = resp.data[0].id
            const nombreusuario = resp.data[0].nombre
            const idrol = resp.data[0].idrol
            const idsucursal = resp.data[0].idsucursal
            const status = resp.data[0].status
            const feultget = resp.data[0].fe_ult_get
              ? moment(resp.data[0].fe_ult_get).format('DD/MM/YYYY HH:mm:ss')
              : 'S/Inf'
            // console.log(resp.data)
            if (status === 1) {
              this.$q.localStorage.set('usuario', this.usuario)
              this.$q.localStorage.set('clave', this.clave)
              this.$q.localStorage.set('nombreusuario', nombreusuario)
              this.$q.localStorage.set('idusuario', idusuario)
              this.$q.localStorage.set('idrol', idrol)
              this.$q.localStorage.set('idsucursal', idsucursal)
              this.$q.localStorage.set('mantener', this.mantener)
              this.$q.localStorage.set('salida', false)
              this.$q.localStorage.set('feultget', feultget)
              if (idrol === 4) {
                this.getProductos().then(() => {
                  console.log('Sincronizado finalizó sin problema')
                  this.feultget = moment().format('YYYY-MM-DD HH:mm:ss')
                  this.$q.localStorage.remove('feultget')
                  this.$q.localStorage.set('feultget', this.feultget)
                  this.loading = false
                  this.isDisabled = false
                  this.$router.push('/productos')
                })
              } else {
                this.loading = false
                this.isDisabled = false
                this.$router.push('/index')
              }
            } else {
              this.loading = false
              this.isDisabled = false
              this.$q.dialog({
                title: 'Oops! No tiene acceso!',
                message: 'Contacte a la adminstración de BLOQUE 7!',
                persistent: true,
                ok: {
                  color: 'dark',
                  label: 'Aceptar'
                }
              })
            }
          } else {
            this.loading = false
            this.isDisabled = false
            // SI LAS CREDENCIALES NO SON VALIDAS
            this.$q.dialog({
              title: 'Oops! Advertencia!',
              message: 'Credenciales no válidas!',
              persistent: true,
              ok: {
                color: 'dark',
                label: 'Aceptar'
              }
            })
          }
        }
      } catch (error) {
        this.mensajeError(3)
      }
    },
    mensajeError (resp) {
      const message = resp === 2 ? 'No hay ENLACE con BLOQUE 7' : 'No tiene INTERNET'
      this.$q.dialog({
        title: '¡Problemas de CONEXION!',
        message: message,
        persistent: true,
        ok: {
          color: 'dark',
          label: 'Aceptar'
        }
      })
    },
    async checkNet () {
      try {
        const resp = await auth.bloque7()
        const enviar = resp.status === 200 ? 1 : 2
        return enviar
      } catch (error) {
        return 3
      }
    }
  },
  created () {
    // this.showMacAddress()
    if (this.$q.localStorage.getItem('mantener')) {
      this.mantener = this.$q.localStorage.getItem('mantener')
      this.usuario = this.$q.localStorage.getItem('usuario')
      this.clave = this.$q.localStorage.getItem('clave')
      this.idrol = this.$q.localStorage.getItem('idrol')
      if (!this.$q.localStorage.getItem('salida')) {
        // console.log('Entrar sin logueo de una :', this.salida)
        if (this.idrol === 4) {
          this.$router.push('/productos')
        } else {
          this.$router.push('/index')
        }
      }
    } else {
      this.mantener = false
    }
    console.log(this.mantener)
    console.log(this.imei)
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
  .headerlogin {
    height: 80px;
    padding-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }
  .bannerlogin{
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .formLogin {
    padding: 20px;
    position: absolute;
    top: 200px;
    left: 0;
    right: 0;
    height: 75%;
  }
</style>
