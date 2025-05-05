<template>
  <div>
    <textarea v-model="errorText" class="form-control" @change="updateText" />
    <file-input :placeholder="$t('mainpage.feedbackModal.uploadFile')" @input="updateFile" />
  </div>
</template>

<script>
export default {
  name: 'ErrorReport',
  data () {
    return {
      errorText: ''
    }
  },
  mounted () {
    this.$store.dispatch('feedback/changeType', 'Error')
  },
  destroyed () {
    this.$store.dispatch('feedback/updateFile', null)
  },
  methods: {
    updateText () {
      this.$store.dispatch('feedback/updateText', this.errorText)
    },
    updateFile (f) {
      this.$store.dispatch('feedback/updateFile', f)
    }
  }
}
</script>

<style scoped>
textarea {
  resize: vertical;
  border:solid 1px;
  margin-bottom: 10px;
}
</style>
