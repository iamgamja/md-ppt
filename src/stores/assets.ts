import { asset } from '@/types/asset'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AssetsStore = {
  getNextId: () => number

  assets: { [id: number]: asset }
  add: (content: string) => number
  copy: (id: number) => number
  remove: (id: number) => void

  updateSize: (id: number, size: number) => void
  updateX: (id: number, x: number) => void
  updateY: (id: number, y: number) => void
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
    }),
    {
      name: 'assets-store',
      version: 0,
    },
  ),
)
