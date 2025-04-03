import ReactMarkdown from "react-markdown";

export default function Viewer({md, width}: {md?: string, width: number}) {
  return (
    <div
      className="aspect-video"
      style={{
        position: 'relative',
        width: `${width}px`
      }}
    >
      <div
        className="aspect-video bg-red-200"
        style={{
          position: 'absolute',
          width: '1920px',
          transformOrigin: 'top left',
          transform: `scale(${width / 1920})`
        }}
      >
        <ReactMarkdown>{md}</ReactMarkdown>
      </div>
    </div>
  )
}