import shadow from 'react-shadow'
import ReactMarkdown from "react-markdown";
import { asset } from './types/asset';
import { BASIC_WIDTH } from './constants/BASIC_SIZE';

export default function Viewer({ md, width, assets }: { md?: string, width: number, assets: asset[]}) {
  return (
    <shadow.div>
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
            transform: `scale(${width / BASIC_WIDTH})`
          }}
        >
          <ReactMarkdown>{md}</ReactMarkdown>
        
          {assets.map((asset, idx) => (
            <img
              key={idx}
              src={asset.content}
              style={{
                position: 'absolute',
                aspectRatio: '1 / 1',
                objectFit: 'contain',
                width: asset.size,
                left: asset.x,
                top: asset.y
              }}
            />
          ))}
        </div>
      </div>
    </shadow.div>
  );
}
