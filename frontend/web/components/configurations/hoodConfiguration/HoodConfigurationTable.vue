<template>
  <div>
    <div v-if="message" class="warn">
      {{ message }}
    </div>
    <box3>
      <h2>{{ $t('configuration.hood.addHoodBtn') }}</h2>
      <div>
        <ui-grid>
          <row>
            <column :wide="3">
              {{ $t('configuration.hood.colName') }}
            </column>
            <column :wide="6">
              <input v-model="hoodName" class="form-control" :placeholder="hoodName">
            </column>
          </row>
          <row>
            <column :wide="3">
              {{ $t('configuration.hood.addOrgCodeBtn') }}
            </column>
            <column :wide="5">
              <input v-model="orgCodeName" class="form-control" :placeholder="'Type Org Code to add'">
            </column>
            <column :wide="2">
              <btn-positive @click="addOrgCode">
                {{ $t('configuration.hood.addBtn') }}
              </btn-positive>
            </column>
          </row>
        </ui-grid>
      </div>
    </box3>
    <box3 class="report">
      <h3>
        {{ $t('configuration.hood.configurationSubTitle') }}
      </h3>
      <ui-grid :columns="4">
        <row>
          <column :wide="3" />
          <column :wide="4">
            <b>{{ $t('configuration.hood.colOrgCode') }}</b>
          </column>
          <column :wide="2">
            <b>{{ $t('configuration.hood.removeHoodBtn') }}</b>
          </column>
        </row>
        <row v-for="r in orgCodes" :key="r.orgCode">
          <column :wide="3" />
          <column :wide="4">
            {{ r.orgCode }}
          </column>
          <column :wide="2">
            <btn-negative @click="removeOrgCode(r)">
              <i class="icon fa-trash" />
            </btn-negative>
          </column>
        </row>
      </ui-grid>
    </box3>
  </div>
</template>

<script>
import LDAP from 'basf-gtu-utils/client/LDAP'

export default {
  name: 'HoodConfigurationTable',
  props: {
    hoodInfo: { type: Object, required: true },
    creating: { type: Boolean, required: true }
  },
  data () {
    return {
      hoodName: null,
      orgCode: null,
      orgCodes: [],
      orgCodeName: null,
      message: null
    }
  },
  watch: {
    hoodName (name) {
      this.$emit('change-hood-name', name)
    }
  },
  mounted () {
    this.loadInformation()
  },
  methods: {
    async loadInformation () {
      if (!this.creating) {
        this.hoodName = this.hoodInfo.name
        this.orgCodes = await this.$api.hood.getOrgCodes({ hoodId: this.hoodInfo.id })
      }
    },
    removeOrgCode (data) {
      this.orgCodes = this.orgCodes.filter((orgC) => { return orgC.orgCode !== data.orgCode })
      this.$emit('delete-org-code', this.orgCodeName)
    },
    async addOrgCode () {
      if (this.orgCodes.some((org) => { return org.orgCode === this.orgCodeName })) {
        this.message = 'The org code already belongs to the hood'
        setTimeout(() => {
          this.message = null
        }, 3500)
        return
      }
      const isValid = await LDAP.orgCodeExists(encodeURIComponent(this.orgCodeName))
      if (isValid) {
        this.$emit('add-org-code', this.orgCodeName)
        this.orgCodes.push({ orgCode: this.orgCodeName })
        this.orgCodeName = ''
      } else {
        this.message = 'This org code does not exist'
        setTimeout(() => {
          this.message = null
        }, 3500)
      }
    }
  }
}
</script>

<style lang="scss">
.warn {

  width: 100%;
  padding: 8px;
  text-align: center;
  color: white;
  margin-bottom: 10px;
  opacity: 1;
  transition: opacity 0.6s;
  font-size: 15px;
  line-height: 1.5;
  font-weight: 400;
  font-family: sans-serif;
  background-color: #F39500;
  border: 1px solid #bf7600;
}

.report{
   margin-top: 10px;
   .row{
     border-bottom: 1px solid lightgray;
   }
 }
</style>
