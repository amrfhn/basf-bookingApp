<template>
  <div>
    <modal
      title="Hood Map"
      closeable
      show
      @close="$emit('close')"
      @delete="$emit('delete')"
      @deleteAll="$emit('deleteAll')"
      @ok="$emit('complete')"
    >
      <Map :hood-id="hoodId" :map="map" :seats="seats" class="map" />
      <row class="buttons">
        <btn-positive v-if="selectedSeats.length" @click="$emit('complete')">
          <i class="icon plus" />
          {{ $t('configuration.hood.assignSeats') }}
        </btn-positive>
        <btn-negative v-if="selectedSeats.length" @click="$emit('delete')">
          <i class="icon minus" />
          {{ $t('configuration.hood.unassignSeats') }}
        </btn-negative>
      </row>
      <template #footer>
        <btn-negative @click="$emit('close')">
          <i class="icon undo" />
          {{ $t('modal.cancel') }}
        </btn-negative>
        <btn-negative @click="$emit('clear')">
          <i class="icon fa-trash" />
          {{ $t('configuration.hood.removeHoodBtn') }}
        </btn-negative>
      </template>
    </modal>
  </div>
</template>

<script>
import Map from '../Map'

export default {
  name: 'MapModal',
  components: { Map },
  props: {
    hoodId: { required: true },
    area: { type: Object, required: true }
  },
  data () {
    return {
      seats: [],
      map: '',
      selectedSeats: []
    }
  },
  mounted () {
    this.$nuxt.$on('select-seat-hood', this.selectSeats)
  },
  async created () {
    const seats = await this.$api.area.seats(this.area.id, { disabled: true })
    const seatIdx = {}
    for (const s of seats) { seatIdx[s.code] = s }
    this.seats = seatIdx
    this.map = await this.$api.area.getMap(this.area.id)
  },
  methods: {
    selectSeats (selectedSeats) {
      this.selectedSeats = selectedSeats
    }
  }
}

</script>

<style scoped>
.buttons {
  text-align: right;
}

</style>
