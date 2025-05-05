import svgPanZoom from 'svg-pan-zoom'

export default ({ app }, inject) => {
  inject('svgPanZoom', svgPanZoom)
}
