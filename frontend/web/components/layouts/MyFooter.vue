<template>
  <ui-footer>
    <div class="pull-left">
      {{ $t('footer') }}
    </div>
    <div class="pull-right">
      v {{ version }}
    </div>
  </ui-footer>
</template>

<script>
import { UiFooter } from 'basf-semantic-ui'

export default {
  name: 'MyFooter',
  components: { UiFooter },
  computed: {
    version () {
      return process.env.version
    }
  }
}
</script>

<style scoped>
</style>

<i18n lang="json">
{
  "en": {
    "footer": "Future of Work ©"
  },
  "de": {
    "footer": "Future of Work ©"
  },
  "es": {
    "footer": "Future of Work ©"
  },
  "pt": {
    "footer": "Future of Work ©"
  }
}
</i18n>
