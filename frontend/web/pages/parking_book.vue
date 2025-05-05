<template>
  <div>
    <box2 class="searchBox">
      <div class="ui attached tabular menu">
        <a class="active item" style="font-size: 18px; margin-top: 1%">
          <i class="icon fa-car" />
          {{ $t("parkingBook.bookYourParking") }}</a>
      </div>
      <div class="ui bottom attached segment active tab">
        <div class="search-container md-flex-col">
          <div class="field ">
            <p class="label mb-2">
              {{ $t("searchbox.sitelabel") }}
            </p>
            <dropdown
              v-model="selectedSite"
              :label-selector="(e) => e.name"
              :non-selected="$t('searchbox.sitetitle')"
              :options="sites"
            />
          </div>
          <div v-if="showBuildingField" class="field">
            <p class="label mb-2">
              {{ $t("searchbox.buildinglabel") }}
            </p>
            <dropdown
              v-model="selectedBuilding"
              :label-selector="(e) => e.name"
              :non-selected="$t('searchbox.sitetitle')"
              :options="buildings"
            />
          </div>

          <div class="field">
            <p class="label mb-2">
              {{ $t("searchbox.from") }}
            </p>
            <datepicker
              v-model="startDate"
              :disabled-dates="disabledDatesFrom"
              :highlighted="{ days: [6, 0] }"
              savable
              :language="$i18n.locale"
            />
          </div>
          <div class="field">
            <p class="label mb-2">
              {{ $t("searchbox.to") }}
            </p>
            <datepicker
              v-model="endDate"
              :disabled-dates="disabledDatesTo"
              :language="$i18n.locale"
              savable
            />
          </div>

          <div class="radio-field">
            <p class="label mb-2">
              {{ $t("searchbox.selectMode") }}
            </p>
            <div class="parking-mode px-2">
              <radio
                v-model="mode"
                class="my-0"
                name="mode"
                r-value="self"
                :label="$t('parkingBook.selfMode')"
              />
              <radio
                v-model="mode"
                class="my-0"
                name="mode"
                r-value="onBehalfOf"
                :label="$t('parkingBook.onBehalfOfMode')"
              />
            </div>
          </div>

          <div v-if="selectedSite && startDate && endDate && allowParkingReservation && parkings.length" class="floor-field">
            <p class="label mb-2">
              {{ $t('searchbox.floorlabel') }}
            </p>
            <div>
              <dropdown
                v-model="selectedFloor"
                :label-selector="e => e.number"
                :options="parkingFloors"
                :non-selected="$t('searchbox.floortitle')"
                @change="loadParkingMap(selectedFloor)"
              />
            </div>
          </div>

          <div v-if="showBooks" class="book-buttons">
            <button
              class="ui golden flex button full"
              @click="book"
            >
              <i class="icon bell" />{{ $t("searchbox.book") }}
            </button>
          </div>
        </div>
      </div>
    </box2>
    <div
      v-if="showFloorMap"
      class="map_container"
      title="Parking Floor Map"
    >
      <svg-pan-zoom
        v-if="isSvgImageFormat"
        :image-path="image"
        object-id="parkingMap"
      />
      <img v-else class="map" :src="image" alt="parking-map">
    </div>
    <confirm-parking-modal />
  </div>
</template>

<script>
import { addDays } from 'basf-gtu-utils/utils/DateUtils'
import ConfirmParkingModal from '../components/modals/ConfirmParkingModal.vue'
import { loadParkings, userAllowedForParkingReservation } from '@/common/ParkingCommon'
import { newFormatDate } from '@/common/Utils'

export default {
  name: 'ParkingBook',
  components: { ConfirmParkingModal },
  data () {
    return {
      parkings: [],
      showFloorMap: false,
      image: '',
      isSvgImageFormat: true,
      startDate: null,
      endDate: null,
      reservationDays: null,
      disabledDatesFrom: () => {},
      disabledDatesTo: () => {},
      confirmationButtonClicked: false,
      mode: 'self',
      selectedFloor: null,
      allowParkingReservation: false
    }
  },
  computed: {
    loggedUser () {
      return this.$store.getters['auth/getUser']
    },
    sites () {
      return this.$store.getters['site/getSites']
    },
    buildings () {
      return this.$store.getters['building/getBuildings']
    },
    showBuildingField () {
      return this.buildings.length > 1
    },
    selectedSite: {
      get () {
        return this.$store.getters['site/getSelectedSiteBooking']
      },
      set (value) {
        this.$store.dispatch('site/selectSiteBooking', value)
      }
    },
    selectedBuilding: {
      get () {
        return this.$store.getters['building/getSelectedBuildingBooking']
      },
      set (value) {
        this.$store.dispatch('building/selectBuildingBooking', value)
      }
    },
    showBooks () {
      return this.parkings && this.selectedFloor ? this.parkings.length : false
    },
    parkingFloors () {
      return this.parkings[0]?.floors
    }
  },
  watch: {
    selectedSite (site) {
      this.cleanSearchBox()
      this.$store.dispatch('building/loadBuildings', site)
    },
    buildings (buildings) {
      if (buildings.length === 1) {
        this.selectedBuilding = buildings[0]
      } else {
        this.selectedBuilding = null
      }
    },
    selectedBuilding (building) {
      if (building) {
        this.updateDisabledDates(building)
        this.search()
      }
    },
    startDate (newDate) {
      if (this.endDate === undefined) {
        this.endDate = newDate
      }
      if (newDate > this.endDate) {
        this.endDate = newDate
      }
      this.search()
    },
    endDate (newDate) {
      this.showBookButton = false
      if (newDate < this.startDate) {
        this.startDate = newDate
      }
      this.search()
    },
    selectedFloor (value) {
      if (value) {
        this.loadParkingMap(value)
      }
    },
    parkingFloors (value) {
      if (value && value.length === 1) {
        this.selectedFloor = this.parkings[0].floors[0]
      } else {
        this.selectedFloor = null
      }
    },
    mode (value) {
      if (value) {
        this.search()
      }
    }
  },
  mounted () {
    this.$nuxt.$on('cleanSearchBox', this.cleanSearchBox)
    if (!this.sites.length) {
      this.$store.dispatch('site/loadSites')
    }
    if (this.selectedSite) {
      this.$store.dispatch('building/loadBuildings', this.selectedSite)
    }
  },
  methods: {
    async search () {
      let userParkingAccesses = []
      if (this.selectedBuilding) {
        userParkingAccesses = await this.$api.userParkingAccess.getUserInfo(this.loggedUser.username, this.selectedBuilding.id)

        if (userParkingAccesses.siteParkingAccess !== this.selectedSite.id) {
          this.$console.warn(
            this.$dk('parkingBook.notRegisteredWarn')
          )
          this.allowParkingReservation = false
          this.showFloorMap = false
        }

        if (this.endDate) {
          this.allowParkingReservation = userAllowedForParkingReservation(
            newFormatDate(this.startDate),
            newFormatDate(this.endDate),
            userParkingAccesses,
            this.selectedSite.id
          )
          if (this.allowParkingReservation) {
            await this.getParkings(userParkingAccesses)
          }
        }
      }
    },
    async getParkings (userInfo) {
      if (this.endDate && this.allowParkingReservation) {
        const loadData = {
          buildingId: this.selectedBuilding.id,
          initialDate: this.startDate,
          finalDate: this.endDate,
          user: userInfo
        }
        this.parkings = await loadParkings(loadData, this)

        if (!this.parkingFloors.length) {
          this.$console.warn(
            this.$dk('configuration.parking.NoAvailableParkingLot')
          )
        }
      }
    },
    loadParkingMap (selectedParking) {
      const map = selectedParking.map
      if (!map || map === '-') {
        this.showFloorMap = false
        return
      }

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
    book () {
      if (this.parkings.length) {
        this.parkings.forEach((p) => {
          p.floor = this.selectedFloor
        })
        const data = {
          floor: this.selectedFloor,
          isBooking: true,
          onlyParking: true,
          startDate: this.startDate,
          endDate: this.endDate,
          onBehalfOf: this.mode === 'onBehalfOf',
          buildingId: this.selectedBuilding.id,
          parkings: this.parkings
        }

        this.$nuxt.$emit('confirmParkingBooking', data)
      } else {
        this.$console.warn(
          this.$dk('configuration.parking.parkingBookingAlreadyExists')
        )
      }
    },
    cleanSearchBox () {
      this.startDate = null
      this.endDate = null
      this.selectedFloor = null
      this.image = ''
      this.$store.dispatch('building/loadBuildings', this.selectedSite)
      this.mode = 'self'
      this.showFloorMap = false
    },
    updateDisabledDates (building) {
      if (building) {
        const lowestDate = addDays(-1)(new Date())
        const greatestDate = addDays(building.parkingReservationDays - 1)(
          new Date()
        )
        this.disabledDatesFrom = () => {
          return { to: lowestDate, from: greatestDate }
        }
        this.disabledDatesTo = () => {
          return { to: lowestDate, from: greatestDate }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.searchBox {
  #location-icon {
    height: 25px;
    width: 25px;
    margin-right: 5px;
  }

  button.full {
    margin-top: 11px;
    width: 100%;
  }

  .golden {
    background-color: #f39501;
    color: #fff;
  }

  .label {
      display: block;
      font-weight: 600;
      color: #000;
      font-size: 14px;
      text-align: left;
      padding-left: 0;
    }

  .field {
    color: #000;
    width: 100%;
  }

  .floor-field {
    color: #000;
    width: 50%;

    @media (max-width: 768px) {
      width: 100%;
    }
  }

  .radio-field {
    color: #000;
    min-width: 130px;

    @media (max-width: 768px) {
      width: 100%;
    }
  }

  .column {
    button:not(:first-child) {
      margin-top: 5px;
    }
  }

  .parking-mode {
    background-color: #e9e9e9;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 5px;
    width: fit-content;

    @media (max-width: 768px) {
      width: 100%;
    }
  }

  .book-buttons {
    display: flex;
    align-items: center;
    width: 150px;

    .button {
      justify-content: center;
    }

    @media (max-width: 768px) {
      width: 100%;
    }
  }
}

.parkingTable {
  .row {
    border-bottom: 1px solid lightgray;
  }

  margin-top: 1rem;
  margin-bottom: 1rem;
}

.closeButton {
  background-color: #ab0000;
  margin-top: 5px;

  &:hover {
    background-color: #d80000;
  }
}

.map_container {
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: #f0f0f0;
  max-height: 500px;
  height: 100%;
}

.map {
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding: 30px;
  width: 100%;
  height: auto;
  object-fit: contain;
  max-block-size: 330px;
  transition: transform 0.3s;
}

.search-container{
  display: flex;
  justify-content: space-between;
  gap: 13px;
  width: 100%;
}
</style>
