import shadow from 'react-shadow'
import ReactMarkdown from "react-markdown";

const DEFAULT_WIDTH = 1000

export default function Viewer({ md, width }: { md?: string, width: number }) {
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
            position: 'absolute',
            aspectRatio: '16/9',
            width: `${DEFAULT_WIDTH}px`,
            transformOrigin: 'top left',
            transform: `scale(${width / DEFAULT_WIDTH})`
          }}
        >
          <ReactMarkdown>{md}</ReactMarkdown>
        </div>
      </div>
    </shadow.div>
  );
}
