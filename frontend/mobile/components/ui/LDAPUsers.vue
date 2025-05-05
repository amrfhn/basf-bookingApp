<template>
  <div class="ldapSearch">
    <input v-model="fullName" @keyup="searchUser">
    <div v-if="fullName.length > 0" class="suggestionList">
      <div v-if="users.length">
        <div v-for="u in users" :key="u.id" class="user" @click="setUser(u)">
          <img :src="u.image" :alt="u.username" :title="u.username">
          <span :title="u.full_name">{{ u.full_name }}</span>
        </div>
      </div>
      <div v-else-if="fullName.length > 0 && !alreadySelected">
        <Spinner />
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from '../ui/loadingIcon/Spinner.vue'

export default {
  name: 'LDAPUsers',
  components: { Spinner },
  props: {
    value: { type: null, default: () => {} },
    caller: { type: Function, required: true }
  },
  data () {
    return {
      fullName: null,
      timeout: null,
      users: [],
      alreadySelected: false
    }
  },
  watch: {
    value (newValue) {
      this.setFullName(newValue)
    }
  },
  created () {
    this.setFullName(this.value)
  },
  methods: {
    setFullName (userData) {
      this.fullName = userData ? userData.full_name : ''
    },
    setUser (u) {
      this.fullName = u.full_name
      this.users = []
      this.$emit('input', u)
      this.alreadySelected = true
    },
    setUsers (users) {
      this.users = users.map((u) => {
        u.username = u.username.toLowerCase()
        return u
      })
    },
    searchUser () {
      this.clearTimeout()
      this.alreadySelected = false
      if (this.fullName.length > 3) {
        this.timeout = setTimeout(this.callLDAP, 400)
      } else {
        this.users = []
      }
    },
    callLDAP () {
      this.caller(this.fullName)
        .then(this.setUsers)
    },
    clearTimeout () {
      if (this.timeout) {
        clearTimeout(this.timeout)
        this.timeout = null
      }
    }
  }
}
</script>

<style lang="scss">
.ldapSearch {
  display: inline-block;
  width: 100%;
  position: relative;
  box-sizing: border-box;

  input {
    width: 100%;
    box-sizing: inherit;

    cursor: text;
    border-radius: 3px;
    height: 38px;
    padding: .5em;
    border: 1px solid rgba(34,36,38,.15);
  }

  .suggestionList {
    z-index: 1;
    box-shadow: 2px 3px 10px -2px #808080;
    box-sizing: inherit;
    position: absolute;
    background: #fff;
    padding: 10px;
    border-radius: 0 0 10px 10px;
    width: 100%;
    text-align: -webkit-center;

    .user {
      padding: 5px;
      cursor: pointer;
      height: 40px;
      white-space: nowrap;
      overflow-x: hidden;
      display: flex;
      align-items: center;

      img {
        border-radius: 50%;
        width: 30px;
        margin-right: 10px;
      }
      span{
        white-space: nowrap;
      }
    }

    .user:hover{
      span {
        color: #1e70bf;
      }
    }
  }
}
</style>
