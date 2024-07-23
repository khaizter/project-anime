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
          <h2 className="font-space-grotesk text-2xl">Popular This Season</h2>
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
          <h2 className="font-space-grotesk text-2xl">Trending</h2>
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
          <h2 className="font-space-grotesk text-2xl">All Time Popular</h2>
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
          <h2 className="font-space-grotesk text-2xl">Upcoming Next Season</h2>
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
        <Link
          className="block text-center text-2xl font-space-grotesk"
          href={"/anime"}
        >
          VIEW MORE
        </Link>
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
