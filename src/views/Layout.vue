<template>
<div class="full-high">
    <TopBar></TopBar>
    <router-view />
    <Footer></Footer>
</div>
</template>

<script>
import TopBar from '@/components/TopBar.vue'
import Footer from '@/components/Footer.vue'
export default {
  components: {
    TopBar,
    Footer
  },
  data () {
    return {}
  },
  methods: {},
  created () {}
}
</script>
