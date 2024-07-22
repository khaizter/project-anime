import { AnimeType } from "@/lib/types";
import React from "react";

interface AnimeOverviewProps {
  anime: AnimeType;
}

const AnimeOverview: React.FC<AnimeOverviewProps> = (props) => {
  const { title, description, trailer } = props.anime;
  return (
    <div className="space-y-4">
      <h1 className="font-space-grotesk text-3xl text-medium-red-violet">
        {title.romaji}
      </h1>
      <div
        className="text-white/60"
        dangerouslySetInnerHTML={{ __html: description }}
      />
      {trailer?.id && (
        <>
          <iframe
            className="w-full h-auto aspect-video"
            width="auto"
            height="auto"
            src={`https://www.youtube.com/embed/${trailer.id}`}
            title="Anime trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
            allowFullScreen
          ></iframe>
        </>
      )}
    </div>
  );
};

export default AnimeOverview;
