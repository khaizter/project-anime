import CustomPagination from "@/components/custom-pagination";
import Thumbnail from "@/components/thumbnail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Wrapper from "@/components/wrapper";
import { getAnimes, getAnimesWithFilter, getGenres } from "@/lib/anilist";
import { useRouter } from "next/router";
import React, { useState } from "react";

const FilterPage = (props: any) => {
  const {
    animes,
    currentPage,
    lastPage,
    genres,
    genresSelected: initialGenresSelected,
    keyword: initialKeyword,
  } = props;
  const router = useRouter();
  const [genresSelected, setGenresSelected] = useState(initialGenresSelected);
  const [keyword, setKeyword] = useState(initialKeyword);

  const genresChangedHandler = (values: any) => {
    setGenresSelected(values);
  };

  const pageChangedHandler = (page: number) => {
    router.push({
      pathname: "/filter",
      query: {
        keyword: keyword,
        page: page,
        genres: genresSelected,
      },
    });
  };

  const filterButtonHandler = () => {
    router.push({
      pathname: "/filter",
      query: {
        keyword: keyword,
        page: currentPage,
        genres: genresSelected,
      },
    });
  };

  return (
    <Wrapper>
      <div className="flex">
        <Input
          placeholder="keyword"
          value={keyword || ""}
          onChange={(e: any) => setKeyword(e.target.value)}
        />
      </div>
      <ToggleGroup
        className="flex flex-wrap"
        type="multiple"
        defaultValue={initialGenresSelected || []}
        onValueChange={genresChangedHandler}
      >
        {genres.map((genre: any) => {
          return (
            <ToggleGroupItem key={genre} value={genre}>
              {genre}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
      <Button type="button" onClick={filterButtonHandler}>
        Filter
      </Button>
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
    const genresSelected = context.query?.genres || null;
    const keyword = context.query?.keyword || null;
    const { pageInfo, animeList } = await getAnimesWithFilter(currentPage, 24, {
      keyword: keyword,
      genres: genresSelected,
    });
    const { lastPage } = pageInfo;

    const genres = await getGenres();

    return {
      props: {
        animes: animeList,
        currentPage: currentPage,
        lastPage: lastPage,
        genres: genres,
        genresSelected: genresSelected,
        keyword: keyword,
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
