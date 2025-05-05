<template>
  <modal
    :title="$t('configuration.hood.title')"
    class="EditHoodsModal"
    closeable
    show
    @close="$emit('close')"
    @ok="$emit('complete')"
  >
    <div v-if="message" class="warn">
      {{ message }}
    </div>
    <hood-configuration-table
      :creating="creating"
      :hood-info="hoodInfo"
      @change-hood-name="updateHoodName"
      @delete-org-code="addOrgCodeToDelete"
      @add-org-code="addOrgCodeToAdd"
    />
    <hood-location-table v-if="!creating" :hood-info="hoodInfo" />
    <template #footer>
      <btn-negative @click="$emit('close')">
        <i class="icon cancel" />
        {{ $t('modal.close') }}
      </btn-negative>
      <btn-positive @click="save">
        <i class="icon save" />
        {{ $t('configuration.hood.saveChangesBtn') }}
      </btn-positive>
    </template>
  </modal>
</template>

<script>

import HoodLocationTable from '../HoodLocationTable'
import HoodConfigurationTable from '../HoodConfigurationTable'

export default {
  name: 'EditHoodModal',
  components: { HoodConfigurationTable, HoodLocationTable },
  props: {
    hoodInfo: { type: Object, required: true },
    creating: { type: Boolean, required: true },
    hoods: { type: Array, required: true }
  },
  data () {
    return {
      hoodName: null,
      message: null,
      orgCodesToAdd: [],
      orgCodesToDelete: []
    }
  },
  methods: {
    updateHoodName (hoodName) {
      this.hoodName = hoodName
    },
    addOrgCodeToDelete (orgCodeName) {
      if (this.orgCodesToDelete.includes(orgCodeName) !== -1) {
        this.orgCodesToDelete.push(orgCodeName)
      }
    },
    addOrgCodeToAdd (orgCodeName) {
      if (this.orgCodesToAdd.includes(orgCodeName) !== -1) {
        this.orgCodesToAdd.push(orgCodeName)
      }
    },
    async save () {
      if (this.hoodName) {
        if (!this.hoods.some(h => h.name === this.hoodName) || !this.creating) {
          if (!this.creating) {
            await this.$api.hood.update(this.hoodInfo.id, { name: this.hoodName })
            await this.updateOrgCodes(this.hoodInfo.id)
          } else {
            const newHoodInfo = await this.$api.hood.create({
              name: this.hoodName,
              siteId: this.$store.getters['site/getSelectedSiteConfiguration'].id
            })
            await this.updateOrgCodes(newHoodInfo.id)
          }
        } else {
          this.message = 'Hood name already exists'
          setTimeout(() => {
            this.message = null
          }, 3500)
        }
      } else {
        this.message = 'Hood name cannot be empty'
        setTimeout(() => {
          this.message = null
        }, 3500)
      }
    },
    async updateOrgCodes (hoodId) {
      if (this.orgCodesToAdd.length) {
        await this.$api.hood.addOrgCodes(hoodId, this.orgCodesToAdd)
        this.orgCodesToAdd = []
      }
      if (this.orgCodesToDelete) {
        await this.$api.hood.removeOrgCodes(hoodId, this.orgCodesToDelete)
        this.orgCodesToDelete = []
      }
      this.$emit('complete')
    }

  }
}
</script>

<style lang="scss">
.EditHoodsModal {

  .field {
    width: 90%;
    padding-top: 8px;

    .LDAPSearch {
      .suggestionList {
        width: 80%;
      }
    }

  }

  .ui.grid {
    .ui.grid {
      .row:first-child {
        padding-top: 0;
      }

      .row:last-child {
        padding-bottom: 0;
      }

    }
  }

  .notification {

    .info, .success, .warn, .error {
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
    }

    .warn {
      background-color: #F39500;
      border: 1px solid #bf7600;
    }
  }

  input {
    margin-left: 0;
  }
}

</style>
