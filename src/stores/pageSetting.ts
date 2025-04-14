import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useSectionsStore } from './sections'
import { useAssetsStore } from './assets'
import { toBase64 } from '@/utils/utils'

type PageSettingStore = {
  sectionsList: number[]
  activeSection: number
  activeTab: string

  setSectionsList: (sectionsList: number[]) => void
  setActiveSection: (activeSection: number) => void
  setActiveTab: (activeTab: string) => void

  addFile: (id: number, file?: File) => Promise<void>
  addSection: () => void
  copySection: (id: number) => void
  removeSection: (id: number) => void
  removeAsset: (assetid: number) => void
}

export const usePageSettingStore = create<PageSettingStore>()(
  persist(
    (set, get) => ({
      sectionsList: [1],
      activeSection: 1,
      activeTab: "markdown",

      setSectionsList(sectionsList) {
        set(() => ({
          sectionsList
        }))
      },
      setActiveSection(activeSection) {
        set(() => ({
          activeSection
        }))
      },
      setActiveTab(activeTab) {
        set(() => ({
          activeTab
        }))
      },

      async addFile(id, file) {
        if (!file) return;
        const assetid = useAssetsStore.getState().add(await toBase64(file))
    
        useSectionsStore.getState().addAsset(id, assetid)
      },

      addSection() {
        const res = useSectionsStore.getState().add()
        const newSectionsList = [ ...get().sectionsList, res ]

        set(() => ({
          sectionsList: newSectionsList,
          activeSection: res
        }))
      },

      copySection(id) {
        const res = useSectionsStore.getState().copy(id)

        const newSectionsList = [...get().sectionsList]
        newSectionsList.splice(get().sectionsList.indexOf(id)+1, 0, res)

        set(() => ({
          sectionsList: newSectionsList,
          activeSection: res
        }))
      },

      removeSection(id) {
        useSectionsStore.getState().remove(id)

        const newSectionsList = [...get().sectionsList]
        newSectionsList.splice(get().sectionsList.indexOf(id), 1)
        
        set(() => ({
          sectionsList: newSectionsList,
          activeSection: newSectionsList[0]
        }))
      },

      removeAsset(assetid: number) {
        useAssetsStore.getState().remove(assetid)
    
        useSectionsStore.getState().updateAssets(
          get().activeSection,
          useSectionsStore.getState().sections[get().activeSection].assets.filter(x => x !== assetid)
        )
      }
    }),
    {
      name: 'page-setting-store',
      version: 0,
    }
  )
)