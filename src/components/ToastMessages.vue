<template>
  <div class="toast-container position-fixed pe-2 end-0 toast-position">
    <Toast v-for="(msg, key) in messages" :key="key" :msg="msg"></Toast>
  </div>
</template>

<script>
import Toast from '@/components/Toast.vue'

export default {
  components: {
    Toast
  },
  data () {
    return {
      messages: []
    }
  },
  inject: ['emitter'],
  unmounted () {
    // If handler is omitted, all handlers of the given type are removed.
    this.emitter.off('push-message')
  },
  mounted () {
    this.emitter.on('push-message', (message) => {
      const { style = 'success', title, content } = message
      this.messages.push({ style, title, content })
    })
  }
}
</script>
