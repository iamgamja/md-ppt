import { asset } from '@/types/asset'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const defaultAnimation = {
  type: 'vibrate' as const,
  ease: 'linear' as const,
  direction: 'x' as const,
  duration: 1,
  value: 0,
}

type AssetsStore = {
  getNextId: () => number

  assets: { [id: number]: asset }
  add: (content: string) => number
  copy: (id: number) => number
  remove: (id: number) => void

  updateSize: (id: number, size: number) => void
  updateX: (id: number, x: number) => void
  updateY: (id: number, y: number) => void
  addAnimation: (id: number) => void
  updateAnimationType: (id: number, idx: number, type: 'vibrate' | 'moveto') => void
  updateAnimationEase: (id: number, idx: number, ease: 'linear' | 'circIn') => void
  updateAnimationDirection: (id: number,idx: number,  direction: 'x' | 'y') => void
  updateAnimationDuration: (id: number, idx: number, duration: number) => void
  updateAnimationValue: (id: number,idx: number,  value: number) => void
}

export const useAssetsStore = create<AssetsStore>()(
  persist(
    (set, get) => ({
      getNextId() {
        return (
          Object.keys(get().assets)
            .map(Number)
            .reduce((x, y) => (x > y ? x : y), 0) + 1
        )
      },

      assets: {},
      add(content) {
        const newid = get().getNextId()
        set((prev) => ({
          assets: {
            ...prev.assets,
            [prev.getNextId()]: {
              content,
              size: 100,
              x: 0,
              y: 0,
              animation: [],
            },
          },
        }))
        return newid
      },
      copy(id) {
        const newid = get().getNextId()
        set((prev) => ({
          assets: {
            ...prev.assets,
            [newid]: {
              ...prev.assets[id],
              animation: { ...prev.assets[id].animation },
            },
          },
        }))
        return newid
      },
      remove(id) {
        set((prev) => {
          const newAssets = { ...prev.assets }
          delete newAssets[id]
          return { assets: newAssets }
        })
      },

      updateSize(id, size) {
        set((prev) => ({
          assets: {
            ...prev.assets,
            [id]: {
              ...prev.assets[id],
              size,
            },
          },
        }))
      },
      updateX(id, x) {
        set((prev) => ({
          assets: {
            ...prev.assets,
            [id]: {
              ...prev.assets[id],
              x,
            },
          },
        }))
      },
      updateY(id, y) {
        set((prev) => ({
          assets: {
            ...prev.assets,
            [id]: {
              ...prev.assets[id],
              y,
            },
          },
        }))
      },
      addAnimation(id) {
        const animations = get().assets[id].animation
        animations.push({ ...defaultAnimation })
        set((prev) => ({
          assets: {
            ...prev.assets,
            [id]: {
              ...prev.assets[id],
              animation: animations
            },
          },
        }))
      },
      updateAnimationType(id, idx, type) {
        const animations = get().assets[id].animation
        animations[idx].type = type
        set((prev) => ({
          assets: {
            ...prev.assets,
            [id]: {
              ...prev.assets[id],
              animation: animations
            },
          },
        }))
      },
      updateAnimationEase(id, idx, ease) {
        const animations = get().assets[id].animation
        animations[idx].ease = ease
        set((prev) => ({
          assets: {
            ...prev.assets,
            [id]: {
              ...prev.assets[id],
              animation: animations
            },
          },
        }))
      },
      updateAnimationDirection(id, idx, direction) {
        const animations = get().assets[id].animation
        animations[idx].direction = direction
        set((prev) => ({
          assets: {
            ...prev.assets,
            [id]: {
              ...prev.assets[id],
              animation: animations
            },
          },
        }))
      },
      updateAnimationDuration(id, idx, duration) {
        const animations = get().assets[id].animation
        animations[idx].duration = duration
        set((prev) => ({
          assets: {
            ...prev.assets,
            [id]: {
              ...prev.assets[id],
              animation: animations
            },
          },
        }))
      },
      updateAnimationValue(id, idx, value) {
        const animations = get().assets[id].animation
        animations[idx].value = value
        set((prev) => ({
          assets: {
            ...prev.assets,
            [id]: {
              ...prev.assets[id],
              animation: animations
            },
          },
        }))
      },
    }),
    {
      name: 'assets-store',
      version: 0,
    },
  ),
)
