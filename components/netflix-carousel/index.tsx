import RobotError from "@/components/robot-error";
import Thumbnail from "@/components/thumbnail";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getAnimes,
  getPopularAnimes,
  getPopularAnimesNextSeason,
  getPopularAnimesThisSeason,
  getTrendingAnimes,
} from "@/lib/anilist";
import { AnimeType, SortType } from "@/lib/types";
import React, { useCallback, useEffect, useState } from "react";

interface NetflixCarouselProps {
  sort: SortType;
}

const NUMBER_OF_CELLS = 5;

const getAnimeCategory = async (
  currentPage: number,
  perPage: number,
  sort: SortType
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

const NetflixCarousel: React.FC<NetflixCarouselProps> = (props) => {
  const { sort } = props;
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [animes, setAnimes] = useState<Array<AnimeType> | null>(null);
  const [loadingAnimes, setLoadingAnimes] = useState<boolean>(true);

  const fetchAnimes = useCallback(
    async (page: number, perPage: number, sortType: SortType) => {
      const { animeList } = await getAnimeCategory(page, perPage, sortType);
      setAnimes((_) => {
        setLoadingAnimes(false);
        return animeList;
      });
    },
    []
  );

  useEffect(() => {
    const asyncFunction = async () => {
      try {
        setLoadingAnimes(true);
        await fetchAnimes(1, NUMBER_OF_CELLS, sort);
      } catch (err) {
        setLoadingAnimes(false);
      }
    };
    asyncFunction();
  }, [sort, fetchAnimes]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (loadingAnimes) {
    return (
      <ul className="w-full px-[5%] grid grid-flow-col-dense grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from(Array(NUMBER_OF_CELLS).keys()).map((item) => {
          return (
            <div key={item} className="space-y-2 p-2">
              <Skeleton className="h-[250px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          );
        })}
      </ul>
    );
  }

  return (
    <>
      {animes ? (
        <Carousel
          opts={{
            align: "start",
            slidesToScroll: 1,
          }}
          className="w-full p-0"
          setApi={setApi}
        >
          <CarouselContent className="ml-[5%] pr-[5%]">
            {animes.map((anime, index: number) => {
              return (
                <CarouselItem
                  key={index}
                  className="basis-[50%] sm:basis-1/3 md:basis-[25%] lg:basis-[20%] p-2 last:mr-[5%]"
                >
                  <Thumbnail key={anime.id} anime={anime} />
                </CarouselItem>
              );
            })}
          </CarouselContent>
          {current > 1 && (
            <CarouselPrevious className="left-0 bg-gradient-to-r from-jacaranda to-transparent hover:to-jacaranda/50 w-[5%] h-full rounded-none border-0" />
          )}
          {current < count && (
            <CarouselNext className="right-0 bg-gradient-to-l from-jacaranda to-transparent hover:to-jacaranda/50 w-[5%] h-full rounded-none border-0" />
          )}
        </Carousel>
      ) : (
        <RobotError />
      )}
    </>
  );
};

export default NetflixCarousel;
