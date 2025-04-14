import { section } from "@/types/section"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useAssetsStore } from "./assets"

type SectionsStore = {
  getNextId: () => number

  sections: { [id: number]: section }
  add: () => number
  copy: (id: number) => number
  remove: (id: number) => void
  updateContent: (id: number, content: string) => void
  addAsset: (id: number, assetid: number) => void
  updateAssets: (id: number, assets: number[]) => void
}

export const useSectionsStore = create<SectionsStore>()(
  persist(
    (set, get) => ({
      getNextId() {
        return Object.keys(get().sections).map(Number).reduce((x,y) => x>y?x:y, 0) + 1
      },
    
      sections: { 1: { content: "# title", assets: [] } },
      add() {
        const newid = get().getNextId()
        set((prev) => ({
          sections: {
            ...prev.sections,
            [newid]: {
              content: "# title",
              assets: [],
            }
          }
        }))
        return newid
      },
      copy(id) {
        const newid = get().getNextId()
        set((prev) => ({
          sections: {
            ...prev.sections,
            [newid]: {
              ...prev.sections[id],
              assets: prev.sections[id].assets.map((assetid) => (
                useAssetsStore.getState().copy(assetid)
              ))
            }
          }
        }))
        return newid
      },
      remove(id) {
        set((prev) => {
          const newSections = { ...prev.sections }
          delete newSections[id]
          return { sections: newSections }
        })
      },
      
      updateContent(id, content) {
        set((prev) => ({
          sections: {
            ...prev.sections,
            [id]: {
              ...prev.sections[id],
              content
            }
          }
        }))
      },
      addAsset(id, assetid) {
        set((prev) => ({
          sections: {
            ...prev.sections,
            [id]: {
              ...prev.sections[id],
              assets: [
                ...prev.sections[id].assets,
                assetid
              ]
            }
          }
        }))
      },
    
      updateAssets(id, assets) {
        set((prev) => ({
          sections: {
            ...prev.sections,
            [id]: {
              ...prev.sections[id],
              assets
            }
          }
        }))
      },
    }),
    {
      name: 'sections-store',
      version: 0,
    }
  )
)