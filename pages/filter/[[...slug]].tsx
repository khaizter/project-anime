import CustomPagination from "@/components/custom-pagination";
import Thumbnail from "@/components/thumbnail";
import { Input } from "@/components/ui/input";
import { ToggleGroupItem } from "@/components/ui/toggle-group";
import Wrapper from "@/components/wrapper";
import { getAnimesWithFilter, getGenres } from "@/lib/anilist";
import { ToggleGroup } from "@radix-ui/react-toggle-group";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";

type FilterType = {
  keyword?: string | null;
  genres?: Array<string> | null;
};

const FilterPage = (props: any) => {
  const { genres, initialKeyword, initialGenresSelected } = props;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(20);
  const [keyword, setKeyword] = useState<string>(initialKeyword || "");
  const [genresSelected, setGenresSelected] = useState<Array<string>>(
    initialGenresSelected || []
  );
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
    <Wrapper className="flex">
      <div className="w-1/4 max-w-52 py-4 space-y-4">
        <div className="text-2xl font-space-grotesk text-medium-red-violet">
          Search
        </div>
        <div className="flex items-center bg-white p-2 rounded-sm">
          <Search className="h-4 w-4 mr-2" color="#3B0086" />
          <input
            className="text-kingfisher-daisy-800 focus:outline-none grow"
            type="text"
            placeholder="keyword"
            value={keyword || ""}
            onChange={(e: any) => setKeyword(e.target.value)}
          />
        </div>
        {genres ? (
          <>
            <div className="text-2xl font-space-grotesk text-medium-red-violet">
              Genres
            </div>
            <ToggleGroup
              className="grid grid-cols-2"
              type="multiple"
              value={genresSelected}
              onValueChange={genresChangedHandler}
            >
              {genres.map((genre: any) => {
                return (
                  <ToggleGroupItem
                    key={genre}
                    value={genre}
                    className="block text-start px-0 font-rajdhani"
                  >
                    {genre}
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
          </>
        ) : (
          <div>Loading genres...</div>
        )}
      </div>
      <div className="p-4 w-3/4 grow">
        {!loadingAnimes ? (
          <ul className="grid grid-cols-6 gap-4">
            {animes.map((anime: any) => {
              return <Thumbnail key={anime.id} anime={anime} />;
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
      </div>
    </Wrapper>
  );
};

export const getServerSideProps = async (context: any) => {
  try {
    const genresSelected = context.query?.genres || null;
    const keyword = context.query?.keyword || null;
    const genres = await getGenres();
    return {
      props: {
        genres: genres,
        initialKeyword: keyword,
        initialGenresSelected: genresSelected,
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
