import { Textarea } from "@/components/ui/textarea";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "./components/ui/popover";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import Viewer from "./Viewer";
import styles from './App.module.css'
import { BASIC_HEIGHT, BASIC_WIDTH } from "./constants/BASIC_SIZE";
import { useSectionsStore } from "./stores/sections";
import { useAssetsStore } from "./stores/assets";
import { Button } from "./components/ui/button";
import { usePageSettingStore } from "./stores/pageSetting";

export default function App() {
  const SectionsStore = useSectionsStore()
  const AssetsStore = useAssetsStore()
  const { sectionsList, activeSection, activeTab, setSectionsList, setActiveSection, setActiveTab, addFile, addSection, copySection, removeSection, removeAsset } = usePageSettingStore()

  const handleSectionListDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedItems = [...sectionsList];
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);
    setSectionsList(reorderedItems);
  }

  const handleAssetListDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedItems = [...nowsection.assets];
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);
    SectionsStore.updateAssets(activeSection, reorderedItems);
  }

  const nowsection = SectionsStore.sections[activeSection]

  return (
    <div className="flex flex-col h-dvh">
      {/* 미리보기 섹션 */}
      <div className="aspect-video">
        <Viewer md={nowsection.content} width={window.innerWidth} assets={nowsection.assets} />
      </div>
      
      {/* 마크다운 편집기 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 p-4 bg-gray-200 overflow-scroll">
        <TabsList>
          <TabsTrigger className="default-tab" value="markdown">Markdown</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="tmp1" onClick={() => {copySection(activeSection); setActiveTab("markdown")}}>copy</TabsTrigger>
          <TabsTrigger value="tmp2" className="bg-red-400" disabled={sectionsList.length === 1} onClick={() => {removeSection(activeSection); setActiveTab("markdown")}}>delete</TabsTrigger>
        </TabsList>

        <TabsContent value="markdown" className="flex flex-col">
          <Textarea
            className="flex-1 p-2 border rounded-md bg-white"
            value={nowsection.content}
            onChange={(e) => SectionsStore.updateContent(activeSection, e.target.value)}
          />
        </TabsContent>

        <TabsContent value="assets">
          <div className="h-full rounded-md border p-2 space-y-2 bg-white">
            <div className="flex flex-row-reverse">
              <Input type="file" accept="image/*" onChange={e => (addFile(activeSection, e.target.files?.[0]), e.target.value = '')} />
            </div>

            <DragDropContext onDragEnd={handleAssetListDragEnd}>
              <Droppable droppableId="asset-list">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {nowsection.assets.map((asset, idx) => {
                      const magnetX = BASIC_WIDTH/2 - AssetsStore.assets[asset].size/2
                      const magnetY = BASIC_HEIGHT/2 - AssetsStore.assets[asset].size/2

                      return (
                        <Draggable key={asset} draggableId={asset.toString()} index={idx}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="h-20 flex p-2 border rounded-md space-x-2"
                            >
                              <img src={AssetsStore.assets[asset].content} className="aspect-square h-full object-contain" />
                              <div className="h-full flex-1 flex flex-col justify-between">
                                <Label>size <Slider min={0} max={BASIC_WIDTH} value={[AssetsStore.assets[asset].size]} onValueChange={([size]) => AssetsStore.updateSize(asset, size)} /></Label>
                                <Label>x <Slider min={0} max={BASIC_WIDTH} value={[AssetsStore.assets[asset].x]} onValueChange={([x]) => AssetsStore.updateX(asset, Math.abs(x-magnetX) < 20 ? magnetX : x)} /></Label>
                                <Label>y <Slider min={0} max={BASIC_HEIGHT} value={[AssetsStore.assets[asset].y]} onValueChange={([y]) => AssetsStore.updateY(asset, Math.abs(y-magnetY) < 20 ? magnetY : y)} /></Label>
                              </div>
                              <div className="flex flex-col justify-between">
                                <Button variant="destructive" className="w-7 h-7" onClick={() => removeAsset(asset)}>X</Button>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant='outline' className="w-7 h-7">ani</Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="">
                                    <div className="grid gap-4">
                                      <div className="space-y-2">
                                        <h4 className="font-medium leading-none">Animations</h4>
                                      </div>
                                      <div className="grid gap-2">
                                        <p>🛠️ Work in Progress...</p>
                                        {/* <Label className="grid grid-cols-3 items-center gap-4">
                                          Type
                                          <Input className="col-span-2 h-8"/>
                                        </Label> */}
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>
                          )}
                      </Draggable>
                    )})}

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
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="w-full flex items-center bg-gray-100 px-2 py-3 space-x-2"
              >
                {sectionsList.map((sec, idx) => (
                  <Draggable key={sec} draggableId={sec.toString()} index={idx}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <motion.div
                          className={`p-1 border rounded-md bg-white ${activeSection === sec ? styles.selected : ''}`}
                          onClick={() => setActiveSection(sec)}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Viewer md={SectionsStore.sections[sec].content} width={100} assets={SectionsStore.sections[sec].assets} />
                        </motion.div>
                      </div>
                    )}
                  </Draggable>
                ))}
                
              {provided.placeholder}

              <div>
                <motion.div
                  className={'p-1 border border-dashed rounded-md bg-gray-100'}
                  onClick={addSection}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="aspect-video w-[100px] flex flex-wrap justify-center content-center text-gray-500">
                    <span>+</span>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
          </Droppable>
        </DragDropContext>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
