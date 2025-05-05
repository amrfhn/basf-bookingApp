<template>
  <div>
    <modal
      v-if="isBooking"
      :title="$t('parkingBook.confirmationModal.title')"
      closeable
      show
      :is-loading="isLoading"
      @close="close"
      @ok="confirmBooking"
    >
      <div>
        <ul>
          <li>
            {{ $t("parkingBook.confirmationModal.site") }}
            <strong>{{ site.name }}</strong>
          </li>
          <li>
            {{ $t("parkingBook.confirmationModal.building") }}
            <strong>{{ building.name }}</strong>
          </li>
          <li>
            {{ $t("parkingBook.confirmationModal.floor") }}
            <strong>{{ floor.number }}</strong>
          </li>
          <hr>
        </ul>

        <!-- ON BEHALF OF CONFIG -->
        <ul v-if="isOnBehalfOf">
          <li>
            <b>
              {{ $t("parkingBook.confirmationModal.thirdParty") }}
            </b>
            <br>
            <radio
              v-model="userType"
              :label="$t('parkingBook.confirmationModal.internal')"
              name="userType"
              r-value="internal"
            />
            <div
              v-if="userType === 'internal' && onBehalfOfUser === null"
            >
              <p class="my-2">
                {{ $t("configuration.superadmin.findUser") }}
                <tooltip :content="$t('general.findUserTooltip')">
                  <i class="icon info circle" style="color: #494040" />
                </tooltip>
              </p>
              <ldap-users
                :key="ldapKey"
                :caller="getLdap"
                class="input-ldap"
                @input="addUser"
              />
            </div>
            <div
              v-if="userType === 'internal' && onBehalfOfUser != null"
            >
              <ui-table>
                <tbody>
                  <tr>
                    <td>
                      <img id="photo" :src="onBehalfOfUser.image">
                    </td>
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
            </div>
          </li>
          <hr>
        </ul>

        <ul v-show="parkings.length && (!isOnBehalfOf || (isOnBehalfOf && onBehalfOfUser))">
          <li>
            {{ $t("parkingBook.confirmationModal.parkingDetails") }}

            <ui-grid :columns="4">
              <row class="pb-0">
                <column class="my-auto" :wide="4">
                  <label class="my-auto">{{ $t('app.datetitle') }}</label>
                </column>
                <column class="my-auto" :wide="4">
                  <label class="my-auto">{{ $t('configuration.parking.parkingLot') }}</label>
                </column>
              </row>

              <row v-for="(item, i) in parkings" :key="i" class="pb-0">
                <column class="my-auto" :wide="4">
                  <p>
                    {{ item.date | formatDate }}
                  </p>
                </column>

                <column v-if="item.authorized && item.floors.length" class="my-auto" :wide="4">
                  <dropdown
                    v-model="item.parkingLot"
                    :label-selector="e => e.code"
                    :options="item.parkingLots"
                    style="text-align: left"
                  />
                </column>
              </row>
            </ui-grid>
          </li>
        </ul>

        <div v-if="parkingWarningMessage !== ''" class="warning-parking">
          {{ parkingWarningMessage }}
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import LDAP from 'basf-gtu-utils/client/LDAP'
import { loadParkingLots, loadParkings, userAllowedForParkingReservation } from '@/common/ParkingCommon'
import { LDAPSearch } from '@/common/Filters'
import { newFormatDate } from '@/common/Utils'

export default {
  name: 'ConfirmParkingModal',
  filters: {
    formatDate (date) {
      if (date != null) {
        return date.getDate() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getFullYear()
      }
    }
  },
  data () {
    return {
      parkings: [],
      floor: null,
      isBooking: false,
      startDate: null,
      endDate: null,
      isLoading: false,
      isOnBehalfOf: false,
      onBehalfOfUser: null,
      ldapKey: 0,
      userType: 'internal',
      allowParkingReservation: false,
      parkingLots: null,
      parkingWarningMessage: ''
    }
  },
  computed: {
    token () {
      return this.$store.getters['auth/token']
    },
    site () {
      return this.$store.getters['site/getSelectedSiteBooking']
    },
    building () {
      return this.$store.getters['building/getSelectedBuildingBooking']
    },
    selectedBuilding: {
      get () {
        return this.$store.getters['building/getSelectedBuildingBooking']
      },
      set (value) {
        this.$store.dispatch('building/selectBuildingBooking', value)
      }
    }
  },
  mounted () {
    this.parkingWarningMessage = ''
    LDAP.authenticate({ federation_token: this.token })
    this.$nuxt.$on('confirmParkingBooking', this.setBookingData)
  },
  methods: {
    loadParkingLots,
    setBookingData (value) {
      this.startDate = value.startDate
      this.endDate = value.endDate
      this.isBooking = value.isBooking
      this.isOnBehalfOf = value.onBehalfOf
      this.floor = value.floor

      if (!this.isOnBehalfOf) {
        const parkings = value.parkings.filter(p => p.booked !== 1)
        if (parkings.length) {
          parkings.forEach((parking) => {
            const parkingFloor = parking.floors.filter(f => f.id === this.floor.id)
            parking.floor = parkingFloor[0]

            loadParkingLots(parking)
          })
          this.parkings = parkings
        }

        if (!parkings.length) {
          this.parkingWarningMessage = this.$dk('configuration.parking.parkingBookingAlreadyExists')
        } else if (!this.parkings[0].parkingLots) {
          this.parkingWarningMessage = this.$dk('configuration.parking.NoAvailableParkingLot')
        }
      }
    },
    async confirmBooking () {
      let data = {}
      data = {
        bookings: [],
        parking: true,
        onlyParking: true,
        onBehalfOf: this.isOnBehalfOf,
        buildingId: this.selectedBuilding.id
      }
      if (this.parkings.length) {
        for (const book of this.parkings) {
          if (
            book.authorized &&
                     !book.booked &&
                     book.available &&
                     book.parkingLot
          ) {
            const date = newFormatDate(book.date)
            // todo improve consecutive dates one call
            data.isBooking = true

            data.bookings.push({
              seatId: book.parkingLot.id,
              floorNumber: this.floor.number,
              initialDate: date,
              finalDate: date,
              buildingId: this.selectedBuilding.id
            })
          }
        }
        if (this.isOnBehalfOf) {
          data.onBehalfOf = true
          data.onBehalfOfUserID = this.onBehalfOfUser
        }
      } else {
        this.close()
        return
      }
      return await this.$api.booking
        .create(data)
        .then(() => {
          this.parkings = []
          this.onBehalfOfUser = null
          this.cleanSearchBox()
          this.$console.success(
            this.$dk('parkingBook.confirmationModal.bookSuccess')
          )
        })
        .catch(() => {
          this.close()
        })
    },
    close () {
      this.parkingWarningMessage = ''
      this.parkings = []
      this.onBehalfOfUser = null
      this.isBooking = false
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
      } else {
        this.parkingWarningMessage = this.$dk('parkingBook.notRegisteredWarn')
      }
    },
    removeUser () {
      this.parkingWarningMessage = ''
      this.onBehalfOfUser = null
      this.userParkingInfoOnBehalf = null
    },
    async getParkings (userInfo) {
      if (this.endDate && this.isOnBehalfOf && this.allowParkingReservation) {
        const loadData = {
          buildingId: this.building.id,
          initialDate: this.startDate,
          finalDate: this.endDate,
          user: userInfo
        }
        let parkings = await loadParkings(loadData, this)
        parkings = parkings.filter(p => p.booked !== 1)
        parkings = parkings.filter(p => p.floors.length)

        if (!parkings.length) {
          this.parkingWarningMessage = this.$dk('configuration.parking.parkingBookingAlreadyExists')
        }

        if (parkings.length) {
          parkings.forEach((parking) => {
            const parkingFloor = parking.floors.filter(f => f.id === this.floor.id)
            parking.floor = parkingFloor[0]
            loadParkingLots(parking)
          })

          this.parkings = parkings
        }
      }
    },
    cleanSearchBox () {
      this.isBooking = false
      this.parking = []
      this.$nuxt.$emit('cleanSearchBox')
    }
  }
}
</script>

<style lang="scss" scoped>
.mb-2 {
   margin-bottom: 8px;
}

#photo {
  height: 35px;
  border-radius: 30px;
}

.flex-col-1 {
  flex:1;
}

#icon {
  padding: 0px;
}

.input-ldap {
  width: 80%;

  @media (max-width: 768px) {
  width: 100%;
  }
}

.warning-parking {
  margin: 0 12px;
  background: #F39500;
  color: #fff;
  padding: 5px;
}
</style>
