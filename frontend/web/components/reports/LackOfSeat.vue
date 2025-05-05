<template>
  <div>
    <h1> {{ $t('reports.reportNames.outOfSeat') }}</h1>
    <box3 class="searchInputs">
      <ui-grid :columns="3 + (report.length > 0)">
        <row>
          <column v-show="isAdmin && isManager">
            <radio v-model="mode" :label="$t('reports.columnNames.manager')" name="mode" r-value="manager" />
            <radio v-model="mode" :label="$t('reports.columnNames.admin')" name="mode" r-value="admin" />
          </column>
        </row>
        <row v-if="showSiteField">
          <column>
            <label>{{ $t('searchbox.sitelabel') }}</label>
            <dropdown v-model="site" :non-selected="$t('searchbox.sitetitle')" :options="sites" :label-selector="e => e.name" />
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
      <ui-grid :columns="4">
        <row>
          <column><b>{{ $t('reports.columnNames.name') }}</b></column>
          <column><b>{{ $t('reports.columnNames.quantity') }}</b></column>
          <column><b>{{ $t('reports.columnNames.details') }}</b></column>
          <column v-if="showMoreDetails">
            <b>{{ $t('reports.columnNames.datesReported') }}</b>
          </column>
        </row>
        <row v-for="r in report" :key="r.username">
          <column>{{ r.userFullName }}</column>
          <column>{{ r.q }}</column>
          <column>
            <btn-positive @click="toggleDetail(r)">
              <icon :class="r.username + ' add' " icon="add" />
              <icon :class="r.username + ' minus hide'" icon="minus" />
            </btn-positive>
          </column>
          <column>
            <ui-grid :class="r.username + ' detail hide'" :columns="1">
              <row v-for="d in r.dates" :key="d">
                <column>{{ d }}</column>
              </row>
            </ui-grid>
          </column>
        </row>
      </ui-grid>
    </box3>
  </div>
</template>

<script>
// import { formatDate } from 'basf-gtu-utils/utils/DateUtils'
// const dateFormat = 'YYYY-MM-DD'

import { newFormatDate, EIGHTEEN_SECONDS_IN_MILISEC } from '@/common/Utils'

export default {
  name: 'LackOfSeat',
  data () {
    return {
      initialDate: new Date(),
      finalDate: new Date(),
      report: [],
      mode: null,
      site: null,
      showMoreDetails: false
    }
  },
  computed: {
    sites () { return this.$store.getters['auth/getAdminSites'] },
    showSiteField () { return this.$store.getters['site/getSites'].length > 1 && this.mode === 'admin' },
    isAdmin () { return this.$store.getters['auth/getRoles'].isAdmin },
    isManager () { return this.$store.getters['auth/getRoles'].isManager },
    managedSites () { return this.$store.getters['auth/getManagedSites'] }
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
        this.site = null
      }
    }
  },
  mounted () {
    this.$store.dispatch('site/loadSites')
    if (this.isManager) {
      this.mode = 'manager'
    } else if (this.isAdmin) {
      this.mode = 'admin'
    } else {
      // No logic in else statement
    }
  },
  methods: {
    setReport (report) {
      this.report = report
      if (this.report.length === 0) {
        this.$console.warn(this.$t('reports.noResults'))
      }
    },
    search () {
      const anonymizedDataUpToDate = new Date()
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
            site: this.site,
            initialDate: newFormatDate(this.initialDate),
            finalDate: newFormatDate(this.finalDate)
          }
          this.$api.report.lackOfSeatReport(data).then(this.setReport)
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
            initialDate: newFormatDate(this.initialDate),
            finalDate: newFormatDate(this.finalDate)
          }
          this.$api.report.lackOfSeatReport(data).then(this.setReport)
        }
      } else {
        this.$console.warn(this.$t('reports.disabledReport'))
      }
    },
    convertToExcel () {
      if (this.site || this.mode === 'manager') {
        const data = {
          mode: this.mode,
          site: this.site,
          initialDate: newFormatDate(this.initialDate),
          finalDate: newFormatDate(this.finalDate)
        }
        this.$api.report.downloadOutOfSeat(data)
      } else {
        this.$console.warn(this.$t('reports.missingInfo'))
      }
    },
    toggleDetail (r) {
      const detail = document.getElementsByClassName(r.username + ' detail')
      const addButton = document.getElementsByClassName(r.username + ' add')
      const minusButton = document.getElementsByClassName(r.username + ' minus')
      for (const b of [addButton[0], minusButton[0]]) {
        if (b.classList.contains('hide')) {
          b.classList.remove('hide')
          b.classList.add('active')
        } else {
          b.classList.add('hide')
          b.classList.remove('active')
        }
      }
      if (detail[0].classList.contains('hide')) {
        detail[0].classList.remove('hide')
      } else {
        detail[0].classList.add('hide')
      }
      const showColumnName = document.getElementsByClassName('minus active')
      if (showColumnName.length !== 0) {
        this.showMoreDetails = true
      } else {
        this.showMoreDetails = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
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
  .row{
    border-bottom: 1px solid lightgray;
  }
}
.hide{
  display:none;
}
.report{
  margin-top: 10px;
}
</style>
