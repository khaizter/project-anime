import Thumbnail from "@/components/thumbnail";
import Wrapper from "@/components/wrapper";
import {
  getAnimes,
  getPopularAnimes,
  getPopularAnimesNextSeason,
  getPopularAnimesThisSeason,
  getTrendingAnimes,
} from "@/lib/anilist";
import React, { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/router";
import CustomPagination from "@/components/custom-pagination";
import { AnimeType, SortType } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const NUMBER_OF_CELLS = 24;

const AnimePage = (props: any) => {
  const router = useRouter();
  const { currentPage: initialCurrentPage, sort } = props;
  const [currentPage, setCurrentPage] = useState<number>(initialCurrentPage);
  const [lastPage, setLastPage] = useState<number>(1);
  const [animes, setAnimes] = useState<Array<AnimeType>>([]);
  const [loadingAnimes, setLoadingAnimes] = useState<boolean>(true);

  const fetchAnimes = useCallback(async (page: number, sort: SortType) => {
    setLoadingAnimes(true);
    try {
      console.log("try");
      const { pageInfo, animeList } = await getAnimeCategory(
        page,
        NUMBER_OF_CELLS,
        sort
      );
      setAnimes(animeList);
      setLastPage(pageInfo.lastPage);
      setCurrentPage(pageInfo.currentPage);
      router.push({
        pathname: "/anime",
        query: {
          page: pageInfo.currentPage,
          sort: sort,
        },
      });
      setLoadingAnimes(false);
    } catch (err) {
      setLoadingAnimes(false);
      console.log("error:", err);
    }
  }, []);

  useEffect(() => {
    console.log("fetch currentpage:", currentPage);
    console.log("fetch sort:", sort);
    fetchAnimes(currentPage, sort);
  }, [currentPage, sort, fetchAnimes]);

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

  const pageChangedHandler = async (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Wrapper className="py-24 space-y-4">
      <div className="text-2xl font-space-grotesk text-medium-red-violet">
        {title}
      </div>
      {loadingAnimes ? (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from(Array(NUMBER_OF_CELLS).keys()).map((item) => {
            return (
              <div key={item} className="space-y-2">
                <Skeleton className="h-[250px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            );
          })}
        </ul>
      ) : (
        <>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {animes.map((anime: any, index: number) => {
              return <Thumbnail key={index} anime={anime} />;
            })}
          </ul>
          <CustomPagination
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChanged={pageChangedHandler}
          />
        </>
      )}
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
    return {
      props: {
        currentPage: currentPage,
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
