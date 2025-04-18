import shadow from 'react-shadow'
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import { BASIC_WIDTH } from './constants/BASIC_SIZE';
import { useAssetsStore } from './stores/assets';
import { useSectionsStore } from './stores/sections';

export default function Viewer({ id, width }: { id: number, width: number}) {
  const { sections } = useSectionsStore()
  const AssetsStore = useAssetsStore()

  const assets = sections[id].assets

  return (
    <shadow.div>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap');
      </style>
      <link rel="stylesheet" href="https://unpkg.com/bamboo.css"></link>
      <div style={{
        aspectRatio: '16/9',
        position: 'relative',
        width: `${width}px`,
        overflow: 'hidden'
      }}>
        <div
          style={{
            aspectRatio: '16/9',
            position: 'absolute',
            width: `${BASIC_WIDTH}px`,
            padding: '20px',
            transformOrigin: 'top left',
            transform: `scale(${width / BASIC_WIDTH})`,
            fontFamily: '"Noto Sans KR", sans-serif',
          }}
        >
          <ReactMarkdown remarkPlugins={[[remarkGfm, {singleTilde: false}]]}>
            {sections[id].content}
          </ReactMarkdown>
        
          {assets.map((asset, idx) => (
            <img
              key={idx}
              src={AssetsStore.assets[asset].content}
              style={{
                position: 'absolute',
                aspectRatio: '1 / 1',
                objectFit: 'contain',
                width: AssetsStore.assets[asset].size,
                left: AssetsStore.assets[asset].x,
                top: AssetsStore.assets[asset].y
              }}
            />
          ))}
        </div>
      </div>
    </shadow.div>
  );
}
