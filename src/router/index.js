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
        path: 'BusSearch/:queryString',
        name: 'busSearch',
        component: () => import('../views/BusSearch.vue')
      },
      {
        path: 'NearbyStation/',
        name: 'nearStation',
        component: () => import('../views/NearbyStation.vue')
      },
      {
        path: 'LikeBus/',
        name: 'likeBus',
        component: () => import('../views/LikeBus.vue')
      },
      {
        path: 'StopSearch/',
        component: () => import('../views/StopSearch.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
