<template>
<div class="full-high">
    <TopBar></TopBar>
    <router-view />
    <Footer></Footer>
    <ToastMessages></ToastMessages>
</div>
</template>

<script>
import TopBar from '@/components/TopBar.vue'
import Footer from '@/components/Footer.vue'
import ToastMessages from '@/components/ToastMessages.vue'
import emitter from '@/methods/emitter'
export default {
  components: {
    TopBar,
    Footer,
    ToastMessages
  },
  provide () {
    return {
      emitter
    }
  },
  data () {
    return {}
  },
  methods: {},
  created () {}
}
</script>
