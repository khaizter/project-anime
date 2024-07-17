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
  console.log(popularAnimesThisSeason);
  return (
    <>
      <HeroCarousel animes={trendingAnimes} />
      <Wrapper>
        <h2>Popular This Season</h2>
        <div className="grid grid-cols-6 gap-4">
          {popularAnimesThisSeason.map((anime: any) => {
            return <Thumbnail key={anime.id} anime={anime} />;
          })}
        </div>
        <h2>Trending</h2>
        <div className="grid grid-cols-6 gap-4">
          {trendingAnimes.map((anime: any) => {
            return <Thumbnail key={anime.id} anime={anime} />;
          })}
        </div>

        <h2>All Time Popular</h2>
        <div className="grid grid-cols-6 gap-4">
          {popularAnimes.map((anime: any) => {
            return <Thumbnail key={anime.id} anime={anime} />;
          })}
        </div>
        <h2>Upcoming Next Season</h2>
        <div className="grid grid-cols-6 gap-4">
          {popularAnimesNextSeason.map((anime: any) => {
            return <Thumbnail key={anime.id} anime={anime} />;
          })}
        </div>
        <Link href={"/anime"}>VIEW MORE</Link>
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
