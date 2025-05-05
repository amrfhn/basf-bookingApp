<template>
  <div v-if="selectedSeats && selectedSeats.length" class="attr">
    <accordion
      v-if="!isBuildingMindsAdmin"
      id="enable-disable-accordion"
      :title="$t('configuration.seats_config.enable_disable')"
      name="acc1"
    >
      <ui-grid :columns="1" class="terms">
        <row>
          <column>
            <row>
              <radio
                v-model="enableDisableRadio"
                :label="$t('configuration.seats_config.enable')"
                class="enable-disable-radio"
                name="enableDisableRadio"
                r-value="enable"
              />
            </row>
            <row v-if="enableDisableRadio === 'enable'" class="en-dis-content">
              <column>
                <radio
                  v-model="enableRadio"
                  :label="$t('configuration.seats_config.forPeriod')"
                  name="enableRadio"
                  r-value="forPeriod"
                />
                <row v-if="enableRadio === 'forPeriod'" class="input-content">
                  <column>
                    <label>{{ $t('configuration.seats_config.enabledFrom') }}</label>
                    <datepicker v-model="startDate" :disabled-dates="disabledDatesFrom" savable />
                    <label>{{ $t('configuration.seats_config.enabledUntil') }}</label>
                    <datepicker v-model="endDate" :disabled-dates="disabledDatesFrom" savable />
                  </column>
                </row>
              </column>
            </row>
            <row v-if="enableDisableRadio === 'enable'" class="en-dis-content">
              <radio
                v-model="enableRadio"
                :label="$t('configuration.seats_config.indefinitely')"
                name="enableRadio"
                r-value="forever"
              />
            </row>
            <row>
              <radio
                v-model="enableDisableRadio"
                :label="$t('configuration.seats_config.disable')"
                class="enable-disable-radio"
                name="enableDisableRadio"
                r-value="disable"
              />
            </row>
            <row v-if="enableDisableRadio === 'disable'" class="en-dis-content">
              <column>
                <radio
                  v-model="disableRadio"
                  :label="$t('configuration.seats_config.forPeriod')"
                  name="disableRadio"
                  r-value="forPeriod"
                />
                <row v-if="disableRadio === 'forPeriod'" class="input-content">
                  <column>
                    <label>{{ $t('configuration.seats_config.disabledFrom') }}</label>
                    <datepicker v-model="startDateDisable" :disabled-dates="disabledDatesFrom" savable />
                    <label>{{ $t('configuration.seats_config.disabledUntil') }}</label>
                    <datepicker v-model="endDateDisable" :disabled-dates="disabledDatesFrom" savable />
                  </column>
                </row>
              </column>
            </row>
            <row v-if="enableDisableRadio === 'disable'" class="en-dis-content">
              <column>
                <radio
                  v-model="disableRadio"
                  :label="$t('configuration.seats_config.indefinitely')"
                  name="disableRadio"
                  r-value="forever"
                />
                <row v-if="disableRadio === 'forever'" class="input-content">
                  <label>{{ $t('configuration.seats_config.disabledFrom') }}</label>
                  <datepicker v-model="disableFrom" savable />
                </row>
              </column>
            </row>
          </column>
        </row>
        <row>
          <column>
            <btn-positive @click="confirm">
              <i class="icon check" />
              {{ $t('modal.confirm') }}
            </btn-positive>
          </column>
        </row>
        <dialog-modal
          :body="$t('configuration.sites.bookingsCancellationWarning')"
          :show="confirmCancellationShowModal"
          :title="$t('modal.dialog')"
          closeable
          @close="confirmCancellationToggleModal"
          @ok="confirmFromModalOnDisable"
        />
      </ui-grid>
    </accordion>
    <accordion v-if="!isBuildingMindsAdmin" :title="$t('configuration.amenities.amenities')" name="acc1">
      <button class="ui golden button" @click="modifyAmenities">
        <i class="edit icon" />
        {{ $t('configuration.seats_config.modifyAmenities') }}
      </button>
      <seat-amenities-modal v-if="showAmenitiesModal && !isBuildingMindsAdmin" @close="closeModal" />
    </accordion>
    <accordion :title="$t('configuration.seats_config.seatOwners')" name="acc1">
      <button class="ui golden button" @click="toggleSeatOwnerSModal">
        <i class="edit icon" />
        {{ $t('configuration.seats_config.modify') + ' ' + $t('configuration.seats_config.seatOwners') }}
      </button>
      <modal
        id="seatOwnersModal"
        :show="toggleSeatOwnersModal"
        :title="$t('configuration.seats_config.edit') +' '+ $t('configuration.seats_config.seatOwners')"
        closeable
        @close="toggleSeatOwnerSModal"
        @ok="updateSeatOwners"
      >
        <div class="ldap-input">
          <label>
            {{ $t('configuration.seats_config.addOwner') }}
            <tooltip :content="$t('general.findUserTooltip')">
              <i class="icon info circle" style="color:#494040" />
            </tooltip>
          </label>
          <div class="ldap-search-container">
            <ldap-users :key="ldapKey" :caller="getLdap" @input="loadOwnerInput" />
            <btn-positive @click="addSeatOwner(userInput)">
              <i class="icon plus" />
            </btn-positive>
          </div>
        </div>
        <ui-grid id="seatOwnersTable" :columns="3" stackable>
          <row>
            <column>{{ $t('configuration.seats_config.selectedSeats') }}</column>
            <column>{{ $t('configuration.seats_config.seatOwners') }}</column>
            <column>{{ $t('configuration.feedback.delete') }}</column>
          </row>
          <row v-for="(seat, i) in seatsWithSeatOwners" :key="i">
            <column>
              {{ seat.code }}
            </column>
            <ui-grid :columns="3">
              <row v-for="(owner, e) in seat.owners" :key="e">
                <column style="width: 100%">
                  {{ owner.full_name }}
                </column>
                <div class="delete-seat-owner-button">
                  <btn-negative @click="deleteOwner(seat, i, owner)">
                    <i class="icon fa-trash" />
                  </btn-negative>
                </div>
              </row>
            </ui-grid>
          </row>
        </ui-grid>
      </modal>
    </accordion>
  </div>
</template>

<script>
import LDAP from 'basf-gtu-utils/client/LDAP'
import { addDays } from 'basf-gtu-utils/utils/DateUtils'
import { LDAPSearch } from '../../../common/Filters'
import SeatAmenitiesModal from './modals/SeatAmenitiesModal'
import DialogModal from '@/components/ui/Modal'

export default {
  name: 'SeatAttributes',
  components: {
    DialogModal,
    SeatAmenitiesModal
  },
  data () {
    return {
      enableDisableRadio: '',
      disableRadio: '',
      enableRadio: '',
      toggleSeatOwnersModal: false,
      seatsWithSeatOwners: [],
      userInput: null,
      inputValue: '',
      ldapKey: 0,
      showAmenitiesModal: false,
      confirmCancellationShowModal: false,
      startDate: new Date(),
      endDate: new Date(),
      startDateDisable: null,
      endDateDisable: null,
      disableFrom: new Date(),
      disabledDatesFrom: () => {
      },
      seatsToUpdate: [],
      flag: ''
    }
  },
  computed: {
    token () {
      return this.$store.getters['auth/token']
    },
    selectedSeats: {
      get () {
        return this.$store.getters['seat/getSelectedSeatsConfig']
      },
      set (value) {
        this.$store.dispatch('seat/updateSelectedSeatsConfig', value)
      }
    },
    selectedArea: {
      get () {
        return this.$store.getters['floor/getSelectedAreaConfig']
      }
    },
    seats: {
      get () {
        return this.$store.getters['seat/getSeats']
      }
    },
    isBuildingMindsAdmin () {
      return (this.$store.getters['site/getSelectedSiteConfiguration'] && this.$store.getters['site/getSelectedSiteConfiguration'].buildingMindsID !== null)
    }
  },
  mounted () {
    LDAP.authenticate({ federation_token: this.token })
    this.setDates()
  },
  methods: {
    setDates () {
      const lowestDate = addDays(-1)(new Date())
      const lowestDateDisabledFrom = addDays(-2)(new Date())
      lowestDate.setHours(lowestDate.getHours())
      lowestDateDisabledFrom.setHours(lowestDate.getHours())
      this.disableFrom = lowestDate
      // this.disableDatesFrom = lowestDateDisabledFrom
    },
    async getLdap (fullName) {
      return await LDAPSearch(fullName, LDAP)
    },
    async confirmFromModalOnDisable () {
      let error = ''
      const body = {
        seatsToUpdate: this.seatsToUpdate
      }
      if (this.flag !== '') {
        if (this.flag === 'forever') {
          body.seatsToUpdate = this.seatsToUpdate.map((x) => {
            return {
              ...x,
              startDate: Object.entries(this.seats).filter(y => y[1].id === x.id)[0][1].startDate
            }
          })
        }
        body.flag = this.flag
      }
      await this.$api.seat.updateSeats(body).catch((e) => {
        error = e
      })
      this.flag = ''
      if (error === '') {
        this.$console.success(this.$dk('configuration.seats_config.datesChanged'))
      }
      this.$store.dispatch('seat/setSelectedSeatsConfig', [])
      this.$store.dispatch('seat/loadSeats', this.selectedArea)
      this.seatsToUpdate = []
      this.confirmCancellationToggleModal()
    },
    confirmCancellationToggleModal () {
      this.confirmCancellationShowModal = !this.confirmCancellationShowModal
    },
    async confirm () {
      const seatsToUpdate = this.selectedSeats.map((x) => {
        return { id: Object.entries(this.seats).find(y => y[1].code === x)[1].id }
      })
      this.flag = ''
      if (this.enableDisableRadio === 'enable' && this.enableRadio === 'forPeriod') {
        if (this.startDate && this.endDate) {
          if (this.startDate <= this.endDate) {
            for (const seat of seatsToUpdate) {
              seat.startDate = this.startDate
              seat.endDate = this.endDate
            }
          } else {
            this.$console.warn(this.$dk('configuration.seats_config.datesError'))
          }
        } else {
          this.$console.warn(this.$dk('searchbox.missinginfo'))
        }
      } else if (this.enableDisableRadio === 'enable' && this.enableRadio === 'forever') {
        for (const seat of seatsToUpdate) {
          seat.startDate = new Date(2023, 0, 1)
          seat.endDate = null
        }
      } else if (this.enableDisableRadio === 'disable' && this.disableRadio === 'forPeriod') {
        if (this.startDateDisable && this.endDateDisable) {
          if (this.startDateDisable <= this.endDateDisable) {
            for (const seat of seatsToUpdate) {
              seat.startDate = this.startDateDisable
              seat.endDate = this.endDateDisable
              seat.period = true
            }
            this.flag = 'forPeriod'
          } else {
            this.$console.warn(this.$dk('configuration.seats_config.datesError'))
          }
        } else {
          this.$console.warn(this.$dk('searchbox.missinginfo'))
        }
      } else if (this.disableFrom) {
        for (const seat of seatsToUpdate) {
          if (this.disableFrom > seat.startDate) {
            seat.startDate = this.disableFrom
          }
          seat.endDate = this.disableFrom
          this.flag = 'forever'
        }
      } else {
        this.$console.warn(this.$dk('searchbox.missinginfo'))
      }
      this.selectedSeats = seatsToUpdate
      if (seatsToUpdate) {
        if (this.flag !== '') {
          this.seatsToUpdate = seatsToUpdate
          this.confirmCancellationToggleModal()
        } else {
          await this.$api.seat.updateSeats({ seatsToUpdate }).catch(e => e)
          this.seatsToUpdate = []
          this.$console.success(this.$dk('configuration.seats_config.datesChanged'))
          this.$store.dispatch('seat/setSelectedSeatsConfig', [])
          this.$store.dispatch('seat/loadSeats', this.selectedArea)
        }
      }
    },
    formatDate (date) {
      if (date === null) {
        return null
      }
      const splitDate = date.split('-')
      const newDate = new Date(parseInt(splitDate[0]), parseInt(splitDate[1]) - 1, parseInt(splitDate[2]))
      return newDate
    },
    modifyAmenities () {
      this.showAmenitiesModal = true
    },
    async toggleSeatOwnerSModal () {
      if (!this.toggleSeatOwnersModal) {
        this.seatsWithSeatOwners = await this.$store.dispatch('seat/loadSeatsWithSeatOwners')
      } else {
        this.seatsWithSeatOwners = []
      }
      this.toggleSeatOwnersModal = !this.toggleSeatOwnersModal
    },
    loadOwnerInput (user) {
      this.ldapKey += 2
      this.userInput = user
      this.inputValue = user.full_name
      setTimeout(function () {
        const div = document.getElementsByClassName('ldapSearch')
        const input = div[0].children
        input[0].value = user.full_name
      }, 200)
    },
    addSeatOwner (user) {
      if (user) {
        for (const seat of this.seatsWithSeatOwners) {
          let wasDeleted = []
          if (this.seatsWithSeatOwners.toDelete.length) {
            wasDeleted = this.seatsWithSeatOwners.toDelete.filter(o => o.userId === user.username && o.seatId === seat.id)
          }
          if (wasDeleted.length) {
            seat.owners.push(wasDeleted[0])
            this.seatsWithSeatOwners.toDelete = this.seatsWithSeatOwners.toDelete.filter(o => o.id !== wasDeleted[0].id)
          } else {
            let existUser = []
            if (seat.owners) {
              existUser = seat.owners.filter(o => o.userId === user.username)
            } else {
              seat.owners = []
            }
            if (!existUser.length) {
              seat.owners.push({ full_name: user.full_name, userId: user.username })
            }
          }
        }
        this.userInput = null
        this.inputValue = ''
        setTimeout(function () {
          const div = document.getElementsByClassName('ldapSearch')
          const input = div[0].children
          input[0].value = ''
        }, 200)
      }
    },
    deleteOwner (seat, i, owner) {
      if (owner.id) {
        this.seatsWithSeatOwners.toDelete.push(owner)
      }
      this.seatsWithSeatOwners[i].owners = this.seatsWithSeatOwners[i].owners.filter(o => o.userId !== owner.userId)
    },
    async updateSeatOwners () {
      const toDelete = this.seatsWithSeatOwners.toDelete
      delete this.seatsWithSeatOwners.toDelete
      if (toDelete.length) {
        const seatOwnersIds = toDelete.map(o => o.id)
        await this.$api.seatOwner.bulkDelete(seatOwnersIds).catch(e => console.error(e))
      }
      for (const seat of this.seatsWithSeatOwners) {
        const seatId = Object.entries(this.seats).find(x => x[1].code === seat.code)[1].id
        const ownersToAdd = seat.owners.filter(o => o.id === undefined)
        if (ownersToAdd.length) {
          for (const owner of ownersToAdd) {
            await this.$api.seatOwner.create({ userId: owner.userId, seatId }).catch(e => console.error(e))
          }
        }
      }
      this.toggleSeatOwnerSModal()
    },
    closeModal () {
      this.showAmenitiesModal = false
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-header {
  padding-bottom: 0;
}
.attr {
  padding-right: 50px;

  #enable-disable-accordion {
    .enable-disable-radio:first-of-type {
      margin-top: 0;
    }

    .enable-disable-radio {
      margin-left: 5px;
      color: #00793A;
    }

    .en-dis-content {
      margin-left: 15px;

      .input-content {
        margin-left: 10px;

        .datepicker {
          margin-bottom: 10px;
        }
      }
    }
  }
}

#seatOwnersTable {
  .row {
    border-bottom: 1px solid lightgray;
  }

  .delete-seat-owner-button {
    position: absolute;
    right: -69px;
  }
}

.ldap-input {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  label {
    display: flex;
    width: auto;
    gap: 5px;
  }
  .ldap-search-container {
    display: flex;
    gap: 5px;
    .ldapSearch {
      width: 60%;
    }
  }
}

.golden {
  background-color: #f39501;
  color: #fff;
}
</style>

<style lang="scss">
.enable-disable-radio {
  label {
    font-weight: bold;
  }
}

#seatOwnersModal {
  .modal-dialog {
    width: 50vw !important;

    h4 {
      margin: 0;
      padding: 0;
    }
  }
}
</style>
