<template>
  <div>
    <h1>{{ $t('reports.reportNames.teamCancelHistory') }}</h1>
    <box3 class="searchInputs">
      <ui-grid :columns="3 + (report.length > 0)">
        <row v-if="isAdmin && isManager">
          <column>
            <radio v-model="mode" :label="$t('reports.columnNames.manager')" name="mode" r-value="manager" />
            <radio v-model="mode" :label="$t('reports.columnNames.admin')" name="mode" r-value="admin" />
          </column>
        </row>
        <row v-if="showSiteField">
          <column>
            <label>{{ $t('searchbox.sitelabel') }}</label>
            <dropdown v-model="site" :non-selected="$t('searchbox.sitetitle')" :options="sites" :label-selector="e => e.name" />
          </column>
          <column v-if="showBuildingField">
            <label>{{ $t('searchbox.buildinglabel') }}</label>
            <dropdown v-model="building" :non-selected="$t('searchbox.buildingtitle')" :options="buildings" :label-selector="e => e.name" />
          </column>
        </row>
        <row>
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
      <ui-grid :columns="5">
        <row>
          <column><b>{{ $t('reports.columnNames.reservationDate') }}</b></column>
          <column><b>{{ $t('reports.columnNames.name') }}</b></column>
          <column><b>{{ $t('app.floortitle') }}</b></column>
          <column><b>{{ $t('app.seattitle') }}</b></column>
          <column><b>{{ $t('reports.columnNames.cancellationDate') }}</b></column>
        </row>
        <row v-for="r in report" :key="r.username">
          <column>{{ r.reservationDate }}</column>
          <column>{{ r.userFullName }}</column>
          <column>{{ r.floor }}</column>
          <column>{{ r.seat }}</column>
          <column>{{ showDate(r.cancellationDate) }}</column>
        </row>
      </ui-grid>
    </box3>
  </div>
</template>

<script>
import moment from 'moment'

import { newFormatDate, EIGHTEEN_SECONDS_IN_MILISEC } from '@/common/Utils'
const TWENTY_THREE_HOURS = 23
const FIFTY_NINE_MINUTES = 59
const FIFTY_NINE_SECONDS = 59
const NINE_HUNDRED_NINETY_NINE_MILISEC = 999

export default {
  name: 'CancellationReport',
  data () {
    return {
      initialDate: new Date(),
      finalDate: new Date(),
      mode: null,
      report: []
    }
  },
  computed: {
    sites () { return this.$store.getters['cancellationReport/getSites'] },
    buildings () { return this.$store.getters['cancellationReport/getBuildings'] },
    showSiteField () { return this.$store.getters['cancellationReport/getSites'].length >= 1 && this.mode === 'admin' },
    showBuildingField () { return this.buildings.length > 1 && this.mode === 'admin' },
    isAdmin () { return this.$store.getters['auth/getRoles'].isAdmin },
    isManager () { return this.$store.getters['auth/getRoles'].isManager },
    managedSites () { return this.$store.getters['auth/getManagedSites'] },
    site: {
      get () { return this.$store.getters['cancellationReport/getSelectedSite'] },
      set (value) { this.$store.dispatch('cancellationReport/selectSite', value) }
    },
    building: {
      get () { return this.$store.getters['cancellationReport/getSelectedBuilding'] },
      set (value) { this.$store.dispatch('cancellationReport/selectBuilding', value) }
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
    },
    mode () {
      if (this.mode) {
        this.report = []
      }
    }
  },
  mounted () {
    this.$store.dispatch('cancellationReport/loadSites')
    if (this.isManager) {
      this.mode = 'manager'
    } else if (this.isAdmin) {
      this.mode = 'admin'
    } else {
      // No logic in else statement
    }
  },
  methods: {
    showDate (d) {
      return moment(d).format('DD-MM-YYYY, HH:mm')
    },
    setReport (report) {
      this.report = report
      if (this.report.length === 0) {
        this.$console.warn(this.$t('reports.noResults'))
      }
    },
    search () {
      const anonymizedDataUpToDate = new Date()
      const startOfDay = this.initialDate
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = this.finalDate
      endOfDay.setHours(TWENTY_THREE_HOURS, FIFTY_NINE_MINUTES, FIFTY_NINE_SECONDS, NINE_HUNDRED_NINETY_NINE_MILISEC)
      if (this.site !== null && this.site.name === 'Seoul 서울') {
        this.$console.warn(this.$t('reports.disabledReport'), EIGHTEEN_SECONDS_IN_MILISEC) // Shown for 18 seconds
      } else if (this.mode === 'manager') {
        this.managerSearch(anonymizedDataUpToDate)
      } else if (this.site) {
        // Validate if data been brought is previous to data anonymization
        anonymizedDataUpToDate.setDate(anonymizedDataUpToDate.getDate() - this.site.anonymizationDaysConfig)
        if (newFormatDate(this.initialDate) < newFormatDate(anonymizedDataUpToDate)) {
          this.$console.warn(this.$t('reports.anonymizedData'), EIGHTEEN_SECONDS_IN_MILISEC) // Shown for 18 seconds
        } else {
          const data = {
            mode: this.mode,
            building: this.building,
            initialDate: newFormatDate(this.initialDate),
            finalDate: newFormatDate(this.finalDate)
          }
          this.$api.report.cancellationReport(data).then(this.setReport)
        }
      } else {
        this.$console.warn(this.$t('reports.missingInfo'))
      }
    },
    managerSearch (anonymizedDataUpToDate) {
      const isManagerBerlin = this.managedSites.find(o => o.name === 'HUB Berlin')
      const isManagerSeoul = this.managedSites.find(o => o.name === 'Seoul 서울')
      if (isManagerBerlin === undefined && isManagerSeoul === undefined) {
        // Validate if data been brought is previous to data anonymization. The minimum value of all the places the manager manages is taken
        let minAnonDays = this.managedSites[0].anonymizationDaysConfig
        // eslint-disable-next-line no-return-assign
        Object.entries(this.managedSites).forEach((key, _value) =>
          minAnonDays = minAnonDays <= key[1].anonymizationDaysConfig ? minAnonDays : key[1].anonymizationDaysConfig
        )
        anonymizedDataUpToDate.setDate(anonymizedDataUpToDate.getDate() - minAnonDays)
        if (newFormatDate(this.initialDate) < newFormatDate(anonymizedDataUpToDate)) {
          this.$console.warn(this.$t('reports.anonymizedData'), EIGHTEEN_SECONDS_IN_MILISEC) // Shown for 18 seconds
        } else {
          const data = {
            mode: this.mode,
            building: this.building,
            initialDate: newFormatDate(this.initialDate),
            finalDate: newFormatDate(this.finalDate)
          }
          this.$api.report.cancellationReport(data).then(this.setReport)
        }
      } else {
        this.$console.warn(this.$t('reports.disabledReport'))
      }
    },
    convertToExcel () {
      const data = {
        initialDate: newFormatDate(this.initialDate),
        finalDate: newFormatDate(this.finalDate)
      }
      this.$api.report.downloadCancellationReport(data)
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
.report{
  margin-top: 10px;
  .row{
    border-bottom: 1px solid lightgray;
  }
}
</style>
