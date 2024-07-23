import Thumbnail from "@/components/thumbnail";
import Wrapper from "@/components/wrapper";
import {
  getAnimes,
  getPopularAnimes,
  getPopularAnimesNextSeason,
  getPopularAnimesThisSeason,
  getTrendingAnimes,
} from "@/lib/anilist";
import React from "react";

import { useRouter } from "next/router";
import CustomPagination from "@/components/custom-pagination";

const AnimePage = (props: any) => {
  const { animes, currentPage, lastPage, sort } = props;
  const router = useRouter();
  let title = "A to Z";
  switch (sort) {
    case "popular":
      title = "Popular This Season";
      break;
    case "trending":
      title = "Trending";
      break;
    case "alltimepopular":
      title = "All Time Popular";
      break;
    case "upcoming":
      title = "Upcoming Next Season";
      break;
  }

  const pageChangedHandler = (page: number) => {
    router.push({
      pathname: "/anime",
      query: {
        page: page,
        sort: sort,
      },
    });
  };

  return (
    <Wrapper className="py-4 space-y-4">
      <div className="text-2xl font-space-grotesk text-medium-red-violet">
        {title}
      </div>
      <ul className="grid grid-cols-6 gap-4">
        {animes.map((anime: any, index: number) => {
          return (
            <Thumbnail
              key={anime.id}
              anime={anime}
              index={index}
              totalColumn={6}
            />
          );
        })}
      </ul>
      <CustomPagination
        currentPage={parseInt(currentPage)}
        lastPage={parseInt(lastPage)}
        onPageChanged={pageChangedHandler}
      />
    </Wrapper>
  );
};

const getAnimeCategory = async (
  currentPage: number,
  perPage: number,
  sort: string
) => {
  switch (sort) {
    case "popular":
      return await getPopularAnimesThisSeason(currentPage, perPage);
    case "trending":
      return await getTrendingAnimes(currentPage, perPage);
    case "alltimepopular":
      return await getPopularAnimes(currentPage, perPage);
    case "upcoming":
      return await getPopularAnimesNextSeason(currentPage, perPage);
    default:
      return await getAnimes(currentPage, perPage);
  }
};

export const getServerSideProps = async (context: any) => {
  try {
    const currentPage = context.query?.page || 1;
    const sort = context.query?.sort || null;

    const { pageInfo, animeList } = await getAnimeCategory(
      currentPage,
      24,
      sort
    );

    const { lastPage } = pageInfo;

    return {
      props: {
        animes: animeList,
        currentPage: currentPage,
        lastPage: lastPage,
        sort: sort,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

export default AnimePage;
