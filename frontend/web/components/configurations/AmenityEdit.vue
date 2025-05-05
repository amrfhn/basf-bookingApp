<template>
  <ui-grid :columns="3">
    <row>
      <column>{{ $t('configuration.seats_config.amenityName') }}:</column>
      <column><input v-model="editable.key" :placeholder="$t('configuration.seats_config.amenityName')"></column>
      <column />
    </row>
    <row>
      <column>{{ $t('configuration.amenities.filterable') }}:</column>
      <column><input v-model="editable.filterable" type="checkbox"></column>
      <column />
    </row>
    <row>
      <column>{{ $t('configuration.seats_config.amenityType') }}:</column>
      <column>
        <dropdown
          v-model="editable.type"
          :non-selected="$t('configuration.seats_config.amenityType')"
          :options="types"
        />
      </column>
      <column />
    </row>

    <row v-if="editable.type === 'MULTI'">
      <table class="table">
        <thead>
          <tr>
            <th><h3>Amenity Values</h3></th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-for="av in editable.values" :key="av">
            <td>{{ av }}</td>
            <td>
              <btn-negative @click="remove(av)">
                <i class="icon trash" />
              </btn-negative>
            </td>
          </tr>
          <tr>
            <td><input v-model="amenityValue" :placeholder="$t('configuration.seats_config.amenityValue')"></td>
            <td>
              <btn-primary @click="addValue">
                <i class="icon plus" />
              </btn-primary>
            </td>
          </tr>
        </tbody>
      </table>
    </row>
  </ui-grid>
</template>

<script>
export default {
  name: 'AmenityEdit',
  props: {
    value: { type: null, default: null }
  },
  data () {
    return {
      editable: this.value,
      amenityValue: null,
      types: ['NUMERIC', 'BOOLEAN', 'MULTI']
    }
  },
  computed: {},
  watch: {
    value (newValue) {
      this.editable = newValue
    },
    editable: {
      handler (newValue) {
        this.$emit('input', newValue)
      },
      deep: true
    }
  },
  methods: {
    addValue () {
      if (!this.editable.values) {
        this.editable.values = []
      }

      if (!this.amenityValue) {
        return
      }
      if (!this.amenityValue.length) {
        return
      }
      if (this.editable.values.includes(this.amenityValue)) {
        return
      }

      this.editable.values.push(this.amenityValue)
      this.amenityValue = null
      this.editable = { ...this.editable }
    },
    remove (av) {
      this.editable.values = this.editable.values.filter(a => a !== av)
      this.editable = { ...this.editable }
    }
  }
}
</script>

<style lang="scss" scoped>
input {
  width: 100%;
}

.svg-container {
  padding: 0;
}
</style>
