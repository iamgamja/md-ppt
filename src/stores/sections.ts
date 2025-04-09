import { section } from "@/types/section"
import { preconnect } from "react-dom"
import { create } from "zustand"
import { useAssetsStore } from "./assets"

let nextId = 2
function getNextId() { return nextId++ }

type SectionsStore = {
  sections: { [id: number]: section }
  add: () => number
  copy: (id: number) => number
  remove: (id: number) => void
  updateContent: (id: number, content: string) => void
  addAsset: (id: number, assetid: number) => void
}

export const useSectionsStore = create<SectionsStore>((set) => ({
  sections: { 1: { content: "# title", assets: [] } },
  add() {
    const newid = getNextId()
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
    const newid = getNextId()
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
}))