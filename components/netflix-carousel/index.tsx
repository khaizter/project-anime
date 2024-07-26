import Thumbnail from "@/components/thumbnail";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AnimeType } from "@/lib/types";
import React from "react";

interface NetflixCarouselProps {
  animes: Array<AnimeType>;
}

const NetflixCarousel: React.FC<NetflixCarouselProps> = (props) => {
  const { animes } = props;
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Carousel
      opts={{
        align: "start",
        slidesToScroll: 5,
      }}
      className="w-full p-0"
      setApi={setApi}
    >
      <CarouselContent className="ml-[5%] pr-[5%]">
        {animes.map((anime, index: number) => {
          return (
            <CarouselItem key={index} className="basis-[20%] p-2 last:mr-[5%]">
              <Thumbnail
                key={anime.id}
                anime={anime}
                index={index}
                totalColumn={5}
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>
      {current > 1 && (
        <CarouselPrevious className="left-0 bg-black/50 hover:bg-black/90 w-[5%] h-full rounded-none" />
      )}
      {current < count && (
        <CarouselNext className="right-0 bg-black/50 hover:bg-black/90 w-[5%] h-full rounded-none" />
      )}
    </Carousel>
  );
};

export default NetflixCarousel;
