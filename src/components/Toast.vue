<template>
  <div
    class="toast"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
    ref="toast"
  >
    <!-- <div class="toast-header">
      <span
        :class="`bg-${msg.style}`"
        class="p-2 rounded me-2 d-inline-block"
      ></span>
      <strong class="me-auto text-white">{{ msg.title }}</strong>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="toast"
        aria-label="Close"
      ></button>
    </div> -->
    <!--  v-if="msg.content" -->
    <div class="toast-body toast-border px-0" :class="`border-${msg.style}`">
      <div class="row justify-conent-between align-items-center g-0">
        <div class="col-1 text-center">
          <i class="bi bi-exclamation-triangle-fill fs-6 text-danger" v-if="msg.style === 'danger'"></i>
          <i class="bi bi-check-circle-fill fs-6 text-success" v-else></i>
        </div>
        <div class="col-10">
          <div class="d-flex flex-column px-2 toast-content">
            <strong class="title">{{ msg.title }}</strong>
            <span class="content">{{ msg.content }}</span>
          </div>
        </div>
        <div class="col-1 text-center">
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from 'bootstrap/js/dist/toast'

export default {
  name: 'Toast',
  props: [
    'msg'
  ],
  mounted () {
    const toastEl = this.$refs.toast
    const toast = new Toast(toastEl, {
      delay: 1000
    })
    toast.show()
  }
}
</script>
