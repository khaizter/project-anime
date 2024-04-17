import CustomPagination from "@/components/custom-pagination";
import Thumbnail from "@/components/thumbnail";
import { Input } from "@/components/ui/input";
import { ToggleGroupItem } from "@/components/ui/toggle-group";
import Wrapper from "@/components/wrapper";
import { getAnimesWithFilter, getGenres } from "@/lib/utils";
import { ToggleGroup } from "@radix-ui/react-toggle-group";
import React, { useEffect, useState } from "react";

type FilterType = {
  keyword?: string | null;
  genres?: Array<string> | null;
};

const Filter2Page = (props: any) => {
  const { genres } = props;
  const [title, setTitle] = useState("MY TITLE");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(20);
  const [keyword, setKeyword] = useState<string>("");
  const [genresSelected, setGenresSelected] = useState<Array<string>>([]);
  const [animes, setAnimes] = useState<Array<any>>([]);
  const [loadingAnimes, setLoadingAnimes] = useState<boolean>(false);

  const fetchData = async (filter: FilterType, page: number) => {
    console.log("fetch Data", filter);
    console.log("on page", page);
    setLoadingAnimes(true);
    const { pageInfo, animeList } = await getAnimesWithFilter(page, 24, filter);
    setLastPage(pageInfo.lastPage);
    setAnimes(animeList);
    setLoadingAnimes(false);
  };

  const genresChangedHandler = (values: any) => {
    setGenresSelected((_) => {
      fetchData({ keyword, genres: values }, 1);
      setCurrentPage(1);
      return values;
    });
  };

  const pageChangedHandler = (page: number) => {
    setCurrentPage((_) => {
      fetchData({ keyword, genres: genresSelected }, page);
      return page;
    });
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      fetchData(
        {
          keyword,
          genres: genresSelected,
        },
        1
      );
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timeOutId);
  }, [keyword]);

  return (
    <Wrapper>
      <div className="flex">
        <Input
          placeholder="keyword"
          value={keyword || ""}
          onChange={(e: any) => setKeyword(e.target.value)}
        />
      </div>

      {genres ? (
        <ToggleGroup
          className="flex flex-wrap"
          type="multiple"
          value={genresSelected}
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
      ) : (
        <div>Loading genres...</div>
      )}
      {!loadingAnimes ? (
        <ul className="grid grid-cols-6 gap-4">
          {animes.map((anime: any) => {
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
      ) : (
        <div>Loading animes...</div>
      )}
      <CustomPagination
        currentPage={+currentPage}
        lastPage={+lastPage}
        onPageChanged={pageChangedHandler}
      />
    </Wrapper>
  );
};

export const getStaticProps = async (context: any) => {
  try {
    const genres = await getGenres();
    return {
      props: {
        genres: genres,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      notFound: true,
    };
  }
};

export default Filter2Page;
