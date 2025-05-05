<!--<template>-->
<!--  <modal-->
<!--    v-if="showModal"-->
<!--    :title="$t('configuration.seats_config.modify_hoods')"-->
<!--    show-->
<!--    closeable-->
<!--    @ok="confirm"-->
<!--    @close="close"-->
<!--  >-->
<!--    <box3>-->
<!--      <div class="field">-->
<!--        <label>{{ $t('configuration.seats_config.hoods') }}</label>-->
<!--        <dropdown v-model="hood" :non-selected="$t('configuration.seats_config.hoods_title')" :options="hoods" :label-selector="(h)=>h.name" />-->
<!--        <btn-secondary @click="addHood">-->
<!--          <i class="icon plus" />-->
<!--        </btn-secondary>-->
<!--      </div>-->
<!--      <ui-grid :columns="2 + selectedHoods.length">-->
<!--        <row>-->
<!--          <column><b>{{ $t('app.floortitle') }}</b></column>-->
<!--          <column v-for="(h, i) in selectedHoods" :key="i">-->
<!--            <b>{{ h.hood }}</b>-->
<!--          </column>-->
<!--        </row>-->
<!--        <row v-for="(s, i) in selectedSeats" :key="i">-->
<!--          <column>{{ s[0].code }} </column>-->
<!--          <column v-for="(h, i) in selectedHoods" :key="i">-->
<!--            <column v-for="(seat, i) in h.seats" :key="i">-->
<!--              <input v-show="s[0].code+'' === Object.keys(seat)[0]+'' " v-model="seat[s[0].code]" type="checkbox">-->
<!--            </column>-->
<!--          </column>-->
<!--          <column>-->
<!--            <btn-secondary @click="deleteSeat(s)">-->
<!--              <i class="icon trash" />-->
<!--            </btn-secondary>-->
<!--          </column>-->
<!--        </row>-->
<!--        <row>-->
<!--          <column>All</column>-->
<!--          <column v-for="(h, i) in selectedHoods" :key="i">-->
<!--            <input type="checkbox" @change="checkAllSeatsInHood(h, $event.target.checked)">-->
<!--          </column>-->
<!--        </row>-->
<!--      </ui-grid>-->
<!--    </box3>-->
<!--  </modal>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
<!--  name: 'HoodsModal',-->
<!--  data () {-->
<!--    return {-->
<!--      hood: null,-->
<!--      checkHood: null-->
<!--    }-->
<!--  },-->
<!--  computed: {-->
<!--    showModal () { return this.$store.getters['configSeats/getModalHoods'] },-->
<!--    hoods () { return this.$store.getters['configSeats/getSiteHoods'] },-->
<!--    selectedSeats () { return this.$store.getters['configSeats/getSeatsWithHoods'] },-->
<!--    selectedHoods () { return JSON.parse(JSON.stringify(this.$store.getters['configSeats/getSelectedHoods'])) }-->
<!--  },-->
<!--  mounted () {-->
<!--    this.hood = null-->
<!--  },-->
<!--  methods: {-->
<!--    addHood () {-->
<!--      if (this.hood !== null) {-->
<!--        this.$store.dispatch('configSeats/addHood', this.hood)-->
<!--      }-->
<!--    },-->
<!--    confirm () {-->
<!--      this.$store.dispatch('configSeats/confirmModifyHoods', this.selectedHoods)-->
<!--      this.hood = null-->
<!--    },-->
<!--    close () {-->
<!--      this.$store.dispatch('configSeats/toggleModalHoods', false)-->
<!--      this.hood = null-->
<!--    },-->
<!--    deleteSeat (seat) {-->
<!--      this.$store.dispatch('configSeats/deleteSelectedSeat', seat)-->
<!--    },-->
<!--    checkAllSeatsInHood (hood, value) {-->
<!--      const data = { hood, check: value }-->
<!--      this.$store.dispatch('configSeats/checkAllSeatsInHood', data)-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style lang="scss" scoped>-->
<!--.field{-->
<!--  float: right;-->
<!--  select {-->
<!--    width: 200px;-->
<!--  }-->
<!--  button {-->

<!--  }-->
<!--}-->
<!--.grid{-->
<!--  margin-top: 50px !important;-->
<!--  overflow-x: scroll;-->
<!--  .column {-->
<!--  }-->
<!--  //border-collapse: collapse;-->
<!--}-->
<!--</style>-->
