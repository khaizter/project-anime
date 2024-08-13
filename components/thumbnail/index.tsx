import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Eye } from "lucide-react";
import HoverDetails from "@/components/thumbnail/hover-details";
import { getAnimeHoverDetails } from "@/lib/anilist";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { AnimeType } from "@/lib/types";
import { sleep } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  const { id, title, coverImage }: AnimeType = anime;

  const fetchMoreDetails = useCallback(async (id: number) => {
    try {
      console.log("fetch more details");
      setIsFetchingDetails(true);
      const fetchedAnime = await getAnimeHoverDetails(id);
      setAnime(fetchedAnime);
      setIsFetchedAlready(true);
      setIsFetchingDetails(false);
    } catch (err) {
      setIsFetchingDetails(false);
      // wait 20 seconds then fetch again
      await sleep(20000);
      await fetchMoreDetails(id);
      throw new Error("Failed to fetch more details");
    }
  }, []);

  const fetchFavorites = useCallback(async (id: number) => {
    try {
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
      setIsFavorite(favorites.find((item: number) => item === id));
      setIsLoadingFavorite(false);
    } catch (err) {
      setIsLoadingFavorite(false);
      throw new Error("Failed to fetch favorites data");
    }
  }, []);

  useEffect(() => {
    if (showDetails && !isFetchedAlready) setIsFetchingDetails(true);

    const asyncFunction = async () => {
      try {
        if (showDetails && !isFetchedAlready) {
          await fetchMoreDetails(anime.id);
          if (status === "authenticated") {
            await fetchFavorites(anime.id);
          }
        }
      } catch (err) {
        toast({
          duration: 3000,
          variant: "destructive",
          title: (err as Error).message || "Something went wrong!",
          description: "You may also refresh the page or try again later",
        });
      }
    };

    const timeOutId = setTimeout(() => {
      asyncFunction();
    }, 150);
    return () => clearTimeout(timeOutId);
  }, [
    showDetails,
    isFetchedAlready,
    anime.id,
    status,
    fetchMoreDetails,
    fetchFavorites,
    toast,
  ]);

  const favoriteHandler: React.MouseEventHandler = async (e) => {
    if (status === "unauthenticated") {
      e.preventDefault();
      router.push("/auth");
    }
    try {
      setIsLoadingFavorite(true);
      const result = await addFavorite(anime.id, isFavorite);
      setIsLoadingFavorite(false);
    } catch (err) {
      setIsLoadingFavorite(false);
      toast({
        duration: 3000,
        variant: "destructive",
        title: "Something went wrong while updating favorites!",
        description: "You may also refresh the page or try again later",
      });
    }
    setIsFavorite((prevState) => !prevState);
  };

  return (
    <div className="h-full group flex flex-col bg-jacaranda">
      <div className="grow flex flex-col">
        <HoverCard onOpenChange={(value) => setShowDetails(value)}>
          <HoverCardTrigger asChild>
            <Link className="grow relative" href={`/anime/${id}`}>
              <Image
                src={coverImage.large || ""}
                alt={`${title} cover image`}
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-jacaranda to-transparent to-30% group-hover:to-jacaranda/50" />
              <Eye
                className="absolute hidden group-hover:block left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 w-10 h-10"
                color="#EA7AF4"
              />
            </Link>
          </HoverCardTrigger>
          <HoverCardContent
            className="w-80 bg-transparent border-transparent relative z-50"
            align="start"
            side="right"
            sideOffset={-100}
            alignOffset={50}
          >
            {showDetails && (
              <HoverDetails
                anime={anime}
                isFetchingDetails={isFetchingDetails}
                isFavorite={isFavorite}
                isLoadingFavorite={isLoadingFavorite}
                favoriteHandler={favoriteHandler}
              />
            )}
          </HoverCardContent>
        </HoverCard>
      </div>
      <div className="h-20 p-3">
        <div className="line-clamp-2 font-space-grotesk min-h-12">
          {title.romaji}
        </div>
      </div>
    </div>
  );
};

export default Thumbnail;
