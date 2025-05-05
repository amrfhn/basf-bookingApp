<template>
  <box3>
    <ui-grid>
      <row>
        <column v-if="site" :wide="6" class="add">
          <label>
            {{ $t('configuration.first_aider.adduser') }}
            <tooltip :content="$t('general.findUserTooltip')">
              <i class="icon info circle" style="color:#494040" />
            </tooltip>
          </label>
          <ldap-users v-if="!userChosen" v-model="user" :caller="getLdap" @input="userChosen = true" />
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
        <column v-if="site">
          <btn-positive :disabled="disabled" class="button" @click="add">
            <i class="icon plus" /> {{ $t('configuration.first_aider.add') }}
          </btn-positive>
        </column>
      </row>
    </ui-grid>
    <ui-table v-if="site">
      <thead>
        <tr>
          <th>{{ $t('configuration.first_aider.colUsername') }}</th>
          <th>{{ $t('configuration.first_aider.colFullname') }}</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-if="firstAiders !== null && firstAiders.length===0">
          <td> {{ $t('configuration.amenities.noResults') }}</td>
        </tr>
        <tr v-for="(fa, i) in firstAiders" :key="i">
          <td> {{ fa.username }}</td>
          <td> {{ fa.user ? fa.user.full_name : '-' }}</td>
          <td>
            <btn-negative @click="remove(fa.id)">
              <i class="icon fa-trash" />
            </btn-negative>
          </td>
        </tr>
      </tbody>
    </ui-table>
  </box3>
</template>

<script>
import LDAP from 'basf-gtu-utils/client/LDAP'
import { LDAPSearch } from '../../common/Filters'

export default {
  layout: 'configuration',
  data () {
    return {
      user: null,
      disabled: true,
      userChosen: false,
      firstAiders: null
    }
  },
  computed: {
    site: {
      get () {
        return this.$store.getters['site/getSelectedSiteConfiguration']
      },
      set (value) {
        this.$store.dispatch('site/selectSiteConfiguration', value)
      }
    }
  },
  watch: {
    user (value) {
      value ? this.disabled = false : this.disabled = true
    },
    site () {
      this.loadFirstAiders()
    }
  },
  mounted () {
    this.$nuxt.$emit('updateTitle', 'configuration.first_aider.title')
    LDAP.authenticate({ federation_token: this.token })
    this.loadFirstAiders()
  },
  methods: {
    async loadFirstAiders () {
      this.firstAiders = null
      if (this.site) {
        const siteFirstAiders = (await this.$api.brigadier.get({ siteId: this.site.id })).sort((a, b) => a.username.localeCompare(b.username))
        this.firstAiders = siteFirstAiders
      }
    },
    async add () {
      if (this.site) {
        try {
          const firstAider = await this.$api.brigadier.create({ siteId: this.site.id, username: this.user.username })
          this.$console.success('User added')
          const firstAiders = [...this.firstAiders, firstAider].sort((a, b) => a.username.localeCompare(b.username))
          this.firstAiders = firstAiders
        } catch (e) {
          this.$console.error('User already exists')
        }
      }
      this.user = null
      this.userChosen = false
    },
    remove (id) {
      this.$api.brigadier.delete(id).then(() => {
        const firstAiders = this.firstAiders.filter(b => b.id !== id)
        this.firstAiders = firstAiders
        this.$console.success('User deleted')
      })
    },
    async getLdap (fullName) {
      return await LDAPSearch(fullName, LDAP)
    },
    removeUser () {
      this.user = null
      this.userChosen = false
    }
  }
}
</script>

<style lang="scss" scoped>
.svg-container {
  padding: 0;
}

.positive {
  margin-top: 25px;
  width: max-content;
}

.add {

  label {
    width: 100%;
  }

  input {
    width: 70%;
    padding: 10px;
    cursor: pointer;
    border-radius: 3px;
    border: 1px solid rgba(34, 36, 38, .15);

    &:focus-visible {
      outline: #00793A solid 0.5px;
      outline-offset: -1px;
    }
  }

  button {
    width: 50px;
  }

}
</style>
