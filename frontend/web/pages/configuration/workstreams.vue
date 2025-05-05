<template>
  <box3>
    <btn-positive v-if="site" @click="add">
      <i class="icon plus" /> {{ $t('configuration.workstream.add') }}
    </btn-positive>
    <table v-if="site" class="table">
      <thead>
        <tr>
          <th><h3>{{ $t('configuration.workstream.workstream') }}</h3></th>
          <th />
          <th />
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-if="workStreams !== null && workStreams.length===0">
          <td> No results </td>
        </tr>
        <template v-for="(ws, i) in workStreams">
          <tr :key="i">
            <td> {{ ws.name }}</td>
            <td>
              <btn-primary :title="'Edit: '+ ws.name" @click="edit(ws)">
                <i class="icon pencil alternate" />
              </btn-primary>
            </td>
            <td>
              <btn-negative :title="'Delete: '+ ws.name" @click="deleteWS(ws)">
                <i class="icon fa-trash" />
              </btn-negative>
            </td>
            <td>
              <btn-secondary :title="'Details: '+ ws.name" @click="toggleDetails(ws.id)">
                <icon v-if="details[ws.id]" icon="minus" />
                <icon v-else icon="add" />
              </btn-secondary>
            </td>
          </tr>
          <template v-if="details[ws.id]">
            <tr v-for="oc in ws.orgCodes" :key="oc" :ref="'details'+ws.id">
              <td>{{ oc }}</td><td /><td /><td />
            </tr>
          </template>
        </template>
      </tbody>
    </table>

    <dialog-modal :show="deleting" title="Are you Sure?" closeable @close="deleting=false" @ok="remove" />
    <work-stream-modal v-model="workStream" :show="editing" @close="editing=false" @ok="save" />
  </box3>
</template>

<script>
import DialogModal from '../../components/modals/DialogModal'
import WorkStreamModal from '../../components/modals/WorkStreamModal.vue'

export default {
  components: { WorkStreamModal, DialogModal },
  layout: 'configuration',
  data () {
    return {
      deleting: false,
      editing: false,
      workStream: null,
      details: {},
      workStreams: null
    }
  },
  computed: {
    site: {
      get () { return this.$store.getters['site/getSelectedSiteConfiguration'] },
      set (value) { this.$store.dispatch('site/selectSiteConfiguration', value) }
    },
    showSiteField () { return this.$store.getters['site/getConfigurationSites'].length > 1 }
  },
  watch: {
    site () {
      this.workStream = null
      this.loadWorkstreams()
    }
  },
  mounted () {
    this.$nuxt.$emit('updateTitle', 'configuration.workstream.title')
    this.loadWorkstreams()
  },
  methods: {
    async loadWorkstreams () {
      this.workStreams = null
      if (this.site) {
        const siteWorkStreams = await this.$api.workStream.get({ siteId: this.site.id })
        this.workStreams = siteWorkStreams.sort((a, b) => a.name.localeCompare(b.name))
      }
    },
    add () {
      this.workStream = { siteId: this.site.id }
      this.editing = true
    },
    edit (ws) {
      this.workStream = JSON.parse(JSON.stringify(ws))
      this.editing = true
    },
    async save () {
      this.editing = false
      if (this.workStream.id) {
        await this.$api.workStream.update(this.workStream.id, this.workStream)
      } else {
        await this.$api.workStream.create(this.workStream)
      }
      this.workStream = null
      this.loadWorkstreams()
    },
    deleteWS (ws) {
      this.workStream = ws
      this.deleting = true
    },
    async remove () {
      await this.$api.workStream.delete(this.workStream.id)
      this.deleting = false
      this.loadWorkstreams()
    },
    toggleDetails (id) {
      this.details = { ...this.details, [id]: !this.details[id] }
    }
  }
}
</script>

<style lang="scss" scoped>
.svg-container {
  padding: 0;
}
.positive {
  margin-bottom: 10px;
  width: max-content;
}

</style>
