<template>
  <modal
    id="seatAmenitiesModal"
    :title="$t('configuration.seats_config.modifyAmenities')"
    closeable
    show
    @close="$emit('close')"
    @ok="updateAmenities"
  >
    <notification />
    <amenities />
  </modal>
</template>

<script>
import Notification from '../../../layouts/Notification'
import Amenities from '@/components/configurations/seats/Amenities'

export default {
  name: 'SeatAmenitiesModal',
  components: { Notification, Amenities },
  methods: {
    updateAmenities () {
      this.$nuxt.$emit('saveAmenities')
      this.$emit('close')
    }
  }
}
</script>

<style  lang="scss">
#seatAmenitiesModal {
  .modal-dialog {
    width: 80% !important;
    min-width: 600px !important;
  }

  .container{
    width: 100%;
    min-width: auto;
  }
}

</style>
