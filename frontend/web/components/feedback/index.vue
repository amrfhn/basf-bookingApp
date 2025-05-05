<template>
  <div class="feedback">
    <button id="btn_feedback" class="ui primary button inline" @click="toggleFeedbackModal">
      <i class="comment alternate icon" />
      <span>{{ $t('mainpage.feedback') }}</span>
    </button>
    <modal
      :title="$t('mainpage.feedbackModal.title')"
      :show="showFeedbackModal"
      closeable
      :confirm-text="$t('mainpage.feedbackModal.send')"
      @close="toggleFeedbackModal"
      @ok="sendFeedback"
    >
      <Feedback />
    </modal>
  </div>
</template>

<script>
import Feedback from './Feedback'

export default {
  name: 'FeedbackBtn',
  components: { Feedback },
  data () {
    return {
      showFeedbackModal: false
    }
  },
  computed: {
    feedbackType: { get () { return this.$store.getters['feedback/getType'] } },
    feedbackText: { get () { return this.$store.getters['feedback/getText'] } },
    feedbackDates: { get () { return this.$store.getters['feedback/getDates'] } }
  },
  methods: {
    toggleFeedbackModal () {
      this.showFeedbackModal = !this.showFeedbackModal
    },
    sendFeedback () {
      switch (this.feedbackType) {
        case 'SeatUnavailable':
          if (this.feedbackDates.from <= this.feedbackDates.to) {
            this.$store.dispatch('feedback/sendFeedback')
          } else {
            this.$console.warn(this.$t('mainpage.feedbackModal.errors.onDates'))
          }
          this.showFeedbackModal = false
          break
        default:
          if (this.feedbackText) {
            this.$store.dispatch('feedback/sendFeedback')
          } else {
            this.$console.warn(this.$t('mainpage.feedbackModal.errors.emptyComment'))
          }
          this.showFeedbackModal = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.feedback{

  #btn_feedback {
    width: 52px;
    height: 35px;
    max-width: fit-content;
    z-index: 50;
    background-color: #65AC1E;
    position: fixed;
    right: 10px;
    bottom: 50px;
    overflow: hidden;
    transition: .3s .7s ease-out;
  }
  #btn_feedback i {
    height: 35px;
    float: left;
  }
  #btn_feedback span {
    display: inline-block;
    height: 35px;
  }
  #btn_feedback:hover {
    width: 220px;
    max-width: fit-content;
  }
}
</style>
