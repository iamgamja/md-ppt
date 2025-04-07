import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import Viewer from "./Viewer";
import styles from './App.module.css'

export type asset = {
  content: string
  size: number
  x: number
  y: number
}

type section = {
  id: number
  content: string
  assets: asset[]
}

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result!.toString());
  reader.onerror = reject;
});

export default function App() {
  const [sections, setSections] = useState<section[]>([
    {
      id: 1,
      content: "# 섹션 1\n이곳에 내용을 입력하세요.",
      assets: []
    }
  ]);
  const [activeSection, setActiveSection] = useState(1);

  const addAsset = async (id: number, file?: File) => {
    if (!file) return;

    const base64 = await toBase64(file)
    const asset: asset = {
      content: base64,
      size: 100,
      x: 0,
      y: 0
    }

    setSections(sections.map(sec => (
      sec.id === id
      ? { ...sec, assets: [...sec.assets, asset] }
      : sec
    )))
  }

  const updateAsset = (id: number, contentidx: number, prop: 'size'|'x'|'y', value: number) => {
    const oldassets = sections.find(s => s.id === id)!.assets
    const newassets = [...oldassets]
    newassets[contentidx][prop] = value

    setSections(sections.map(sec => sec.id === id ? { ...sec, assets: newassets } : sec));
  }

  const updateContent = (id: number, newContent: string) => {
    setSections(sections.map(sec => sec.id === id ? { ...sec, content: newContent } : sec));
  };

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
    <div className="flex flex-col h-screen">
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
              <Input type="file" accept="image/*" onChange={e => (addAsset(activeSection, e.target.files?.[0]), e.target.value = '')} />
            </div>

            {section.assets.map((asset, idx) => (
              <div key={idx} className="h-20 flex p-2 border rounded-md">
                <img src={asset.content} className="aspect-square h-full object-contain" />
                <div className="h-full flex-1 flex flex-col justify-between">
                  <Label>size <Slider min={0} max={700} value={[asset.size]} onValueChange={(e) => updateAsset(section.id, idx, 'size', e[0])} /></Label>
                  <Label>x <Slider min={0} max={700} value={[asset.x]} onValueChange={(e) => updateAsset(section.id, idx, 'x', e[0])} /></Label>
                  <Label>y <Slider min={0} max={700} value={[asset.y]} onValueChange={(e) => updateAsset(section.id, idx, 'y', e[0])} /></Label>
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
