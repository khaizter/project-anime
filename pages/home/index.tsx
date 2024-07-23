import Thumbnail from "@/components/thumbnail";
import Wrapper from "@/components/wrapper";
import {
  getPopularAnimes,
  getPopularAnimesThisSeason,
  getPopularAnimesNextSeason,
  getTrendingAnimes,
} from "@/lib/anilist";
import Link from "next/link";
import React from "react";
import HeroCarousel from "@/components/hero-carousel";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
const HomePage = (props: any) => {
  const {
    popularAnimes,
    trendingAnimes,
    popularAnimesThisSeason,
    popularAnimesNextSeason,
  } = props;
  return (
    <>
      <HeroCarousel animes={trendingAnimes} />
      <Wrapper className="space-y-10 py-10">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
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
          <div className="grid grid-cols-6 gap-4">
            {popularAnimesThisSeason.map((anime: any, index: number) => {
              return (
                <Thumbnail
                  key={anime.id}
                  anime={anime}
                  index={index}
                  totalColumn={6}
                />
              );
            })}
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-space-grotesk text-2xl">Trending</h2>
            <Link
              className="flex items-center"
              href={{
                pathname: "/anime",
                query: {
                  sort: "trending",
                },
              }}
            >
              View More
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-6 gap-4">
            {trendingAnimes.map((anime: any, index: number) => {
              return (
                <Thumbnail
                  key={anime.id}
                  anime={anime}
                  index={index}
                  totalColumn={6}
                />
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-space-grotesk text-2xl">All Time Popular</h2>
            <Link
              className="flex items-center"
              href={{
                pathname: "/anime",
                query: {
                  sort: "alltimepopular",
                },
              }}
            >
              View More
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-6 gap-4">
            {popularAnimes.map((anime: any, index: number) => {
              return (
                <Thumbnail
                  key={anime.id}
                  anime={anime}
                  index={index}
                  totalColumn={6}
                />
              );
            })}
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-space-grotesk text-2xl">
              Upcoming Next Season
            </h2>
            <Link
              className="flex items-center"
              href={{
                pathname: "/anime",
                query: {
                  sort: "upcoming",
                },
              }}
            >
              View More
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-6 gap-4">
            {popularAnimesNextSeason.map((anime: any, index: number) => {
              return (
                <Thumbnail
                  key={anime.id}
                  anime={anime}
                  index={index}
                  totalColumn={6}
                />
              );
            })}
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export const getStaticProps = async (context: any) => {
  const { animeList: popularAnimeList } = await getPopularAnimes(1, 6);
  const { animeList: popularAnimeThisSeasonList } =
    await getPopularAnimesThisSeason(1, 6);
  const { animeList: popularAnimeNextSeasonList } =
    await getPopularAnimesNextSeason(1, 6);
  const { animeList: trendingAnimeList } = await getTrendingAnimes(1, 6);
  return {
    props: {
      popularAnimes: popularAnimeList,
      trendingAnimes: trendingAnimeList,
      popularAnimesThisSeason: popularAnimeThisSeasonList,
      popularAnimesNextSeason: popularAnimeNextSeasonList,
    },
  };
};

export default HomePage;
