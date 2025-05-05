<template>
  <div class="references">
    <!--  In the future this HEXColors will be dynamically loaded -->
    <div class="item">
      <span style="background-color: #BDDCE1FF" />
      <label>{{ $t('mapReferences.disabled') }}</label>
    </div>
    <div class="item">
      <span style="background-color: #C70124FF" />
      <label>{{ $t('mapReferences.occupied') }}</label>
    </div>
    <div class="item">
      <span style="background-color: #F39500FF" />
      <label>{{ $t('mapReferences.manager') }}</label>
    </div>
    <div class="item">
      <span style="background-color: #0D99D4" />
      <label>{{ $t('mapReferences.brigadier') }}</label>
    </div>
    <div class="item">
      <span style="background-color: #65AC1EFF" />
      <label>{{ $t('mapReferences.available') }}</label>
    </div>
    <div class="item">
      <span style="background-color: #014A97FF" />
      <label>{{ $t('mapReferences.selection') }}</label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MapReferences'
}
</script>

<style lang="scss" scoped>
.references {

  padding-top: 47px;

  .item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 3px;
  }

  span {
    display: inline-block;
    width: 38px;
    height: 38px;
    border-radius: 3px;
    margin-right: 5px;
  }

  label {
    margin: 0;
    flex: 1;
  }

}
</style>
