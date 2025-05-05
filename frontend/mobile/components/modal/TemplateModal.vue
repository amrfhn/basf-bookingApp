<template>
  <div v-if="show">
    <div id="Modal" class="modal" tabindex="-1" role="dialog" style="display: block;">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title inline">
              <strong>{{ title }}</strong>
            </h2>
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
            <h4 style="color: red">
              {{ body === 'preBooks' ? $t('modal.preBooksWarn') : null }}
            </h4>
          </div>
          <div class="modal-body">
            <slot />
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <btn-positive @click="submit">
                <i class="icon check" />
                {{ $t('modal.confirmButton') }}
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
  name: 'TemplateModal',
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
<style>
.inline {
  display: inline-block;
}
.modal{
  overflow-y: auto;
}
</style>
