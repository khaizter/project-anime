import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { AnimeType } from "@/lib/types";

interface HoverDetailsProps {
  anime: any;
  isFetchingDetails: boolean;
  isFavorite: boolean;
  isLoadingFavorite: boolean;
  favoriteHandler: React.MouseEventHandler;
}

const HoverDetails: React.FC<HoverDetailsProps> = (props) => {
  const { title, description, synonyms, startDate, status, genres }: AnimeType =
    props.anime;

  const { isFetchingDetails, isFavorite, isLoadingFavorite, favoriteHandler } =
    props;

  const aired = startDate
    ? new Date(
        startDate.year,
        startDate.month,
        startDate.day
      ).toLocaleDateString()
    : "processing date";

  return (
    <div
      // className={`absolute top-1/2 ${
      //   isLastinRow ? "right-1/2" : "left-1/2"
      // } w-80 h-fit bg-jacaranda z-50 p-4 rounded-md shadow-lg shadow-lavender-magenta/25 space-y-4`}
      className={`relative w-80 h-fit bg-jacaranda z-50 p-4 rounded-md shadow-lg shadow-lavender-magenta/25 space-y-4 text-white`}
    >
      {isFetchingDetails ? (
        <div>LOADING...</div>
      ) : (
        <>
          <div className="font-space-grotesk">{title.romaji}</div>
          <div
            className="line-clamp-2 text-white/60"
            dangerouslySetInnerHTML={{ __html: description }}
          />
          <div>
            {title.native && (
              <div>
                <span className="mr-2">Japanese:</span>
                <span className="text-white/60 line-clamp-2">
                  {title.native}
                </span>
              </div>
            )}
            {synonyms?.[0] && (
              <div>
                <span className="mr-2">Synonyms:</span>
                <span className="text-white/60 line-clamp-2">
                  {synonyms?.[0]}
                </span>
              </div>
            )}
            {aired && (
              <div>
                <span className="mr-2">Aired:</span>
                <span className="text-white/60">{aired}</span>
              </div>
            )}
            {status && (
              <div>
                <span className="mr-2">Status:</span>
                <span className="text-white/60">{status}</span>
              </div>
            )}
            {genres && genres.length > 0 && (
              <div className="text-wrap break-words">
                <span className="mr-2">Genres: </span>
                {genres?.map((genre: string, index: number) => {
                  return (
                    <span key={index}>
                      <Link
                        className="hover:text-medium-red-violet"
                        href={{
                          pathname: "/filter",
                          query: {
                            genres: [genre],
                          },
                        }}
                      >
                        {genre}
                      </Link>
                      <span>, </span>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
          <Button
            variant="destructive"
            className="w-full"
            onClick={favoriteHandler}
            disabled={isLoadingFavorite}
          >
            <Heart
              className="mr-2 h-4 w-4"
              color={isFavorite ? "white" : "white"}
              fill={isFavorite ? "white" : "transparent"}
            />
            {isFavorite ? "Added to Favorites" : "Add to Favorites"}
          </Button>
        </>
      )}
    </div>
  );
};

export default HoverDetails;
