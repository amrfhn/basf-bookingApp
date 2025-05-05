<template>
  <div>
    <h1>{{ $t('reports.reportNames.seatBooking') }}</h1>
    <box3 class="searchInputs">
      <h3>{{ $t('reports.byPeriod') }}</h3>
      <ui-grid :columns="4 + (report.length > 0)" stackable>
        <row>
          <column>
            <label>{{ $t('searchbox.from') }}</label>
            <datepicker v-model="initialDate" savable :language="$i18n.locale" />
          </column>
          <column>
            <label>{{ $t('searchbox.to') }}</label>
            <datepicker v-model="finalDate" savable :language="$i18n.locale" />
          </column>
          <column>
            <label>{{ $t('searchbox.buildinglabel') }}</label>
            <dropdown v-model="building" :non-selected="$t('searchbox.buildinglabel')" :options="buildings" :label-selector="e => e.name" />
          </column>
          <column>
            <label class="buttonFix">.</label>
            <btn-positive @click="search">
              <i class="icon search" />{{ $t('searchbox.search') }}
            </btn-positive>
          </column>
          <column>
            <label class="buttonFix">.</label>
            <btn-positive v-if="report.length > 0" @click="convertToExcelPeriod">
              <i class="icon download" />{{ $t('reports.download') }}
            </btn-positive>
          </column>
        </row>
      </ui-grid>
    </box3>

    <box3 v-if="report && report.length > 0" class="report">
      <ui-grid :columns="8">
        <row>
          <column><b>{{ $t('reports.columnNames.floor') }}</b></column>
          <column><b>{{ $t('reports.columnNames.totalAvailableSeats') }}</b></column>
          <column><b>{{ $t('reports.columnNames.bookings') }}</b></column>
          <column><b>{{ $t('reports.columnNames.bookingAverage') }}</b></column>
          <column><b>{{ $t('reports.columnNames.maxSeatsBookedPercentage') }}</b></column>
          <column><b>{{ $t('reports.columnNames.maxSeatsBooked') }}</b></column>
          <column><b>{{ $t('reports.columnNames.minSeatsBookedPercentage') }}</b></column>
          <column><b>{{ $t('reports.columnNames.minSeatsBooked') }}</b></column>
        </row>
        <row v-for="r in report" :key="r.floorId">
          <column>{{ r.floorNumber }}</column>
          <column>{{ r.totalAvailableSeats }}</column>
          <column>{{ parseInt((r.totalBookedSeats/r.periodDays) / r.totalAvailableSeats * 100) + '%' }}</column>
          <column>{{ Math.round((r.totalBookedSeats/r.periodDays) * 100) / 100 }}</column>
          <column>{{ parseInt(r.minAndMax.max/r.minAndMax.booksPerDate * 100) + '%' }}</column>
          <column>{{ r.minAndMax.max }}</column>
          <column>{{ parseInt(r.minAndMax.min/r.minAndMax.booksPerDate * 100) + '%' }}</column>
          <column>{{ r.minAndMax.min }}</column>
        </row>
      </ui-grid>
    </box3>
    <box3 class="searchInputs">
      <h3>{{ $t('reports.bySpecificDay') }}</h3>
      <ui-grid :columns="4" stackable>
        <row>
          <column>
            <label>{{ $t('searchbox.date') }}</label>
            <datepicker v-model="singleDay" savable :language="$i18n.locale" />
          </column>
          <column>
            <label>{{ $t('searchbox.buildinglabel') }}</label>
            <dropdown v-model="buildingOneDay" :non-selected="$t('searchbox.buildinglabel')" :options="buildings" :label-selector="e => e.name" />
          </column>
          <column>
            <label class="buttonFix">.</label>
            <btn-positive @click="searchByDay">
              <i class="icon search" />{{ $t('searchbox.search') }}
            </btn-positive>
          </column>
          <column>
            <label class="buttonFix">.</label>
            <btn-positive v-if="singleDayReport.length > 0" @click="convertToExcelSpecificDate">
              <i class="icon download" />{{ $t('reports.download') }}
            </btn-positive>
          </column>
        </row>
      </ui-grid>
    </box3>
    <box3 v-if="singleDayReport && singleDayReport.length > 0" class="report">
      <ui-grid :columns="4">
        <row>
          <column><b>{{ $t('reports.columnNames.floor') }}</b></column>
          <column><b>{{ $t('reports.columnNames.totalAvailableSeats') }}</b></column>
          <column><b>{{ $t('reports.columnNames.bookings') }}</b></column>
          <column><b>{{ $t('reports.columnNames.bookedSeats') }}</b></column>
        </row>
        <row v-for="r in singleDayReport" :key="r.floorId">
          <column>{{ r.floorNumber }}</column>
          <column>{{ r.totalAvailableSeats }}</column>
          <column>{{ parseInt(r.totalBookedSeats/r.totalAvailableSeats * 100) + '%' }}</column>
          <column>{{ r.totalBookedSeats }}</column>
        </row>
      </ui-grid>
    </box3>
  </div>
</template>

<script>

import { newFormatDate } from '@/common/Utils'

export default {
  name: 'SeatBooking',
  data () {
    return {
      initialDate: new Date(),
      finalDate: new Date(),
      singleDay: new Date(),
      building: null,
      buildingOneDay: null,
      report: [],
      singleDayReport: []
    }
  },
  computed: {
    buildings () {
      return this.$store.getters['report/getBuildings']
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
  methods: {
    setDateRangeReport (report) {
      this.report = report
      if (this.report.length === 0) {
        this.$console.warn(this.$t('reports.noData'))
      }
      if (this.report[report.length - 1].capacityWarning) {
        this.$console.warn(this.$t('reports.capacityWarning'))
        this.report.pop()
      }
    },
    setDateSingDayReport (report) {
      this.singleDayReport = report
      if (this.singleDayReport.length === 0) {
        this.$console.warn(this.$t('reports.noData'))
      }
    },

    async search () {
      if (!this.building) {
        this.$console.warn(this.$t('reports.missingInfo'))
      } else {
        const data = {
          buildingId: this.building.id,
          initialDate: newFormatDate(this.initialDate),
          finalDate: newFormatDate(this.finalDate)
        }
        const res = await this.$api.report.buildingOccupation(data)
        this.setDateRangeReport(res)
      }
    },
    async searchByDay () {
      if (!this.buildingOneDay) {
        this.$console.warn(this.$t('reports.missingInfo'))
      } else {
        const data = {
          buildingId: this.buildingOneDay.id,
          initialDate: newFormatDate(this.singleDay),
          finalDate: newFormatDate(this.singleDay)
        }
        const res = await this.$api.report.buildingOccupation(data)
        this.setDateSingDayReport(res)
      }
    },
    convertToExcelPeriod () {
      if (this.building) {
        const data = {
          buildingId: this.building.id,
          initialDate: newFormatDate(this.initialDate),
          finalDate: newFormatDate(this.finalDate)
        }
        this.$api.report.downloadSeatBookingHistoryPeriod(data)
      }
    },
    convertToExcelSpecificDate () {
      if (this.buildingOneDay) {
        const data = {
          buildingId: this.buildingOneDay.id,
          initialDate: newFormatDate(this.singleDay),
          finalDate: newFormatDate(this.singleDay)
        }
        this.$api.report.downloadSeatBookingHistoryDay(data)
      } else {
        this.$console.warn(this.$t('reports.missingInfo'))
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
  .column {
    b {
      margin-left: 5px;
    }
  }
  .buttonFix{
    visibility: hidden;
  }
  button{
    width: 100%;
  }
}

.report {
  margin-top: 10px;
  .row {
    border-bottom: 1px solid lightgray;
  }
}

#iconExcel{
float: left;
margin-left: 20%;
}

</style>
