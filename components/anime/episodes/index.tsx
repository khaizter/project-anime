import { AnimeType } from "@/lib/types";
import { useRouter } from "next/router";
import React from "react";
import Image from "next/image";

interface AnimeEpisodesProps {
  anime: AnimeType;
}

const AnimeEpisodes: React.FC<AnimeEpisodesProps> = (props) => {
  const { streamingEpisodes } = props.anime;
  const router = useRouter();
  return (
    <div className="grid grid-cols-3 gap-4">
      {streamingEpisodes?.map((episode: any, index: number) => {
        return (
          <div
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
          </div>
        );
      })}
    </div>
  );
};

export default AnimeEpisodes;
