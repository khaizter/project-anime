import Thumbnail from "@/components/thumbnail";
import Wrapper from "@/components/wrapper";
import { getAnimes } from "@/lib/utils";
import React from "react";

import { useRouter } from "next/router";
import CustomPagination from "@/components/custom-pagination";

const AnimePage = (props: any) => {
  const { animes, currentPage, lastPage } = props;
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
  const currentPage = context.query?.page || 1;
  const { pageInfo, animeList } = await getAnimes(currentPage, 20);
  const { lastPage } = pageInfo;
  return {
    props: {
      animes: animeList,
      currentPage: currentPage,
      lastPage: lastPage,
    },
  };
};

export default AnimePage;
