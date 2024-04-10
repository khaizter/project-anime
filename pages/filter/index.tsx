import CustomPagination from "@/components/custom-pagination";
import Thumbnail from "@/components/thumbnail";
import Wrapper from "@/components/wrapper";
import { getAnimes, getAnimesWithFilter } from "@/lib/utils";
import { useRouter } from "next/router";
import React from "react";

const FilterPage = (props: any) => {
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
  try {
    const currentPage = context.query?.page || 1;
    const keyword = context.query?.keyword || null;
    const { pageInfo, animeList } = await getAnimesWithFilter(currentPage, 24, {
      keyword: keyword,
    });
    const { lastPage } = pageInfo;
    return {
      props: {
        animes: animeList,
        currentPage: currentPage,
        lastPage: lastPage,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      notFound: true,
    };
  }
};

export default FilterPage;
