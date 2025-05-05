<template>
  <div>
    <p> {{ $t('mainpage.feedbackModal.fbcomment') }} </p>
    <ui-grid>
      <row>
        <column>
          <dropdown v-model="site" :non-selected="$t('mainpage.feedbackModal.topic.site')" :options="sites" :label-selector="e => e.name" />
        </column>
      </row>
    </ui-grid>
    <div>
      <accordion :name="'acc1'" :title="$t('mainpage.feedbackModal.topic.seat')">
        <seat-unavailable />
      </accordion>
      <accordion :name="'acc1'" :title="$t('mainpage.feedbackModal.topic.comment')">
        <send-comment />
      </accordion>
      <accordion :name="'acc1'" :title="$t('mainpage.feedbackModal.topic.error')">
        <ErrorReport />
      </accordion>
    </div>
    <br>
    <div v-show="showAnonymous" class="checkbox-container">
      <input id="checkbox" v-model="checkedAnonymous" type="checkbox" @change="updateFeedback">
      <label for="checkbox">{{ $t('mainpage.feedbackModal.type.anonymous') }}</label>
    </div>
  </div>
</template>

<script>
import SeatUnavailable from './SeatUnavailable'
import ErrorReport from './ErrorReport'
import SendComment from './SendComment'

export default {
  name: 'Feedback',
  components: { SendComment, ErrorReport, SeatUnavailable },
  data () {
    return {
      checkedAnonymous: this.$store.getters['feedback/getAnonymous']
    }
  },
  computed: {
    showAnonymous () { return this.$store.getters['feedback/getShowAnonymous'] },
    sites () { return this.$store.getters['feedback/getSites'] },
    site: {
      get () { return this.$store.getters['feedback/getSelectedSite'] },
      set (value) { this.$store.dispatch('feedback/selectSite', value) }
    }
  },
  async mounted () {
    await this.$store.dispatch('feedback/loadSites')
  },
  methods: {
    updateFeedback () {
      this.$store.dispatch('feedback/updateAnonymous', this.checkedAnonymous)
    }
  }
}
</script>

<style scoped>
.checkbox-container {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
