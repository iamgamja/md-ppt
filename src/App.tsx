import { Textarea } from '@/components/ui/textarea'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { motion } from 'framer-motion'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import Viewer from './Viewer'
import styles from './App.module.css'
import { BASIC_HEIGHT, BASIC_WIDTH } from './constants/BASIC_SIZE'
import { useSectionsStore } from './stores/sections'
import { useAssetsStore } from './stores/assets'
import { Button } from './components/ui/button'
import { usePageSettingStore } from './stores/pageSetting'
import { exportStores, importStores } from './utils/fileSave'
import { exportPDF } from './utils/exportPDF'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MdAnimation, MdOutlineDelete, MdOutlineContentCopy, MdAddCircleOutline } from 'react-icons/md'

export default function App() {
  const SectionsStore = useSectionsStore()
  const AssetsStore = useAssetsStore()
  const { sectionsList, activeSection, activeTab, setSectionsList, setActiveSection, setActiveTab, addFile, addSection, copySection, removeSection, removeAsset } =
    usePageSettingStore()
  const [isExportingPDF, setIsExportingPDF] = useState(false)

  const handleSectionListDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const reorderedItems = [...sectionsList]
    const [movedItem] = reorderedItems.splice(result.source.index, 1)
    reorderedItems.splice(result.destination.index, 0, movedItem)
    setSectionsList(reorderedItems)
  }

  const handleAssetListDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const reorderedItems = [...nowsection.assets]
    const [movedItem] = reorderedItems.splice(result.source.index, 1)
    reorderedItems.splice(result.destination.index, 0, movedItem)
    SectionsStore.updateAssets(activeSection, reorderedItems)
  }

  const resetStores = () => {
    useSectionsStore.persist.clearStorage()
    useAssetsStore.persist.clearStorage()
    usePageSettingStore.persist.clearStorage()
    window.location.reload()
  }

  const nowsection = SectionsStore.sections[activeSection]

  return (
    <div className="flex flex-col h-dvh">
      {/* 미리보기 섹션 */}
      <div className="aspect-video">
        <Viewer id={activeSection} width={window.innerWidth} />
      </div>

      {/* 마크다운 편집기 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 p-4 bg-gray-200 overflow-scroll">
        <TabsList>
          <TabsTrigger className="default-tab" value="markdown">
            Markdown
          </TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger
            value="tmp1"
            className="bg-blue-300"
            onClick={() => {
              copySection(activeSection)
              setActiveTab('markdown')
            }}
          >
            <MdOutlineContentCopy />
          </TabsTrigger>
          <TabsTrigger
            value="tmp2"
            className="bg-red-400"
            disabled={sectionsList.length === 1}
            onClick={() => {
              removeSection(activeSection)
              setActiveTab('markdown')
            }}
          >
            <MdOutlineDelete />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="markdown" className="flex flex-col">
          <Textarea className="flex-1 p-2 border rounded-md bg-white" value={nowsection.content} onChange={(e) => SectionsStore.updateContent(activeSection, e.target.value)} />
        </TabsContent>

        <TabsContent value="assets">
          <div className="h-full rounded-md border p-2 space-y-2 bg-white">
            <div className="flex flex-row-reverse">
              <Input type="file" accept="image/*" onChange={(e) => (addFile(activeSection, e.target.files?.[0]), (e.target.value = ''))} />
            </div>

            <DragDropContext onDragEnd={handleAssetListDragEnd}>
              <Droppable droppableId="asset-list">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {nowsection.assets.map((asset, idx) => {
                      const magnetX = BASIC_WIDTH / 2 - AssetsStore.assets[asset].size / 2
                      const magnetY = BASIC_HEIGHT / 2 - AssetsStore.assets[asset].size / 2

                      return (
                        <Draggable key={asset} draggableId={asset.toString()} index={idx}>
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="h-20 flex p-2 border rounded-md space-x-2">
                              <img src={AssetsStore.assets[asset].content} className="aspect-square h-full object-contain" />
                              <div className="h-full flex-1 flex flex-col justify-between">
                                <Label>
                                  size <Slider min={0} max={BASIC_WIDTH} value={[AssetsStore.assets[asset].size]} onValueChange={([size]) => AssetsStore.updateSize(asset, size)} />
                                </Label>
                                <Label>
                                  x{' '}
                                  <Slider
                                    min={0}
                                    max={BASIC_WIDTH}
                                    value={[AssetsStore.assets[asset].x]}
                                    onValueChange={([x]) => AssetsStore.updateX(asset, Math.abs(x - magnetX) < 20 ? magnetX : x)}
                                  />
                                </Label>
                                <Label>
                                  y{' '}
                                  <Slider
                                    min={0}
                                    max={BASIC_HEIGHT}
                                    value={[AssetsStore.assets[asset].y]}
                                    onValueChange={([y]) => AssetsStore.updateY(asset, Math.abs(y - magnetY) < 20 ? magnetY : y)}
                                  />
                                </Label>
                              </div>
                              <div className="flex flex-col justify-between">
                                <Button variant="destructive" className="w-7 h-7" onClick={() => removeAsset(asset)}>
                                  <MdOutlineDelete />
                                </Button>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-7 h-7">
                                      <MdAnimation />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent>
                                    <div className="grid gap-4">
                                      <div className="space-y-2">
                                        <h4 className="font-medium leading-none">Animations</h4>
                                      </div>
                                      <div className="grid gap-2">
                                        {/* Animation Type */}
                                        <Label className="grid grid-cols-3 items-center gap-4">
                                          Type
                                          <div className="col-span-2">
                                            <Select
                                              value={AssetsStore.assets[asset].animation.type}
                                              onValueChange={(type) => AssetsStore.updateAnimationType(asset, type as 'vibrate' | 'moveto')}
                                            >
                                              <SelectTrigger className="w-full">
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="vibrate">Vibrate</SelectItem>
                                                <SelectItem value="moveto">Move To</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </Label>

                                        {/* Animation Ease */}
                                        <Label className="grid grid-cols-3 items-center gap-4">
                                          Ease
                                          <div className="col-span-2">
                                            <Select
                                              value={AssetsStore.assets[asset].animation.ease}
                                              onValueChange={(ease) => AssetsStore.updateAnimationEase(asset, ease as 'linear' | 'circIn')}
                                            >
                                              <SelectTrigger className="w-full">
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="linear">Linear</SelectItem>
                                                <SelectItem value="circIn">CircIn</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </Label>

                                        {/* Animation Direction */}
                                        <Label className="grid grid-cols-3 items-center gap-4">
                                          Direction
                                          <div className="col-span-2">
                                            <Select
                                              value={AssetsStore.assets[asset].animation.direction}
                                              onValueChange={(direction) => AssetsStore.updateAnimationDirection(asset, direction as 'x' | 'y')}
                                            >
                                              <SelectTrigger className="w-full">
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="x">X</SelectItem>
                                                <SelectItem value="y">Y</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </Label>

                                        {/* Animation Duration */}
                                        <Label className="grid grid-cols-3 items-center gap-4">
                                          Duration
                                          <Input
                                            type="number"
                                            value={AssetsStore.assets[asset].animation.duration}
                                            onChange={(e) => AssetsStore.updateAnimationDuration(asset, parseFloat(e.target.value))}
                                            className="col-span-2"
                                          />
                                        </Label>

                                        {/* Animation Value */}
                                        <Label className="grid grid-cols-3 items-center gap-4">
                                          Value
                                          <Input
                                            type="number"
                                            value={AssetsStore.assets[asset].animation.value}
                                            onChange={(e) => AssetsStore.updateAnimationValue(asset, parseFloat(e.target.value))}
                                            className="col-span-2"
                                          />
                                        </Label>
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      )
                    })}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </TabsContent>
      </Tabs>

      {/* 섹션 목록 */}
      <ScrollArea>
        <DragDropContext onDragEnd={handleSectionListDragEnd}>
          <Droppable droppableId="section-list" direction="horizontal">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="w-full flex items-center bg-gray-100 px-2 py-3 space-x-2">
                {sectionsList.map((sec, idx) => (
                  <Draggable key={sec} draggableId={sec.toString()} index={idx}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <motion.div
                          className={`p-1 border rounded-md bg-white ${activeSection === sec ? styles.selected : ''}`}
                          onClick={() => setActiveSection(sec)}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Viewer id={sec} width={100} />
                        </motion.div>
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}

                <div>
                  <motion.div className={'p-1 border border-dashed rounded-md bg-gray-100'} onClick={addSection} whileTap={{ scale: 0.9 }}>
                    <div className="aspect-video w-[100px] flex flex-wrap justify-center content-center text-gray-500">
                      <MdAddCircleOutline />
                    </div>
                  </motion.div>
                </div>

                <div>
                  <Popover>
                    <PopoverTrigger>
                      <motion.div className={'p-1 border border-dashed rounded-md bg-blue-300'} whileTap={{ scale: 0.9 }}>
                        <div className="aspect-video w-[100px] flex flex-wrap justify-center content-center text-gray-800">
                          <span>Project</span>
                        </div>
                      </motion.div>
                    </PopoverTrigger>

                    <PopoverContent>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">Project</h4>
                        </div>
                        <div className="grid gap-2">
                          <Label className="grid grid-cols-3 items-center gap-4">
                            Presentation
                            <Button asChild className="col-span-2 h-8">
                              <Link to="/presentation">click!</Link>
                            </Button>
                          </Label>
                        </div>
                        <hr />
                        <div className="grid gap-2">
                          <Label className="grid grid-cols-3 items-center gap-4">
                            Load
                            <Input type="file" onChange={(e) => importStores(e.target.files?.[0])} className="col-span-2 h-8" />
                          </Label>
                        </div>
                        <div className="grid gap-2">
                          <Label className="grid grid-cols-3 items-center gap-4">
                            Save
                            <Button onClick={exportStores} className="col-span-2 h-8">
                              click!
                            </Button>
                          </Label>
                        </div>
                        <div className="grid gap-2">
                          <Label className="grid grid-cols-3 items-center gap-4">
                            Export to PDF
                            <Button
                              disabled={isExportingPDF}
                              onClick={async () => {
                                setIsExportingPDF(true)
                                await exportPDF()
                                setIsExportingPDF(false)
                              }}
                              className="col-span-2 h-8"
                            >
                              click!
                            </Button>
                          </Label>
                        </div>
                        <hr />
                        <div className="grid gap-2">
                          <Label className="grid grid-cols-3 items-center gap-4">
                            Reset
                            <Button variant="destructive" onClick={resetStores} className="col-span-2 h-8">
                              click!
                            </Button>
                          </Label>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* pdf export sections */}
      <div className="absolute -left-9999">
        {sectionsList.map((id, idx) => (
          <div key={idx} className="pdf-section">
            <Viewer id={id} width={1980} />
          </div>
        ))}
      </div>
    </div>
  )
}
