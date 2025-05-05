<template>
  <modal
    :title="$t('configuration.parking.title')"
    show
    closeable
    @close="close"
    @ok="submit"
  >
    <notification />
    <ui-grid :columns="2">
      <row>
        <column :wide="3">
          <label>{{ $t('configuration.parking.floor') }}</label>
        </column>
        <column>
          <input v-model="editable.number">
        </column>
      </row>
      <br>
      <row>
        <column :wide="3">
          <label> {{ $t('configuration.hood.colFloorMap') }} </label>
        </column>
        <column :wide="8">
          <!--          Azure maps-->
          <file-input :placeholder="$t('mainpage.feedbackModal.uploadFile')" :clean="clean" :accept="accept" :max-size="maxSize" @input="updateFile" />
          <p class="file-description">
            ({{ $t('configuration.parking.fileUploadDescription') }})
          </p>
          <div>
            <svg-pan-zoom v-if="isSvgImageFormat && existImage" :image-path="image" object-id="parkingMap" />
            <img v-else-if="!isSvgImageFormat && existImage" class="map" :src="image">
          </div>
          <btn-negative v-if="existImage" class="btn-img" @click="deleteImage">
            <icon icon="trash" />
          </btn-negative>
        </column>
      </row>
      <hr>
    </ui-grid>
    <table class="table">
      <thead>
        <tr>
          <th><h3>{{ $t('configuration.parking.parkingLot') }}</h3></th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="pl in editable.parkingLots" :key="pl">
          <td>{{ pl }}</td>
          <td>
            <btn-negative @click="remove(pl)">
              <icon icon="trash" />
            </btn-negative>
          </td>
        </tr>
        <tr>
          <td> <input v-model="parkingLot" type="number" :placeholder="$t('configuration.parking.parkingLot')" @keyup.enter="add"> </td>
          <td>
            <btn-primary @click="add">
              <i class="icon plus" />
              {{ $t('configuration.parking.addParkingLot') }}
            </btn-primary>
          </td>
        </tr>
      </tbody>
    </table>

    <template #footer>
      <btn-negative @click="close">
        <i class="icon undo" /> {{ $t('modal.cancel') }}
      </btn-negative>

      <btn-positive @click="submit">
        <i class="icon save" />
        {{ $t('configuration.hood.saveChangesBtn') }}
      </btn-positive>
    </template>
    <modal
      id="modalOfSeatDeletion"
      :title="$t('configuration.parking.deletingParking')"
      :show="showModal && seatDeleted"
      closeable
      @close="toggleModal"
      @ok="submitActualData"
    >
      <h5>{{ $t('configuration.parking.deletingParkingMessage') }}</h5>
    </modal>
  </modal>
</template>

<script>
import Notification from '@/components/layouts/Notification'
import Modal from '@/components/ui/Modal'

export default {
  name: 'ParkingModal',
  components: { Modal, Notification },
  props: {
    parkingFloor: { type: Object, required: true }
  },
  data () {
    return {
      editable: null,
      parkingLot: '',
      accept: 'image/png, image/jpeg, image/svg+xml',
      maxSize: '720 KB',
      image: null,
      isSvgImageFormat: true,
      clean: false,
      seatDeleted: false,
      showModal: false
    }
  },
  computed: {
    disableSave () {
      return !(this.editable.parkingLots && this.editable.parkingLots.length > 0 && this.editable.number && this.editable.number.length > 0)
    },
    existImage () {
      return this.image !== null
    }
  },
  watch: {
    editable: {
      handler (newValue) {
        const map = newValue ? newValue.map : '-'
        if (map !== '-' && map !== undefined) {
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
        }
        this.$emit('input', newValue)
      },
      deep: true
    }
  },
  created () {
    this.editable = this.parkingFloor
  },
  methods: {
    toggleModal () {
      this.showModal = !this.showModal
    },
    submit () {
      if (this.seatDeleted) { this.toggleModal() } else {
        this.submitActualData()
      }
    },
    submitActualData () {
      this.toggleModal()
      this.image = null
      this.$emit('ok', this.editable)
    },
    close () {
      this.seatDeleted = false
      this.image = null
      this.$emit('close')
    },
    updateFile (f) {
      if (f !== '') {
        const blobToBase64 = (blob) => {
          const reader = new FileReader()
          reader.readAsDataURL(blob)
          return new Promise((resolve) => {
            reader.onloadend = () => {
              resolve(reader.result)
            }
          })
        }
        blobToBase64(f).then((res) => {
          this.editable.map = res
        })
      }
      const urlCreator = window.URL || window.webkitURL
      const imageUrl = urlCreator.createObjectURL(f)
      this.image = imageUrl
    },
    add () {
      if (!this.editable.parkingLots) { this.editable.parkingLots = [] }
      if (!this.parkingLot) { return }
      if (this.editable.parkingLots.includes(parseInt(this.parkingLot))) {
        this.$console.warn(`The parking lot ${this.parkingLot} already exists in ${this.editable.number}`)
        this.parkingLot = ''
        return
      } else {
        this.editable.parkingLots.push(this.parkingLot)
      }
      this.parkingLot = ''
      this.editable = { ...this.editable }
    },
    remove (pf) {
      this.seatDeleted = true
      this.editable.parkingLots = this.editable.parkingLots.filter(p => p !== pf)
      this.editable = { ...this.editable }
    },
    deleteImage () {
      this.image = null
      if (this.clean) {
        this.clean = false
      } else {
        this.clean = true
      }
      this.editable.map = '-'
    }
  }
}
</script>

<style lang="scss" scoped>
.svg-container {
  padding: 0;
}

.container{
  width: 100%;
  min-width: auto;
}

input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.map{
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}
.btn-img{
  position: absolute;
  right: 0;
}
.file-description {
  font-size: 12px;
  color: #797979;
  margin-top: 12px;
}
</style>
