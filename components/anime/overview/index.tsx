import { AnimeType } from "@/lib/types";
import Link from "next/link";
import React from "react";

interface AnimeOverviewProps {
  anime: AnimeType;
}

const AnimeOverview: React.FC<AnimeOverviewProps> = (props) => {
  const {
    title,
    description,
    trailer,
    episodes,
    status: animeStatus,
    startDate,
    season,
    seasonYear,
    studios,
    genres,
    synonyms,
  } = props.anime;

  const mainStudios = studios.edges.filter((studio) => studio.isMain);
  const producers = studios.edges.filter((studio) => !studio.isMain);
  return (
    <div className="space-y-4">
      <h1 className="hidden md:block font-space-grotesk text-3xl text-medium-red-violet">
        {title.romaji}
      </h1>
      <div
        className="hidden md:block text-white/60"
        dangerouslySetInnerHTML={{ __html: description }}
      />
      <div className="block md:hidden space-y-2">
        {episodes && (
          <div>
            <span className="mr-2">Episodes:</span>
            <span className="text-white/60">{episodes}</span>
          </div>
        )}
        {animeStatus && (
          <div>
            <span className="mr-2">Status:</span>
            <span className="text-white/60">{animeStatus}</span>
          </div>
        )}
        {startDate && (
          <div>
            <span className="mr-2">Aired:</span>
            <span className="text-white/60">
              {new Date(
                startDate.year,
                startDate.month,
                startDate.day
              ).toLocaleDateString()}
            </span>
          </div>
        )}
        {season && seasonYear && (
          <div>
            <span className="mr-2">Season:</span>
            <span className="text-white/60">{`${season} ${seasonYear}`}</span>
          </div>
        )}
        {mainStudios && mainStudios.length > 0 && (
          <div className="flex flex-wrap md:block">
            <span className="mr-2">Studios:</span>
            {mainStudios.map((studio) => {
              return (
                <div className="text-white/60 group" key={studio.node.id}>
                  {studio.node.name}
                  <span className="inline md:hidden group-[:last-child]:hidden mr-2">
                    ,
                  </span>
                </div>
              );
            })}
          </div>
        )}
        {producers && producers.length > 0 && (
          <div className="flex flex-wrap md:block">
            <span className="mr-2">Producers:</span>
            {producers.map((studio) => {
              return (
                <div className="text-white/60 group" key={studio.node.id}>
                  {studio.node.name}
                  <span className="inline md:hidden group-[:last-child]:hidden mr-2">
                    ,
                  </span>
                </div>
              );
            })}
          </div>
        )}
        {genres && genres.length > 0 && (
          <div className="flex flex-wrap md:block">
            <span className="mr-2">Genre:</span>
            {genres.map((genre, index) => {
              return (
                <Link
                  className="block text-white/60 hover:text-medium-red-violet group"
                  key={index}
                  href={{
                    pathname: "/filter",
                    query: {
                      genres: [genre],
                    },
                  }}
                >
                  {genre}
                  <span className="inline md:hidden group-[:last-child]:hidden mr-2">
                    ,
                  </span>
                </Link>
              );
            })}
          </div>
        )}
        {title.romaji && (
          <div>
            <span className="mr-2">Romaji:</span>
            <span className="text-white/60">{title.romaji}</span>
          </div>
        )}
        {title.english && (
          <div>
            <span className="mr-2">English:</span>
            <span className="text-white/60">{title.english}</span>
          </div>
        )}
        {title.native && (
          <div>
            <span className="mr-2">Native:</span>
            <span className="text-white/60">{title.native}</span>
          </div>
        )}
        {synonyms && synonyms.length > 0 && (
          <div className="flex flex-wrap md:block">
            <span className="mr-2">Synonyms:</span>
            {synonyms?.map((synonym, index) => {
              return (
                <div className="text-white/60 group" key={index}>
                  {synonym}
                  <span className="inline md:hidden group-[:last-child]:hidden mr-2">
                    ,
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
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
