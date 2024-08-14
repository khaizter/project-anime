import { AnimeType } from "@/lib/types";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { getAnimeEpisodes } from "@/lib/anilist";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import RobotError from "@/components/robot-error";
import EmptyBox from "@/components/empty-box";

interface AnimeEpisodesProps {
  anime: AnimeType;
  setAnime: React.Dispatch<React.SetStateAction<AnimeType>>;
}

const NUMBER_OF_CELLS = 8;

const AnimeEpisodes: React.FC<AnimeEpisodesProps> = (props) => {
  const { setAnime } = props;
  const { id: animeId, streamingEpisodes } = props.anime;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchEpisodes = useCallback(
    async (id: number) => {
      const media = await getAnimeEpisodes(id);
      const newStreamingEpisodes = media.streamingEpisodes;
      setAnime((prevState) => {
        setIsLoading(false);
        return { ...prevState, streamingEpisodes: newStreamingEpisodes };
      });
    },
    [setAnime]
  );

  useEffect(() => {
    const asyncFunction = async () => {
      try {
        if (!streamingEpisodes) {
          setIsLoading(true);
          await fetchEpisodes(animeId);
        }
      } catch (err) {
        setIsLoading(false);
        toast({
          duration: 3000,
          variant: "destructive",
          title: "Something went wrong!",
          description: "You may also refresh the page or try again later",
        });
      }
    };

    asyncFunction();
  }, [animeId, streamingEpisodes, fetchEpisodes, toast]);

  if (isLoading) {
    return (
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from(Array(NUMBER_OF_CELLS).keys()).map((item) => {
          return (
            <li key={item} className="space-y-2">
              <Skeleton className="h-[96px] w-full rounded-xl" />
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <>
      {streamingEpisodes ? (
        <>
          {streamingEpisodes.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {streamingEpisodes.map((episode: any, index: number) => {
                return (
                  <li
                    key={index}
                    className="relative h-24 rounded-sm overflow-hidden"
                    onClick={() => router.push(episode.url)}
                  >
                    <Image
                      src={episode.thumbnail}
                      alt={`thumb nail`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 overflow-hidden text-ellipsis whitespace-nowrap bg-black/60 p-1">
                      {episode.title}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyBox />
          )}
        </>
      ) : (
        <RobotError />
      )}
    </>
  );
};

export default AnimeEpisodes;
