<template>
  <div class="lds-default">
    <div /><div /><div /><div /><div /><div /><div /><div /><div /><div /><div /><div />
  </div>
</template>

<script>
export default {
  name: 'Spinner'
}
</script>

<style lang="scss" scoped>
.lds-default {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 35px;
}
.lds-default div {
  position: absolute;
  width: 3px;
  height: 3px;
  background: #00793a;
  border-radius: 50%;
  animation: lds-default 1.2s linear infinite;
}
.lds-default div:nth-child(1) {
  animation-delay: 0s;
  top: 18.5px;
  left: 33px;
}
.lds-default div:nth-child(2) {
  animation-delay: -0.1s;
  top: 11px;
  left: 31px;
}
.lds-default div:nth-child(3) {
  animation-delay: -0.2s;
  top: 5.5px;
  left: 26px;
}
.lds-default div:nth-child(4) {
  animation-delay: -0.3s;
  top: 3.5px;
  left: 18.5px;
}
.lds-default div:nth-child(5) {
  animation-delay: -0.4s;
  top: 5.5px;
  left: 11px;
}
.lds-default div:nth-child(6) {
  animation-delay: -0.5s;
  top: 11px;
  left: 5.5px;
}
.lds-default div:nth-child(7) {
  animation-delay: -0.6s;
  top: 18.5px;
  left: 3.5px;
}
.lds-default div:nth-child(8) {
  animation-delay: -0.7s;
  top: 26px;
  left: 5.5px;
}
.lds-default div:nth-child(9) {
  animation-delay: -0.8s;
  top: 31px;
  left: 11px;
}
.lds-default div:nth-child(10) {
  animation-delay: -0.9s;
  top: 33px;
  left: 18.5px;
}
.lds-default div:nth-child(11) {
  animation-delay: -1s;
  top: 31px;
  left: 26px;
}
.lds-default div:nth-child(12) {
  animation-delay: -1.1s;
  top: 26px;
  left: 31px;
}
@keyframes lds-default {
  0%, 20%, 80%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
}
</style>
