<template>
  <div>
    <h3>
      {{ $t('configuration.parking.parkingAccess') }}
    </h3>
    <div class="table-filter">
      <label>{{ $t('configuration.parking.findByUserName') }}: </label><input
        v-model="searchInput"
        type="text"
        :placeholder="$t('searchbox.search')"
      >
      <btn-positive @click="getCSV">
        <i class="icon save" />
        {{ $t('reports.download') }}
      </btn-positive>
    </div>
    <ui-grid :columns="16">
      <row>
        <column :wide="1">
          <b>{{ $t('configuration.superadmin.fullName') }}</b>
        </column>
        <column :wide="1">
          <b>{{ $t('configuration.parking.company') }}</b>
        </column>
        <column :wide="1">
          <b>{{ $t('configuration.parking.model') }}</b>
        </column>
        <column :wide="1">
          <b>{{ $t('configuration.parking.plate') }}</b>
        </column>
        <column :wide="1">
          <b> {{ $t('configuration.parking.permanentAccess') }} </b>
        </column>
        <column :wide="1">
          <b> {{ $t('configuration.parking.lastDateValidParkingLot') }} </b>
        </column>
        <column :wide="1">
          <b> {{ $t('configuration.parking.parkingLotAssigned') }} </b>
        </column>
        <column :wide="1">
          <b> {{ $t('configuration.parking.owner') }} </b>
        </column>
        <column :wide="1">
          <b> {{ $t('configuration.parking.state') }} </b>
        </column>
        <column :wide="1">
          <b> {{ $t('configuration.hood.colEdit') }} </b>
        </column>
        <column :wide="1">
          <b> {{ $t('configuration.hood.colDelete') }} </b>
        </column>
        <column :wide="1">
          <b> {{ $t('configuration.parking.enableAccess') }} </b>
        </column>
      </row>
      <row v-for="userParkingAccess in userParkingAccessesFiltered" :key="userParkingAccess.id">
        <column :wide="1">
          {{ userParkingAccess.user ? userParkingAccess.user.full_name : userNotFound(userParkingAccess) }}
        </column>
        <column :wide="1">
          {{ userParkingAccess.carBrand }}
        </column>
        <column :wide="1">
          {{ userParkingAccess.carModel }}
        </column>
        <column :wide="1">
          {{ userParkingAccess.carLicensePlate }}
        </column>
        <column :wide="1">
          {{ userParkingAccess.endDate ? $t('configuration.parking.no') : $t('configuration.parking.yes') }}
        </column>
        <column :wide="1">
          {{ userParkingAccess.endDate ? userParkingAccess.endDate : '-' }}
        </column>
        <column :wide="1">
          {{ userParkingAccess.parkingLotShowed }}
        </column>
        <column :wide="1">
          {{ userParkingAccess.isOwner ? $t('configuration.parking.yes') : $t('configuration.parking.no') }}
        </column>
        <column :wide="1">
          {{ userParkingAccess.carBrand || userParkingAccess.carModel || userParkingAccess.carLicensePlate ?
            $t('configuration.parking.completed') : $t('configuration.parking.missing')
          }}
        </column>
        <column :wide="1">
          <btn-primary class="buttons" @click="$emit('go-section', ['access', userParkingAccess])">
            <i class="icon pencil alternate" />
          </btn-primary>
        </column>
        <column :wide="1">
          <btn-negative class="buttons" @click="deleteUser(userParkingAccess)">
            <i class="icon fa-trash" />
          </btn-negative>
        </column>
        <column :wide="1">
          <input
            :checked="userParkingAccess.startDate !== null"
            :disabled="!enableCheckBox(userParkingAccess)"
            class="cancelCheckbox"
            type="checkbox"
            @click="allowAccess(userParkingAccess)"
          >
        </column>
      </row>
    </ui-grid>
    <dialog-modal
      :show="deleting"
      :title="$t('modal.dialog')"
      :body="$t('configuration.parking.deletedUserAccessWarning')"
      closeable
      @close="deleting = false"
      @ok="remove"
    />
  </div>
</template>

<script>
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import DialogModal from '@/components/modals/DialogModal'

export default {
  name: 'AssignedParkingTable',
  components: { DialogModal },
  props: {
    upt: { type: Array, required: true }
  },
  data () {
    return {
      deleting: false,
      userParkingAccess: null,
      searchInput: '',
      userParkingAccessesFiltered: [],
      userParkingAccesses: null
    }
  },
  watch: {
    searchInput (newValue) {
      if (newValue !== '') {
        this.userParkingAccessesFiltered = this.userParkingAccesses.filter((p) => {
          return p.user.full_name.toLowerCase().includes(newValue.toLowerCase())
        })
      } else {
        this.userParkingAccessesFiltered = this.userParkingAccesses
      }
    }
  },
  mounted () {
    this.userParkingAccesses = [...this.upt]
    this.userParkingAccessesFiltered = this.userParkingAccesses
  },
  methods: {
    getCSV () {
      // get keys as array
      let data = this.userParkingAccesses.sort((a, b) => {
        return a.user.full_name.localeCompare(b.user.full_name)
      })
      data = data.map((a) => {
        const a1 = JSON.parse(JSON.stringify(a))
        delete a1.parkingLotFloor
        delete a1.parkingLot
        a1.user = a1.user.full_name
        return a1
      })
      const headers = Object.keys(data[0])

      function exportCSVFile (headers, items, fileTitle) {
        if (headers) {
          items.unshift(headers)
        }
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
        // Create a new Work Sheet using the data stored in an Array of Arrays.
        //
        const arrify = (arr = []) => {
          const res = []
          const { length: l } = arr
          for (let i = 0; i < l; i++) {
            const obj = arr[i]
            const subArr = Object.values(obj)
            res.push(subArr)
          };
          return res
        }
        const workSheet = XLSX.utils.aoa_to_sheet(arrify(items))
        // Generate a Work Book containing the above sheet.
        const workBook = {
          Sheets: { data: workSheet, cols: [] },
          SheetNames: ['data']
        }
        // Exporting the file with the desired name and extension.
        const excelBuffer = XLSX.write(workBook, { bookType: 'xlsx', type: 'array' })
        const fileData = new Blob([excelBuffer], { type: fileType })
        FileSaver.saveAs(fileData, fileTitle)
      }

      exportCSVFile(headers, data, 'result.xlsx')
    },
    async allowAccess (userParkingAccess) {
      if (!userParkingAccess.startDate) {
        await this.$api.userParkingAccess.update(userParkingAccess.id, {
          userId: userParkingAccess.userId,
          startDate: new Date(),
          endDate: userParkingAccess.endDate,
          updatedByAdmin: true,
          carBrand: userParkingAccess.carBrand,
          carModel: userParkingAccess.carModel,
          carLicensePlate: userParkingAccess.carLicensePlate
        })
      } else if (userParkingAccess.startDate) {
        await this.$api.userParkingAccess.update(userParkingAccess.id, { userId: userParkingAccess.userId, startDate: null, updatedByAdmin: true })
      }
      // this.$emit('refresh')
    },
    deleteUser (pa) {
      this.userParkingAccess = pa
      this.deleting = true
    },
    async remove () {
      this.deleting = false
      const data = JSON.parse(JSON.stringify(this.userParkingAccess))
      try {
        await this.$api.userParkingAccess.deleteUserInfo(data)
      } catch (e) {
        this.$console.warning(e)
      }
      this.$emit('refresh')
    },
    userNotFound (pa) {
      this.userParkingAccess = pa
      this.remove()
    },
    enableCheckBox (pa) {
      if (pa.carBrand && pa.carModel && pa.carLicensePlate) {
        return true
      } else { return false }
    }
  }
}
</script>

<style scoped lang="scss">
input[type=checkbox] {
  margin-top: 0;
  margin-left: 20%;
  width: 20%;
  cursor: pointer;
  accent-color: #fff;
}

.row:not(#bar) {
  border-bottom: 1px solid lightgray;
}

.buttons {
  width: 70%;
  text-align: center;
  padding-left: 25%;
}

.table-filter {
  padding: 10px;

  label {
    margin-right: 5px;
  }
}
</style>
