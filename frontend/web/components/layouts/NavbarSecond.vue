<template>
  <div class="navbar navbar-default navbar-fixed-top navbar-second">
    <div class="container">
      <div class="navbar-header">
        <button
          type="button"
          class="navbar-toggle form-inline"
          data-toggle="collapse"
          data-target=".main-nav"
        >
          <span class="icon-bar" />
          <span class="icon-bar" />
          <span class="icon-bar" />
        </button>
        <ul class="nav pull-right icons-right">
          <li class="env">
            <label v-if="!isProd">
              Test Environment
            </label>
          </li>
          <li>
            <a title="FoW User Docs" href="https://basf.sharepoint.com/teams/DigitalBuildingTwin/SitePages/FoW---FutureOfWork-desk-booking-app.aspx" target="_blank">
              <i class="icon external alternate" />
            </a>
          </li>
          <li v-show="!authenticated">
            <a :title=" $t('navbar.login')" @click="$sso()">
              <i class="icon lock" />
            </a>
          </li>
          <li class="dropdown">
            <a class="dropdown-toggle" data-toggle="dropdown" href="#" aria-expanded="true">
              <i class="icon globe" /></a>
            <ul class="dropdown-menu">
              <li>
                <nuxt-link :to="switchLocalePath('en')">
                  {{ $t('navbar.lang.en') }}
                </nuxt-link>
              </li>
              <li>
                <nuxt-link :to="switchLocalePath('es')">
                  {{ $t('navbar.lang.es') }}
                </nuxt-link>
              </li>
              <li>
                <nuxt-link :to="switchLocalePath('de')">
                  {{ $t('navbar.lang.de') }}
                </nuxt-link>
              </li>
              <li>
                <nuxt-link :to="switchLocalePath('pt')">
                  {{ $t('navbar.lang.pt') }}
                </nuxt-link>
              </li>
              <li>
                <nuxt-link :to="switchLocalePath('kr')">
                  {{ $t('navbar.lang.kr') }}
                </nuxt-link>
              </li>
            </ul>
          </li>
          <li v-if="authenticated">
            <div id="userpic">
              <img alt="UserPic" :title="fullName" :src="imgData">
            </div>
          </li>
        </ul>
      </div>
      <div class="collapse navbar-collapse main-nav">
        <ul class="nav navbar-nav">
          <li>
            <nuxt-link :to="localePath('/book')">
              <i class="icon home" />
              <b> {{ $t('app.title') }}</b>
            </nuxt-link>
          </li>
          <li v-if="authenticated && admin" class="dropdown">
            <a class="dropdown-toggle" data-toggle="dropdown" href="#" aria-expanded="true">
              {{ $t('reports.columnNames.reservations') }} <span class="caret" /></a>
            <ul class="dropdown-menu">
              <li v-if="authenticated">
                <nuxt-link :to="localePath('/reservation')">
                  {{ $t('reservationTable.pagetitle') }}
                </nuxt-link>
              </li>
              <li v-if="authenticated">
                <nuxt-link :to="localePath('/admin_reservation')">
                  {{ $t('reservationTable.site') }}
                </nuxt-link>
              </li>
            </ul>
          </li>
          <li v-else-if="!admin && authenticated">
            <nuxt-link :to="localePath('/reservation')">
              {{ $t('reservationTable.pagetitle') }}
            </nuxt-link>
          </li>
          <li v-if="authenticated && hasParking && hasParkingAccess">
            <a class="dropdown-toggle" data-toggle="dropdown" href="#" aria-expanded="true">
              {{ $t('configuration.parking.parking') }} <span class="caret" /></a>
            <ul class="dropdown-menu">
              <li v-if="authenticated">
                <nuxt-link :to="localePath('/parking_book')">
                  {{ $t('parkingBook.bookParking') }}
                </nuxt-link>
              </li>
              <li v-if="authenticated">
                <nuxt-link :to="localePath('/parking')">
                  {{ $t('parkingBook.manageParking') }}
                </nuxt-link>
              </li>
            </ul>
          </li>
          <li v-else-if="authenticated && hasParking && !hasParkingAccess">
            <nuxt-link :to="localePath('/parking')">
              {{ $t('parkingBook.manageParking') }}
            </nuxt-link>
          </li>
          <li v-if="authenticated" class="dropdown">
            <a class="dropdown-toggle" data-toggle="dropdown" href="#" aria-expanded="true">
              {{ $t('reports.title') }} <span class="caret" /></a>
            <ul class="dropdown-menu">
              <li v-if="isManager || isAdmin">
                <nuxt-link :to="localePath('/reports?out_of_seat_report')">
                  {{ $t('reports.reportNames.outOfSeat') }}
                </nuxt-link>
              </li>
              <li v-if="isManager || isAdmin">
                <nuxt-link :to="localePath('/reports?team_cancel_history')">
                  {{ $t('reports.reportNames.teamCancelHistory') }}
                </nuxt-link>
              </li>
              <li>
                <nuxt-link :to="localePath('/reports?booking_history')">
                  {{ $t('reports.reportNames.bookingHistory') }}
                </nuxt-link>
              </li>
              <li v-if="isManager || isAdmin">
                <nuxt-link :to="localePath('/reports?landing_zones_occupation')">
                  {{ $t('reports.reportNames.landingZonesOccupation') }}
                </nuxt-link>
              </li>
              <li v-if="isManager || isAdmin">
                <nuxt-link :to="localePath('/reports?work_stream_dashboard')">
                  {{ $t('reports.reportNames.workStreamDashboard') }}
                </nuxt-link>
              </li>
              <li>
                <nuxt-link :to="localePath('/reports?first_aiders')">
                  {{ $t('reports.reportNames.firstAiders') }}
                </nuxt-link>
              </li>
              <li v-if="isManager || isAdmin">
                <nuxt-link :to="localePath('/reports?seat_booking')">
                  {{ $t('reports.reportNames.seatBooking') }}
                </nuxt-link>
              </li>
            </ul>
          </li>
          <li v-if="authenticated && (isAdmin || superAdmin)" class="dropdown">
            <nuxt-link :to="localePath('/configuration/site')">
              {{ $t('navbar.configuration') }}
            </nuxt-link>
          </li>
          <li v-if="authenticated">
            <nuxt-link :to="localePath('/about')">
              {{ $t('about.title') }}
            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>
    <notification />
  </div>
</template>

<script>
import Notification from '@/components/layouts/Notification'
export default {
  name: 'NavbarSecond',
  components: { Notification },
  computed: {
    superAdmin () {
      return this.$store.getters['auth/getRoles'].isSuperAdmin
    },
    admin () {
      return this.$store.getters['auth/getRoles'].isAdmin
    },
    authenticated () {
      return this.$store.getters['auth/isAuthenticated']
    },
    imgData () {
      const username = this.$store.getters['auth/getUsername']
      return 'https://app.roqs.basf.net/user_picture_api/image/' + username
    },
    fullName () {
      return this.$store.getters['auth/getUser'].full_name
    },
    isManager () {
      const role = this.$store.getters['auth/getRoles']
      return role.isManager
    },
    isAdmin () {
      const role = this.$store.getters['auth/getRoles']
      return role.isAdmin
    },
    hasParking () {
      return this.$store.getters['auth/getParkingAccesses'].length
    },
    isProd () {
      return window.location.host === 'app.roqs.basf.net'
    },
    hasParkingAccess () {
      return this.$store.getters['auth/getParkingAccesses'].hasAccess
    }
  },
  updated () {
    const collapse = document.getElementsByClassName('collapse in')
    if (collapse.length !== 0) {
      document.getElementsByClassName('navbar-toggle form-inline')[0].click()
    }
  }
}
</script>

<style scoped lang="scss">
.env {
  color: #0ea432;
  font-size: 20px
}
.icons-right {
  display: flex;
  position: absolute;
  right: 1em;
  align-items: center;
  height: 50px;
  a {
    i {
      font-size: 17px;
    }
  }
  #userpic {
    margin: 0 7px 0 7px;

    img {
      width: 30px;
      border-radius: 50%;
    }
  }
}
</style>
