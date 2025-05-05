<template>
  <div>
    <modal
      :title="$t('configuration.hood.deleteModalTitle')"
      show
      closeable
      @close="$emit('close')"
      @ok="$emit('delete')"
    >
      <p>{{ $t('configuration.hood.quantityOfSeats') }}: {{ seatQuantityByHood }}</p>
    </modal>
  </div>
</template>

<script>

export default {
  name: 'DeleteHoodModal',
  props: {
    hoodInfo: { type: Object, required: true },
    data () {
      return { seatQuantityByHood: null }
    }
  },
  async mounted () {
    this.seatQuantityByHood = await this.$api.seat.getSeatQuantityByHood({ hoodId: this.hoodInfo.id })
  }
}
</script>

<style scoped>
</style>
