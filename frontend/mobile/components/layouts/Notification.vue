<template>
  <div class="notification container">
    <div v-if="show" :class="{info: type === 'info', warn: type === 'warn', success: type === 'success', error: type === 'error', vanished: vanished}">
      <span class="closebtn" @click="vanish">&times;</span>
      <br v-show="msgs.length>1">
      <ul>
        <li v-for="m in msgs" :key="m">
          {{ m }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Notification',
  data () {
    return {
      type: '',
      msgs: [],
      show: false,
      vanished: true,
      timer: null
    }
  },
  created () {
    this.$nuxt.$on('notification', (type, msg) => {
      this.type = type.toLowerCase()
      this.msgs.push(msg)
      this.show = true
      this.vanished = false
    })
  },
  methods: {
    dismiss () {
      this.msgs = []
      this.show = false
    },
    vanish () {
      this.vanished = true
      setTimeout(this.dismiss, 600)
    }
  }

}
</script>

<style lang="scss">
.notification{

  .info, .success, .warn, .error {
    width: 100%;
    padding: 8px;
    text-align: center;
    color: white;
    margin-bottom: 10px;
    opacity: 1;
    transition: opacity 0.6s;
    font-size: 15px;
    line-height: 1.5;
    font-weight: 400;
    font-family: sans-serif;
  }

  .info{
    background-color: #21A0D2;
    border: 1px solid #19789e;
  }

  .success {
    background-color: #65AC1E;
    border: 1px solid #467814;
  }

  .warn {
    background-color: #F39500;
    border: 1px solid #bf7600;
  }

  .error {
    background-color: #C50022;
    border: 1px solid #910018;
  }

  .vanished {
    opacity: 0;
  }

  .closebtn {
    margin-left: 15px;
    color: white;
    font-weight: bold;
    float: right;
    font-size: 22px;
    line-height: 20px;
    cursor: pointer;
    transition: 0.3s;
  }

  .closebtn:hover {
    color: black;
  }

  ul{
    margin: 0;
    list-style-type: none;
  }
}
</style>
