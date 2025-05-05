<template>
  <textarea v-model="commentText" class="form-control" @change="updateFeedback" />
</template>

<script>
export default {
  name: 'SendComment',
  data () {
    return {
      commentText: ''
    }
  },
  mounted () {
    this.$store.dispatch('feedback/changeType', 'Comment')
  },
  methods: {
    updateFeedback () {
      this.$store.dispatch('feedback/updateText', this.commentText)
    }
  }
}
</script>

<style scoped>
textarea {
  resize: vertical;
  border:solid 1px;
}
</style>
