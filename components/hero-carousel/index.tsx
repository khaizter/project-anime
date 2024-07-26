import React from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import Wrapper from "@/components/wrapper";
import { ChevronRight, Circle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeroCarouselProps {
  animes: Array<any>;
}

const HeroCarousel: React.FC<HeroCarouselProps> = (props) => {
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
      className="w-full"
      opts={{
        loop: true,
      }}
      autoplay={false}
      autoplayInterval={4000}
      setApi={setApi}
    >
      <CarouselContent className="ml-0">
        {animes?.map((anime: any, index: number) => {
          return (
            <CarouselItem key={index} className="p-0">
              <div className="relative w-full h-[80vh]">
                <Image
                  src={anime?.bannerImage || ""}
                  fill
                  priority
                  className="object-cover"
                  alt={`banner image`}
                />
                <div className="absolute z-10 inset-0 bg-gradient-to-r from-jacaranda/85 from-0% via-transparent via-70% to-jacaranda/85 to-100%"></div>
                <div className="absolute z-10 inset-0 bg-gradient-to-b from-transparent to-jacaranda"></div>

                <div className="absolute z-20 inset-x-0 bottom-40 px-[calc(5%+8px)] py-4 space-y-4">
                  <div className="text-xl font-space-grotesk text-lavender-magenta">{`#${
                    index + 1
                  } Trending`}</div>
                  <div className="text-4xl font-space-grotesk line-clamp-2 max-w-96">
                    {anime?.title?.romaji}
                  </div>
                  <div
                    className="line-clamp-2 font-rajdhani text-white/90"
                    dangerouslySetInnerHTML={{
                      __html: anime?.description || "",
                    }}
                  />
                  <Button>
                    <Play className="w-4 h-4 mr-2" fill="#FFF" />
                    More details
                  </Button>
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <div className="absolute z-20 top-60 right-[calc(5%+8px)] space-y-2">
        {animes.map((item: any, slide_index: number) => {
          return (
            <Circle
              key={slide_index}
              className="w-1.5 h-1.5"
              color="rgba(255, 255, 255, 0.8)"
              fill={
                current >= slide_index
                  ? "rgba(255, 255, 255, 0.8)"
                  : "transparent"
              }
            />
          );
        })}
      </div>
      <div className="flex items-center justify-between px-[calc(5%+8px)] mb-8 w-full absolute left-0 bottom-0">
        <h2 className="font-space-grotesk text-2xl">Popular This Season</h2>
        <Link
          className="flex items-center"
          href={{
            pathname: "/anime",
            query: {
              sort: "popular",
            },
          }}
        >
          View More
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </Carousel>
  );
};

export default HeroCarousel;
