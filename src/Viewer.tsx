import shadow from 'react-shadow'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import rehypeMathjax from 'rehype-mathjax'
import remarkMath from 'remark-math'
import { BASIC_WIDTH } from './constants/BASIC_SIZE'
import { useAssetsStore } from './stores/assets'
import { useSectionsStore } from './stores/sections'
import { Root } from 'mdast'
import { h } from 'hastscript'
import { visit } from 'unist-util-visit'
import ErrorBoundary from './utils/ErrorBoundary'
import { motion } from 'framer-motion'
import { animation } from './types/asset'
import { ReactNode } from 'react'

const sineWave = Array.from({ length: 60 }, (_, i) => {
  const progress = (i / (60 - 1)) * (2 * Math.PI) // 0 ~ 2π
  return Math.sin(progress)
})

type animProps = {
  animate: { [key: string]: number | number[] }
  transition: {
    duration: number
    repeat: number
    ease: string | [number, number, number, number]
  }
}

const generateAnimProps = (animation: animation): animProps => {
  const { type, ease, direction, duration, value } = animation

  if (type === 'vibrate') {
    const wave = sineWave.map((v) => v * value)
    return {
      animate: { [direction]: wave },
      transition: {
        duration,
        repeat: Infinity,
        ease,
      },
    }
  } else if (type === 'moveto') {
    return {
      animate: { [direction]: value },
      transition: {
        duration,
        repeat: Infinity,
        ease,
      },
    }
  } else {
    throw new Error('Unknown animation type')
  }
}

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

function wrapWithMotion({ animations, idx, children, key }: { animations: animation[]; idx: number; children: ReactNode, key: number | string }) {
  if (idx >= animations.length) return children

  const animation = animations[idx]

  return <motion.div key={`
recursion-${key}-${idx}`} {...generateAnimProps(animation)}>{wrapWithMotion({ animations, idx: idx + 1, children, key })}</motion.div>
}

export default function Viewer({ id, width }: { id: number; width: number }) {
  const sections = useSectionsStore((state) => state.sections)
  const assets = useAssetsStore((state) => state.assets)

  return (
    <ErrorBoundary fallback={<p>Something went wrong</p>}>
      <shadow.div>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap');

          :host {
            --b-font-main: system-ui, sans-serif;
            --b-font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
            
            --b-txt: #2e3440;
            --b-bg-1: #fff;
            --b-bg-2: #eceff4;
            --b-line: #eceff4;
            --b-link: #bf616a;
            --b-btn-bg: #242933;
            --b-btn-txt: #fff;
            --b-focus: #d8dee9;
          }

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
            margin-bottom: 24px;
            border-bottom: 2px solid var(--ppt-color-highlight);
          }

          div.bg div.block {
            width: 100%;
            background-color: var(--ppt-color-block);
            padding: 20px;
            box-shadow: 0px 2px 6px rgb(0 0 0 / 10%);
          }

          div.bg div.block.flex {
            display: flex;
            gap: 20px;
          }

          div.bg div.block.flex.column {
            flex-direction: column;
          }

          div.bg :is(h1,h2,h3,h4,h5,h6) {
            margin-top: 10px;
          }

          div.bg :is(em, strong, ins) {
            color: var(--ppt-color-highlight);
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
            <ReactMarkdown remarkPlugins={[[remarkGfm, { singleTilde: false }], remarkDirective, myDirectivePlugin, remarkMath]} rehypePlugins={[rehypeMathjax]}>
              {sections[id].content}
            </ReactMarkdown>

            {sections[id].assets.map((asset, idx) =>
              wrapWithMotion({
                animations: assets[asset].animation,
                idx: 0,
                key: idx,
                children: (
                  <motion.img
                    key={idx}
                    src={assets[asset].content}
                    style={{
                      position: 'absolute',
                      aspectRatio: '1 / 1',
                      objectFit: 'contain',
                      width: assets[asset].size,
                      left: assets[asset].x,
                      top: assets[asset].y,
                    }}
                  />
                ),
              }),
            )}
          </div>
        </div>
      </shadow.div>
    </ErrorBoundary>
  )
}
