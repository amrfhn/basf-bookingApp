<!--https://brandportal.basf.com/global/en/create/corporate-design/media-specific-design/digital/online-media/intranetstyleguide.html-->
<template>
  <ui-layout schema="green">
    <template #header>
      <ui-brand-header href="/future_of_work/mobile/" />
      <navbar-second />
    </template>

    <notification />
    <nuxt />

    <template #footer>
      <my-footer />
    </template>
  </ui-layout>
</template>

<script>
import UiLayout from '@/components/ui/UiLayout'
import UiBrandHeader from '@/components/ui/UiBrandHeader'
import MyFooter from '@/components/layouts/MyFooter'
import Notification from '@/components/layouts/Notification'
import NavbarSecond from '@/components/layouts/NavbarSecond'

export default {
  components: { Notification, MyFooter, UiLayout, UiBrandHeader, NavbarSecond }
}
</script>
