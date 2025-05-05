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
          </div>
          <div class="modal-body">
            <slot />
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button
                v-if="closeable"
                id="ok"
                type="button"
                class="ui button primary"
                data-dismiss="modal"
                @click="close"
              >
                <i class="icon undo" />
                Aceptar
              </button>
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
  name: 'SeatAlreadyBookedAlert',
  props: {
    title: { type: String, required: true },
    show: { type: Boolean, required: true },
    closeable: { type: Boolean, default: false, required: false }
  },
  methods: {
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
#ok {
  background-color: #65ac1e;
}
</style>
