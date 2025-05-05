<template>
  <ui-grid>
    <row>
      <label>{{ $t('searchbox.sitelabel') }}</label>
      <dropdown v-model="site" :non-selected="$t('searchbox.sitetitle')" :options="sites" :label-selector="e => e.name" />
    </row>
    <row>
      <label>
        {{ $t('configuration.superadmin.findUser') }}
        <tooltip :content="$t('general.findUserTooltip')">
          <i class="icon info circle" style="color:#494040" />
        </tooltip>
      </label>
      <ldap-users v-model="user" :caller="getLdap" @input="search" />
    </row>
    <row v-if="showMessage">
      <p>{{ $t('reservationTable.noBooksMessage') }}</p>
    </row>
    <row v-if="showTable" style="display: block">
      <div class="reservation">
        <ui-table class="reservations">
          <thead>
            <tr>
              <th>{{ $t('reservationTable.daytitle') }}</th>
              <th>{{ $t('reservationTable.booksite') }}</th>
              <th>{{ $t('app.floortitle') }}</th>
              <th>{{ $t('app.areatitle') }}</th>
              <th>{{ $t('app.seattitle') }}</th>
              <th>{{ $t('configuration.superadmin.fullName') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(books, i) in sortedByDateColleagueReservations" :key="i">
              <td> {{ books.calendar.date }}</td>
              <td> {{ books.seat.area.floor.building.site.name }} </td>
              <td> {{ books.seat.area.floor.number }} </td>
              <td> {{ books.seat.area.code }} </td>
              <td> {{ books.seat.code }} </td>
              <td> {{ books.full_name }} </td>
            </tr>
          </tbody>
          <tbody />
        </ui-table>
      </div>
    </row>
  </ui-grid>
</template>

<script>
import LDAP from 'basf-gtu-utils/client/LDAP'
import { LDAPSearch } from '../../common/Filters'

export default {
  name: 'FindColleagueModal',
  data () {
    return {
      user: null,
      books: [],
      showTable: false,
      showMessage: false
    }
  },
  computed: {
    token () { return this.$store.getters['auth/token'] },
    sites () { return this.$store.getters['site/getSites'] },
    site: {
      get () { return this.$store.getters['site/getSelectedSiteBooking'] },
      set (value) { this.$store.dispatch('site/selectSiteBooking', value) }
    },
    sortedByDateColleagueReservations () {
      return Object.values(this.books).sort((d1, d2) => (d1.calendar.date).localeCompare(d2.calendar.date))
    }
  },
  mounted () {
    LDAP.authenticate({ federation_token: this.token })
    // LDAP.authenticate({ gitlab_token: process.env.GITLAB_TOKEN })
  },
  methods: {
    async search () {
      if (this.site && this.user) {
        await this.loadData()
        if (this.books.length > 0) {
          this.showTable = true
          this.showMessage = false
        } else {
          this.showMessage = true
          this.showTable = false
        }
      }
    },
    async getLdap (fullName) {
      return await LDAPSearch(fullName, LDAP)
    },
    async loadData () {
      this.books = []
      const userId = this.user.username
      const siteId = this.site.id
      const books = this.books = await this.$api.booking.get({ userId, siteId, future: true })
      books.forEach((books) => { books.full_name = this.user.full_name })
      this.user = null
    }
  }
}
</script>

<style lang="scss" scoped>

#searchBtn {
  width: 100%;
  margin-top: 25px;
  display: inline-block;
}
.reservation {
  border: 2px solid #00793A;
  background-color: #D9EBE2;
}
</style>
