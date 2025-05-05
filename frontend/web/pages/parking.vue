<template>
  <div>
    <box3>
      <h1>
        {{ $t('configuration.parking.info') }}
      </h1>
      <ui-grid class="terms" :columns="2">
        <row>
          <column :wide="3">
            <row>
              <column :wide="1">
                <label>{{ $t('configuration.parking.company') }}</label>
              </column>
              <column :wide="2">
                <input v-model="carBrand">
              </column>
              <column :wide="1">
                <label> {{ $t('configuration.parking.model') }} </label>
              </column>
              <column :wide="2">
                <input v-model="carModel">
              </column>
              <column :wide="1">
                <label> {{ $t('configuration.parking.plate') }} </label>
              </column>
              <column :wide="2">
                <input v-model="carLicensePlate">
              </column>
            </row>
            <hr>
            <btn-positive :disabled="enable" @click="add">
              <i class="icon plus" />{{ $t('configuration.parking.addCar') }}
            </btn-positive>
          </column>
          <column :wide="7">
            <br>
            <div v-if="showTable">
              <ui-table>
                <thead>
                  <tr>
                    <th>{{ $t('configuration.parking.company') }}</th>
                    <th>{{ $t('configuration.parking.model') }}</th>
                    <th>{{ $t('configuration.parking.plate') }}</th>
                    <th style="width: 7%">
                      {{ $t('configuration.parking.delete') }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="userParkingAccess in userParkingAccesses" :key="userParkingAccess.id">
                    <td> {{ userParkingAccess.carBrand }} </td>
                    <td> {{ userParkingAccess.carModel }} </td>
                    <td> {{ userParkingAccess.carLicensePlate }} </td>
                    <td style="width: 7%">
                      <btn-negative @click="remove(userParkingAccess)">
                        <i class="icon fa-trash" />
                      </btn-negative>
                    </td>
                  </tr>
                </tbody>
              </ui-table>
            </div>
          </column>
        </row>
      </ui-grid>
    </box3>
  </div>
</template>

<script>
export default {
  name: 'Parking',
  data () {
    return {
      vehicle: null,
      showTable: false,
      carBrand: null,
      carModel: null,
      carLicensePlate: null,
      userParkingAccesses: null
    }
  },
  computed: {
    loggedUser () { return this.$store.getters['auth/getUsername'] },
    enable () {
      return !(this.carBrand && this.carModel && this.carLicensePlate)
    }
  },
  watch: {
    userParkingAccesses (value) {
      this.showTable = !(value.length === 1 && value[0].carBrand === null)
    }
  },
  async mounted () {
    await this.loadParkingAccsses()
  },
  methods: {
    async loadParkingAccsses () {
      this.userParkingAccesses = await this.$api.userParkingAccess.mine()
    },
    async add () {
      try {
        await this.$api.userParkingAccess.userCreate({
          userId: this.loggedUser,
          updatedByUser: true,
          carBrand: this.carBrand,
          carModel: this.carModel,
          carLicensePlate: this.carLicensePlate,
          siteId: this.userParkingAccesses[0].siteId
        })
        this.$console.success('New user`s car information added successfully')
      } catch (e) {
        this.$console.warning(e)
      }
      this.carLicensePlate = null
      this.carModel = null
      this.carBrand = null
      await this.loadParkingAccsses()
    },
    async remove (userParkingAccess) {
      if (this.userParkingAccesses.length === 1) {
        const body = { carBrand: null, carModel: null, carLicensePlate: null, updatedByUser: true }
        await this.$api.userParkingAccess.update(userParkingAccess.id, body)
      } else {
        await this.$api.userParkingAccess.delete(userParkingAccess.id)
      }
      await this.loadParkingAccsses()
    }
  }
}
</script>

<style scoped>
label {
  justify-content: center;
  margin-top: 10px;
  padding-right: 20px;
}
.terms{
  margin-left: 2%;
  flex-wrap: wrap;
}
#check {
  display: inline-flex;
  width: 100%;
}
  p{
    padding: 1rem 1rem;
  }
  a{
    font-size: 17px;
  }
  a:hover {
    cursor: pointer;
    border-bottom: 1px solid currentColor;
  }
input[type=checkbox]{
  width: 5%;
  cursor: pointer;
}
</style>
