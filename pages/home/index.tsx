import Thumbnail from "@/components/thumbnail";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Wrapper from "@/components/wrapper";
import { getPopularAnimes, getTrendingAnimes } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Circle, Play } from "lucide-react";
const HomePage = (props: any) => {
  const { popularAnimes, trendingAnimes } = props;
  return (
    <>
      <Carousel
        className="w-full"
        opts={{
          loop: true,
        }}
        autoplay={true}
        autoplayInterval={4000}
      >
        <CarouselContent>
          {trendingAnimes?.map((anime: any, index: number) => {
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
                    {trendingAnimes.map((item: any, slide_index: number) => {
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
                      className="line-clamp-2 font-rajdhani"
                      dangerouslySetInnerHTML={{
                        __html: anime?.description || "",
                      }}
                    />
                    <Button className="bg-medium-red-violet font-space-grotesk">
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

      <Wrapper>
        <h2>Popular</h2>
        <div className="grid grid-cols-6 gap-4">
          {popularAnimes.map((anime: any) => {
            return (
              <Thumbnail
                key={anime.id}
                id={anime.id}
                title={anime.title.romaji}
                coverImage={anime.coverImage.large}
                description={anime.description}
              />
            );
          })}
        </div>
        <h2>Trending</h2>
        <div className="grid grid-cols-6 gap-4">
          {trendingAnimes.map((anime: any) => {
            return (
              <Thumbnail
                key={anime.id}
                id={anime.id}
                title={anime.title.romaji}
                coverImage={anime.coverImage.large}
                description={anime.description}
              />
            );
          })}
        </div>
        <Link href={"/anime"}>VIEW MORE</Link>
      </Wrapper>
    </>
  );
};

export const getStaticProps = async (context: any) => {
  const { animeList: popularAnimeList } = await getPopularAnimes(1, 6);
  const { animeList: trendingAnimeList } = await getTrendingAnimes(1, 6);
  return {
    props: {
      popularAnimes: popularAnimeList,
      trendingAnimes: trendingAnimeList,
    },
  };
};

export default HomePage;
