<template>
  <box3 id="parking-config">
    <accordion v-if="building" class="" :name="'acc1'" :title="$t('configuration.parking.parkings')">
      <btn-positive v-if="site" @click="add">
        <i class="icon plus" /> {{ $t('configuration.parking.add') }}
      </btn-positive>
      <ui-grid :columns="5">
        <row>
          <column :wide="2">
            <b>{{ $t('configuration.parking.floor') }}</b>
          </column>
          <column :wide="2">
            <b>{{ $t('configuration.parking.edit') }}</b>
          </column>
          <column :wide="2">
            <b>{{ $t('configuration.parking.delete') }}</b>
          </column>
          <column :wide="2">
            <b>{{ $t('configuration.hood.colDetails') }}</b>
          </column>
          <column v-if="Object.keys(selectedFloor).length && showMoreDetails" :wide="2">
            <b> {{ $t('configuration.parking.parkingLot') }} </b>
          </column>
          <column v-if="Object.keys(selectedFloor).length && showMoreDetails" :wide="2">
            <b> {{ $t('configuration.parking.assigned') }} </b>
          </column>
        </row>
        <row v-for="parkingFloor in parkingFloors" :key="parkingFloor.id">
          <column :wide="2">
            {{ parkingFloor.number }}
          </column>
          <column :wide="2">
            <btn-primary @click="edit(parkingFloor)">
              <i class="icon pencil alternate" />
            </btn-primary>
          </column>
          <column :wide="2">
            <btn-negative @click="deleteFloor(parkingFloor)">
              <i class="icon fa-trash" />
            </btn-negative>
          </column>
          <column :wide="2">
            <div v-if="Object.keys(selectedFloor).length && selectedFloor.id === parkingFloor.id && showMoreDetails">
              <btn-negative @click="showDetails(parkingFloor)">
                <icon icon="minus" />
              </btn-negative>
            </div>
            <div v-else>
              <btn-secondary @click="showDetails(parkingFloor)">
                <icon icon="add" />
              </btn-secondary>
            </div>
          </column>
          <column v-show="Object.keys(selectedFloor).length && showMoreDetails" :wide="2">
            <div v-if="selectedFloor.id === parkingFloor.id">
              <ui-grid :columns="1">
                <row v-for="pl in parkingLots" :key="pl.code">
                  <column>
                    {{ pl.code }}
                  </column>
                </row>
              </ui-grid>
            </div>
          </column>
          <column v-show="Object.keys(selectedFloor).length && showMoreDetails" :wide="2">
            <div v-if="selectedFloor.id === parkingFloor.id">
              <ui-grid :columns="1">
                <row v-for="pl in parkingLots" :key="pl.code">
                  <column>
                    {{ pl.seatOwners.length + pl.seatPreferables.length }}
                    <!--                  <btn-positive id="assigned">-->
                    <!--                    <icon icon="add" />-->
                    <!--                  </btn-positive>-->
                  </column>
                </row>
              </ui-grid>
            </div>
          </column>
        </row>
      </ui-grid>
      <parking-modal v-if="editing" :parking-floor="parkingFloor" @close="editing=false" @ok="save" />
      <dialog-modal
        :show="deleting"
        :title="$t('modal.dialog')"
        :body="$t('configuration.parking.deletedParkingLotsWarning')"
        closeable
        @close="deleting=false"
        @ok="remove"
      />
    </accordion>
    <a ref="access" />
    <accordion v-if="building" :name="'acc1'" :title="$t('configuration.parking.userAccess')">
      <new-user-access-parking v-model="editableUser" :parking-floors="parkingFloors" :upt="userParkingAccessTable" @refresh="refreshTable" />
      <assigned-parking-table v-if="userParkingAccessTable.length" :key="refreshUserParkingTable" :upt="userParkingAccessTable" @go-section="editAccess" @refresh="refreshTable" />
    </accordion>
    <accordion v-if="building" :name="'acc1'" :title="$t('configuration.bookParking')">
      <ui-grid :columns="3" stackable>
        <column class="field">
          <label>{{ $t('searchbox.from') }}</label>
          <datepicker v-model="startDate" :disabled-dates="disabledDatesFrom" savable :language="$i18n.locale" />
        </column>
        <column class="field">
          <label>{{ $t('searchbox.to') }}</label>
          <datepicker v-model="endDate" :disabled-dates="disabledDatesFrom" savable :language="$i18n.locale" />
        </column>
        <column>
          <label />
          <div class="book-buttons">
            <button class="ui primary button full" @click="search">
              <i class="icon search" />{{ $t('searchbox.search') }}
            </button>
            <button v-if="showBooks" class="ui golden button full" @click="book">
              <i class="icon bell" />{{ $t('searchbox.book') }}
            </button>
          </div>
        </column>
      </ui-grid>
      <ui-grid v-if="showBooks" :columns="4">
        <row>
          <column :wide="2">
            <label>{{ $t('app.datetitle') }}</label>
          </column>
          <column :wide="3">
            <label>{{ $t('searchbox.floorlabel') }}</label>
          </column>
          <column :wide="3">
            <label>{{ $t('configuration.parking.parkingLot') }}</label>
          </column>
          <column :wide="4" />
        </row>
        <row v-for="item in parkings" :key="item.date">
          <column :wide="2">
            <p>{{ item.date.toISOString().slice(0,10) }}</p>
          </column>
          <column v-if="item.floors.length" :wide="3">
            <dropdown v-model="item.floor" :options="item.floors" :label-selector="e => e.number" @change="loadParkingLots(item)" />
          </column>
          <column v-if="item.floor && item.floors.length" :wide="3">
            <dropdown v-model="item.parkingLot" :options="item.parkingLots" :label-selector="e => e.code" style="text-align: left" />
          </column>
          <column v-if="item.floor && item.floors.length" :wide="4">
            <btn-positive v-if="false" @click="showMapModal(item)">
              {{ $t('configuration.parking.viewParkingMap') }}
            </btn-positive>
          </column>
          <column v-if="!item.available" :wide="10">
            {{ $t('configuration.parking.NoAvailableParkingLot') }}
          </column>
          <hr>
        </row>
      </ui-grid>
      <ui-grid>
        <row>
          <column
            :wide="12"
            style="text-align: right;"
          >
            <button id="cancel" class="ui primary button inline" :disabled="disabled" @click="toggleModal">
              <i class="icon fa-calendar-times-o" />
              {{ $t('reservationTable.cancelbtn') }}
            </button>
          </column>
          <column :wide="12">
            <div class="reservation">
              <h2> {{ $t('configuration.cancelParkingAdmin') }} </h2>
              <ui-table class="reservations">
                <thead>
                  <tr>
                    <th>{{ $t('reservationTable.daytitle') }}</th>
                    <th>{{ $t('reservationTable.booksite') }}</th>
                    <th>{{ $t('app.floortitle') }}</th>
                    <th>{{ $t('app.seattitle') }}</th>
                    <th>
                      {{ $t('reservationTable.selectiontitle') }}
                      <input id="selectAllParkingsAdmin" v-model="selectAllParkingsAdmin" type="checkbox" class="inline">
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(preBook, i) in parkingsAdmin" :key="i">
                    <td> {{ preBook.calendar.date }}</td>
                    <td> {{ preBook.seat.area.floor.building.site.name }} </td>
                    <td> {{ preBook.seat.area.floor.number }} </td>
                    <td> {{ preBook.seat.code }} </td>
                    <td>
                      <div class="field">
                        <input v-model="selectedParkingsAdmin" :value="preBook" type="checkbox">
                      </div>
                    </td>
                  </tr>
                </tbody>
              </ui-table>
            </div>
          </column>
        </row>
      </ui-grid>
      <modal
        v-if="loggedUser"
        id="modalOfCancellation"
        :title="$t('reservationTable.modal.title')"
        :show="showModal"
        closeable
        @close="toggleModal"
        @ok="cancelBooks"
      >
        <div id="modalOfCancellationBody">
          {{ loggedUser.full_name }} {{ $t('reservationTable.modal.body') }} <br><br>
          <span v-show="selectedParkingsAdmin && selectedParkingsAdmin.length > 0">
            <ul>
              <li v-for="(pb, i) in selectedParkingsAdmin" :key="i">
                {{ $t('app.floortitle') }} <strong>{{ pb.seat.area.floor.number }}</strong>,
                {{ $t('app.seattitle') }} <strong>{{ pb.seat.code }}</strong>,
                {{ $t('app.datetitle') }} <strong>{{ pb.calendar.date }}</strong>
              </li>
            </ul>
          </span>
          <hr>
          <p>{{ $t('reservationTable.modal.closingmessage') }}</p>
        </div>
      </modal>
    </accordion>
  </box3>
</template>

<script>
import { addDays } from 'basf-gtu-utils/utils/DateUtils'
import DialogModal from '../../components/modals/DialogModal'
import { newFormatDate } from '../../common/Utils'
import { loadParkingLots, loadParkingsForAdmin } from '../../common/ParkingCommon'
import ParkingModal from '../../components/modals/ParkingModal.vue'
import NewUserAccessParking from '@/components/configurations/parking/NewUserAccessParking'
import AssignedParkingTable from '@/components/configurations/parking/AssignedParkingTable'
import { sortByStrAndNumFloorOrSeat } from '@/common/Utils'

export default {
  components: { AssignedParkingTable, ParkingModal, DialogModal, NewUserAccessParking },
  layout: 'configuration',
  data () {
    return {
      deleting: false,
      editing: false,
      parkingFloor: null,
      parkingLots: {},
      showMoreDetails: false,
      selectedFloor: {},
      siteData: null,
      buildingData: null,
      editableUser: null,
      startDate: new Date(),
      endDate: new Date(),
      showBooks: false,
      parkings: [],
      parkingsAdmin: [],
      selectedParkingsAdmin: [],
      showModal: false,
      refreshUserParkingTable: false,
      parkingFloors: [],
      userParkingAccessTable: []
    }
  },
  computed: {
    loggedUser () { return this.$store.getters['auth/getUser'] },
    sites () { return this.$store.getters['site/getSites'] },
    showSiteField () { return this.sites.length > 1 },
    buildings () { return this.$store.getters['building/getBuildings'] },
    showBuildingField () { return this.buildings.length > 1 },
    site: {
      get () { return this.$store.getters['site/getSelectedSiteConfiguration'] },
      set (value) { this.$store.dispatch('site/selectSiteConfiguration', value) }
    },
    building: {
      get () { return this.$store.getters['building/getSelectedBuildingConfiguration'] },
      set (value) { this.$store.dispatch('building/selectBuildingConfiguration', value) }
    },
    selectAllParkingsAdmin: {
      get () { return this.parkingsAdmin ? this.selectedParkingsAdmin.length === this.parkingsAdmin.length : false },
      set (value) {
        this.selectedParkingsAdmin = value ? this.parkingsAdmin.map(b => b) : []
      }
    },
    disabled () {
      const parkingsAdmin = this.selectedParkingsAdmin && this.selectedParkingsAdmin.length > 0
      const enableBtn = parkingsAdmin
      return !enableBtn
    },
    disabledDatesFrom () {
      return () => {
        const lowestDate = addDays(-1)(new Date())
        lowestDate.setHours(lowestDate.getHours())
        return { to: lowestDate }
      }
    }
  },
  watch: {
    building (building) {
      this.loadParkingFloors()
      this.loadUserParkingAccessesTable(building)
    },
    sites (values) {
      let siteId = this.$route.query.siteId
      siteId = siteId ? parseInt(siteId) : null
      this.site = values.find(s => s.id === siteId) || null
    },
    async site () {
      this.parkingFloor = null
      this.loadParkingFloors()
      this.parkingsAdmin = await this.loadParkingAdmin()
    },
    startDate (newDate) {
      if (newDate > this.endDate) {
        this.endDate = newDate
      }
    },
    endDate (newDate) {
      if (newDate < this.startDate) {
        this.startDate = newDate
      }
    }
  },
  mounted () {
    this.$nuxt.$emit('updateTitle', 'configuration.parking.title')
    if (this.building) {
      this.loadUserParkingAccessesTable(this.building)
    }
    this.loadParkingFloors()
  },
  methods: {
    async loadParkingFloors () {
      if (this.building) {
        const floors = await this.$api.floor.getParking({ buildingId: this.building.id })
        this.parkingFloors = sortByStrAndNumFloorOrSeat(floors, true)
      }
    },
    add () {
      this.parkingFloor = { building: { id: this.building.id }, buildingId: this.building.id, startDate: new Date(), typeId: 2 }
      this.editing = true
    },
    edit (pf) {
      const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
      const parkingLots = pf.areas.flatMap(a => a.seats.flatMap(s => s.code))
      pf.parkingLots = parkingLots.sort((a, b) => collator.compare(a.name, b.name))
      this.parkingFloor = pf
      this.showMoreDetails = false
      this.editing = true
    },
    async save (editable) {
      this.parkingFloor = editable
      this.editing = false
      if (!editable.map) {
        editable.map = '-'
      }
      try {
        if (editable.id) {
          await this.$api.floor.update(editable.id, editable)
          this.$console.success(`The floor ${editable.number} was edited successfully`)
        } else if (!(this.parkingFloors.map(p => p.number)).includes(editable.number)) {
          await this.$api.floor.create(editable)
          this.$console.success(`The floor ${editable.number} was created successfully`)
        } else {
          this.$console.warn(`The floor ${editable.number} already exists`)
        }
      } catch (e) {
        this.$console.warn(e)
      }
      this.loadParkingFloors()
    },
    deleteFloor (floor) {
      this.parkingFloor = floor
      this.deleting = true
    },
    async remove () {
      this.deleting = false
      try {
        await this.$api.floor.delete(this.parkingFloor.id)
        this.$console.success(`The floor ${this.parkingFloor.number} was deleted successfully`)
      } catch (e) {
        this.$console.warn(e)
      }
      this.loadParkingFloors()
    },
    showDetails (data) {
      const previousSelectedFloor = this.selectedFloor
      if (this.showMoreDetails) {
        this.showMoreDetails = false
        this.selectedFloor = {}
        this.parkingLots = []
        if (previousSelectedFloor.id === data.id) {
          return
        }
      }
      this.selectedFloor = data
      this.parkingLots = sortByStrAndNumFloorOrSeat(this.selectedFloor.areas.flatMap(s => s.seats), false)
      this.showMoreDetails = true
    },
    editAccess (sectionRef) {
      const element = this.$refs[sectionRef[0]]
      sectionRef[1].isEditing = true
      this.editableUser = sectionRef[1]
      const top = element.offsetTop
      window.scroll({
        top,
        behavior: 'smooth'
      })
    },
    refreshTable () {
      this.loadUserParkingAccessesTable(this.building)
      this.refreshUserParkingTable = !this.refreshUserParkingTable
    },
    async loadUserParkingAccessesTable  (building) {
      this.userParkingAccessTable = []
      if (building) {
        const userParkingAccess = await this.$api.userParkingAccess.get({ siteId: building.siteId })
        let parkingsInBuilding = await this.$api.seat.getParkingsByBuilding({ buildingId: building.id })
        parkingsInBuilding = parkingsInBuilding.filter(f => f.areas.length)
        for (const user of userParkingAccess) {
          user.isOwner = false
          for (const parkingFloor of parkingsInBuilding) {
            for (const parkingLot of parkingFloor.areas[0].seats) {
              if (parkingLot.seatOwners.find(so => so.userId === user.userId)) {
                user.parkingLotFloor = parkingFloor
                user.parkingLot = { code: parkingLot.code, id: parkingLot.id }
                user.parkingLotShowed = parkingFloor.number + ' : ' + parkingLot.code
                user.isOwner = true
              } else if (parkingLot.seatPreferables.find(sp => sp.userId === user.userId)) {
                user.parkingLotFloor = parkingFloor
                user.parkingLot = { code: parkingLot.code, id: parkingLot.id }
                user.parkingLotShowed = parkingFloor.number + ' : ' + parkingLot.code
              }
            }
          }
        }
        this.userParkingAccessTable = userParkingAccess.map((elem) => {
          return elem.user ? elem : { ...elem, user: { full_name: elem.userId } }
        }).sort((a, b) => {
          return a.user.full_name.localeCompare(b.user.full_name)
        })
      }
    },
    async search () {
      if (this.endDate) {
        const loadData = {
          buildingId: this.building.id,
          initialDate: this.startDate,
          finalDate: this.endDate
        }
        this.parkings = await loadParkingsForAdmin(loadData, this)
        this.showBooks = true
      }
    },
    loadParkingLots,
    async book () {
      const parkingsToCreate = this.parkings.map((p) => { return { date: newFormatDate(p.date), seat: p.parkingLot } })
      const book = await this.$api.booking.createParkingBooksAdmin({ parkingsToCreate }).catch(() => console.log('Error booking parkings'))
      if (book) {
        this.parkingsAdmin = await this.loadParkingAdmin()
        this.parkings = []
        this.showBooks = false
      }
      this.loadParkingFloors()
    },
    toggleModal () {
      this.showModal = !this.showModal
    },
    async cancelBooks () {
      const bookIds = this.selectedParkingsAdmin.map((b) => { return b.id })
      await this.$api.booking.deleteMultipleParkingBookingsAdmin({ bookIds })
      this.selectedParkingsAdmin = []
      this.toggleModal()
      this.parkingsAdmin = await this.loadParkingAdmin()
    },
    async loadParkingAdmin () {
      return this.site ? Object.values(await this.$api.booking.getParkingBookingsAdmin(this.site.id)).sort((d1, d2) => (d1.calendar.date).localeCompare(d2.calendar.date)) : null
    }
  }
}
</script>

<!--<style lang="scss">-->
<!--#parking-config {|-->
<!--  .accordion-title {-->
<!--    margin-left: 15px;-->
<!--  }-->
<!--  .svg-container {-->
<!--    padding: 1px !important;-->
<!--    left: 0px !important;-->
<!--  }-->
<!--}-->
<!--</style>-->

<style scoped lang="scss">
.row:not(#bar) {
  border-bottom: 1px solid lightgray;
}
#assigned {
  bottom: -50%;
  left: 40%;
  position: absolute;
}
.golden {
  background-color: #f39501;
  color: #fff;
}
.reservation {
  padding: 5px;
  border: 2px solid #00793A;
  background-color: #D9EBE2;
}
.reservations {
  .genericRow {
    cursor: pointer;
  }
}
#cancel {
  background-color: #c70124;
  margin-bottom: 10px;
}
.book-buttons{
  margin-top: 5px;
}
</style>
