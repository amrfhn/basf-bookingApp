import { useBreakpoints } from '@vueuse/core'
import { BREAKPOINTS } from './common.js'

/*
{
   'xs': 480,
   'sm': 640,
   'md': 768,
   'lg': 1024,
   'xl': 1280,
   '2xl': 1536,
};
*/

// const breakpoints = null
// const isXS = null
// const isSM = null
// const isMD = null
// const isLG = null
// const isXL = null
// const isXXL = null
// const isXXXL = null

// const init = () => {
//   // breakpoints = useBreakpoints(BREAKPOINTS)

//   // isMobileViewport = breakpoints.smaller('md')
//   isXS = breakpoints.smaller('xs')
//   isSM = breakpoints.between('xs', 'sm')
//   isMD = breakpoints.between('sm', 'md')
//   isLG = breakpoints.between('md', 'lg')
//   isXL = breakpoints.between('lg', 'xl')
//   isXXL = breakpoints.between('xl', '2xl')
//   isXXXL = breakpoints.greater('2xl')
// }

export const isMobileViewport = () => {
  const breakpoints = useBreakpoints(BREAKPOINTS)
  return breakpoints.smaller('md')
}

// export {
//   init,
//   breakpoints,
//   isXS,
//   isSM,
//   isMD,
//   isLG,
//   isXL,
//   isXXL,
//   isXXXL,
// }
