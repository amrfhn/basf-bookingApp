<template>
  <box3>
    <h2>{{ $t('navbar.superadmin') }}</h2>
    <div class="superuser">
      <div class="inputfield-container">
        <label>
          {{ $t('configuration.superadmin.findUser') }}
          <tooltip :content="$t('general.findUserTooltip')">
            <i class="icon info circle" style="color:#494040" />
          </tooltip>
        </label>
        <ldap-users :key="ldapKey" :caller="getLdap" @input="addUser" />
      </div>

      <div class="inputfield-container">
        <label>
          {{ $t('configuration.superadmin.multiUsernames') }}
          <tooltip :content="$t('general.findUserTooltip')">
            <i class="icon info circle" style="color:#494040" />
          </tooltip>
        </label>
        <input v-model="multi" @change="parseUsers">
      </div>

      <div class="inputfield-container">
        <label>{{ $t('configuration.superadmin.rol') }}: </label>
        <dropdown :key="roleKey" :options="accessItRoles" :label-selector="(r)=>r.name" @input="addRole" />
      </div>

      <hr><hr>

      <ui-table>
        <thead>
          <tr>
            <th />
            <th>{{ $t('configuration.superadmin.fullName') }}</th>
            <th>{{ $t('configuration.superadmin.username') }}</th>
            <th>{{ $t('configuration.superadmin.mail') }}</th>
            <th>{{ $t('configuration.superadmin.phone') }}</th>
            <th>{{ $t('configuration.superadmin.company') }}</th>
            <th>{{ $t('configuration.superadmin.orgCode') }}</th>
            <th>{{ $t('configuration.superadmin.country') }}</th>
            <th>{{ $t('configuration.superadmin.region') }}</th>
            <th>{{ $t('configuration.superadmin.site') }}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, id) in users" :key="id">
            <td><img :src="user.image" :alt="user.full_name"></td>
            <td>{{ user.full_name }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.mail }}</td>
            <td>{{ user.phone }}</td>
            <td>{{ user.company }}</td>
            <td>{{ user.org_code }}</td>
            <td>{{ user.country }}</td>
            <td>{{ user.region }}</td>
            <td>{{ user.site }}</td>
            <td>
              <btn-negative @click="removeUser(user)">
                <icon icon="trash" />
              </btn-negative>
            </td>
          </tr>
        </tbody>
      </ui-table>

      <hr><hr>

      <ui-table>
        <thead>
          <tr>
            <th>{{ $t('configuration.superadmin.id') }}</th>
            <th>{{ $t('configuration.superadmin.name') }}</th>
            <th>{{ $t('configuration.superadmin.description') }}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-for="(role, id) in roles" :key="id">
            <td>{{ role.id }}</td>
            <td>{{ role.name }}</td>
            <td>{{ role.description }}</td>
            <td>
              <btn-negative @click="removeRole(role)">
                <icon icon="trash" />
              </btn-negative>
            </td>
          </tr>
        </tbody>
      </ui-table>

      <hr><hr>

      <btn-primary @click="save">
        {{ $t('configuration.superadmin.save') }}
      </btn-primary>

      <hr><hr>

      <br> <br>
      <span style="white-space: pre-wrap;">{{ response }}</span>
      <br> <br>
    </div>
  </box3>
</template>
<script>
import AccessIT from 'basf-gtu-utils/client/AccessIT'
import LDAP from 'basf-gtu-utils/client/LDAP'
import { LDAPSearch } from '../../common/Filters'

const APP_ID = 3994
const bannedRoles = [11091275, 11141611, 11141612, 11141613, 11141614]
const expresion = /(\w+)/gi

export default {
  async middleware ({ store, redirect }) {
    await store.dispatch('auth/waitAuth')
    if (store.getters['auth/getRoles'].isSuperAdmin) { return }
    redirect('/')
  },
  data () {
    return {
      ldapKey: 0,
      roleKey: 1,
      accessItRoles: [],
      roles: [],
      users: [],
      multi: '',
      response: ''
    }
  },
  computed: {
    token () { return this.$store.getters['auth/token'] }
  },
  async mounted () {
    LDAP.authenticate({ federation_token: this.token })
    AccessIT.authenticate({ federation_token: this.token })
    try {
      this.accessItRoles = (await AccessIT.application.roles(APP_ID).list()).filter(r => !bannedRoles.includes(r.id)).sort((a, b) => a.name.localeCompare(b.name))
    } catch (e) {
      console.error(e)
      this.$console.error('Unable to load Roles')
    }
  },
  methods: {
    async getLdap (fullName) {
      return await LDAPSearch(fullName, LDAP)
    },
    parseUsers () {
      const usernames = this.multi.match(expresion).map(e => e.toLowerCase())
      this.multi = ''

      for (const username of usernames) {
        this.users.push({ username })
      }
      LDAP.getUsers(usernames).then((r) => {
        const tmpUsers = []
        for (const user of this.users) {
          const ldapUser = r[user.username]
          if (ldapUser) {
            tmpUsers.push(ldapUser)
          } else {
            tmpUsers.push(user)
          }
        }
        this.users = tmpUsers
      })
    },
    addUser (user) {
      this.users.push(user)
      this.ldapKey += 2
    },
    removeUser (user) {
      this.users = this.users.filter(u => u.username !== user.username)
    },
    addRole (role) {
      this.roles.push(role)
      this.roleKey += 2
    },
    removeRole (role) {
      this.roles = this.roles.filter(r => r.id !== role.id)
    },
    save () {
      this.response = ''
      for (const role of this.roles) {
        for (const user of this.users) {
          AccessIT.application.roles(APP_ID).entitlement(role.id).create(user.username, { pre_approval: true })
            .then((r) => {
              console.log(r)
              this.response += `OK - ${user.username} - ${role.name}\n`
            })
            .catch((e) => {
              console.error(e)
              this.response += `Error - ${user.username} - ${role.name}\n`
            })
        }
      }
    }
  }
}
</script>
<style scoped lang="scss">
.superuser {
  .inputfield-container {
    margin: 12px 10px;
  }
  input {
    padding: 10px;
    width: 100%;
    cursor: pointer;
    border-radius: 3px;
    border: 1px solid rgba(34,36,38,.15);
    &:focus-visible {
      outline: #00793A solid 0.5px;
      outline-offset: -1px;
    }
  }

  img{
    width: 32px;
    border-radius: 25px;
  }

  svg{
    padding:0
  }
}
</style>
