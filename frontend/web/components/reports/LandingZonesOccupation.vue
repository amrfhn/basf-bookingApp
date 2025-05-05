<template>
  <div>
    <h1>{{ $t('reports.reportNames.landingZonesOccupation') }}</h1>

    <box3 class="searchInputs">
      <ui-grid :columns="3 + showSite + (report.length > 0)" stackable>
        <row>
          <column v-if="showSite">
            <label>{{ $t('searchbox.sitelabel') }}</label>
            <dropdown v-if="isManager && isAdmin" v-model="site" :non-selected="$t('searchbox.sitetitle')" :options="allSites" :label-selector="e => e.name" />
            <dropdown v-else-if="isManager" v-model="site" :non-selected="$t('searchbox.sitetitle')" :options="sitesManager" :label-selector="e => e.name" />
            <dropdown v-else-if="isAdmin" v-model="site" :non-selected="$t('searchbox.sitetitle')" :options="sitesAdmin" :label-selector="e => e.name" />
          </column>
          <column>
            <label>{{ $t('searchbox.from') }}</label><datepicker v-model="initialDate" savable :language="$i18n.locale" />
          </column>
          <column>
            <label>{{ $t('searchbox.to') }}</label><datepicker v-model="finalDate" savable :language="$i18n.locale" />
          </column>
          <column>
            <label class="buttonFix">.</label>
            <btn-positive @click="search">
              <i class="icon search" />{{ $t('searchbox.search') }}
            </btn-positive>
          </column>
          <column>
            <label class="buttonFix">.</label>
            <btn-positive v-if="report.length > 0" @click="convertToExcel">
              <i class="icon download" />{{ $t('reports.download') }}
            </btn-positive>
          </column>
        </row>
      </ui-grid>
    </box3>
    <box3 v-if="report.length" class="report">
      <table>
        <thead>
          <tr>
            <th><b>{{ $t('reservationTable.daytitle') }}</b></th>
            <th v-for="h of hoods" :key="h.name">
              <b>{{ h.name }}</b>
            </th>
            <th><b>{{ $t('reports.columnNames.total') }}</b></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in report" :key="r.day">
            <td>{{ r.day }}</td>
            <td v-for="h of hoods" :key="h.name">
              {{ r.occupation[h.name] ? r.occupation[h.name] : 0 }}%
            </td>
            <td>{{ r.total }}%</td>
          </tr>
        </tbody>
      </table>
    </box3>
  </div>
</template>

<script>

import { newFormatDate, EIGHTEEN_SECONDS_IN_MILISEC } from '@/common/Utils'

export default {
  name: 'LandingZonesOccupation',
  data () {
    return {
      initialDate: new Date(),
      finalDate: new Date(),
      report: [],
      defaultBuilding: null,
      showSite: true
    }
  },
  computed: {
    sitesManager () { return this.$store.getters['auth/getManagedSites'] },
    sitesAdmin () { return this.$store.getters['auth/getAdminSites'] },
    allSites () { return [...this.sitesManager, ...this.sitesAdmin] },
    isManager () { return this.$store.getters['auth/getRoles'].isManager },
    isAdmin () { return this.$store.getters['auth/getRoles'].isAdmin },
    hoods () { return this.$store.getters['report/getHoods'] },
    site: {
      get () { return this.$store.getters['report/getSelectedSite'] },
      set (value) {
        this.report = []
        this.$store.dispatch('report/selectSite', value)
      }
    }
  },
  watch: {
    initialDate (newDateFrom) {
      if (this.finalDate < newDateFrom) {
        this.finalDate = newDateFrom
      }
    },
    finalDate (newDateTo) {
      if (this.initialDate > newDateTo) {
        this.initialDate = newDateTo
      }
    }
  },
  async mounted () {
    await this.$store.dispatch('report/init')
  },
  methods: {
    setReport (report) {
      this.report = report
      if (this.report.length === 0) {
        this.$console.warn(this.$t('reports.noOccupation'))
      }
      if (this.report[report.length - 1].siteHasNoLadingZone) {
        this.$console.warn(this.$t('reports.siteWithoutLandingZoneInfo'))
        this.report = []
      }
      if (this.report[report.length - 1].capacityWarning) {
        this.$console.warn(this.$t('reports.capacityWarning'))
        this.report.pop()
      }
    },
    search () {
      if (this.site.name === 'Seoul 서울') {
        this.$console.warn(this.$t('reports.disabledReport'), EIGHTEEN_SECONDS_IN_MILISEC) // Shown for 18 seconds
      } else if (this.site) {
        const data = {
          siteId: this.site.id,
          initialDate: newFormatDate(this.initialDate),
          finalDate: newFormatDate(this.finalDate)
        }
        this.$api.report.landingZonesOccupation(data).then(this.setReport)
      } else {
        this.$console.warn(this.$t('searchbox.sitetitle'))
      }
    },
    convertToExcel () {
      if (this.site) {
        const data = {
          siteId: this.site.id,
          initialDate: newFormatDate(this.initialDate),
          finalDate: newFormatDate(this.finalDate)
        }
        this.$api.report.downloadLandingZonesOccupation(data)
      } else {
        this.$console.warn(this.$t('searchbox.sitetitle'))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
h1{
  border-bottom: 1px solid lightgray;
}
.searchInputs{
  .buttonFix{
    visibility: hidden;
  }
  button{
    width: 100%;
  }
}
// TODO make Total fixed
.report{
  padding: 0 0 10px 0;
  margin-top: 10px;
  overflow-x: scroll;
  border-collapse: collapse;
  thead {
    th {
      height: 90px;
      font-weight: 400;
      padding: 10px;
    }
    th:nth-child(1){
      box-shadow: 5px 0 3px -2px #ccc;
      padding-left: 10px;
      background-color: #f3f3f3;
      width: 90px;
      padding-top: 2rem;
      position: absolute;
      z-index: 1;
      height: 88px;
    }
    th:nth-child(2){
      padding-left: 100px;
    }
  }
  tbody {
    td {
      height: 50px;
      text-align: center;
      padding-top: 1rem;
      padding-bottom: 1rem;
    }
    td:nth-child(1){
      border-bottom: 1px solid lightgray;
      padding-left: 5px;
      box-shadow: 5px 0 3px -2px #ccc;
      position: absolute;
      z-index: 1;
      background: #f3f3f3;
      text-align: left;
      padding-right: 1rem;
    }
    td:nth-child(2){
      padding-left: 100px;
    }

  }
  tr {
    border-bottom: 1px solid lightgray;
  }
}
</style>
