import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
interface ThumbnailProps {
  anime: any;
}

const Thumbnail: React.FC<ThumbnailProps> = (props) => {
  const {
    id,
    title,
    coverImage,
    description,
    nativeTitle,
    synonyms,
    startDate,
    status,
    genres,
  }: {
    id: number;
    title: { romaji: string; english?: string; native?: string };
    coverImage: {
      extraLarge?: string;
      large?: string;
      medium?: string;
      color?: string;
    };
    description: string;
    nativeTitle?: string;
    synonyms?: Array<string>;
    startDate: { year: number; month: number; day?: number };
    status: string;
    genres: Array<string>;
  } = props.anime;

  const aired = "Jan 2, 2024";

  const [showDetails, setShowDetails] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div
      className="group flex flex-col bg-jacaranda relative overflow-visible"
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      <Link className="grow relative" href={`/anime/${id}`}>
        <Image
          src={coverImage.large || ""}
          alt={`${title} cover image`}
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-full opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-jacaranda to-transparent to-30% group-hover:to-jacaranda/50" />
        <Eye
          className="absolute hidden group-hover:block left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 w-10 h-10"
          color="#EA7AF4"
        />
      </Link>
      <div className="h-20 p-3">
        <div className="line-clamp-2 font-space-grotesk min-h-12">
          {title.romaji}
        </div>
      </div>
      {showDetails && (
        <div className="absolute top-1/2 left-1/2 group-last:left-auto group-last:right-1/2 w-64 h-fit bg-jacaranda z-10 p-4 rounded-md shadow-lg shadow-lavender-magenta/25 space-y-4">
          <div className="font-space-grotesk">{title.romaji}</div>
          <div
            className="line-clamp-3 text-white/60"
            dangerouslySetInnerHTML={{ __html: description }}
          />
          <div>
            <div>
              <span className="mr-2">Japanese:</span>
              <span className="text-white/60">{title.native}</span>
            </div>
            <div>
              <span className="mr-2">Synonyms:</span>
              <span className="text-white/60">{synonyms?.[0]}</span>
            </div>
            <div>
              <span className="mr-2">Aired:</span>
              <span className="text-white/60">{aired}</span>
            </div>
            <div>
              <span className="mr-2">Status:</span>
              <span className="text-white/60">{status}</span>
            </div>
            <div className="text-wrap break-words">
              <span className="mr-2">Genres: </span>
              {genres.map((genre: string, index: number) => {
                return (
                  <span key={index}>
                    <span>{genre}</span>
                    <span>, </span>
                  </span>
                );
              })}
            </div>
          </div>
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => setIsFavorite((prevState) => !prevState)}
          >
            <Heart
              className="mr-2 h-4 w-4"
              color={isFavorite ? "white" : "white"}
              fill={isFavorite ? "white" : "transparent"}
            />
            {isFavorite ? "Added to Favorites" : "Add to Favorites"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Thumbnail;
