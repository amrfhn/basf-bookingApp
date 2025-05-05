<!--https://brandportal.basf.com/global/en/create/corporate-design/media-specific-design/digital/online-media/intranetstyleguide.html-->
<template>
  <!--  <ui-layout :schema="isProd ? 'green':'light-blue'">-->
  <ui-layout schema="green">
    <template #header>
      <ui-brand-header href="/future_of_work/" />
      <navbar-second />
    </template>
    <nuxt />
    <template #footer>
      <feedback />
      <my-footer />
    </template>
  </ui-layout>
</template>

<script>
import { UiLayout, UiBrandHeader } from 'basf-semantic-ui'
import MyFooter from '../components/layouts/MyFooter'
import NavbarSecond from '../components/layouts/NavbarSecond'
import Feedback from '../components/feedback'

export default {
  components: { MyFooter, UiLayout, UiBrandHeader, NavbarSecond, Feedback },
  data () {
    return {
      env: window.location.host
    }
  },
  computed: {
    isProd () {
      return this.env === 'app.roqs.basf.net'
    }
  }
}

</script>
