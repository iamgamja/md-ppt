import { useState } from 'react'
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md'

export default function FullscreenToggleButton() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => {
    const elem = document.documentElement

    if (!isFullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }

    setIsFullscreen(!isFullscreen)
  }

  return (
    <button onClick={toggleFullscreen} className="fixed bottom-4 right-4 bg-black/10 text-white p-3 rounded-full">
      {isFullscreen ? <MdFullscreenExit size={24} /> : <MdFullscreen size={24} />}
    </button>
  )
}
