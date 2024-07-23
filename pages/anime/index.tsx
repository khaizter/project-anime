import Thumbnail from "@/components/thumbnail";
import Wrapper from "@/components/wrapper";
import { getAnimes } from "@/lib/anilist";
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

export const getServerSideProps = async (context: any) => {
  try {
    const currentPage = context.query?.page || 1;
    const { pageInfo, animeList } = await getAnimes(currentPage, 24);
    const { lastPage } = pageInfo;
    return {
      props: {
        animes: animeList,
        currentPage: currentPage,
        lastPage: lastPage,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

export default AnimePage;
