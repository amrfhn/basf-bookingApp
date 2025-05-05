<template>
  <div :class="{'navbar navbar-default navbar-fixed-top navbar-second':true,'fade-in':!faded}">
    <div class="container">
      <div class="navbar-header">
        <button
          type="button"
          class="navbar-toggle"
          data-toggle="collapse"
          data-target=".main-nav"
        >
          <span class="icon-bar" />
          <span class="icon-bar" />
          <span class="icon-bar" />
        </button>
        <ul class="nav pull-right icons-right">
          <li v-show="!authenticated">
            <a :title=" $t('navbar.login')" @click="$sso()">
              <i class="icon lock" />
            </a>
          </li>
          <li class="dropdown">
            <a class="dropdown-toggle" data-toggle="dropdown" href="#" aria-expanded="true">
              <i class="icon globe" /></a>
            <ul class="dropdown-menu">
              <li>
                <nuxt-link :to="switchLocalePath('en')">
                  {{ $t('navbar.lang.en') }}
                </nuxt-link>
              </li>
              <li>
                <nuxt-link :to="switchLocalePath('es')">
                  {{ $t('navbar.lang.es') }}
                </nuxt-link>
              </li>
              <li>
                <nuxt-link :to="switchLocalePath('de')">
                  {{ $t('navbar.lang.de') }}
                </nuxt-link>
              </li>
              <li>
                <nuxt-link :to="switchLocalePath('pt')">
                  {{ $t('navbar.lang.pt') }}
                </nuxt-link>
              </li>
              <li>
                <nuxt-link :to="switchLocalePath('kr')">
                  {{ $t('navbar.lang.kr') }}
                </nuxt-link>
              </li>
            </ul>
          </li>
          <li v-if="authenticated">
            <div id="userpic">
              <img alt="UserPic" :src="imgData" :title="username">
            </div>
          </li>
        </ul>
      </div>
      <div class="collapse navbar-collapse main-nav">
        <ul class="nav navbar-nav">
          <li>
            <nuxt-link :to="localePath('/book') + '/'">
              <i class="icon home" />
              <b> {{ $t('app.title') }}</b>
            </nuxt-link>
          </li>
          <li>
            <nuxt-link :to="localePath('/reservation/')">
              {{ $t('page.myReservations') }}
            </nuxt-link>
          </li>
          <li v-if="authenticated">
            <nuxt-link :to="localePath('/about')">
              {{ $t('about.title') }}
            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavbarSecond',
  data () {
    return {
      scroll: 0
    }
  },
  computed: {
    faded () { return this.scroll > 50 },
    authenticated () { return this.$store.getters['auth/isAuthenticated'] },
    username () { return this.$store.getters['auth/getUsername'] },
    imgData () { return process.env.BACKEND_URL + 'resources/image/' + this.username }
  },
  beforeMount () {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  updated () {
    const collapse = document.getElementsByClassName('collapse in')
    if (collapse.length !== 0) {
      document.getElementsByClassName('navbar-toggle')[0].click()
    }
  },
  methods: {
    handleScroll () { this.scroll = window.scrollY }
  }
}
</script>

<style scoped lang="scss">
.navbar-toggle {
  float: left;
  margin-left: 1em;
}

.navbar {
  margin-bottom: 20px;
  min-height: 50px;
  transition: all .4s ease;
  background-color: #FFFFFF;
  top: 0;

  &.fade-in {
    top: 80px;
  }
}

.icons-right {
  display: flex;
  position: absolute;
  right: 1em;
  align-items: center;
  height: 50px;

  a {
    i {
      font-size: 17px;
    }
  }
  #userpic {
    margin: 0 7px 0 7px;

    img {
      width: 40px;
      border-radius: 50%;
    }
  }
}
</style>
