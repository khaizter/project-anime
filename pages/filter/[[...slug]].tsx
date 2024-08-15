import CustomPagination from "@/components/custom-pagination";
import EmptyBox from "@/components/empty-box";
import RobotError from "@/components/robot-error";
import Thumbnail from "@/components/thumbnail";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/components/ui/use-toast";
import Wrapper from "@/components/wrapper";
import { getAnimesWithFilter, getGenres } from "@/lib/anilist";
import { AnimeType } from "@/lib/types";
import { ToggleGroup } from "@radix-ui/react-toggle-group";
import { Bot, Search } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";

type FilterType = {
  keyword?: string | null;
  genres?: Array<string> | null;
};

const NUMBER_OF_CELLS = 24;

const FilterPage = (props: any) => {
  const { genres, initialKeyword, initialGenresSelected } = props;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(20);
  const [keyword, setKeyword] = useState<string>(initialKeyword || "");
  const [genresSelected, setGenresSelected] = useState<Array<string>>(
    (initialGenresSelected && [initialGenresSelected]) || []
  );
  const [animes, setAnimes] = useState<Array<AnimeType> | null>(null);
  const [loadingAnimes, setLoadingAnimes] = useState<boolean>(true);
  const { toast } = useToast();

  const fetchAnimes = useCallback(
    async (filter: FilterType, page: number) => {
      try {
        console.log("fetch Data", filter);
        console.log("on page", page);
        setLoadingAnimes(true);
        const { pageInfo, animeList } = await getAnimesWithFilter(
          page,
          NUMBER_OF_CELLS,
          filter
        );
        setLastPage(pageInfo.lastPage);
        setAnimes((_) => {
          setLoadingAnimes(false);
          return animeList;
        });
      } catch (err) {
        setLoadingAnimes(false);
        setAnimes(null);
        toast({
          duration: 3000,
          variant: "destructive",
          title: "Something went wrong!",
          description: "You may also refresh the page or try again later",
        });
      }
    },
    [toast]
  );

  const genresChangedHandler = async (values: any) => {
    setGenresSelected((_) => {
      fetchAnimes({ keyword, genres: values }, 1);
      setCurrentPage(1);
      return values;
    });
  };

  const pageChangedHandler = (page: number) => {
    setCurrentPage((_) => {
      fetchAnimes({ keyword, genres: genresSelected }, page);
      return page;
    });
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      fetchAnimes(
        {
          keyword,
          genres: genresSelected,
        },
        1
      );
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timeOutId);
  }, [keyword, fetchAnimes]);

  return (
    <Wrapper className="py-8 md:py-20 grid grid-cols-1 lg:grid-cols-4">
      <div className="py-4 space-y-4">
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
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2"
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
      <div className="py-4 lg:p-4 space-y-4 col-span-3">
        {loadingAnimes ? (
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
            {animes ? (
              <>
                {animes.length > 0 ? (
                  <>
                    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {animes.map((anime: any, index) => {
                        return <Thumbnail key={index} anime={anime} />;
                      })}
                    </ul>
                    <CustomPagination
                      currentPage={+currentPage}
                      lastPage={+lastPage}
                      onPageChanged={pageChangedHandler}
                    />
                  </>
                ) : (
                  <EmptyBox />
                )}
              </>
            ) : (
              <RobotError />
            )}
          </>
        )}
      </div>
    </Wrapper>
  );
};

export const getServerSideProps = async (context: any) => {
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
};

export default FilterPage;
