<template>
  <modal
    v-if="editable && show"
    :title="$t('configuration.workstream.addUpdate')"
    show
    closeable
    @close="close"
    @ok="submit"
  >
    <notification />
    <div class="search-container">
      <label>WorkStream Name</label>
      <input v-model="editable.name">
    </div>

    <hr>
    <table class="table">
      <thead>
        <tr>
          <th><h3>OrgCodes</h3></th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="oc in editable.orgCodes" :key="oc">
          <td>{{ oc }}</td>
          <td>
            <btn-negative @click="remove(oc)">
              <icon icon="trash" />
            </btn-negative>
          </td>
        </tr>
        <tr>
          <td> <input v-model="orgCode" placeholder="OrgCode"> </td>
          <td>
            <btn-primary @click="add">
              <i class="icon plus" />
              {{ $t('configuration.workstream.addOrgCode') }}
            </btn-primary>
          </td>
        </tr>
      </tbody>
    </table>

    <template #footer>
      <btn-negative @click="close">
        <i class="icon times" /> {{ $t('modal.cancel') }}
      </btn-negative>

      <btn-positive :disabled="disableSave" @click="submit">
        <i class="icon check" /> {{ $t('modal.confirm') }}
      </btn-positive>
    </template>
  </modal>
</template>

<script>
import LDAP from 'basf-gtu-utils/client/LDAP'
import Notification from '../layouts/Notification.vue'

export default {
  name: 'WorkStreamModal',
  components: { Notification },
  props: {
    value: { type: null, default: null },
    show: { type: Boolean, required: true }
  },
  data () {
    return {
      editable: null,
      orgCode: null
    }
  },
  computed: {
    disableSave () {
      return !(this.editable.orgCodes && this.editable.orgCodes.length > 0 && this.editable.name && this.editable.name.length > 0)
    }
  },
  watch: {
    value (newValue) {
      this.editable = newValue
    },
    editable: {
      handler (newValue) { this.$emit('input', newValue) },
      deep: true
    }
  },
  mounted () {
    LDAP.authenticate({ federation_token: this.token })
  },
  methods: {
    submit () {
      this.$emit('ok')
    },
    close () {
      this.$emit('close')
    },
    async add () {
      if (!this.editable.orgCodes) { this.editable.orgCodes = [] }
      if (!this.orgCode) { return }
      if (!this.orgCode.length) { return }
      if (this.editable.orgCodes.includes(this.orgCode)) {
        this.$console.warn(`The org code ${this.orgCode} already exists in ${this.editable.name}`)
        this.orgCode = null
        return
      }
      const isValid = await LDAP.orgCodeExists(encodeURIComponent(this.orgCode))
      if (!isValid) {
        this.$console.warn(`Org code ${this.orgCode} not found in LDAP`)
      } else {
        this.editable.orgCodes.push(this.orgCode)
        this.$console.success(`Org code ${this.orgCode} added to ${this.editable.name} `)
      }
      this.orgCode = null
      this.editable = { ...this.editable }
    },
    remove (oc) {
      this.editable.orgCodes = this.editable.orgCodes.filter(o => o !== oc)
      this.editable = { ...this.editable }
    }
  }
}
</script>

<style lang="scss" scoped>
.svg-container {
  padding: 0;
}
.notification {
  position: relative;
}
.container{
  width: 100%;
  min-width: auto;
}

.search-container {
  display: flex;
  flex-direction: column;
  input {
    width: 70%;
  }
}
table {
  input {
    width: 100%;
  }
}
</style>
