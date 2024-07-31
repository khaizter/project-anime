import {
  getPopularAnimes,
  getPopularAnimesThisSeason,
  getPopularAnimesNextSeason,
  getTrendingAnimes,
} from "@/lib/anilist";
import React from "react";
import HeroCarousel from "@/components/hero-carousel";

import NetflixCarousel from "@/components/netflix-carousel";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const HomePage = (props: any) => {
  const {
    popularAnimes,
    trendingAnimes,
    popularAnimesThisSeason,
    popularAnimesNextSeason,
  } = props;

  return (
    <div>
      <HeroCarousel animes={trendingAnimes} />
      <NetflixCarousel animes={popularAnimesThisSeason} />
      <div className="flex items-center justify-between px-[calc(5%+8px)] mb-8 mt-20">
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
      <NetflixCarousel animes={trendingAnimes} />
      <div className="flex items-center justify-between px-[calc(5%+8px)] mb-8 mt-20">
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
      <NetflixCarousel animes={popularAnimes} />
      <div className="flex items-center justify-between px-[calc(5%+8px)] mb-8 mt-20">
        <h2 className="font-space-grotesk text-2xl">Upcoming Next Season</h2>
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
      <NetflixCarousel animes={popularAnimesNextSeason} />
    </div>
  );
};

export const getStaticProps = async (context: any) => {
  const { animeList: popularAnimeList } = await getPopularAnimes(1, 15);
  const { animeList: popularAnimeThisSeasonList } =
    await getPopularAnimesThisSeason(1, 15);
  const { animeList: popularAnimeNextSeasonList } =
    await getPopularAnimesNextSeason(1, 15);
  const { animeList: trendingAnimeList } = await getTrendingAnimes(1, 15);
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
