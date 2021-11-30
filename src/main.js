import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Loading from 'vue3-loading-overlay'
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap'
import $getAuthorizationHeader from './methods/getAuthorizationHeader'
import { toMinute, replaceCity } from './methods/filters'
// createApp(App).use(router).mount('#app')
const app = createApp(App)
app.use(VueAxios, axios)
app.use(router)
app.config.globalProperties.$getAuthorizationHeader = $getAuthorizationHeader
app.config.globalProperties.$filters = {
  toMinute,
  replaceCity
}
app.component('Loading', Loading)
app.mount('#app')
