<template>
  <box3>
    <template v-if="site && site.buildingMindsID === null">
      <h3>{{ $t('configuration.amenities.createEdit') }}</h3>
      <configurations-amenity-edit v-model="amenity" />
      <btn-negative :disabled="isBuildingMindsAdmin" @click="clear">
        {{ $t('configuration.amenities.clear') }}
      </btn-negative>
      <btn-positive :disabled="isBuildingMindsAdmin" @click="save">
        {{ $t('configuration.amenities.save') }}
      </btn-positive>

      <h2>{{ $t('configuration.amenities.amenities') }}</h2>
    </template>

    <table v-if="site && site.buildingMindsID === null" class="table">
      <thead>
        <tr>
          <th>{{ $t('configuration.amenities.key') }}</th>
          <th>{{ $t('configuration.amenities.type') }}</th>
          <th>{{ $t('configuration.amenities.values') }}</th>
          <th>{{ $t('configuration.amenities.filterable') }}</th>
          <th />
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-if="amenities.length===0">
          <td>{{ $t('configuration.amenities.noResults') }}</td>
        </tr>
        <tr v-for="(a, i) in amenities" :key="i">
          <td> {{ a.key }}</td>
          <td> {{ a.type }}</td>
          <td v-if="a.values" class="ellipse">
            {{ a.values.join(' | ') }}
          </td>
          <td v-else>
            N / A
          </td>

          <td>
            <i v-if="a.filterable" class="icon check" />
          </td>
          <td>
            <btn-primary :disabled="isBuildingMindsAdmin" :title="'Edit: '+ a.name" @click="edit(a)">
              <icon icon="edit" />
            </btn-primary>
          </td>
          <td>
            <btn-negative :disabled="isBuildingMindsAdmin" :title="'Delete: '+ a.name" @click="deleteAmenity(a)">
              <i class="icon fa-trash" />
            </btn-negative>
          </td>
        </tr>
      </tbody>
    </table>
  </box3>
</template>

<script>

export default {
  layout: 'configuration',
  data () {
    return {
      amenity: { name: '', type: null },
      amenities: []
    }
  },
  computed: {
    sites () { return this.$store.getters['site/getSites'] },
    site: {
      get () { return this.$store.getters['site/getSelectedSiteConfiguration'] },
      set (value) { this.$store.dispatch('site/selectSiteConfiguration', value) }
    },
    isBuildingMindsAdmin () {
      return (this.site && this.site.buildingMindsID !== null)
    },
    showSiteField () { return this.sites.length > 1 }
  },
  watch: {
    sites (values) {
      let siteId = this.$route.query.siteId
      siteId = siteId ? parseInt(siteId) : null
      this.site = values.find(s => s.id === siteId) || null
    },
    site () {
      this.clear()
    }
  },
  async mounted () {
    this.$nuxt.$emit('updateTitle', 'configuration.amenities.title')
    await this.loadAmenities()
  },
  methods: {
    async loadAmenities () {
      if (this.site) {
        const amenities = await this.$api.amenities.get({ siteId: this.site.id })
        this.amenities = amenities.sort((a, b) => a.key.localeCompare(b.key))
      }
    },
    async clear () {
      this.amenity = { key: null, type: null, siteId: this.site.id }
      await this.loadAmenities()
    },
    edit (a) {
      this.amenity = JSON.parse(JSON.stringify(a))
    },
    async deleteAmenity (a) {
      await this.$api.amenities.delete(a.id)
      await this.clear()
    },
    async save () {
      if (this.amenity.id) {
        await this.$api.amenities.update(this.amenity.id, this.amenity)
      } else {
        await this.$api.amenities.create(this.amenity)
      }

      await this.clear()
    }
  }
}
</script>

<style lang="scss" scoped>
.svg-container {
  padding: 0;
}

.ellipse{
  text-overflow: ellipsis;
  //white-space: nowrap;
  overflow: hidden;

}

</style>
