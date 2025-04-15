import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Fade from 'embla-carousel-fade'
import { useSectionsStore } from "./stores/sections"
import { usePageSettingStore } from "./stores/pageSetting"
import Viewer from "./Viewer"

export default function Presentation() {
  const { sectionsList } = usePageSettingStore()
  const { sections } = useSectionsStore()

  return (
    <Carousel plugins={[ Fade() ]}>
      <CarouselContent>
        {sectionsList.map((id, idx) => (
          <CarouselItem className="border" key={idx}>
            <Viewer md={sections[id].content} assets={sections[id].assets} width={window.innerWidth} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
