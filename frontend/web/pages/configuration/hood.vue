<template>
  <div>
    <box3>
      <btn-positive v-if="site" :disabled="isBuildingMindsAdmin" @click="editHood({}, true)">
        <i class="icon plus" />
        {{ $t('configuration.hood.addHoodBtn') }}
      </btn-positive>

      <ui-grid v-if="hoods.length" :columns="5">
        <row>
          <column :wide="2">
            <b>{{ $t('configuration.hood.colName') }}</b>
          </column>
          <column :wide="2">
            <b>{{ $t('configuration.hood.colEdit') }}</b>
          </column>
          <column :wide="2">
            <b>{{ $t('configuration.hood.colDelete') }}</b>
          </column>
          <column :wide="2">
            <b>{{ $t('configuration.hood.colDetails') }}</b>
          </column>
          <column v-if="Object.keys(selectedHood).length && showMoreDetails" :wide="2">
            <b> {{ $t('configuration.hood.colOrgCodes') }} </b>
          </column>
        </row>
        <row v-for="hood in hoods" :key="hood.id">
          <column :wide="2">
            {{ hood.name }}
          </column>
          <column :wide="2">
            <btn-primary :disabled="isBuildingMindsAdmin" @click="editHood(hood, false)">
              <i class="icon pencil alternate" />
            </btn-primary>
          </column>
          <column :wide="2">
            <btn-negative :disabled="isBuildingMindsAdmin" @click="showDeleteHoodModal(hood)">
              <i class="icon fa-trash" />
            </btn-negative>
          </column>
          <column :wide="2">
            <div v-if="Object.keys(selectedHood).length && selectedHood.id === hood.id && !showDeleteModal">
              <btn-negative :disabled="isBuildingMindsAdmin" @click="showDetails(hood)">
                <icon icon="minus" />
              </btn-negative>
            </div>
            <div v-else>
              <btn-secondary :disabled="isBuildingMindsAdmin" @click="showDetails(hood)">
                <icon icon="add" />
              </btn-secondary>
            </div>
          </column>
          <column v-show="Object.keys(selectedHood).length" :wide="2">
            <div v-if="selectedHood.id === hood.id">
              <ui-grid :columns="1">
                <row v-for="org in orgCodes" :key="org.orgCode">
                  <column>
                    {{ org.orgCode }}
                  </column>
                </row>
              </ui-grid>
            </div>
          </column>
        </row>
      </ui-grid>
    </box3>
    <delete-hood-modal v-if="showDeleteModal" :hood-info="selectedHood" @close="closeDeleteModal" @delete="deleteHood" />
    <edit-hood-modal
      v-if="showEditHood"
      :creating="create"
      :hood-info="selectedHood"
      :hoods="hoods"
      @close="closeEditModal"
      @complete="save"
    />
  </div>
</template>

<script>

import DeleteHoodModal from '../../components/modals/DeleteHoodModal'
import EditHoodModal from '../../components/configurations/hoodConfiguration/modals/EditHoodModal'

export default {
  name: 'Hood',
  components: { DeleteHoodModal, EditHoodModal },
  layout: 'configuration',
  data () {
    return {
      showEditHood: false,
      selectedHood: {},
      showMoreDetails: false,
      showDeleteModal: false,
      hoods: [],
      create: false,
      orgCodes: []
    }
  },
  computed: {
    sites () {
      return this.$store.getters['site/getConfigurationSites']
    },
    site: {
      get () {
        return this.$store.getters['site/getSelectedSiteConfiguration']
      },
      set (value) {
        this.$store.dispatch('site/selectSiteConfiguration', value)
      }
    },
    isBuildingMindsAdmin () {
      return (this.site && this.site.buildingMindsID !== null)
    }
  },
  watch: {
    site () {
      this.search()
    }
  },
  mounted () {
    this.$nuxt.$emit('updateTitle', 'configuration.hood.title')
    if (this.site) {
      this.search()
    }
  },
  methods: {
    async showDetails (data) {
      const previousSelectedHood = this.selectedHood
      if (this.showMoreDetails) {
        this.showMoreDetails = false
        this.selectedHood = {}
        this.orgCodes = []
        if (previousSelectedHood.id === data.id) {
          return
        }
      }
      this.selectedHood = data
      this.showMoreDetails = true
      this.orgCodes = await this.$api.hood.getOrgCodes({ hoodId: data.id })
    },
    async search () {
      if (this.site) {
        const data = {
          siteId: this.site.id
        }
        this.hoods = await this.$api.hood.get(data)
        if (this.hoods.length === 0) {
          this.$console.warn('No hoods found for this site')
        }
      } else {
        this.$console.warn('Please select a site')
      }
    },
    editHood (data, create) {
      this.create = create
      this.selectedHood = data
      this.showEditHood = true
    },
    showDeleteHoodModal (data) {
      this.showDeleteModal = true
      this.selectedHood = data
    },
    closeDeleteModal () {
      this.showDeleteModal = false
      if (!this.orgCodes.length) {
        this.selectedHood = {}
      }
    },
    deleteHood () {
      this.hoods = this.hoods.filter((hood) => {
        return hood.id !== this.selectedHood.id
      })
      this.$api.hood.delete(this.selectedHood.id)
      this.selectedHood = {}
      this.showDeleteModal = false
    },
    closeEditModal () {
      this.showEditHood = false
      if (!this.orgCodes.length) {
        this.selectedHood = {}
      }
    },
    save () {
      this.selectedHood = {}
      this.showEditHood = false
      if (this.site) {
        this.search()
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.searchInputs {
  .buttonFix {
    visibility: hidden;
  }
}

.row:not(.site) {
  border-bottom: 1px solid lightgrey;
}

</style>
