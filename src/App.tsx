import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { asset } from "./types/asset";
import { section } from "./types/section";
import Viewer from "./Viewer";
import styles from './App.module.css'
import { BASIC_HEIGHT, BASIC_WIDTH } from "./constants/BASIC_SIZE";
import { toBase64 } from "./utils/utils";

export default function App() {
  const [sections, setSections] = useState<section[]>([
    {
      id: 1,
      content: "# 섹션 1\n이곳에 내용을 입력하세요.",
      assets: []
    }
  ]);
  const [activeSection, setActiveSection] = useState(1);

  const updateContent = (id: number, content: string) => {
    setSections(sections.map(sec => sec.id === id ? { ...sec, content } : sec));
  }

  const addAsset = (id: number, asset: asset) => {
    setSections(sections.map(sec => sec.id === id ? { ...sec, assets: [...sec.assets, asset] } : sec));
  }

  const updateAsset = (id: number, idx: number, prop: 'size'|'x'|'y', value: number, magnet?: number) => {
    if (typeof magnet === 'number') {
      if (Math.abs(value - magnet) < 10)
        value = magnet
    }

    setSections(sections.map(sec => sec.id === id ? {
      ...sec,
      assets: sec.assets.map((asset, assetidx) => assetidx === idx ? {
        ...asset,
        [prop]: value
      } : asset)
    } : sec));
  }

  const addFile = async (id: number, file?: File) => {
    if (!file) return;

    addAsset(id, {
      content: await toBase64(file),
      size: 100,
      x: 0,
      y: 0
    })
  }

  const addSection = () => {
    const newId = sections.map(sec => sec.id).reduce((x,y) => x>y?x:y) + 1;
    setSections([...sections, { id: newId, content: `# 섹션 ${newId}\n새로운 내용을 입력하세요.`, assets: [] }]);
    setActiveSection(newId);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedItems = [...sections];
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);
    setSections(reorderedItems);
  };

  const section = sections.find(s => s.id === activeSection)!

  return (
    <div className="flex flex-col h-dvh">
      {/* 미리보기 섹션 */}
      <div className="aspect-video">
        <Viewer md={section.content} width={window.innerWidth} assets={section.assets} />
      </div>
      
      {/* 마크다운 편집기 */}
      <Tabs defaultValue="markdown" className="flex-1 p-4 bg-gray-200 overflow-scroll">
        <TabsList>
          <TabsTrigger value="markdown">Markdown</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
        </TabsList>

        <TabsContent value="markdown" className="flex flex-col">
          <Textarea
            className="flex-1 p-2 border rounded-md bg-white"
            value={section.content}
            onChange={(e) => updateContent(activeSection, e.target.value)}
          />
        </TabsContent>

        <TabsContent value="assets">
          <div className="h-full rounded-md border p-2 space-y-2 bg-white">
            <div className="flex flex-row-reverse">
              <Input type="file" accept="image/*" onChange={e => (addFile(activeSection, e.target.files?.[0]), e.target.value = '')} />
            </div>

            {section.assets.map((asset, idx) => (
              <div key={idx} className="h-20 flex p-2 border rounded-md space-x-2">
                <img src={asset.content} className="aspect-square h-full object-contain" />
                <div className="h-full flex-1 flex flex-col justify-between">
                  <Label>size <Slider min={0} max={BASIC_WIDTH} value={[asset.size]} onValueChange={(e) => updateAsset(activeSection, idx, 'size', e[0])} /></Label>
                  <Label>x <Slider min={0} max={BASIC_WIDTH} value={[asset.x]} onValueChange={(e) => updateAsset(activeSection, idx, 'x', e[0], BASIC_WIDTH/2-asset.size/2)} /></Label>
                  <Label>y <Slider min={0} max={BASIC_HEIGHT} value={[asset.y]} onValueChange={(e) => updateAsset(activeSection, idx, 'y', e[0], BASIC_HEIGHT/2-asset.size/2)} /></Label>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* 섹션 목록 */}
      <ScrollArea>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable-list" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="w-full flex items-center bg-gray-100 px-2 py-3 space-x-2"
              >
                {sections.map((sec, idx) => (
                  <Draggable key={sec.id} draggableId={sec.id.toString()} index={idx}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <motion.div
                          className={`p-1 border rounded-md bg-white ${activeSection === sec.id ? styles.selected : ''}`}
                          onClick={() => setActiveSection(sec.id)}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Viewer md={sec.content} width={100} assets={sec.assets} />
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
