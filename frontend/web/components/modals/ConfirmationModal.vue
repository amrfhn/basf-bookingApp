<template>
  <div>
    <modal
      v-if="isBooking || isQuickBooking"
      :body="mode"
      :title="$t('mainpage.confirmationModal.title')"
      closeable
      show
      :is-loading="isLoading"
      @close="close"
      @ok="confirm"
    >
      <b>{{ loggedUser.full_name }}, {{ $t('mainpage.confirmationModal.selectionTitle') }}</b>
      <br><br>
      <ul>
        <li>
          {{ $t('mainpage.confirmationModal.period') }}<strong>{{ startDate | formatDate }} - {{
            endDate | formatDate
          }}</strong>
        </li>
        <li>{{ $t('mainpage.confirmationModal.site') }} <strong>{{ site.name }}</strong></li>
        <li>{{ $t('mainpage.confirmationModal.building') }} <strong>{{ building.name }}</strong></li>
        <li v-if="!isQuickBooking">
          {{ $t('mainpage.confirmationModal.floor') }} <strong>{{ floor.number }}</strong>
        </li>
        <li v-if="!isQuickBooking">
          {{ $t('mainpage.confirmationModal.area') }} <strong>{{ area.code }}</strong>
        </li>
        <template v-for="s of selectedSeats">
          <li :key="s.id">
            {{ $t('mainpage.confirmationModal.seatNumber') }}<strong>{{ s.code }}</strong>
            <ul v-if="s.amenities">
              <li v-for="(elem, i) in availableAmenities(s.amenities)" :key="i">
                <template v-if="(elem.type ==='BOOLEAN')">
                  {{ dk(elem.key) }}
                </template>
                <template v-if="elem.type ==='NUMERIC'">
                  {{ dk(elem.key) }}: {{ elem.numericValue }}
                </template>
                <template v-if="elem.type ==='MULTI'">
                  {{ dk(elem.key) }}: {{ dk(elem.multiValue) }}
                </template>
              </li>
            </ul>
          </li>
        </template>
      </ul>
      <div v-if="mode === 'onBehalfOf'">
        <hr>
        <column class="field">
          <p>
            <b>
              {{ $t('mainpage.confirmationModal.thirdParty') }}
            </b>
          </p>
        </column>
        <column class="field">
          <radio
            v-model="userType"
            :label="$t('mainpage.confirmationModal.internal')"
            name="userType"
            r-value="internal"
          />
          <!-- <radio v-model="userType" :label="$t('mainpage.confirmationModal.external')" name="userType" r-value="external" />-->
        </column>
        <column v-if="userType === 'internal' && onBehalfOfUser === null">
          <label>
            {{ $t('configuration.superadmin.findUser') }}
            <tooltip :content="$t('general.findUserTooltip')">
              <i class="icon info circle" style="color:#494040" />
            </tooltip>
          </label>
          <ldap-users :key="ldapKey" :caller="getLdap" @input="addUser" />
        </column>
        <column v-if="userType === 'internal' && onBehalfOfUser != null">
          <ui-table>
            <tbody>
              <tr>
                <td><img id="photo" :src="onBehalfOfUser.image"></td>
                <td>{{ onBehalfOfUser.full_name }}</td>
                <td>{{ onBehalfOfUser.mail }}</td>
                <td>
                  <btn-negative @click="removeUser()">
                    <icon id="icon" icon="trash" />
                  </btn-negative>
                </td>
              </tr>
            </tbody>
          </ui-table>
        </column>
      </div>
      <div v-if="allowParkingReservation && !isQuickBooking">
        <hr>
        <input id="parkingLotBooking" v-model="bookParkingCheck" type="checkbox">
        <label for="parkingLotBooking" style="font-size: 16px;">{{
          $t('mainpage.confirmationModal.wantBookParkingLot')
        }}</label>
        <ui-grid v-if="bookParkingCheck" :columns="4">
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
          <row v-for="(item,i) in parkings" :key="i">
            <column :wide="2">
              <p>{{ item.date.toISOString().slice(0, 10) }}</p>
            </column>
            <column v-if="item.authorized && item.floors.length && !item.booked" :wide="3">
              <dropdown
                v-model="item.floor"
                :label-selector="e => e.number"
                :options="item.floors"
                @change="loadParkingLots(item)"
              />
            </column>
            <column v-if="item.authorized && item.floor && item.floors.length && !item.booked" :wide="3">
              <dropdown
                v-model="item.parkingLot"
                :label-selector="e => e.code"
                :options="item.parkingLots"
                style="text-align: left"
              />
            </column>
            <column v-if="item.authorized && item.floor && item.floors.length && !item.booked" :wide="4">
              <btn-positive :disabled="isDisadisbled(item)" @click="showMapModal(item)">
                {{ $t('configuration.parking.viewParkingMap') }}
              </btn-positive>
            </column>
            <column v-if="item.booked && item.authorized" :wide="10">
              {{ $t('configuration.parking.parkingBookingAlreadyExists') }}
            </column>
            <column v-if="!item.authorized" :wide="10">
              {{ $t('configuration.parking.NotAuthorizedParkingLot') }}
            </column>
            <column v-if="!item.available" :wide="10">
              {{ $t('configuration.parking.NoAvailableParkingLot') }}
            </column>
            <hr>
          </row>
        </ui-grid>
      </div>
      <hr>
      <p class="safety">
        {{ $t('mainpage.confirmationModal.body') }}
      </p>
      <p>{{ $t('mainpage.confirmationModal.cancelMessage', {'cancellationHours': building.cancellationHours}) }}</p>
    </modal>
    <modal
      v-if="showFloorMap"
      closeable
      show
      title="Parking Floor Map"
      @close="closeMapModal"
      @ok="closeMapModal"
    >
      <div>
        <svg-pan-zoom v-if="isSvgImageFormat" :image-path="image" object-id="parkingMap" />
        <img v-else :src="image" alt="parking-map" class="map">
      </div>
    </modal>
  </div>
</template>

<script>
import LDAP from 'basf-gtu-utils/client/LDAP'
import { availableAmenities, LDAPSearch } from '../../common/Filters'
import { loadParkingLots, loadParkings, userAllowedForParkingReservation } from '../../common/ParkingCommon'
import { newFormatDate } from '@/common/Utils'

export default {
  name: 'ConfirmationModal',
  filters: {
    formatDate (date) {
      if (date != null) {
        return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()
      }
    }
  },
  data () {
    return {
      startDate: null,
      endDate: null,
      mode: null,
      isBooking: false,
      ldapKey: 0,
      onBehalfOfUser: null,
      userType: 'internal',
      userParkingInfoOnBehalf: null,
      parkingCheck: false,
      parkings: [],
      userParkingAccesses: null,
      allowParkingReservation: false,
      showFloorMap: false,
      image: null,
      isSvgImageFormat: true,
      confirmationButtonClicked: false,
      isQuickBooking: false,
      isLoading: false
    }
  },
  computed: {
    token () {
      return this.$store.getters['auth/token']
    },
    loggedUser () {
      return this.$store.getters['auth/getUser']
    },
    site () {
      return this.$store.getters['site/getSelectedSiteBooking']
    },
    building () {
      return this.$store.getters['building/getSelectedBuildingBooking']
    },
    floor () {
      return this.$store.getters['floor/getSelectedFloorBooking']
    },
    area () {
      return this.$store.getters['floor/getSelectedAreaBooking']
    },
    selectedSeats () {
      return this.$store.getters['seat/getSelectedSeatsBooking']
    },
    hasParkingAccess () {
      return this.$store.getters['auth/getParkingAccesses'].hasAccess
    },
    bookParkingCheck: {
      get () {
        return this.parkingCheck
      },
      set (value) {
        this.parkingCheck = value
      }
    }
  },
  watch: {
    // async endDate () {
    //   if (this.mode === 'self') {
    //     this.userParkingAccesses = await this.$api.userParkingAccess.getUserInfo(this.loggedUser.username, this.building.id)
    //     this.allowParkingReservation = userAllowedForParkingReservation(newFormatDate(this.startDate), newFormatDate(this.endDate), this.userParkingAccesses, this.site.id)
    //     if (this.allowParkingReservation) {
    //       await this.getParkings(this.userParkingAccesses)
    //     }
    //   }
    // },
    async isBooking (value) {
      if (value) {
        if (this.mode === 'self') {
          this.userParkingAccesses = await this.$api.userParkingAccess.getUserInfo(this.loggedUser.username, this.building.id)
          this.allowParkingReservation = userAllowedForParkingReservation(newFormatDate(this.startDate), newFormatDate(this.endDate), this.userParkingAccesses, this.site.id)
          if (this.allowParkingReservation) {
            await this.getParkings(this.userParkingAccesses)
          }
        }
      }
    },
    userType (value) {
      this.userType = value
    }
  },
  mounted () {
    LDAP.authenticate({ federation_token: this.token })
    this.$nuxt.$on('book', this.setIsBooking)
    this.$nuxt.$on('quickbook', this.setIsQuickBooking)
  },
  methods: {
    setIsBooking (value) {
      this.isBooking = value.isBooking
      this.startDate = value.startDate
      this.endDate = value.endDate
      this.mode = value.mode
    },
    setIsQuickBooking (value) {
      this.isQuickBooking = value.isQuickBooking
      this.startDate = value.startDate
      this.endDate = value.endDate
      this.mode = value.mode
    },
    async getLdap (fullName) {
      return await LDAPSearch(fullName, LDAP)
    },
    async addUser (newUser) {
      this.onBehalfOfUser = newUser
      this.ldapKey += 2
      this.userParkingInfoOnBehalf = await this.$api.userParkingAccess.getUserInfo(this.onBehalfOfUser.username, this.building.id)
      this.allowParkingReservation = userAllowedForParkingReservation(newFormatDate(this.startDate), newFormatDate(this.endDate), this.userParkingInfoOnBehalf, this.site.id)
      if (this.allowParkingReservation) {
        await this.getParkings(this.userParkingInfoOnBehalf)
      }
    },
    removeUser () {
      this.onBehalfOfUser = null
      this.userParkingInfoOnBehalf = null
    },
    availableAmenities,
    async getParkings (userInfo) {
      if (this.endDate && (this.mode === 'self' || this.mode === 'onBehalfOf') && !this.isQuickBooking && this.allowParkingReservation) {
        const loadData = {
          buildingId: this.building.id,
          initialDate: this.startDate,
          finalDate: this.endDate,
          user: userInfo
        }
        this.parkings = await loadParkings(loadData, this)
      }
    },
    loadParkingLots,
    showMapModal (item) {
      const map = item.floor.map
      const imageData = map.split(';')[0]
      const contentType = imageData.split(':')[1]
      const b64Data = map.split(',')[1]
      const byteCharacters = atob(b64Data)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: contentType })
      const urlCreator = window.URL || window.webkitURL
      const imageUrl = urlCreator.createObjectURL(blob)
      this.isSvgImageFormat = contentType.includes('svg')
      this.image = imageUrl
      this.showFloorMap = true
    },
    closeMapModal () {
      this.showFloorMap = false
    },
    isDisadisbled (item) {
      if (item.floor.map !== '-') {
        return false
      }
      return true
    },
    async confirm () {
      if (!this.confirmationButtonClicked) {
        this.confirmationButtonClicked = true
        this.isLoading = true

        const seatIds = this.selectedSeats.flatMap(s => s.id)
        const initialDate = newFormatDate(this.startDate)
        const finalDate = newFormatDate(this.endDate)
        let method = ''
        let data = {}
        if (this.isQuickBooking) {
          method = 'quickbook'
          data = { initialDate, finalDate, siteId: this.site.id, buildingId: this.building.id, parking: false, onBehalfOf: false, siteName: this.site.name }
          return await this.$api.booking[method](data).then(() => {
            this.clean()
            this.removeUser()
            this.confirmationButtonClicked = false
            this.isLoading = false
            this.$console.success(this.$dk('mainpage.confirmationModal.bookSuccess'))
          }).catch(() => {
            this.confirmationButtonClicked = false
            this.isQuickBooking = false
            this.isLoading = false
          })
        } else {
          if (this.mode === 'preBooks') {
            data = { seatIds, initialDate, finalDate }
            method = 'createPreBooks'
          } else {
            method = 'create'
            if (seatIds.length === 1) {
              data = { bookings: [], parking: false, onBehalfOf: false, buildingId: this.building.id }
              data.bookings.push({ seatId: seatIds[0], initialDate, finalDate, buildingId: this.building.id, siteName: this.site.name })
              if (this.bookParkingCheck && this.parkings.length) {
                data.parking = true
                for (const book of this.parkings) {
                  if (book.authorized && !book.booked && book.available && book.parkingLot) {
                    const date = newFormatDate(book.date)
                    // todo improve consecutive dates one call
                    data.bookings.push({
                      seatId: book.parkingLot.id,
                      initialDate: date,
                      finalDate: date,
                      buildingId: this.building.id
                    })
                  }
                }
              }
            }
            if (this.mode === 'onBehalfOf') {
              data.onBehalfOf = true
              data.onBehalfOfUserID = this.onBehalfOfUser
            }
          }
          return await this.$api.booking[method](data).then(() => {
            this.clean()
            this.removeUser()
            this.confirmationButtonClicked = false
            this.isLoading = false
            if (method === 'create' || method === 'quickbook') {
              this.$console.success(this.$dk('mainpage.confirmationModal.bookSuccess'))
            } else if (method === 'createPreBooks') {
              this.$console.success(this.$dk('mainpage.confirmationModal.preBookSuccess'))
            }
          }).catch((e) => {
            console.log('Error in initiate the booking: ', e)
            this.confirmationButtonClicked = false
            this.isBooking = false
            this.isLoading = false
          })
        }
      }
    },
    dk (k) {
      const auxKey = 'amenities.' + k
      const value = this.$dk(auxKey)
      return value === auxKey ? k : value
    },
    close () {
      this.confirmationButtonClicked = false
      this.isBooking = false
      this.isQuickBooking = false
    },
    clean () {
      this.isBooking = false
      this.isQuickBooking = false
      this.parkings = []
      this.$nuxt.$emit('cleanArea')
      this.$nuxt.$emit('cleanSearchBox')
    }
  }
}
</script>

<style scoped lang="scss">
.safety {
  color: red;
}

#icon {
  padding: 0px;
}

#photo {
  height: 35px;
  border-radius: 30px;
}

#parkingLotBooking {
  height: 11px;
  cursor: pointer;
  font-size: 18px;
}

.map {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}
</style>
