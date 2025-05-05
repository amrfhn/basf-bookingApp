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

export default {
  name: 'MyFooter',
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
