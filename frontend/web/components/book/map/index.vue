<template>
  <ui-grid stackable>
    <row>
      <column :wide="1">
        <btn-secondary v-if="showBack" @click="back">
          <icon icon="arrow_back" /> {{ $t('general.back') }}
        </btn-secondary>
      </column>
    </row>
    <row>
      <column :wide="9">
        <floor-map />
        <area-map />
      </column>
      <column :wide="3">
        <div v-if="isAreaSelected">
          <references />
          <amenities-filter />
        </div>
        <quicklinks-bar :variant="2" />
      </column>
    </row>
    <tool-tip />
  </ui-grid>
</template>

<script>
import QuicklinksBar from '../QuicklinksBar.vue'
import AreaMap from './Area'
import AmenitiesFilter from './AmenitiesFilter'
import References from './References'
import FloorMap from './Floor'
import ToolTip from './ToolTip'

export default {
  name: 'ParentMap',
  components: { FloorMap, AreaMap, References, ToolTip, AmenitiesFilter, QuicklinksBar },
  computed: {
    isAreaSelected () { return this.$store.getters['floor/getSelectedAreaBooking'] },
    showBack () { return this.$store.getters['floor/getSelectedAreaBooking'] && this.$store.getters['floor/getAreas'].length > 1 }
  },
  methods: {
    back () { this.$store.dispatch('floor/selectAreaBooking') }
  }
}
</script>

<style lang="scss" scoped>
button {
  .svg-container {
    padding: 0
  }
}
</style>
