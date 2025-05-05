<template>
  <div>
    <box3>
      <div v-if="selectedBuilding || (selectedSite && superAdmin)" style="display: inline-flex">
        <ui-grid v-if="selectedSite && superAdmin" :columns="2">
          <hr>
          <hr>
          <hr>
          <row>
            <column class="field">
              <label>{{ $t('configuration.sites.name') }}</label>
            </column>
            <column :wide="5" class="select">
              <input v-model="selectedSite.name" class="form-control">
            </column>
          </row>
          <row>
            <column class="field">
              <label>{{ $t('configuration.sites.country') }}</label>
            </column>
            <column :wide="5" class="select">
              <input v-model="selectedSite.country" class="form-control">
            </column>
          </row>
          <row>
            <column class="field">
              <label>{{ $t('configuration.sites.city') }}</label>
            </column>
            <column :wide="5" class="select">
              <input v-model="selectedSite.city" class="form-control">
            </column>
          </row>
          <row>
            <column class="field">
              <label>{{ $t('configuration.sites.managerRoleId') }}</label>
            </column>
            <column :wide="5" class="select">
              <input v-model="selectedSite.managerRoleId" class="form-control">
            </column>
          </row>
          <row>
            <column class="field">
              <label>{{ $t('configuration.sites.adminRoleId') }}</label>
            </column>
            <column :wide="5" class="select">
              <input v-model="selectedSite.adminRoleId" class="form-control">
            </column>
          </row>
          <row>
            <column class="field">
              <label>{{ $t('configuration.sites.startDate') }}</label>
            </column>
            <column :wide="5" class="select">
              <input v-model="selectedSite.startDate" class="form-control">
            </column>
          </row>
          <row>
            <column class="field">
              <label>{{ $t('configuration.sites.endDate') }}</label>
            </column>
            <column :wide="5" class="select">
              <input v-model="selectedSite.endDate" class="form-control">
            </column>
          </row>
          <row>
            <column class="field">
              <label>{{ $t('configuration.sites.deletionDays') }}</label>
            </column>
            <column :wide="5" class="select">
              <input v-model="selectedSite.deletionDays" class="form-control" min="0" type="number">
            </column>
          </row>
        </ui-grid>
        <ui-grid v-if="selectedBuilding" :columns="4">
          <row>
            <h3>{{ $t('configuration.buildings.title') }}</h3>
          </row>
          <row v-if="superAdmin">
            <column class="field">
              <label>{{ $t('configuration.buildings.name') }}</label>
            </column>
            <column :wide="3">
              <input v-model="selectedBuilding.name" class="form-control">
            </column>
          </row>
          <row v-if="superAdmin">
            <column class="field">
              <label>{{ $t('configuration.buildings.address') }}</label>
            </column>
            <column :wide="3">
              <input v-model="selectedBuilding.address" class="form-control">
            </column>
          </row>
          <row>
            <column class="field">
              <label> {{ $t('configuration.periodCollaborator') }} </label>
            </column>
            <column :wide="2">
              <input v-model="selectedBuilding.reservationDays" class="form-control" min="0" type="number">
            </column>
            <column>
              <label> {{ $t('configuration.days') }}. </label>
            </column>
          </row>
          <row>
            <column class="field">
              <label> {{ $t('configuration.periodManager') }} </label>
            </column>
            <column :wide="2">
              <input v-model="selectedBuilding.managerReservationDays" class="form-control" min="0" type="number">
            </column>
            <column>
              <label> {{ $t('configuration.days') }}. </label>
            </column>
          </row>
          <row>
            <column class="field">
              <label> {{ $t('configuration.parkingReservationPeriod') }} </label>
            </column>
            <column :wide="2">
              <input v-model="selectedBuilding.parkingReservationDays" class="form-control" min="0" type="number">
            </column>
            <column>
              <label> {{ $t('configuration.days') }}. </label>
            </column>
          </row>
          <row>
            <column class="field">
              <label> {{ $t('configuration.preBooksAvailability') }} </label>
            </column>
            <column :wide="2">
              <input v-model="selectedBuilding.reservationCancellationHours" class="form-control" min="0" type="number">
            </column>
            <column>
              <label> {{ $t('configuration.hours') }}. </label>
            </column>
          </row>
          <row>
            <column class="field">
              <label> {{ $t('configuration.cancellationTimeout') }} </label>
            </column>
            <column :wide="2">
              <input v-model="selectedBuilding.cancellationHours" class="form-control" min="0" type="number">
            </column>
            <column>
              <label> {{ $t('configuration.hours') }}. </label>
            </column>
          </row>
          <row>
            <column class="field">
              <label> {{ $t('configuration.timezone') }} </label>
              <label class="gmt"> {{ $t('configuration.gmt') }} </label>
            </column>
            <column :wide="2">
              <input v-model="selectedBuilding.gmt" class="form-control" max="14" min="-13" type="number">
            </column>
            <column />
          </row>
          <row v-if="superAdmin">
            <column class="field">
              <label>Start Date</label>
            </column>
            <column :wide="2">
              <input v-model="selectedBuilding.startDate" class="form-control">
            </column>
          </row>
          <row v-if="superAdmin">
            <column class="field">
              <label>End Date</label>
            </column>
            <column :wide="2">
              <input v-model="selectedBuilding.endDate" class="form-control">
            </column>
          </row>
        </ui-grid>
      </div>
      <div v-if="selectedBuilding || (selectedSite && superAdmin)">
        <br>
        <btn-positive @click="saveChanges">
          <i />{{ $t('configuration.save') }}
        </btn-positive>
        <br>
      </div>
      <!--      <dialog-modal :show="savingWithDialogModal" :title="$t('configuration.sites.anonymizationModalMessage', { days: modalAnonymizationDays })" closeable @close="savingWithDialogModal=false" @ok="saveChangesProcess" />-->
    </box3>

    <div class="floor-config-container">
      <h3 class="green">
        {{ $t('configuration.floor') }}
      </h3>
      <div class="floor-container">
        <label>{{ $t('configuration.floors.floor') }}</label>
        <select v-model="selectedFloorConfig" class="floor-select">
          <option disabled value>
            {{ $t('configuration.floors.selectFloor') }}
          </option>
          <option v-for="floor in selectedFloor" :key="floor.id" class="floor-option">
            {{ floor.number }}
          </option>
        </select>
      </div>
      <div class="floor-container">
        <label>{{ $t('configuration.floors.landingZones') }}</label>
        <textarea v-model="landingZoneDescription" class="landing-zones-textarea" />
      </div>
      <button class="btn-floor-save" @click="saveLandingZones">
        {{ $t('configuration.save') }}
      </button>
    </div>

    <box3 v-if="selectedBuilding" class="report">
      <ui-grid :columns="6">
        <h3 style="padding-left: 0">
          {{ $t('configuration.feedback.title') }}
        </h3>
        <row>
          <label>{{ $t('configuration.feedback.enterEmail') }}</label>
          <input v-model="mail" class="form-email" type="email">
          <btn-positive :disabled="disable" @click="addMail">
            <i class="icon plus" />
          </btn-positive>
        </row>
        <h3 style="padding-left:0">
          {{ $t('configuration.feedback.sitesMails') }}
        </h3>
        <row>
          <column :wide="4">
            <b>{{ $t('configuration.feedback.email') }}</b>
          </column>
          <column :wide="4">
            <b>{{ $t('configuration.feedback.delete') }}</b>
          </column>
        </row>
        <row v-for="mail in mails" :key="mail">
          <column :wide="4">
            {{ mail }}
          </column>
          <column :wide="4">
            <btn-negative @click="removeMail(mail)">
              <i class="icon fa-trash" />
            </btn-negative>
          </column>
          <column v-if="lastMail" :wide="4">
            <h4>There must be at least one contact email</h4>
          </column>
        </row>
      </ui-grid>
    </box3>
  </div>
</template>

<script>
export default {
  name: 'SiteConfigurations',
  layout: 'configuration',
  data () {
    return {
      floors: null,
      editing: null,
      newName: '',
      mail: null,
      mails: null,
      lastMail: false,
      disable: true,
      wrongMail: false,
      selectedFloor: [],
      selectedlandingzone: '',
      selectedFloorConfig: '',
      floorSelectedId: null,
      landingZoneDescription: ''
      // initialAnonymizationDays: -1,
      // savingWithDialogModal: false,
      // modalAnonymizationDays: ''
    }
  },
  computed: {
    selectedSite: {
      get () {
        return this.$store.getters['site/getSelectedSiteConfiguration'] ? { ...this.$store.getters['site/getSelectedSiteConfiguration'] } : null
      },
      set (site) {
        this.$store.dispatch('site/selectSiteConfiguration', site)
      }
    },
    selectedBuilding: {
      get () {
        return this.$store.getters['building/getSelectedBuildingConfiguration'] ? { ...this.$store.getters['building/getSelectedBuildingConfiguration'] } : null
      },
      set (site) {
        this.$store.dispatch('building/selectBuildingConfiguration', site)
      }
    },
    superAdmin () {
      return this.$store.getters['auth/getRoles'].isSuperAdmin
    }
  },
  watch: {
    selectedBuilding (building) {
      this.showLandingZones(building)
      this.selectedFloorConfig = ''
      this.landingZoneDescription = ''
    },
    selectedSite (site) {
      this.loadMails(site)
      this.selectedFloorConfig = ''
      this.landingZoneDescription = ''
    },
    mail (value) {
      value ? this.disable = false : this.disable = true
    },
    selectedFloorConfig (value) {
      const floorSelected = this.selectedFloor.filter(f => f.number === value)
      if (floorSelected) {
        this.landingZoneDescription = floorSelected[0]?.landingZones
        this.floorSelectedId = floorSelected[0]?.id
      }
    }
  },
  mounted () {
    this.$nuxt.$emit('updateTitle', 'configuration.site')
    if (this.selectedSite) {
      this.loadMails(this.selectedSite)
    }
  },
  methods: {
    async saveLandingZones () {
      console.log('Save landing zones')
      const floor = { landingZones: this.landingZoneDescription }
      if (this.selectedFloorConfig) {
        await this.$api.floor.update(this.floorSelectedId, floor)
        this.$console.success(this.$dk('configuration.savedChanges'))
      }
    },
    saveChanges () {
      // TODO modal to confirm the deletions of the days
      // if (this.initialAnonymizationDays !== this.selectedSite.anonymizationDaysConfig) {
      //   this.modalAnonymizationDays = this.selectedSite.anonymizationDaysConfig.toString()
      //   this.savingWithDialogModal = true
      // } else {
      this.saveChangesProcess()
      // }
    },
    async saveChangesProcess () {
      if (this.selectedBuilding) {
        console.log(this.selectedBuilding)
        const returnedSite = await this.$api.site.update(this.selectedSite.id, this.selectedSite)
        await this.$api.building.update(this.selectedBuilding.id, this.selectedBuilding)
        this.$store.dispatch('site/updateConfigurationSite', returnedSite)
        this.$store.dispatch('site/selectSiteConfiguration', returnedSite)
        this.$console.success(this.$dk('configuration.savedChanges'))
      } else {
        this.$console.warn(this.$dk('configuration.selectSite'))
      }
      // this.savingWithDialogModal = false
    },
    edit (f) {
      this.editing = f.id
      this.newName = f.landingZones
      setTimeout(function () {
        this.$refs['edit' + f.id][0].focus()
      }.bind(this), 200)
    },
    async saveEdit (f) {
      const floor = { ...f, landingZones: this.newName }
      this.editing = null
      if (floor) {
        await this.$api.floor.update(floor.id, floor)
        this.$console.success(this.$dk('configuration.savedChanges'))
        await this.showLandingZones()
      }
    },
    loadMails (site) {
      this.mails = null
      if (site) {
        const mails = site.feedbackContact.split('; ')
        this.mails = mails
      }
    },
    async addMail () {
      if (this.mail && !(this.selectedSite.feedbackContact.split('; ').includes(this.mail))) {
        const mails = this.selectedSite.feedbackContact.concat('; ', this.mail)
        this.selectedSite.feedbackContact = mails
        await this.$api.site.update(this.selectedSite.id, this.selectedSite)
        this.$console.success('Mail added')
        this.mails = this.selectedSite.feedbackContact.split('; ')
      }
      this.mail = null
      this.lastMail = false
    },
    async removeMail (mail) {
      if (this.mails.length > 1) {
        const mails = this.mails
        mails.splice(mails.indexOf(mail), 1)
        this.selectedSite.feedbackContact = mails.join('; ')
        await this.$api.site.update(this.selectedSite.id, this.selectedSite)
        this.$console.warn('Mail removed')
        this.mails = this.selectedSite.feedbackContact.split('; ')
      } else {
        this.lastMail = true
      }
    },
    async showLandingZones (building) {
      if (building) {
        const floors = await this.$api.building.floors(building.id)
        this.selectedFloor = floors
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.floor-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.floor-config-container {
  background-color: #f0f0f0;
  margin-top: 10px;
  padding: 15px;
}

.floor-select, .landing-zones-textarea, .btn-floor-save {
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
}

.green {
  color: #00793A;
}

.landing-zones-textarea {
  font-size: 14px;
  color: #555;
  background-color: #fff;
  background-image: none;
  resize: none;
  margin-bottom: 15px;
  width: 90%;
  &:focus {
      border-color: #66afe9;
      outline: 0;
      -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);
      box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)
  }
}

.floor-select {
  width: 180px;
  cursor: pointer;
  &:focus {
    border-color: #198f35;
    outline: 0;
  }
}

.btn-floor-save {
  width: 180px;
  background-color: #198f35;
  color: #fff;
  cursor: pointer;
  &:hover {
    background-color: #1da83d;
  }
}

@media (max-width: 500px) {
  .btn-floor-save, .floor-select, .landing-zones-textarea { width: 100%; }
}

.field {
  color: #000;
  width: 50%;
}

label:not(.bar) {
  justify-content: center;
  margin-top: 5px;
  padding-right: 20px;
}

p {
  justify-content: center;
  margin-top: 10px;
}

input[type=number] {
  text-align: center;
  text-indent: 1em;
}

.inputText {
  text-indent: 1em;
  width: 50%;
  padding: 5px;
  text-align: start;
  cursor: pointer;
  border-radius: 3px;
  border: 1px solid rgba(34, 36, 38, .15);

  &:focus-visible {
    outline: #00793A solid 0.5px;
    outline-offset: -1px;
  }
}

.gmt {
  float: right;
  padding-right: 0;
}

.departmentTable {
  margin: 20px 0;
  padding: 20px;
  border: 2px solid #00793A;
  background-color: #D9EBE2;
}

.btn {
  background-color: #D9EBE2;
  color: #00793A;
  outline: none;
  font-size: 20px;
  padding-top: 0;
}

.edit {
  text-align: right;
  padding-right: 4%;
}

.editHead {
  text-align: right;
  padding-right: 5.2%;
}

.select {
  right: 25%;
}

.form-email {
  text-align: start;
  margin-right: 20px;
  width: 395px;
  border-radius: 3px;
  border: 1px solid rgba(34, 36, 38, .15);

  &:focus-visible {
    outline: #00793A solid 0.5px;
    outline-offset: -1px;
  }
}

</style>
