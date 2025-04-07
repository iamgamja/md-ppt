import shadow from 'react-shadow'
import ReactMarkdown from "react-markdown";
import { asset } from './App';

const DEFAULT_WIDTH = 700

export default function Viewer({ md, width, assets }: { md?: string, width: number, assets: asset[]}) {
  return (
    <shadow.div>
      <link rel="stylesheet" href="https://unpkg.com/bamboo.css"></link>
      <div style={{
        aspectRatio: '16/9',
        position: 'relative',
        width: `${width}px`
      }}>
        <div
          style={{
            aspectRatio: '16/9',
            position: 'absolute',
            width: `${DEFAULT_WIDTH}px`,
            padding: '20px',
            transformOrigin: 'top left',
            transform: `scale(${width / DEFAULT_WIDTH})`
          }}
        >
          <ReactMarkdown>{md}</ReactMarkdown>
        
          {assets.map((asset, idx) => (
            <img
              key={idx}
              src={asset.content}
              style={{
                position: 'absolute',
                width: `${asset.size}px`,
                left: asset.position[0],
                top: asset.position[1]
              }}
            />
          ))}
        </div>
      </div>
    </shadow.div>
  );
}
