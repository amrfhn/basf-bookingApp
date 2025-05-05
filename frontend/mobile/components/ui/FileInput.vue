<template>
  <div class="fileUpload">
    <input
      id="placeholder"
      v-model="fileNames"
      type="text"
      :placeholder="placeholder"
      readonly
      @click="trigger"
    >
    <input
      id="fileInput"
      ref="fileInput"
      type="file"
      :clean="clean"
      :accept="accept"
      :multiple="multiple"
      :max-size="maxSize"
      @change="previewFiles"
    >
    <btn-primary @click="trigger">
      <icon icon="attachment" />
    </btn-primary>
    <label class="error">{{ error }}</label>
  </div>
</template>

<script>
export default {
  name: 'FileInput',
  props: {
    value: { type: null, default: null },
    accept: { type: String, default: null },
    placeholder: { type: String, default: 'Upload File' },
    multiple: { type: Boolean, default: false },
    maxSize: { type: String, default: null },
    clean: { type: Boolean, default: false }
  },
  data () {
    return {
      fileNames: '',
      files: '',
      error: ''
    }
  },
  watch: {
    value (newValue) {
      this.files = newValue
    },
    files (newValue) {
      if (newValue !== '') {
        this.$emit('input', newValue)
      }
    },
    clean () {
      this.$refs.fileInput.value = null
      this.fileNames = ''
      this.files = ''
    }
  },
  methods: {
    trigger () {
      this.$refs.fileInput.click()
    },
    previewFiles () {
      if (this.$refs.fileInput.files.length) {
        this.files = ''
        this.fileNames = ''
        this.error = ''
        if (this.multiple) {
          const files = Object.values(this.$refs.fileInput.files)
          if (this.maxSize !== null) {
            for (const file of files) {
              this.error = this.sizeError(file)
            }
          }
          if (this.error === '') {
            this.files = files
            this.fileNames = this.files.map(f => f.name).join(', ')
          }
        } else {
          const file = this.$refs.fileInput.files[0]
          if (this.maxSize !== null) {
            this.error = this.sizeError(file)
          }
          if (this.error === '') {
            this.files = file
            this.fileNames = this.files ? this.files.name : null
          }
        }
      }
    },
    sizeError (file) {
      const errorText = 'The file is too large. (max-size:' + this.maxSize + ')'
      let error = ''
      let size = this.formatBytes(file.size)
      size = size.split(' ')
      let maxSize = this.maxSize
      maxSize = maxSize.split(' ')
      switch (maxSize[1]) {
        case 'MB':
          switch (size[1]) {
            case 'KB':
              break
            case 'MB':
              if (size[0] > maxSize[0]) {
                error = errorText
              }
              break
            default:
              error = 'unexpected error'
          }
          break
        case 'KB':
          switch (size[1]) {
            case 'MB':
              error = errorText
              break
            case 'KB':
              if (size[0] > maxSize[0]) {
                error = errorText
              }
              break
            default:
              error = 'unexpected error'
          }
          break
        default:
          error = 'unexpected error'
      }
      return error
    },
    formatBytes (bytes, decimals = 2) {
      if (!+bytes) { return '0 Bytes' }

      const k = 1024
      const dm = decimals < 0 ? 0 : decimals
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

      const i = Math.floor(Math.log(bytes) / Math.log(k))

      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }
  }
}
</script>

<style scoped lang="scss">
.fileUpload {
  display: flex;
  box-sizing: border-box;

  input {
    padding: 10px;
    width: 100%;
    border-width: 0.5px;
  }

  input[type="text"] {
    cursor: pointer;
    border-radius: 3px;
    border: 1px solid rgba(34,36,38,.15);
  }

  input[type="file"] {
    display: none;
  }

  button {
    border-radius: 0 5px 5px 0;
    padding: 7px;
    margin: 0;
    min-width: 40px;
    height: 40px;

    svg {
      height: 100%;
      width: auto;
      padding: 0;
    }
  }
  .error{
    color: red;
    position: absolute;
    font-size: 13px;
    margin-top:38px;
    margin-left: 10px;
  }
}
</style>
