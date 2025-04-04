import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import Viewer from "./Viewer";
import styles from './App.module.css'

export default function CanvasApp() {
  const [sections, setSections] = useState([
    { id: 1, content: "# 섹션 1\n이곳에 내용을 입력하세요." }
  ]);
  const [activeSection, setActiveSection] = useState(1);

  const updateContent = (id: number, newContent: string) => {
    setSections(sections.map(sec => sec.id === id ? { ...sec, content: newContent } : sec));
  };

  const addSection = () => {
    const newId = sections.map(sec => sec.id).reduce((x,y) => x>y?x:y) + 1;
    setSections([...sections, { id: newId, content: `# 섹션 ${newId}\n새로운 내용을 입력하세요.` }]);
    setActiveSection(newId);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedItems = [...sections];
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);
    setSections(reorderedItems);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* 미리보기 섹션 */}
      <div className="w-full aspect-video overflow-auto">
        <Viewer md={sections.find(s => s.id === activeSection)?.content} width={window.innerWidth} />
      </div>
      
      {/* 마크다운 편집기 */}
      <div className="flex-1 flex flex-col p-4 bg-gray-200">
        <Textarea
          className="flex-1 p-2 border rounded-md bg-white"
          value={sections.find(s => s.id === activeSection)?.content || ""}
          onChange={(e) => updateContent(activeSection, e.target.value)}
        />
      </div>

      {/* 편집기 */}
      <div className="flex justify-center p-4 bg-red-200">
        <Button className="ml-2">+ Image</Button>
        <Button className="ml-2" variant="destructive">delete</Button>
      </div>
      
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
                          <Viewer md={sec.content} width={100} />
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
