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
import $httpMessageState from './methods/pushMessageState'
// createApp(App).use(router).mount('#app')
const app = createApp(App)
app.use(VueAxios, axios)
app.use(router)
app.config.globalProperties.$getAuthorizationHeader = $getAuthorizationHeader
app.config.globalProperties.$filters = {
  toMinute,
  replaceCity
}
// 此函式的用途是整合 Ajax 的錯誤事件，統一整理發送給予 Toast 處理
app.config.globalProperties.$httpMessageState = $httpMessageState
app.component('Loading', Loading)
app.mount('#app')
