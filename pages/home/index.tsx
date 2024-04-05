import Thumbnail from "@/components/thumbnail";
import Wrapper from "@/components/wrapper";
import { getPopularAnimes, getTrendingAnimes } from "@/lib/utils";
import React, { useState } from "react";

const HomePage = (props: any) => {
  const { popularAnimes, trendingAnimes } = props;
  return (
    <Wrapper>
      <div>SLIDE SHOW</div>
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
    </Wrapper>
  );
};

export const getStaticProps = async (context: any) => {
  const popularAnimeList = await getPopularAnimes();
  const trendingAnimeList = await getTrendingAnimes();
  return {
    props: {
      popularAnimes: popularAnimeList,
      trendingAnimes: trendingAnimeList,
    },
  };
};

export default HomePage;
