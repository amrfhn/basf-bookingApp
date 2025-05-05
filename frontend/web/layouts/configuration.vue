<template>
  <ui-layout schema="green">
    <template #header>
      <ui-brand-header href="/future_of_work/" />
      <navbar-second />
    </template>
    <div>
      <box3>
        <configuration-nav-bar :is-building-minds-admin="isBuildingMindsAdmin" />
        <ui-grid v-if="showSiteField" :columns="3">
          <h2 class="module-title">{{ displayTitle }}</h2>
          <row v-show="!displaySearchBox">
            <column class="field">
              <label class="bar">{{ $t('searchbox.sitelabel') }}</label>
              <dropdown
                v-model="selectedSite"
                :label-selector="e => e.name"
                :non-selected="$t('searchbox.sitetitle')"
                :options="adminSites"
              />
            </column>
            <column v-if="showBuildingField" class="field">
              <label class="bar">{{ $t('searchbox.buildinglabel') }}</label>
              <dropdown
                v-model="selectedBuilding"
                :label-selector="e => e.name"
                :non-selected="$t('searchbox.buildingtitle')"
                :options="buildings"
              />
            </column>
          </row>
        </ui-grid>
      </box3>
      <Nuxt id="main" />
    </div>
    <template #footer>
      <feedback />
      <my-footer />
    </template>
  </ui-layout>
</template>

<script>
import { UiBrandHeader, UiLayout } from 'basf-semantic-ui'
import MyFooter from '../components/layouts/MyFooter'
import NavbarSecond from '../components/layouts/NavbarSecond'
import Feedback from '../components/feedback'
import ConfigurationNavBar from '../components/layouts/ConfigurationNavBar.vue'

export default {
  name: 'Configuration',
  components: { ConfigurationNavBar, MyFooter, UiLayout, UiBrandHeader, NavbarSecond, Feedback }, // v-if="!$slots.default"
  layout: 'default',
  async middleware ({ store, redirect }) {
    await store.dispatch('auth/waitAuth')
    if (store.getters['auth/getAdminSites'].length > 0) {
      return
    }
    redirect('/')
  },
  data () {
    return {
      env: window.location.host,
      adminSites: [],
      title: 'configuration.site'
    }
  },
  computed: {
    splitRoute () {
      return this.$route && this.$route.path ? this.$route.path.split('/') : []
    },
    displaySearchBox () {
      return this.splitRoute[this.splitRoute.length - 1] === 'seats'
    },
    displayTitle () {
      return this.$dk(this.title)
    },
    isProd () {
      return this.env === 'app.roqs.basf.net'
    },
    sites () {
      return this.$store.getters['site/getSites']
    },
    selectedSite: {
      get () {
        return this.$store.getters['site/getSelectedSiteConfiguration']
      },
      set (site) {
        this.$store.dispatch('site/selectSiteConfiguration', site)
      }
    },
    showSiteField () {
      return this.adminSites.length > 1
    },
    buildings () {
      return this.$store.getters['building/getBuildings']
    },
    selectedBuilding: {
      get () {
        return this.$store.getters['building/getSelectedBuildingConfiguration']
      },
      set (site) {
        this.$store.dispatch('building/selectBuildingConfiguration', site)
      }
    },
    showBuildingField () {
      return this.buildings.length > 1 && (
        (this.splitRoute[this.splitRoute.length - 1] === 'parkings') ||
        (this.splitRoute[this.splitRoute.length - 1] === 'site')
      )
    },
    isBuildingMindsAdmin () {
      return (this.selectedSite && true ? this.selectedSite.buildingMindsID !== null : false)
    }
  },
  watch: {
    selectedSite (site) {
      if (site) {
        this.$store.dispatch('building/loadBuildings', site)
      }
      // if (this.selectedSite !== null) {
      //   this.initialAnonymizationDays = this.selectedSite.anonymizationDaysConfig
      // }
    },
    buildings (buildings) {
      if (buildings.length === 1) {
        this.selectedBuilding = buildings[0]
      } else {
        this.selectedBuilding = null
      }
    },
    sites (sites) {
      this.loadAdminSites(JSON.parse(JSON.stringify(sites)))
    },
    adminSites (value) {
      if (value.length === 1) {
        this.selectedSite = value[0]
      }
    }
  },
  mounted () {
    this.$nuxt.$on('updateTitle', ($event) => {
      this.title = $event
    })
    if (this.sites.length === 0) {
      this.$store.dispatch('site/loadSites')
    } else {
      this.loadAdminSites(this.sites)
    }
    if (this.selectedSite !== null) {
      this.$store.dispatch('building/loadBuildings', this.selectedSite)
    }
  },
  methods: {
    loadAdminSites (sites) {
      const adminSitesIds = this.$store.getters['auth/getAdminSites'].map(s => s.id)
      let adminSites = []
      if (this.sites.length > 0) {
        adminSites = sites.filter(s => adminSitesIds.includes(s.id))
      }
      this.adminSites = adminSites
      this.$store.dispatch('site/setConfigurationSites', adminSites)
    }
  }
}
</script>

<style scoped>
#main {
  padding-bottom: 50px;
}

.module-title {
  padding-left:0;
  margin-top:30px;
  text-transform:capitalize;
  margin-bottom:10px
}
</style>
