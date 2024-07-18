import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import HoverDetails from "@/components/thumbnail/hover-details";
import { getAnimeDetails } from "@/lib/anilist";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const addFavorite = async (
  animeId: string | number,
  remove: boolean = false
) => {
  const response = await fetch("/api/user/favorite", {
    method: "PATCH",
    body: JSON.stringify({ animeId, remove }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong!");
  }

  return data;
};

interface ThumbnailProps {
  anime: any;
}

const Thumbnail: React.FC<ThumbnailProps> = (props) => {
  const [anime, setAnime] = useState<any>(props.anime);
  const [showDetails, setShowDetails] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [isFetchedAlready, setIsFetchedAlready] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();
  const { status } = useSession();

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

    const fetchFavorites = async () => {
      setIsLoadingFavorite(true);
      const response = await fetch("/api/user/favorite", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong!");
      }

      const favorites = result.data;
      setIsFavorite(favorites.find((item: number) => item === anime.id));
      setIsLoadingFavorite(false);
      console.log("done");
    };

    const timeOutId = setTimeout(() => {
      if (showDetails && !isFetchedAlready) {
        fetchMoreDetails();
        if (status === "authenticated") {
          fetchFavorites();
        }
      }
    }, 150);
    return () => clearTimeout(timeOutId);
  }, [showDetails, isFetchedAlready, anime.id]);

  const favoriteHandler: React.MouseEventHandler = async (e) => {
    if (status === "unauthenticated") {
      e.preventDefault();
      router.push("/auth");
    }
    try {
      setIsLoadingFavorite(true);
      const result = await addFavorite(anime.id, isFavorite);
      console.log(result);
      setIsLoadingFavorite(false);
    } catch (err) {
      console.log(err);
      setIsLoadingFavorite(false);
    }
    setIsFavorite((prevState) => !prevState);
  };

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
        <HoverDetails
          anime={anime}
          isFetchingDetails={isFetchingDetails}
          isFavorite={isFavorite}
          isLoadingFavorite={isLoadingFavorite}
          favoriteHandler={favoriteHandler}
        />
      )}
    </div>
  );
};

export default Thumbnail;
