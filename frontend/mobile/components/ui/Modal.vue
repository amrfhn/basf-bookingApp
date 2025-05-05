<template>
  <div v-if="show" class="modal">
    <div class="background">
      <div class="dialog" :style="'width: '+width">
        <div class="content">
          <!-- Header -->
          <div class="header">
            <h2> {{ title }} </h2>
            <button v-if="closeable" class="close" @click="close">
              <span>&times;</span>
            </button>
          </div>

          <!-- Body -->
          <div class="body">
            <slot />
          </div>

          <!-- Footer -->
          <div class="footer">
            <slot name="footer">
              <btn-negative v-if="closeable" @click="close">
                Close
              </btn-negative>

              <btn-positive @click="submit">
                Confirm
              </btn-positive>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    width: { type: String, default: '500px' },
    title: { type: String, required: true },
    show: { type: Boolean, required: true },
    closeable: { type: Boolean, default: false, required: false }
  },
  watch: {
    show (value) {
      if (value) {
        document.body.classList.add('modal-open')
      } else {
        document.body.classList.remove('modal-open')
      }
    }
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

<style scoped lang="scss">

.modal {
  .background {
    width: 100%;
    height: 100%;

    position: fixed;
    z-index: 1100;
    top: 0;
    left: 0;
    background-color: #343a40F0;

    .dialog {

      margin: 1.75rem auto;

      .content {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;
        pointer-events: auto;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid rgba(0, 0, 0, .2);
        border-radius: 0.3rem;
        outline: 0;

        .header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 1rem;
          border-bottom: 1px solid #dee2e6;
          border-top-left-radius: calc(0.3rem - 1px);
          border-top-right-radius: calc(0.3rem - 1px);

          h3 {
            margin-bottom: 0;
            line-height: 1.5;
            font-weight: 500;
          }

          .close{
            padding: 1rem 1rem;
            margin: -1rem -1rem -1rem auto;
            cursor: pointer;
            background-color: transparent;
            border: 0;
            appearance: none;
            font-size: 1.5rem;
            font-weight: 700;
            line-height: 1;
            color: #000;
            text-shadow: 0 1px 0 #fff;
            opacity: .5;
          }

        }

        .body{
          position: relative;
          -ms-flex: 1 1 auto;
          flex: 1 1 auto;
          padding: 1rem;
        }

        .footer{
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: flex-end;
          padding: 0.75rem;
          border-top: 1px solid #dee2e6;
          border-bottom-right-radius: calc(0.3rem - 1px);
          border-bottom-left-radius: calc(0.3rem - 1px);
        }
      }
    }
  }
}
</style>
