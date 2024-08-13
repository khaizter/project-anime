import { getTrendingAnimes } from "@/lib/anilist";
import React, { useEffect } from "react";
import HeroCarousel from "@/components/hero-carousel";

import NetflixCarousel from "@/components/netflix-carousel";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const HomePage = (props: any) => {
  const { trendingAnimes } = props;

  useEffect(() => {}, []);

  return (
    <div className="pb-16">
      <HeroCarousel animes={trendingAnimes} />
      <NetflixCarousel sort="popular" />
      <div className="flex items-center justify-between px-[calc(5%+8px)] mb-8 mt-12">
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
      <NetflixCarousel sort="trending" />
      <div className="flex items-center justify-between px-[calc(5%+8px)] mb-8 mt-12">
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
      <NetflixCarousel sort="alltimepopular" />
      <div className="flex items-center justify-between px-[calc(5%+8px)] mb-8 mt-12">
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
      <NetflixCarousel sort="upcoming" />
    </div>
  );
};

export const getStaticProps = async (context: any) => {
  const { animeList: trendingAnimeList } = await getTrendingAnimes(1, 6);
  return {
    props: {
      trendingAnimes: trendingAnimeList,
    },
  };
};

export default HomePage;
