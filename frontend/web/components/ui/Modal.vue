<template>
  <div v-if="show">
    <div id="Modal" class="modal" tabindex="-1" role="dialog" style="display: block;">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <!-- Header -->
          <div class="modal-header">
            <h3 v-if="title" class="modal-title inline">
              <strong>{{ title }}</strong>
            </h3>
            <button
              v-if="closeable"
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
              @click="close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 v-if="body === 'preBooks'" style="color: red">
              {{ $t('mainpage.confirmationModal.preBooksWarn') }}
            </h4>
          </div>
          <!-- Body -->
          <div class="modal-body">
            <slot />
            <h3> {{ (body !== 'preBooks' && body !== 'onBehalfOf' && body !== 'self') ? body : '' }} </h3>
          </div>
          <!-- Footer -->
          <div class="modal-footer">
            <slot name="footer">
              <btn-positive class="confirm-button" @click="submit">
                <div v-if="!isLoading">
                  <i class="icon check" />
                  {{ $t('modal.confirm') }}
                </div>
                <div v-if="isLoading" class="loader">
                  <spin-loader />
                </div>
              </btn-positive>
            </slot>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop in" />
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    title: { type: String, default: '', required: true },
    body: { type: String, default: '', required: false },
    show: { type: Boolean, required: true },
    closeable: { type: Boolean, default: false, required: false },
    isLoading: { type: Boolean, default: false, required: false }
  },
  methods: {
    submit () {
      this.$emit('ok')
    },
    close () { this.$emit('close') }
  }
}
</script>

<style scoped>
.inline {
  display: inline-block;
}
.modal {
  overflow-y: auto;
}
.confirm-button {
  min-height: 36px;
  min-width: 120px;
}
.loader {
  display: flex;
  justify-content: center;
  position: relative;
  align-items: center;
}
</style>
