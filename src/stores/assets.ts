import { asset } from '@/types/asset'
import { create } from 'zustand'

let nextId = 1
function getNextId() { return nextId++ }

type AssetsStore = {
  assets: {[id: number]: asset}
  add: (content: string) => number
  copy: (id: number) => number
  remove: (id: number) => void

  updateSize: (id: number, size: number) => void
  updateX: (id: number, x: number) => void
  updateY: (id: number, y: number) => void

}

export const useAssetsStore = create<AssetsStore>((set) => ({
  assets: {},
  add(content) {
    const newid = getNextId()
    set((prev) => ({
      assets: {
        ...prev.assets,
        [newid]: {
          content,
          size: 100,
          x: 0,
          y: 0,
        }
      }
    }))
    return newid
  },
  copy(id) {
    const newid = getNextId()
    set((prev) => ({
      assets: {
        ...prev.assets,
        [newid]: {
          ...prev.assets[id]
        }
      }
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
          size
        }
      }
    }))
  },
  updateX(id, x) {
    set((prev) => ({
      assets: {
        ...prev.assets,
        [id]: {
          ...prev.assets[id],
          x
        }
      }
    }))
  },
  updateY(id, y) {
    set((prev) => ({
      assets: {
        ...prev.assets,
        [id]: {
          ...prev.assets[id],
          y
        }
      }
    }))
  },
}))