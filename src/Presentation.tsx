import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Fade from 'embla-carousel-fade'
import { usePageSettingStore } from "./stores/pageSetting"
import Viewer from "./Viewer"

export default function Presentation() {
  const { sectionsList } = usePageSettingStore()

  return (
    <Carousel plugins={[ Fade() ]}>
      <CarouselContent>
        {sectionsList.map((id, idx) => (
          <CarouselItem className="border" key={idx}>
            <Viewer id={id} width={window.innerWidth} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
