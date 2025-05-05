<!--<template>-->
<!--  <modal-->
<!--    title="Hoods Configuration"-->
<!--    class="EditHoodsModal"-->
<!--    closeable-->
<!--    show-->
<!--    @close="$emit('close')"-->
<!--    @ok="$emit('complete')"-->
<!--  >-->
<!--    <hood-configuration-table :hood-info="hoodInfo" @change="updateValues" />-->
<!--    <hood-location-table :key="locationIndex" :hood-location-info="hoodLocations" />-->
<!--    <template #footer>-->
<!--      <btn-negative @click="$emit('close')">-->
<!--        <i class="icon undo" />-->
<!--        {{ $t('modal.cancel') }}-->
<!--      </btn-negative>-->
<!--      <btn-positive @click="save">-->
<!--        <i class="icon save" />-->
<!--        Save Changes-->
<!--      </btn-positive>-->
<!--    </template>-->
<!--  </modal>-->
<!--</template>-->

<!--<script>-->

<!--import HoodLocationTable from '../configurations/hoodConfiguration/HoodLocationTable'-->
<!--import HoodConfigurationTable from '../configurations/hoodConfiguration/HoodConfigurationTable'-->

<!--export default {-->
<!--  name: 'CreateHoodModal',-->
<!--  components: { HoodConfigurationTable, HoodLocationTable },-->
<!--  props: { hoodInfo: { type: Object, required: true } },-->
<!--  data () {-->
<!--    return {-->
<!--      hoodLocations: [],-->
<!--      locationIndex: 0,-->
<!--      hoodName: null-->
<!--    }-->
<!--  },-->
<!--  fetch () {-->
<!--    this.loadInformation()-->
<!--  },-->
<!--  methods: {-->
<!--    async loadInformation () {-->
<!--      this.hoodLocations = await this.$api.hood.getLocations(this.hoodInfo.id)-->
<!--    },-->
<!--    updateValues (data) {-->
<!--      this.orgCodes = data.orgCodes-->
<!--      this.hoodName = data.hoodName-->
<!--    },-->
<!--    save () {-->
<!--      if (this.hoodName && this.hoodName !== this.hoodInfo.name) {-->
<!--        this.$api.hood.update(this.hoodInfo.id, { name: this.hoodName })-->
<!--      }-->
<!--      this.$api.hood.removeOrgCodes(this.hoodInfo.id, this.$store.getters['hoodConfiguration/getOrgCodeToDelete'])-->
<!--      this.$api.hood.addOrgCodes(this.hoodInfo.id, this.$store.getters['hoodConfiguration/getOrgCodeToAdd'])-->
<!--      this.$store.dispatch('hoodConfiguration/addOrgCodesToDelete', null)-->
<!--      this.$store.dispatch('hoodConfiguration/addOrgCodesToAdd', null)-->
<!--      this.$emit('complete')-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style lang="scss">-->
<!--.EditHoodsModal {-->

<!--  .field {-->
<!--    width: 90%;-->
<!--    padding-top: 8px;-->

<!--    .LDAPSearch {-->
<!--      .suggestionList {-->
<!--        width: 80%;-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--  .ui.grid {-->
<!--    .ui.grid {-->
<!--      .row:first-child {-->
<!--        padding-top: 0;-->
<!--      }-->

<!--      .row:last-child {-->
<!--        padding-bottom: 0;-->
<!--      }-->

<!--    }-->
<!--  }-->
<!--  .notification {-->

<!--    .info, .success, .warn, .error {-->
<!--      width: 100%;-->
<!--      padding: 8px;-->
<!--      text-align: center;-->
<!--      color: white;-->
<!--      margin-bottom: 10px;-->
<!--      opacity: 1;-->
<!--      transition: opacity 0.6s;-->
<!--      font-size: 15px;-->
<!--      line-height: 1.5;-->
<!--      font-weight: 400;-->
<!--      font-family: sans-serif;-->
<!--    }-->

<!--    .warn {-->
<!--      background-color: #F39500;-->
<!--      border: 1px solid #bf7600;-->
<!--    }-->
<!--  }-->
<!--  input {-->
<!--    margin-left: 0;-->
<!--  }-->
<!--}-->

<!--</style>-->
