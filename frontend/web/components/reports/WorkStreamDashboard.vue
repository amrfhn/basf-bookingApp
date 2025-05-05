<template>
  <div>
    <h1>{{ $t('reports.reportNames.workStreamDashboard') }}</h1>

    <box3 class="searchInputs">
      <ui-grid :columns="3 + showSite + (report.length > 0)" stackable>
        <row>
          <column v-if="showSite">
            <label>{{ $t('searchbox.sitelabel') }}</label>
            <dropdown
              v-if="isManager && isAdmin"
              v-model="site"
              :label-selector="e => e.name"
              :non-selected="$t('searchbox.sitetitle')"
              :options="allSites"
            />
            <dropdown
              v-else-if="isManager"
              v-model="site"
              :label-selector="e => e.name"
              :non-selected="$t('searchbox.sitetitle')"
              :options="sitesManager"
            />
            <dropdown
              v-else-if="isAdmin"
              v-model="site"
              :label-selector="e => e.name"
              :non-selected="$t('searchbox.sitetitle')"
              :options="sitesAdmin"
            />
          </column>
          <column>
            <label>{{ $t('searchbox.from') }}</label>
            <datepicker v-model="initialDate" :language="$i18n.locale" savable />
          </column>
          <column>
            <label>{{ $t('searchbox.to') }}</label>
            <datepicker v-model="finalDate" :language="$i18n.locale" savable />
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
            <th v-for="w of workStreams" :key="w.name">
              <b>{{ w.name }}</b>
            </th>
            <th><b>{{ $t('reports.columnNames.total') }}</b></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in report" :key="r.day">
            <td>{{ r.day }}</td>
            <td v-for="w of workStreams" :key="w.name">
              {{ r.occupation[w.name] ? r.occupation[w.name] : 0 }}%
            </td>
            <td>{{ (r.total).toFixed(2) }}%</td>
          </tr>
        </tbody>
      </table>
    </box3>
  </div>
</template>

<script>

import { EIGHTEEN_SECONDS_IN_MILISEC, newFormatDate } from '@/common/Utils'

export default {
  name: 'WorkStreamDashboard',
  data () {
    return {
      initialDate: new Date(),
      finalDate: new Date(),
      report: [],
      defaultBuilding: null,
      site: null,
      showSite: true,
      workStreams: null
    }
  },
  computed: {
    sitesManager () {
      return this.$store.getters['auth/getManagedSites']
    },
    sitesAdmin () {
      return this.$store.getters['auth/getAdminSites']
    },
    allSites () {
      return [...this.sitesManager, ...this.sitesAdmin]
    },
    isManager () {
      return this.$store.getters['auth/getRoles'].isManager
    },
    isAdmin () {
      return this.$store.getters['auth/getRoles'].isAdmin
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
    this.workStreams = await this.$api.workStream.get()
  },
  methods: {
    setReport (report) {
      this.report = report
      if (this.report.length === 0) {
        this.$console.warn(this.$t('reports.noOccupation'))
      }
      if (this.report[report.length - 1].siteHasNoWorkStreams) {
        this.$console.warn(this.$t('reports.workStreamNoOrgCodeInfo'))
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
        this.$api.report.workStreamDashboard(data).then(this.setReport)
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
        this.$api.report.downloadWorkStreamDashboard(data)
      } else {
        this.$console.warn(this.$t('searchbox.sitetitle'))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  border-bottom: 1px solid lightgray;
}

.searchInputs {
  .buttonFix {
    visibility: hidden;
  }

  button {
    width: 100%;
  }
}

// TODO make Total fixed
.report {
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

    th:nth-child(1) {
      box-shadow: 5px 0 3px -2px #ccc;
      padding-left: 10px;
      background-color: #f3f3f3;
      width: 90px;
      padding-top: 2rem;
      position: absolute;
      z-index: 1;
      height: 88px;
    }

    th:nth-child(2) {
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

    td:nth-child(1) {
      border-bottom: 1px solid lightgray;
      padding-left: 5px;
      box-shadow: 5px 0 3px -2px #ccc;
      position: fixed;
      position: absolute;
      z-index: 1;
      background: #f3f3f3;
      text-align: left;
      padding-right: 1rem;
      font-weight: bold;
    }

    td:nth-child(2) {
      padding-left: 100px;
    }
  }

  tr {
    border-bottom: 1px solid lightgray;
  }
}
</style>
