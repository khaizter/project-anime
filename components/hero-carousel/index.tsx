import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import Wrapper from "@/components/wrapper";
import { Circle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroCarouselProps {
  animes: Array<any>;
}

const HeroCarousel: React.FC<HeroCarouselProps> = (props) => {
  const { animes } = props;
  return (
    <Carousel
      className="w-full"
      opts={{
        loop: true,
      }}
      autoplay={true}
      autoplayInterval={4000}
    >
      <CarouselContent>
        {animes?.map((anime: any, index: number) => {
          return (
            <CarouselItem key={index}>
              <div className="relative w-full h-[36rem]">
                <Image
                  src={anime?.bannerImage || ""}
                  fill
                  priority
                  className="object-cover"
                  alt={`banner image`}
                />
                <div className="absolute z-10 inset-0 bg-gradient-to-r from-jacaranda/85 from-0% via-transparent via-70% to-jacaranda/85 to-100%"></div>
                <div className="absolute z-10 inset-0 bg-gradient-to-b from-jacaranda/85 via-transparent to-jacaranda/85"></div>
                <Wrapper className="absolute z-20 top-60 right-0 space-y-2">
                  {animes.map((item: any, slide_index: number) => {
                    return (
                      <Circle
                        key={slide_index}
                        className="w-1.5 h-1.5"
                        color="rgba(255, 255, 255, 0.8)"
                        fill={
                          index >= slide_index
                            ? "rgba(255, 255, 255, 0.8)"
                            : "transparent"
                        }
                      />
                    );
                  })}
                </Wrapper>

                <Wrapper className="absolute z-20 inset-x-0 top-60 p-4 space-y-4">
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
                </Wrapper>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
};

export default HeroCarousel;
