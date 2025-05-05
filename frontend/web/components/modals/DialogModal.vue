<template>
  <modal
    class="dialog"
    :title="title"
    :body="body"
    :show="show"
    :closeable="closeable"
    @close="close"
    @ok="submit"
  />
</template>

<script>
export default {
  name: 'DialogModal',
  props: {
    title: { type: String, required: true },
    body: { type: String, required: false },
    show: { type: Boolean, required: true },
    closeable: { type: Boolean, default: false, required: false }
  },
  methods: {
    submit () {
      this.$emit('ok')
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.dialog {
  .modal-header {
    border-bottom: 0
  }

  .modal-body {
    display: none;
  }

  .modal-footer {
    border-top: 0
  }
}
</style>
