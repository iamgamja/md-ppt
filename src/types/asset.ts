export type animation = {
  type: 'vibrate' | 'moveto'
  ease: 'linear' | 'circIn'
  direction: 'x' | 'y'
  duration: number
  value: number
}

export type asset = {
  content: number
  size: number
  x: number
  y: number
  animation: animation[]
}
