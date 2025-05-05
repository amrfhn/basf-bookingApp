<template>
  <box3>
    <div class="seats-config">
      <search-seats class="search-seats" />
      <seats-map class="map" />
      <seat-attributes class="seat-attr" />
    </div>
  </box3>
</template>

<script>
import SearchSeats from '@/components/configurations/seats/Search'
import SeatsMap from '@/components/configurations/seats/Map'
import SeatAttributes from '@/components/configurations/seats/Attributes'

export default {
  name: 'SeatsConfiguration',
  components: { SeatAttributes, SeatsMap, SearchSeats },
  layout: 'configuration',
  mounted () {
    this.$nuxt.$emit('updateTitle', 'configuration.seats_config.title')
    this.$store.dispatch('seat/setSelectedSeatsConfig', [])
  }
}
</script>

<style scoped>
.header {
  grid-area: header;
  height: 50px;
}

.search-seats {
  grid-area: search-seats;
  margin-right: 50px;
}

.map {
  grid-area: map;
}

.seat-attr {
  grid-area: attr;
  margin-left: 50px;
  margin-right: 20px;
}

.seats-config {
  height: 100%;
  display: grid;
  grid-template-columns: 30% 40% 30%;
  /*grid-template-rows: [row1-start] 60px [row1-end row2-start] 100% [row2-end];*/
  grid-template-areas:
    "header header header"
    "search-seats map attr"
}
</style>
