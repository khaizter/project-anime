import React from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import Wrapper from "@/components/wrapper";
import { ChevronRight, Circle, Diamond, Play } from "lucide-react";
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
                  className="object-cover hidden md:block"
                  alt={`banner image`}
                />
                <Image
                  src={anime?.coverImage.large || ""}
                  fill
                  priority
                  className="object-cover block md:hidden"
                  alt={`banner image`}
                />
                <div className="absolute z-10 inset-0 bg-gradient-to-r from-jacaranda/85 from-0% via-transparent via-70% to-jacaranda/85 to-100%"></div>
                <div className="absolute z-10 inset-0 bg-gradient-to-b from-transparent to-jacaranda"></div>

                <div className="absolute z-20 inset-x-0 bottom-0 md:bottom-40 px-[calc(5%+8px)] py-4 space-y-4 flex flex-col items-center md:items-start text-center md:text-start">
                  <div className="text-xl font-space-grotesk text-lavender-magenta">{`#${
                    index + 1
                  } Trending`}</div>
                  <div className="text-4xl font-space-grotesk line-clamp-2 max-w-96">
                    {anime?.title?.romaji}
                  </div>
                  <div className="hidden md:block">
                    <div
                      className="line-clamp-3 font-rajdhani text-white/90 max-w-lg"
                      dangerouslySetInnerHTML={{
                        __html: anime?.description || "",
                      }}
                    />
                  </div>

                  <Button className="w-max">
                    <Play className="w-4 h-4 mr-2" fill="#FFF" />
                    More details
                  </Button>
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <div className="absolute z-20 bottom-16 md:bottom-36 left-1/2 md:left-[calc(5%+8px)] -translate-x-1/2 md:translate-x-0 space-x-2 flex items-center">
        {animes.map((_, slide_index: number) => {
          return (
            <Diamond
              key={slide_index}
              className="w-3 h-3 m-0"
              color="#B43E8F"
              fill={current >= slide_index ? "#B43E8F" : "transparent"}
            />
          );
        })}
      </div>
      <div className="flex items-center justify-between px-[calc(5%+8px)] mb-8 w-full static md:absolute left-0 bottom-0 mt-16">
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
