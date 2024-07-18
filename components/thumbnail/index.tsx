import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import HoverDetails from "@/components/thumbnail/hover-details";
import { getAnimeDetails } from "@/lib/anilist";
interface ThumbnailProps {
  anime: any;
}

const Thumbnail: React.FC<ThumbnailProps> = (props) => {
  const [anime, setAnime] = useState<any>(props.anime);
  const [showDetails, setShowDetails] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [isFetchedAlready, setIsFetchedAlready] = useState(false);

  const {
    id,
    title,
    coverImage,
  }: {
    id: number;
    title: { romaji: string; english?: string; native?: string };
    coverImage: {
      extraLarge?: string;
      large?: string;
      medium?: string;
      color?: string;
    };
  } = anime;

  useEffect(() => {
    if (showDetails && !isFetchedAlready) setIsFetchingDetails(true);

    const fetchMoreDetails = async () => {
      console.log("fetch more details");
      setIsFetchingDetails(true);
      const fetchedAnime = await getAnimeDetails(anime.id);
      setAnime(fetchedAnime);
      setIsFetchedAlready(true);
      setIsFetchingDetails(false);
    };

    const timeOutId = setTimeout(() => {
      if (showDetails && !isFetchedAlready) {
        fetchMoreDetails();
      }
    }, 150);
    return () => clearTimeout(timeOutId);
  }, [showDetails, isFetchedAlready]);

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
        <HoverDetails anime={anime} isFetchingDetails={isFetchingDetails} />
      )}
    </div>
  );
};

export default Thumbnail;
