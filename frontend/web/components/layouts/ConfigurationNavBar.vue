<template>
  <div>
    <h1>{{ $t('navbar.configuration') }}</h1>
    <ui-grid style="text-align: center" :columns="7 + superAdmin">
      <row style="text-align: left">
        <column class="field">
          <label>&nbsp;</label><br>
          <nuxt-link :to="localePath({ path: '/configuration/site'})">
            <i class="icon building" /> {{ $t('searchbox.sitelabel') }}
          </nuxt-link>
        </column>
        <column class="field">
          <div>
            <label>&nbsp;</label><br>
            <nuxt-link :to="localePath({ path: '/configuration/seats'})">
              <i class="icon cube" /> {{ $t('searchbox.seats') }}
            </nuxt-link>
          </div>
        </column>
        <column class="field">
          <label>&nbsp;</label><br>
          <nuxt-link :to="localePath({ path: '/configuration/first_aiders'})">
            <i class="icon medkit" /> {{ $t('navbar.firstAiders') }}
          </nuxt-link>
        </column>
        <column class="field">
          <div v-if="!isBuildingMindsAdmin">
            <label>&nbsp;</label><br>
            <nuxt-link :to="localePath({ path: '/configuration/amenities'})">
              <i class="icon desktop" /> {{ $t('navbar.amenities') }}
            </nuxt-link>
          </div>
        </column>
        <column class="field">
          <label>&nbsp;</label><br>
          <nuxt-link :to="localePath({ path: '/configuration/workstreams'})">
            <i class="icon flag" /> {{ $t('navbar.workstreams') }}
          </nuxt-link>
        </column>
        <column class="field">
          <div v-if="!isBuildingMindsAdmin">
            <label>&nbsp;</label><br>
            <nuxt-link :to="localePath({ path: '/configuration/hood'})">
              <i class="icon fa-users" /> {{ $t('configuration.hood.hood') }}
            </nuxt-link>
          </div>
        </column>
        <column class="field">
          <label>&nbsp;</label><br>
          <nuxt-link :to="localePath({ path: '/configuration/parkings'})">
            <i class="icon car awesome" /> {{ $t('configuration.parking.parking') }}
          </nuxt-link>
        </column>
        <column v-if="superAdmin" class="field">
          <label>&nbsp;</label><br>
          <nuxt-link :to="localePath('/superadmin')">
            <i class="icon cogs" /> {{ $t('navbar.superadmin') }}
          </nuxt-link>
        </column>
      </row>
    </ui-grid>
  </div>
</template>

<script>
export default {
  name: 'ConfigurationNavBar',
  props: {
    isBuildingMindsAdmin: { type: Boolean, required: true }
  },
  computed: {
    superAdmin () { return this.$store.getters['auth/getRoles'].isSuperAdmin }
  }
}
</script>

<style scoped>
</style>
