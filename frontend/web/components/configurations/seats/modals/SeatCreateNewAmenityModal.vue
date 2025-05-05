<template>
  <modal
    closeable
    show
    title="Create amenity"
    @close="$emit('close')"
    @ok="addAmenity"
  >
    <configurations-amenity-edit v-model="amenity" />
  </modal>
</template>

<script>
export default {
  name: 'SeatCreateNewAmenityModal',
  data () {
    return { amenity: {} }
  },
  computed: {
    site () {
      return this.$store.getters['site/getSelectedSiteConfiguration']
    }
  },
  watch: {
    site () {
      this.clear()
    }
  },
  mounted () {
    this.clear()
  },
  methods: {
    clear () {
      this.amenity = { key: null, type: null, siteId: this.site.id }
    },
    async addAmenity () {
      await this.$api.amenities.create(this.amenity)
      this.clear()
      this.$emit('ok')
    }
  }
}
</script>

<style scoped>

</style>
