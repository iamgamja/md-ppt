export type asset = {
  content: string
  size: number
  x: number
  y: number
  animation: {
    type: 'vibrate' | 'moveto'
    ease: 'linear' | 'circIn'
    direction: 'x' | 'y'
    duration: number
    value: number
  } | null
}
