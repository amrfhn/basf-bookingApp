<template>
  <div>
    <h1>{{ $t('reports.reportNames.bookingHistory') }}</h1>

    <box-3 class="searchInputs">
      <div v-if="isAdmin" class="manager-admin-container">
        <label>{{ $t('searchbox.selectRole') }}</label>
        <div class="radios-container">
          <radio v-model="roleMode" :label="$t('reports.columnNames.manager')" name="roleMode" r-value="manager" />
          <radio v-model="roleMode" :label="$t('reports.columnNames.admin')" name="roleMode" r-value="admin" />
        </div>
      </div>

      <div v-if="isAdmin && roleMode == 'admin'" class="mode-container">
        <label>{{ $t('searchbox.selectReportType') }}</label>
        <div class="radios-container">
          <radio v-model="reportMode" :label="$t('reports.allBookingHistoryReport')" name="reportMode" r-value="all" />
          <radio v-model="reportMode" :label="$t('reports.parkingHistoryReport')" name="reportMode" r-value="parking" />
        </div>
      </div>

      <div class="filter-container">
        <!-- admin -->
        <div v-if="showSiteField">
          <div>
            <label>{{ $t('searchbox.sitelabel') }}</label>
            <dropdown v-model="site" :non-selected="$t('searchbox.sitetitle')" :options="sites" :label-selector="e => e.name" />
          </div>
          <div v-if="showBuildingField">
            <label>{{ $t('searchbox.buildinglabel') }}</label>
            <dropdown v-model="building" :non-selected="$t('searchbox.buildingtitle')" :options="buildings" :label-selector="e => e.name" />
          </div>
        </div>
        <div class="vdp-container">
          <label>{{ $t('searchbox.from') }}</label>
          <datepicker v-model="initialDate" savable :language="$i18n.locale" />
        </div>
        <div class="vdp-container">
          <label>{{ $t('searchbox.to') }}</label>
          <datepicker v-model="finalDate" savable :language="$i18n.locale" />
        </div>

        <div v-if="isManager && roleMode !== 'admin'">
          <div class="booking-type">
            <radio v-model="mode" :label="$t('reports.columnNames.myBookingHistory')" name="mode" r-value="My booking history" />
            <radio v-model="mode" :label="$t('reports.columnNames.teamBookingHistory')" name="mode" r-value="Team booking history" />
          </div>
          <div />
        </div>

        <div class="search-action">
          <btn-positive @click="search">
            <i class="icon search" />{{ $t('searchbox.search') }}
          </btn-positive>
        </div>
      </div>

      <div v-if="report && report.length > 0" class="progressbar-container">
        <label>{{ $t('reports.status') }}</label>
        <progress-bar2 :value="progressBar" /> <b>{{ progressBarPercentage }} %</b>
        <label v-if="mode === 'My booking history'"> {{ $t('reports.columnNames.ownRate') }}</label>
        <label v-if="mode === 'Team booking history'"> {{ $t('reports.columnNames.teamRate') }}</label>
      </div>
    </box-3>

    <box3 v-if="report && report.length > 0" class="report">
      <div class="download-action">
        <btn-positive v-if="report.length > 0" @click="convertToExcel">
          <i class="icon download" />{{ $t('reports.download') }}
        </btn-positive>
      </div>
      <ui-grid :columns="5">
        <row>
          <column><b>{{ $t('reports.columnNames.reservationDate') }}</b></column>
          <column><b>{{ $t('reports.columnNames.name') }}</b></column>
          <column><b>{{ $t('app.floortitle') }}</b></column>
          <column><b>{{ $t('app.areatitle') }}</b></column>
          <column><b>{{ $t('app.seattitle') }}</b></column>
        </row>
        <row v-for="r in report" :key="r.username">
          <column>{{ r.reservationDate }}</column>
          <column>{{ r.userFullName }}</column>
          <column>{{ r.floor }}</column>
          <column>{{ r.area }}</column>
          <column>{{ r.seat }}</column>
        </row>
      </ui-grid>
    </box3>
  </div>
</template>

<script>

import { newFormatDate, EIGHTEEN_SECONDS_IN_MILISEC } from '@/common/Utils'

const TWO_FRACTION_DIGITS = 2
const ONE_HUNDRED_PERCENT = 100

export default {
  name: 'MyBookingsReport',
  data () {
    return {
      progressBar: 0,
      initialDate: new Date(),
      finalDate: new Date(),
      report: [],
      progressBarPercentage: 0,
      mode: 'My booking history',
      roleMode: 'manager',
      reportMode: 'all'
    }
  },
  computed: {
    teammates () { return this.$store.getters['auth/getTeammates'] },
    isManager () {
      const role = this.$store.getters['auth/getRoles']
      return role.isManager
    },
    sites () { return this.$store.getters['bookingHistoryReport/getSites'] },
    buildings () { return this.$store.getters['bookingHistoryReport/getBuildings'] },
    showSiteField () { return this.$store.getters['bookingHistoryReport/getSites'].length >= 1 && this.roleMode === 'admin' },
    showBuildingField () { return this.buildings.length > 1 && this.roleMode === 'admin' },
    isAdmin () { return this.$store.getters['auth/getRoles'].isAdmin },
    managedSites () { return this.$store.getters['auth/getManagedSites'] },
    site: {
      get () { return this.$store.getters['bookingHistoryReport/getSelectedSite'] },
      set (value) { this.$store.dispatch('bookingHistoryReport/selectSite', value) }
    },
    building: {
      get () { return this.$store.getters['bookingHistoryReport/getSelectedBuilding'] },
      set (value) { this.$store.dispatch('bookingHistoryReport/selectBuilding', value) }
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
    roleMode () {
      if (this.roleMode) {
        this.report = []
        this.progressBar = 0
        this.progressBarPercentage = 0
        this.reportMode = 'all'
      }
    }
  },
  mounted () {
    this.$store.dispatch('bookingHistoryReport/loadSites')
  },
  methods: {
    setReport (report) {
      this.report = report.data
      if (this.roleMode === 'manager') {
        if (this.mode === 'My booking history') {
          this.progressBar = report.data ? report.data.length / report.daysBetweenDates : 0
          this.progressBarPercentage = report.data ? parseFloat(report.data.length / report.daysBetweenDates).toFixed(TWO_FRACTION_DIGITS) * ONE_HUNDRED_PERCENT : 0
        } else if (this.mode === 'Team booking history') {
          this.progressBar = report.data ? (report.booksQuantityReserved / (this.teammates.length * report.daysBetweenDates)) : 0
          this.progressBarPercentage = report.data ? parseFloat((report.booksQuantityReserved / (this.teammates.length * report.daysBetweenDates))).toFixed(TWO_FRACTION_DIGITS) * ONE_HUNDRED_PERCENT : 0
        } else {
          // No logic in else statement
        }
      } else if (this.roleMode === 'admin') {
        this.progressBar = report.data ? (report.booksQuantityReserved / report.bookingsAvailable) : 0
        this.progressBarPercentage = report.data ? parseFloat((report.booksQuantityReserved / report.bookingsAvailable)).toFixed(TWO_FRACTION_DIGITS) * ONE_HUNDRED_PERCENT : 0
      } else {
        // No logic in else statement
      }
      if (this.report.length === 0) {
        this.$console.warn(this.$t('reports.noData'))
      }
    },
    search () {
      this.report = []
      const anonymizedDataUpToDate = new Date()
      if (this.roleMode === 'manager') {
        // Validate if data been brought is previous to data anonymization. The minimum value of all the places the manager manages is taken
        let minAnonDays = this.managedSites[0].anonymizationDaysConfig
        // eslint-disable-next-line no-return-assign
        Object.entries(this.managedSites).forEach((key, _value) =>
          minAnonDays = minAnonDays <= key[1].anonymizationDaysConfig ? minAnonDays : key[1].anonymizationDaysConfig
        )
        anonymizedDataUpToDate.setDate(anonymizedDataUpToDate.getDate() - minAnonDays)
        if (newFormatDate(this.initialDate) < newFormatDate(anonymizedDataUpToDate)) {
          this.$console.warn(this.$t('reports.anonymizedData'), EIGHTEEN_SECONDS_IN_MILISEC) // Shown for 18 seconds
        } else if (this.mode === 'My booking history') {
          const dataBookHistory = {
            initialDate: newFormatDate(this.initialDate),
            finalDate: newFormatDate(this.finalDate)
          }
          this.$api.report.myBookingHistory(dataBookHistory).then(this.setReport)
        } else if (this.mode === 'Team booking history') {
          const isAdminBerlin = this.managedSites.find(o => o.name === 'HUB Berlin')
          if (isAdminBerlin === undefined) {
            const dataMyTeamHistory = {
              initialDate: newFormatDate(this.initialDate),
              finalDate: newFormatDate(this.finalDate),
              teammates: this.teammates
            }
            this.$api.report.myTeamHistory(dataMyTeamHistory).then(this.setReport)
          } else {
            this.$console.warn(this.$t('reports.disabledReport'))
          }
        } else {
          // No logic in else statement
        }
      } else if (this.site) {
        // Validate if data been brought is previous to data anonymization
        anonymizedDataUpToDate.setDate(anonymizedDataUpToDate.getDate() - this.site.anonymizationDaysConfig)
        if (newFormatDate(this.initialDate) < newFormatDate(anonymizedDataUpToDate)) {
          this.$console.warn(this.$t('reports.anonymizedData'), EIGHTEEN_SECONDS_IN_MILISEC) // Shown for 18 seconds
        } else {
          const building = this.$store.getters['bookingHistoryReport/getSelectedBuilding']
          const dataAdminBookHistory = {
            initialDate: newFormatDate(this.initialDate),
            finalDate: newFormatDate(this.finalDate),
            buildingId: building.id,
            isParkingOnly: this.reportMode === 'parking'
          }
          this.$api.report.bookingsAdminHistory(dataAdminBookHistory).then(this.setReport)
        }
      } else {
        this.$console.warn(this.$t('reports.missingInfo'))
      }
    },
    convertToExcel () {
      if (this.roleMode === 'manager') {
        if (this.mode === 'My booking history') {
          const dataMyBookHistory = {
            initialDate: newFormatDate(this.initialDate),
            finalDate: newFormatDate(this.finalDate)
          }
          this.$api.report.downloadBookingHistory(dataMyBookHistory)
        } else if (this.mode === 'Team booking history') {
          const dataMyTeamHistory = {
            initialDate: newFormatDate(this.initialDate),
            finalDate: newFormatDate(this.finalDate),
            teammates: this.teammates
          }
          this.$api.report.downloadBookingHistory(dataMyTeamHistory)
        } else {
          // No logic in else statement
        }
      } else if (this.roleMode === 'admin' && this.site.name !== 'HUB Berlin') {
        const building = this.$store.getters['bookingHistoryReport/getSelectedBuilding']
        const dataAdminBookHistory = {
          initialDate: newFormatDate(this.initialDate),
          finalDate: newFormatDate(this.finalDate),
          buildingId: building.id,
          isParkingOnly: this.reportMode === 'parking'
        }
        this.$api.report.downloadBookingHistory(dataAdminBookHistory)
      } else {
        this.$console.warn(this.$t('reports.disabledReport'))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
h1{
  border-bottom: 1px solid lightgray;
}
.averageLabel {
  margin-left: 5px;
}
.searchInputs{
  display: flex;
  flex-direction: column;
  gap: 10px;

  .radios-container {
    display: flex;
    gap: 10px;
    margin-left: 10px;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 0;
      margin-bottom: 10px;
    }

    .radio {
      margin-bottom: 0;
    }
  }

  .column {
    b {
      margin-left: 5px;
    }
  }
  .buttonFix{
    visibility: hidden;
  }

}

.report {
  margin-top: 10px;
  .row {
    border-bottom: 1px solid lightgray;
  }
}

.search-action {
  margin: auto 0 0 0;
  @media (max-width: 768px) {
    width: 100%;
  }
  .button {
    @media (max-width: 768px) {
      width: 100%;
    }
  }
}

.download-action {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.filter-container {
  display: flex;
  gap: 30px;
  align-items:flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  .vdp-container {
    @media (max-width: 768px) {
      width: 100%;
    }
  }
}

.progressbar-container {
  @media (min-width: 768px) {
    width: 50%;
  }
}
.booking-type {
  display: flex;
  flex-direction: column;

  .radio {
    margin-bottom: 0;
  }
}

</style>
