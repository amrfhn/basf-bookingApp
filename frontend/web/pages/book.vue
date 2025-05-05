<template>
  <div>
    <search-box v-if="authenticated" />
    <fake-loading-bar v-else />
    <parent-map v-if="isSearching" />
    <suggestion-parent v-if="!isSearching" />
    <confirmation-modal />
  </div>
</template>

<script>
import SearchBox from '../components/book/SearchBox'
import SuggestionParent from '../components/book/table'
import ParentMap from '../components/book/map'
import FakeLoadingBar from '../components/book/FakeLoadingBar'
import ConfirmationModal from '../components/modals/ConfirmationModal'

export default {
  name: 'Booker',
  components: {
    SuggestionParent,
    SearchBox,
    ParentMap,
    FakeLoadingBar,
    ConfirmationModal
  },
  data () {
    return {
      isSearching: false
    }
  },
  computed: {
    authenticated () {
      return this.$store.getters['auth/isAuthenticated']
    },
    sites () {
      return this.$store.getters['site/getSites']
    },
    selectedSite () {
      return this.$store.getters['site/getSelectedSite']
    }
  },
  mounted () {
    this.$nuxt.$on('search', this.setIsSearching)
    if (!this.sites.length) {
      this.$store.dispatch('site/loadSites')
    }
    if (this.selectedSite) {
      this.$store.dispatch('building/loadBuildings', this.selectedSite)
    }
  },
  methods: {
    setIsSearching (value) {
      this.isSearching = value
      this.$store.dispatch('building/updateQuantityPerFloor')
    }
  }
}
</script>

<style scoped>

</style>
