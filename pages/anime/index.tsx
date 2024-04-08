import Thumbnail from "@/components/thumbnail";
import Wrapper from "@/components/wrapper";
import { getAnimes } from "@/lib/utils";
import React from "react";

import { useRouter } from "next/router";
import Link from "next/link";
import CustomPagination from "@/components/custom-pagination";

const AnimePage = (props: any) => {
  const { animes, currentPage, hasNextPage, lastPage } = props;
  const router = useRouter();

  const pageChangedHandler = (page: number) => {
    router.push({
      pathname: "/anime",
      query: {
        page: page,
      },
    });
  };

  return (
    <Wrapper>
      <div>SEARCH</div>
      <div>FILTERS</div>
      <ul className="grid grid-cols-6 gap-4">
        {animes.map((anime: any, index: number) => {
          return (
            <Thumbnail
              key={anime.id}
              id={anime.id}
              title={anime.title.romaji}
              coverImage={anime.coverImage.large}
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

export const getServerSideProps = async (context: any) => {
  const animeList = await getAnimes();
  const lastPage = 20;
  return {
    props: {
      animes: animeList,
      currentPage: context.query?.page,
      hasNextPage: context.query?.page && context.query?.page < lastPage,
      lastPage: lastPage,
    },
  };
};

export default AnimePage;
