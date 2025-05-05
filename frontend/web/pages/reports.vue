<template>
  <div>
    <div v-if="which === 'out_of_seat_report'">
      <lack-of-seat v-if="isManager || isAdmin" />
    </div>
    <div v-else-if="which === 'team_cancel_history'">
      <cancellation-report v-if="isManager || isAdmin" />
    </div>
    <div v-else-if="which === 'booking_history'">
      <my-bookings-report />
    </div>
    <div v-else-if="which === 'landing_zones_occupation'">
      <landing-zones-occupation v-if="isManager || isAdmin" />
    </div>
    <div v-else-if="which === 'work_stream_dashboard'">
      <work-stream-dashboard v-if="isManager || isAdmin" />
    </div>
    <div v-else-if="which === 'first_aiders'">
      <first-aiders-report />
    </div>
    <div v-else-if="which === 'seat_booking'">
      <SeatBooking v-if="isManager || isAdmin" />
    </div>
  </div>
</template>

<script>
import LackOfSeat from '../components/reports/LackOfSeat'
import CancellationReport from '../components/reports/CancellationReport'
import MyBookingsReport from '../components/reports/MyBookingsReport'
import WorkStreamDashboard from '../components/reports/WorkStreamDashboard'
import LandingZonesOccupation from '../components/reports/LandingZonesOccupation'
import FirstAidersReport from '../components/reports/FirstAidersReport'
import SeatBooking from '../components/reports/SeatBooking'

export default {
  name: 'Reports',
  components: { LandingZonesOccupation, CancellationReport, LackOfSeat, MyBookingsReport, FirstAidersReport, WorkStreamDashboard, SeatBooking },
  async middleware ({ store }) {
    await store.dispatch('auth/waitAuth')
  },
  computed: {
    isManager () {
      const role = this.$store.getters['auth/getRoles']
      return role.isManager
    },
    isAdmin () {
      const role = this.$store.getters['auth/getRoles']
      return role.isAdmin
    },
    which () {
      return Object.keys(this.$route.query)[0] || 'none'
    }
  },
  mounted () {
    this.$store.dispatch('report/loadBuildings')
  }
}
</script>

<style scoped>

</style>
