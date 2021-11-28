import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/Layout.vue'),
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('../views/Index.vue')
      },
      {
        path: 'BusSearch/:city',
        component: () => import('../views/BusSearch.vue')
      },
      {
        path: 'NearbyStation/',
        component: () => import('../views/NearbyStation.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
