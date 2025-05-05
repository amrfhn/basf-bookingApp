<template>
  <ui-grid>
    <row>
      <column :wide="isMobileViewport ? 12 : 10">
        <department-table v-if="building && (which === 'first' || hasLandingZones) && which !== 'second'" @showFloorsTable="show('second')" />
        <suggestion-table v-else-if="building && (which === 'second' || !hasLandingZones) && which !== 'first' " @showDepartmentTable="show('first')" />
      </column>
      <column v-if="!isMobileViewport" :wide="2">
        <quicklinks-bar />
      </column>
    </row>
  </ui-grid>
</template>

<script>
import QuicklinksBar from '../QuicklinksBar.vue'
import SuggestionTable from './SuggestionTable'
import DepartmentTable from './DepartmentTable.vue'
import { isMobileViewport } from '@/common/UseBreakpoints'

export default {
  name: 'SuggestionParent',
  components: { SuggestionTable, DepartmentTable, QuicklinksBar },
  data () {
    return {
      which: '',
      isMobileViewport: isMobileViewport()
    }
  },
  computed: {
    building () { return this.$store.getters['building/getSelectedBuildingBooking'] },
    hasLandingZones () { return this.$store.getters['floor/hasLandingZones'] }
    // isMobileViewport () { return isMobileViewport() }
  },
  watch: {
    building () {
      this.which = ''
    }
  },
  methods: {
    show (which) { this.which = which }
  }
}
</script>

<style lang="scss" scoped>

</style>
