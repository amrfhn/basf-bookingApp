<!-- This component is used when can pass image path as SVG and needs to have the pan zoom functionality. -->
<template>
  <div class="SvgPanZoom">
    <object
      :id="objectId"
      type="image/svg+xml"
      :data="computedImgPath"
      class="svg_object"
    />
  </div>
</template>

<script>
export default {
  name: 'SvgPanZoom',
  props: {
    imagePath: { type: String, required: true, default: '' },
    objectId: { type: String, required: true }
  },
  data () {
    return {
      svgPanZoomInstance: null,
      objectElement: null
    }
  },
  computed: {
    computedImgPath () {
      return this.imagePath
    }
  },
  watch: {
    imagePath (value) {
      const objectElement = document.getElementById(this.objectId)

      if (value && objectElement) {
        this.setOnLoadPanZoom(objectElement)
      }
    }
  },
  mounted () {
    const objectElement = document.getElementById(this.objectId)

    if (objectElement) {
      this.setOnLoadPanZoom(objectElement)
    }
  },
  methods: {
    setOnLoadPanZoom (ele) {
      ele.onload = () => {
        this.initializeSvgPanZoom()
      }
    },
    initializeSvgPanZoom () {
      const svgObject = document.getElementById(this.objectId)
      const svgDoc = svgObject.contentDocument
      const svgElement = svgDoc.querySelector('svg')

      if (svgElement) {
        this.$nextTick(() => {
          // Initialize svg-pan-zoom
          this.svgPanZoomInstance = this.$svgPanZoom(svgElement, {
            zoomEnabled: true,
            controlIconsEnabled: true,
            fit: true,
            center: true,
            mouseWheelZoomEnabled: false,
            dblClickZoomEnabled: false
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.svg_object {
  width: 100%;
  height: 500px;
  object-fit: contain;
}
</style>
