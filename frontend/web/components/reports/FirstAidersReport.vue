<template>
  <div>
    <h1>{{ $t('reports.reportNames.firstAiders') }}</h1>
    <h2> {{ headerDate }}</h2>
    <box3 v-if="todayReport.length" class="report">
      <ui-grid :columns="4">
        <row>
          <column><b>{{ $t('app.floortitle') }}</b></column>
          <column><b>{{ $t('app.areatitle') }}</b></column>
          <column><b>{{ $t('app.seattitle') }}</b></column>
          <column><b>{{ $t('reports.columnNames.name') }}</b></column>
        </row>
        <row v-for="(r, i) in todayReport" :key="i">
          <column>{{ r.floor }} </column>
          <column>{{ r.area }} </column>
          <column>{{ r.seat }}</column>
          <column>{{ r.username }}</column>
        </row>
      </ui-grid>
    </box3>

    <h2>{{ $t('reports.period') }}</h2>
    <box3 class="searchInputs">
      <ui-grid :columns="4 + (report.length > 0)" stackable>
        <row>
          <column>
            <label>{{ $t('searchbox.sitelabel') }}</label>
            <dropdown v-model="site" :non-selected="$t('searchbox.sitetitle')" :options="sites" :label-selector="e => e.name" />
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
      <ui-grid :columns="4">
        <row>
          <column :wide="2">
            <b>{{ $t('suggestionTable.date') }}</b>
          </column>
          <column :wide="2">
            <b>{{ $t('reports.columnNames.quantity') }}</b>
          </column>
          <column :wide="2">
            <b>{{ $t('reports.columnNames.details') }}</b>
          </column>
          <column v-if="Object.keys(selectedBookings).length && report.length && showMoreDetails" :wide="6">
            <ui-grid :columns="5">
              <row class="column-names">
                <column>
                  <b>{{ $t('reports.columnNames.reservationDate') }}</b>
                </column>
                <column>
                  <b>{{ $t('reports.columnNames.name') }}</b>
                </column>
                <column>
                  <b>{{ $t('app.floortitle') }}</b>
                </column>
                <column>
                  <b>{{ $t('app.areatitle') }}</b>
                </column>
                <column>
                  <b>{{ $t('app.seattitle') }}</b>
                </column>
              </row>
            </ui-grid>
          </column>
        </row>

        <row v-for="(v, k) in groupReport" :key="k">
          <column :wide="2">
            {{ k }}
          </column>
          <column :wide="2">
            {{ v.length }}
          </column>
          <column :wide="2">
            <btn-positive @click="toggleDetail(v, k)">
              <icon :class="k +' add' " icon="add" />
              <icon :class="k + ' minus hide'" icon="minus" />
            </btn-positive>
          </column>
          <column v-show="selectedBookings[k] && selectedBookings[k].length" :key="columnKey" :wide="6">
            <ui-grid :columns="5">
              <row v-for="r in v" :key="r">
                <column>
                  {{ r.reservationDate }}
                </column>
                <column>
                  {{ r.username }}
                </column>
                <column>
                  {{ r.floor }}
                </column>
                <column>
                  {{ r.area }}
                </column>
                <column>
                  {{ r.seat }}
                </column>
              </row>
            </ui-grid>
          </column>
        </row>
      </ui-grid>
    </box3>
  </div>
</template>

<script>

import _ from 'lodash'
import { newFormatDate } from '@/common/Utils'

export default {
  name: 'FirstAidersReport',
  data () {
    return {
      initialDate: new Date(),
      finalDate: new Date(),
      report: [],
      defaultBuilding: null,
      site: null,
      floor: null,
      area: null,
      bookings: null,
      todayReport: [],
      showMoreDetails: false,
      selectedBookings: {},
      columnKey: 1
    }
  },
  computed: {
    sites () { return this.$store.getters['site/getSites'] },
    sortedByDateBrigadiersReservations () {
      return [...this.report].sort((d1, d2) => (d1.reservationDate).localeCompare(d2.reservationDate))
    },
    headerDate () {
      return newFormatDate(this.todayReport.reservationDate)
    },
    todayBrigadiers () {
      return Object.values(this.report).filter(n => n.reservationDate === newFormatDate(this.initialDate))
    },
    groupReport () {
      return _.groupBy(this.sortedByDateBrigadiersReservations, a => a.reservationDate)
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
    this.defaultBuilding = await this.$api.building.userLatest().catch(() => null)
    await this.$store.dispatch('site/loadSites')
    if (this.sites.length === 1) {
      this.site = this.sites[0]
    } else if (this.defaultBuilding) {
      try {
        this.site = this.sites.find(s => s.id === this.defaultBuilding.site.id)
        this.loadData()
      } catch (e) {
        console.warn('Default building corresponds to disabled site.')
        this.defaultBuilding = null
        this.site = null
      }
    } else {
      // No logic in else statement
    }
  },
  methods: {
    setReport (report) {
      this.report = report
      if (this.report.length === 0) {
        this.$console.warn(this.$t('reports.noData'))
      }
    },
    setTodayReport (todayReport) {
      this.todayReport = todayReport
      if (this.todayReport.length === 0) {
        this.$console.warn(this.$t('reports.noData'))
      }
    },
    search () {
      if (this.site) {
        const data = {
          site: this.site.id,
          initialDate: newFormatDate(this.initialDate),
          finalDate: newFormatDate(this.finalDate)
        }
        this.$api.report.firstAidersReport(data).then(this.setReport)
      } else {
        this.$console.warn(this.$t('searchbox.sitetitle'))
      }
    },
    toggleDetail (bookingsArray, date) {
      const addButton = document.getElementsByClassName(date + ' add')
      const minusButton = document.getElementsByClassName(date + ' minus')
      for (const b of [minusButton[0], addButton[0]]) {
        if (b.classList.contains('hide')) {
          b.classList.remove('hide')
          b.classList.add('active')
        } else {
          b.classList.add('hide')
          b.classList.remove('active')
        }
      }
      const showColumnName = document.getElementsByClassName('minus active')
      if (showColumnName.length !== 0) {
        this.showMoreDetails = true
      } else {
        this.showMoreDetails = false
      }
      if (!this.selectedBookings[date]) {
        this.selectedBookings[date] = bookingsArray
        this.columnKey++
        return
      }
      if (this.selectedBookings[date] && !this.selectedBookings[date].length) {
        this.selectedBookings[date] = bookingsArray
        this.columnKey++
      } else {
        this.selectedBookings[date] = []
        this.columnKey++
      }
    },
    loadData () {
      const data = {
        site: this.site.id,
        initialDate: newFormatDate(this.initialDate),
        finalDate: newFormatDate(this.finalDate)
      }
      this.$api.report.firstAidersReport(data).then(this.setTodayReport)
    },
    convertToExcel () {
      if (this.site) {
        const data = {
          siteId: this.site.id,
          initialDate: newFormatDate(this.initialDate),
          finalDate: newFormatDate(this.finalDate)
        }
        this.$api.report.downloadFirstAiders(data)
      } else {
        this.$console.warn(this.$t('searchbox.sitetitle'))
      }
    }
  }
}
</script>

<style scoped lang="scss">
h2{
  border-bottom: 1px solid lightgray;
}
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
  .column-names{
    border-bottom: none;
    padding-top: 0px;
  }
}

</style>
