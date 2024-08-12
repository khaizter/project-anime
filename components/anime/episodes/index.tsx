import { AnimeType } from "@/lib/types";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getAnimeEpisodes } from "@/lib/anilist";
import { Skeleton } from "@/components/ui/skeleton";

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

  useEffect(() => {
    const fetchEpisodes = async () => {
      setIsLoading(true);
      const media = await getAnimeEpisodes(animeId);
      const newStreamingEpisodes = media.streamingEpisodes;
      setAnime((prevState) => {
        return { ...prevState, streamingEpisodes: newStreamingEpisodes };
      });
      setIsLoading(false);
    };
    if (!streamingEpisodes) {
      fetchEpisodes();
    }
  }, [animeId, setAnime]);

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
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {streamingEpisodes?.map((episode: any, index: number) => {
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
  );
};

export default AnimeEpisodes;
