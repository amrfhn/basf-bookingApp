<template>
  <div v-show="authenticated" class="quicklinks-bar" :style="variant === 2 && 'border-top: 1px solid #e4e4e4; margin-top: 30px; border-bottom: 0;'">
    <p class="quicklink-title">
      {{ $t('general.quicklinks') }}
    </p>
    <ul class="link-listings">
      <li v-for="item in quicklinks" :key="item.text" v-show="item.show">
        <a @click="$router.push(localePath(item.path))">
          <i class="icon linkify" />
          {{ item.text }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'QuicklinksBar',
  props: { variant: { type: Number, default: 1 } },
  data () {
    return {
      quicklinks: [
        {
          text: this.$t('reservationTable.pagetitle'),
          path: '/reservation',
          show: true
        },
        {
          text: this.$t('reservationTable.site'),
          path: '/admin_reservation',
          show: this.isAdmin
        }
      ]
    }
  },
  computed: {
    authenticated () {
      return this.$store.getters['auth/isAuthenticated']
    },
    isAdmin () {
      const role = this.$store.getters['auth/getRoles']
      return role.isAdmin
    }
  }
}
</script>

<style lang="scss" scoped>
.quicklinks-bar {
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid;
  border-color: #e4e4e4;
  justify-content: center;

  .quicklink-title {
    font-size: 12px;
    font-weight: 600;
  }

  .link-listings {
    list-style: none;
    padding-left: 5px;
    cursor: pointer;
    margin-bottom: 0;
    gap: 10px;
    display: flex;
    flex-direction: column;
    li {
      font-size: 13px;
      a {
        &:hover {
          color: #333;
        }
      }
    }
  }
}
</style>
