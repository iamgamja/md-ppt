import shadow from 'react-shadow'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import { BASIC_WIDTH } from './constants/BASIC_SIZE'
import { useAssetsStore } from './stores/assets'
import { useSectionsStore } from './stores/sections'
import { Root } from 'mdast'
import { h } from 'hastscript'
import { visit } from 'unist-util-visit'
import ErrorBoundary from './utils/ErrorBoundary'

function myDirectivePlugin() {
  return function (tree: Root) {
    visit(tree, function (node) {
      if (node.type === 'containerDirective' || node.type === 'leafDirective' || node.type === 'textDirective') {
        const data = node.data || (node.data = {})
        const hast = h(node.name, node.attributes || {})

        data.hName = hast.tagName
        data.hProperties = hast.properties
      }
    })
  }
}

export default function Viewer({ id, width }: { id: number; width: number }) {
  const { sections } = useSectionsStore()
  const AssetsStore = useAssetsStore()

  const assets = sections[id].assets

  return (
    <ErrorBoundary fallback={<p>Something went wrong</p>}>
      <shadow.div>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap');

          center {
            position: absolute;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          div.bg {
            position: absolute;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            padding: 20px;

            background-color: var(--ppt-color-bg);
            color: var(--ppt-color-text);

            --ppt-color-highlight: #ff1b6a;
            --ppt-color-block: #efefef;
          }

          div.bg.title {
            --ppt-color-bg: #0e2432;
            --ppt-color-text: #efefef;
          }

          div.bg.page {
            --ppt-color-bg: white;
            --ppt-color-text: black;
          }

          div.bg hr {
            width: 100px;
            height: 2px;
            background-color: var(--ppt-color-highlight);
            margin-bottom: 24px;
          }

          div.bg div.block {
            width: 100%;
            background-color: var(--ppt-color-block);
            padding: 20px;
          }

          div.bg :is(h1,h2,h3,h4,h5,h6) {
            margin-top: 10px;
          }
        `}</style>
        <link rel="stylesheet" href="https://unpkg.com/bamboo.css"></link>
        <div
          style={{
            aspectRatio: '16/9',
            position: 'relative',
            width: `${width}px`,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              aspectRatio: '16/9',
              position: 'absolute',
              width: `${BASIC_WIDTH}px`,
              transformOrigin: 'top left',
              transform: `scale(${width / BASIC_WIDTH})`,
              fontFamily: '"Noto Sans KR", sans-serif',
            }}
          >
            <ReactMarkdown remarkPlugins={[[remarkGfm, { singleTilde: false }], remarkDirective, myDirectivePlugin]}>{sections[id].content}</ReactMarkdown>

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
                  top: AssetsStore.assets[asset].y,
                }}
              />
            ))}
          </div>
        </div>
      </shadow.div>
    </ErrorBoundary>
  )
}
