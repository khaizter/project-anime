import { Button } from "@/components/ui/button";
import { AnimeType } from "@/lib/types";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface AnimeSideBarProps {
  anime: AnimeType;
}

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

const AnimeSidebar: React.FC<AnimeSideBarProps> = (props) => {
  const {
    id: animeId,
    title,
    coverImage,
    episodes,
    status: animeStatus,
    startDate,
    season,
    seasonYear,
    studios,
    genres,
    synonyms,
  } = props.anime;

  const router = useRouter();
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const mainStudios = studios.edges.filter((studio) => studio.isMain);
  const producers = studios.edges.filter((studio) => !studio.isMain);

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
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
      setIsFavorite(favorites.find((item: number) => item === animeId));
      setIsLoading(false);
    };
    if (status === "authenticated") fetchFavorites();
  }, [animeId, status]);

  const favoriteHandler: React.MouseEventHandler = async (e) => {
    if (status === "unauthenticated") {
      e.preventDefault();
      router.push("/auth");
    }
    try {
      setIsLoading(true);
      const result = await addFavorite(animeId, isFavorite);
      console.log(result);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }

    setIsFavorite((prevState) => !prevState);
  };

  return (
    <div className="w-1/4 max-w-52 space-y-6 py-4">
      <div className="space-y-4">
        <Image
          src={coverImage.large || ""}
          alt={`${title.romaji} cover image`}
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-auto"
        />
        <Button
          className="w-full"
          onClick={favoriteHandler}
          disabled={isLoading || status === "loading"}
        >
          <Heart
            className="mr-2 h-4 w-4"
            color={isFavorite ? "#ff0000" : "#ff0000"}
            fill={isFavorite ? "#ff0000" : "transparent"}
          />
          Add to Favorites
        </Button>
      </div>
      <div className="space-y-2">
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
          <div>
            <span>Studios:</span>
            {mainStudios.map((studio) => {
              return (
                <div className="text-white/60" key={studio.node.id}>
                  {studio.node.name}
                </div>
              );
            })}
          </div>
        )}
        {producers && producers.length > 0 && (
          <div>
            <span>Producers:</span>
            {producers.map((studio) => {
              return (
                <div className="text-white/60" key={studio.node.id}>
                  {studio.node.name}
                </div>
              );
            })}
          </div>
        )}
        {genres && genres.length > 0 && (
          <div>
            <span>Genre:</span>
            {genres.map((genre, index) => {
              return (
                <Link
                  className="block text-white/60 hover:text-medium-red-violet"
                  key={index}
                  href={{
                    pathname: "/filter",
                    query: {
                      genres: [genre],
                    },
                  }}
                >
                  {genre}
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
          <div>
            <span>Synonyms:</span>
            {synonyms?.map((synonym, index) => {
              return (
                <div className="text-white/60" key={index}>
                  {synonym}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimeSidebar;
