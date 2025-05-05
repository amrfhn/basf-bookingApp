<template>
  <ui-grid>
    <row>
      <column :wide="12">
        <row>
          <ui-grid :columns="12" class="suggestion">
            <row>
              <column :wide="3" class="alignlabelcenter">
                <label>{{ $t("configuration.parking.name") }} </label>
              </column>
              <column :wide="4">
                <ldap-users
                  v-if="!userChosen"
                  :key="ldapKey"
                  :caller="getLdap"
                  @input="addUser"
                />
                <ui-table v-if="userChosen">
                  <tbody>
                    <tr>
                      <td class="noBorderTop">
                        <img id="photo" :src="user.image">
                      </td>
                      <td class="noBorderTop">
                        {{ user.full_name }}
                      </td>
                      <td class="noBorderTop">
                        <btn-negative @click="removeUser()">
                          <i class="icon fa-trash" />
                        </btn-negative>
                      </td>
                    </tr>
                  </tbody>
                </ui-table>
              </column>
            </row>
            <row>
              <column :wide="3" class="alignlabelcenter">
                <label>{{ $t("configuration.parking.permanentAccess") }}
                </label>
              </column>
              <column :wide="4">
                <dropdown
                  v-model="permanentAccess"
                  :disabled="
                    editFromNewCarAddition &&
                      !firstRegisterFromNewCarAddition
                  "
                  :label-selector="(e) => e.name"
                  :non-selected="
                    $t(
                      'configuration.parking.permanentAccessNotSelected'
                    )
                  "
                  :options="SiONo"
                />
              </column>
            </row>
            <row v-if="isNotPermanentAccess">
              <column :wide="3" class="alignlabelcenter">
                <label>{{
                  $t(
                    "configuration.parking.lastDateValidParkingLot"
                  )
                }}
                </label>
              </column>
              <column :wide="4">
                <datepicker
                  v-model="dateUntil"
                  :disabled="
                    editFromNewCarAddition &&
                      !firstRegisterFromNewCarAddition
                  "
                />
              </column>
            </row>
            <row>
              <column :wide="3" class="alignlabelcenter">
                <label>{{ $t("configuration.parking.parkingLotAssigned") }}
                </label>
              </column>
              <column :wide="4">
                <ui-grid :columns="12">
                  <row style="padding-top: 0rem">
                    <column :wide="1" class="alignlabelcenter">
                      <p>{{ $t("configuration.parking.floor") }}</p>
                    </column>
                    <column :wide="3">
                      <dropdown
                        v-model="parkingFloor"
                        :disabled="
                          editFromNewCarAddition &&
                            !firstRegisterFromNewCarAddition
                        "
                        :label-selector="(e) => e.number"
                        :options="parkingFloors"
                        non-selected="-"
                        nullable
                      />
                    </column>
                    <column :wide="2" />
                    <column :wide="3" class="alignlabelcenter">
                      <p>
                        {{ $t("configuration.parking.parkingLot") }}
                      </p>
                    </column>
                    <column :wide="3">
                      <dropdown
                        v-model="parkingLot"
                        :disabled="
                          editFromNewCarAddition &&
                            !firstRegisterFromNewCarAddition
                        "
                        :label-selector="(e) => e.code"
                        :options="parkingLots"
                        non-selected="-"
                        nullable
                        style="text-align: left"
                      />
                    </column>
                  </row>
                </ui-grid>
              </column>
            </row>
            <row>
              <column :wide="3" class="alignlabelcenter">
                <label>{{ $t("configuration.parking.isParkingLotOwner") }}
                </label>
              </column>
              <column :wide="4">
                <dropdown
                  v-model="parkingLotOwner"
                  :disabled="
                    editFromNewCarAddition &&
                      !firstRegisterFromNewCarAddition
                  "
                  :label-selector="(e) => e.name"
                  :non-selected="
                    $t(
                      'configuration.parking.permanentAccessNotSelected'
                    )
                  "
                  :options="SiONo"
                />
              </column>
            </row>
            <row>
              <column :wide="3" class="alignlabelcenter">
                <label>{{
                  $t(
                    "configuration.parking.vehicleInfoFilledByUser"
                  )
                }}
                </label>
              </column>
              <column :wide="4">
                <input
                  v-model="notShowVehicleInputs"
                  :disabled="
                    editFromNewCarAddition &&
                      !firstRegisterFromNewCarAddition
                  "
                  type="checkbox"
                >
              </column>
            </row>
            <column :wide="12">
              <row v-if="!notShowVehicleInputs">
                <column :wide="1">
                  <label class="inputLabel">{{
                    $t("configuration.parking.company")
                  }}</label>
                </column>
                <column :wide="2">
                  <input v-model="carBrand" class="inputInfo">
                </column>
                <column :wide="1">
                  <label class="inputLabel">
                    {{ $t("configuration.parking.model") }}
                  </label>
                </column>
                <column :wide="2">
                  <input v-model="carModel" class="inputInfo">
                </column>
                <column :wide="1">
                  <label class="inputLabel">
                    {{ $t("configuration.parking.plate") }}
                  </label>
                </column>
                <column :wide="2">
                  <input v-model="carLicensePlate" class="inputInfo">
                </column>
              </row>
            </column>
            <row>
              <column :wide="10" />
              <column :wide="2" style="text-align: center">
                <btn-positive
                  :disabled="noFieldsEmpty"
                  @click="saveChanges"
                >
                  <i />{{ $t("configuration.save") }}
                </btn-positive>
              </column>
            </row>
          </ui-grid>
        </row>
      </column>
    </row>
  </ui-grid>
</template>

<script>
import LDAP from 'basf-gtu-utils/client/LDAP'
import { LDAPSearch } from '../../../common/Filters'
import { sortByStrAndNumFloorOrSeat } from '../../../common/Utils'

export default {
  name: 'NewUserAccessParking',
  props: {
    value: { type: null, default: null },
    parkingFloors: { type: Array, required: true },
    upt: { type: Array, required: true }
  },
  data () {
    return {
      ldapKey: 0,
      user: null,
      userChosen: false,
      parkingFloor: null,
      parkingLots: null,
      parkingLot: null,
      permanentAccess: null,
      parkingLotOwner: null,
      SiONo: [{ name: this.$t('configuration.parking.yes'), value: true }, {
        name: this.$t('configuration.parking.no'),
        value: false
      }],
      dateUntil: null,
      isPermanentAccess: null,
      isNotPermanentAccess: false,
      isParkingLotOwner: null,
      editable: null,
      isEditing: false,
      notShowVehicleInputs: true,
      editFromNewCarAddition: false,
      firstRegisterFromNewCarAddition: false,
      carBrand: null,
      carModel: null,
      carLicensePlate: null
    }
  },
  computed: {
    token () {
      return this.$store.getters['auth/token']
    },
    site () {
      return this.$store.getters['site/getSelectedSiteConfiguration']
    },
    noFieldsEmpty () {
      return !(
        this.userChosen &&
        (this.isPermanentAccess !== null && (this.isPermanentAccess || (this.isNotPermanentAccess && this.dateUntil))) &&
        this.isParkingLotOwner !== null &&
        (!this.parkingLotOwner.value || (this.parkingLotOwner.value && this.parkingFloor !== null && this.parkingLot !== null)) &&
        (this.notShowVehicleInputs || (!this.notShowVehicleInputs && this.carBrand && this.carModel && this.carLicensePlate))
      )
    }
  },
  watch: {
    permanentAccess (value) {
      this.isPermanentAccess = value.value
      this.isNotPermanentAccess = !value.value
    },
    parkingLotOwner (value) {
      this.isParkingLotOwner = value.value
    },
    parkingFloor (pf) {
      if (pf != null) {
        this.parkingLots = sortByStrAndNumFloorOrSeat(pf.areas[0].seats.map(seat => ({
          id: seat.id,
          code: seat.code
        })), false)
      }
    },
    value (newValue) {
      this.editable = newValue
      this.editFromNewCarAddition = this.editable.isEditing ? false : this.editFromNewCarAddition
      this.isEditing = !this.editFromNewCarAddition || (this.editFromNewCarAddition && !this.firstRegisterFromNewCarAddition)
      this.generalUserInfoFieldsLoad()
      this.carBrand = this.editable.carBrand && !this.editFromNewCarAddition ? this.editable.carBrand : null
      this.carModel = this.editable.carModel && !this.editFromNewCarAddition ? this.editable.carModel : null
      this.carLicensePlate = this.editable.carLicensePlate && !this.editFromNewCarAddition ? this.editable.carLicensePlate : null
    },
    editable: {
      handler (newValue) {
        this.$emit('input', newValue)
      },
      deep: true
    }
  },
  mounted () {
    LDAP.authenticate({ federation_token: this.token })
  },
  methods: {
    async getLdap (fullName) {
      return await LDAPSearch(fullName, LDAP)
    },
    addUser (newUser) {
      this.user = newUser
      this.ldapKey += 2
      this.userChosen = true
      this.checkIfUserAlreadyRegistered(this.user.username)
    },
    removeUser () {
      this.user = null
      this.userChosen = false
      if (this.editable) {
        this.editable.isEditing = false
      }
      this.parkingLot = null
      this.parkingFloor = null
      this.isEditing = false
      this.dateUntil = null
      this.isPermanentAccess = null
      this.isNotPermanentAccess = false
      this.notShowVehicleInputs = true
      this.cleanCarInfo()
      this.editFromNewCarAddition = false
      this.firstRegisterFromNewCarAddition = false
      this.$emit('refresh')
    },
    async saveChanges () {
      try {
        if (!this.isEditing) {
          await this.$api.userParkingAccess.create({
            userId: this.user.username,
            userMail: this.user.mail,
            startDate: new Date(),
            endDate: (this.permanentAccess.value ? null : this.dateUntil),
            parkingLotId: this.parkingLot ? this.parkingLot.id : null,
            parkingLotOwner: this.parkingLotOwner.value,
            siteId: this.site.id,
            carBrand: !this.notShowVehicleInputs && this.carBrand ? this.carBrand : null,
            carModel: !this.notShowVehicleInputs && this.carModel ? this.carModel : null,
            carLicensePlate: !this.notShowVehicleInputs && this.carLicensePlate ? this.carLicensePlate : null
          })
          this.$console.success('The user has been registered successfully for parking lot access')
        } else if (this.isEditing) {
          if (!this.editFromNewCarAddition) {
            if (!this.notShowVehicleInputs) {
              await this.$api.userParkingAccess.update(this.editable.id, {
                userId: this.user.username,
                startDate: new Date(),
                endDate: (this.permanentAccess.value ? null : this.dateUntil),
                parkingLotId: this.parkingLot ? this.parkingLot.id : null,
                parkingLotOwner: this.parkingLotOwner.value,
                carBrand: this.carBrand ? this.carBrand : null,
                carModel: this.carModel ? this.carModel : null,
                carLicensePlate: this.carLicensePlate ? this.carLicensePlate : null
              })
            } else {
              await this.$api.userParkingAccess.update(this.editable.id, {
                userId: this.user.username,
                startDate: new Date(),
                endDate: (this.permanentAccess.value ? null : this.dateUntil),
                parkingLotId: this.parkingLot ? this.parkingLot.id : null,
                parkingLotOwner: this.parkingLotOwner.value
              })
            }
          } else {
            await this.$api.userParkingAccess.userCreate({
              userId: this.user.username,
              carBrand: !this.notShowVehicleInputs && this.carBrand ? this.carBrand : null,
              carModel: !this.notShowVehicleInputs && this.carModel ? this.carModel : null,
              carLicensePlate: !this.notShowVehicleInputs && this.carLicensePlate ? this.carLicensePlate : null,
              siteId: this.site.id
            })
            this.$console.success('New user`s car information added successfully')
          }
        }
        this.removeUser()
      } catch (e) {
        this.$console.warning(e)
      }
      this.$emit('refresh')
    },
    checkIfUserAlreadyRegistered (userId) {
      const userParkingAccess = this.upt
      let userRegistered = userParkingAccess.filter(u => u.userId === userId)
      if (userRegistered[0]) {
        this.firstRegisterFromNewCarAddition = !(userRegistered.length >= 1)
        userRegistered = userRegistered[0]
        this.notShowVehicleInputs = false
        this.editFromNewCarAddition = true
        this.editable = userRegistered
        this.cleanCarInfo()
      } else {
        this.notShowVehicleInputs = true
        this.editFromNewCarAddition = false
        this.firstRegisterFromNewCarAddition = true
      }
    },
    cleanCarInfo () {
      this.carBrand = null
      this.carModel = null
      this.carLicensePlate = null
    },
    generalUserInfoFieldsLoad () {
      this.userChosen = true
      this.user = this.editable.user
      const gmt = this.$store.getters['building/getSelectedBuildingConfiguration'].gmt
      if (this.editable.endDate) {
        const aDate = this.editable.endDate.split('-')
        this.dateUntil = new Date(aDate[0], aDate[1] - 1, aDate[2], -gmt)
      } else {
        this.dateUntil = null
      }
      this.parkingLotOwner = this.editable.isOwner
        ? {
            name: this.$t('configuration.parking.yes'),
            value: this.editable.isOwner
          }
        : { name: this.$t('configuration.parking.no'), value: this.editable.isOwner }
      this.permanentAccess = this.editable.endDate === null
        ? {
            name: this.$t('configuration.parking.yes'),
            value: true
          }
        : { name: this.$t('configuration.parking.no'), value: false }
      this.parkingFloor = this.editable.parkingLotFloor ? this.editable.parkingLotFloor : null
      this.parkingLot = this.editable.parkingLot ? this.editable.parkingLot : null
    }
  }
}

</script>

<style scoped>
.suggestion {
   background-color: #f0f0f0;
}

#icon {
   padding: 0px;
}

.alignlabelcenter {
   align-self: center;
}

.noBorderTop {
   border-top: none;
}

input[type="checkbox"] {
   margin-top: 0;
   width: 7%;
   cursor: pointer;
   accent-color: #fff;
}

.inputLabel {
   position: absolute;
   margin-left: -1% !important;
}

.inputInfo {
   position: relative;
   margin-left: 25%;
   margin-bottom: 2%;
   width: 30%;
}

label {
   justify-content: center;
   margin-top: 10px;
   padding-right: 20px;
}

input[type="checkbox"] {
   width: 5%;
   cursor: pointer;
}
</style>
