<template>
  <ui-grid :columns="2" stackable>
    <column>
      <label>{{ $t('book.from') }}</label>
      <datepicker v-model="dateFrom" />
    </column>
    <column>
      <label>{{ $t('book.to') }}</label>
      <datepicker v-model="dateTo" />
    </column>
  </ui-grid>
</template>

<script>
export default {
  name: 'SeatUnavailable',
  data () {
    return {
      dateFrom: null,
      dateTo: null
    }
  },
  watch: {
    dateFrom (newDateFrom) {
      if (this.dateTo < newDateFrom) {
        this.dateTo = newDateFrom
      } else {
        this.updateDates()
      }
    },
    dateTo (newDateTo) {
      if (this.dateFrom > newDateTo) {
        this.dateFrom = newDateTo
      } else {
        this.updateDates()
      }
    }
  },
  mounted () {
    this.dateFrom = new Date()
    this.dateTo = new Date()
    this.updateDates()
    this.$store.dispatch('feedback/changeType', 'SeatUnavailable')
  },
  destroyed () {
    this.dateFrom = null
    this.dateTo = null
    this.updateDates()
  },
  methods: {
    updateDates () {
      this.$store.dispatch('feedback/updateDates', { from: this.dateFrom, to: this.dateTo })
    }
  }
}
</script>

<style scoped>
textarea {
  resize: vertical;
  border:solid 1px;
}
</style>
