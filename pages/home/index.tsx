import Thumbnail from "@/components/thumbnail";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Wrapper from "@/components/wrapper";
import { getPopularAnimes, getTrendingAnimes } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const HomePage = (props: any) => {
  const { popularAnimes, trendingAnimes } = props;
  return (
    <>
      <Carousel className="w-full">
        <CarouselContent>
          {trendingAnimes?.map((anime: any, index: number) => {
            console.log(anime);
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
                  <div className="absolute z-10 inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
                  <div className="absolute z-20 inset-x-0 bottom-0 p-4 text-center">
                    <div>{anime?.title?.romaji}</div>
                    <div
                      className="line-clamp-3"
                      dangerouslySetInnerHTML={{
                        __html: anime?.description || "",
                      }}
                    />
                    <Button>More details</Button>
                  </div>
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
