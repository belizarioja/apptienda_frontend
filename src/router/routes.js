
const routes = [
  { path: '/', component: () => import('pages/Login.vue') },
  { path: '/logout', component: () => import('pages/Logout.vue') },
  {
    path: '/index',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/index', component: () => import('pages/Index.vue') },
      { path: '/ayuda', component: () => import('pages/Ayuda.vue') },
      { path: '/clientes', component: () => import('pages/Clientes.vue') },
      { path: '/categorias', component: () => import('pages/Categorias.vue') },
      { path: '/productos', component: () => import('pages/Productos.vue') },
      { path: '/vendedores', component: () => import('pages/Vendedores.vue') },
      { path: '/vendedoresclientes', component: () => import('pages/Vendedoresclientes.vue') },
      { path: '/usuarios', component: () => import('pages/Usuarios.vue') },
      { path: '/cuentasxcobrar', component: () => import('pages/Cuentasxcobrar.vue') },
      { path: '/reportepedidos', component: () => import('pages/Reportepedidos.vue') },
      { path: '/cambiarclave', component: () => import('pages/Cambiarclave.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
