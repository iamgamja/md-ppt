import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import Fade from 'embla-carousel-fade'
import { usePageSettingStore } from './stores/pageSetting'
import Viewer from './Viewer'
import { useEffect, useState } from 'react'
import FullscreenToggleButton from './components/fullscreenButton'

export default function Presentation() {
  const sectionsList = usePageSettingStore((state) => state.sectionsList)

  const [api, setApi] = useState<CarouselApi>()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') api?.scrollPrev()
      if (e.key === 'ArrowRight') api?.scrollNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [api])

  return (
    <>
      <Carousel plugins={[Fade()]} setApi={setApi}>
        <CarouselContent>
          {sectionsList.map((id, idx) => (
            <CarouselItem key={idx}>
              <Viewer id={id} width={window.innerWidth} animation />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <FullscreenToggleButton />
    </>
  )
}
