import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Wrapper from "@/components/wrapper";
import { getAnimeDetails } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";

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

const AnimeDetailPage = (props: any) => {
  const { animeDetails } = props;
  const animeId = animeDetails.id;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { status } = useSession();

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
    <>
      <div className="relative w-full h-96">
        <Image
          src={animeDetails.bannerImage}
          fill
          priority
          className="object-cover"
          alt={`${animeDetails.title.romaji} banner image`}
        />
        <div className="absolute w-full h-full bg-gradient-to-t from-black to-transparent"></div>
      </div>
      <Wrapper>
        <div className="flex items-start">
          <div className="relative m-4 min-w-52">
            <Image
              src={animeDetails.coverImage.large}
              alt={`${animeDetails.title.romaji} cover image`}
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto"
            />
            <Button
              onClick={favoriteHandler}
              disabled={isLoading || status === "loading"}
            >
              <Heart
                className="mr-2 h-4 w-4"
                color={isFavorite ? "#ff0000" : undefined}
                fill={isFavorite ? "#ff0000" : undefined}
              />
              Add to Favorites
            </Button>
          </div>
          <div className="p-4">
            <h1>{animeDetails.title.romaji}</h1>
            <div
              dangerouslySetInnerHTML={{ __html: animeDetails.description }}
            />
            <div className="flex">
              <div className="mr-2">Aired in</div>
              <span>
                {animeDetails.startDate.month},{animeDetails.startDate.day},
                {animeDetails.startDate.year}
              </span>
              <span> - </span>
              <span>
                {animeDetails.endDate.month},{animeDetails.endDate.day},
                {animeDetails.endDate.year}
              </span>
            </div>
            <div>STUDIOS</div>
            <div>TAGS</div>
            <div>Genres</div>
            <ul className="flex gap-2">
              {animeDetails.genres.map((genre: any, index: number) => {
                return <Button key={index}>{genre}</Button>;
              })}
            </ul>
            {animeDetails?.trailer?.id && (
              <>
                <div>TRAILER</div>
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${animeDetails.trailer.id}`}
                  title="Anime trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                  allowFullScreen
                ></iframe>
              </>
            )}
            <ScrollArea className="h-72 rounded-md border p-1">
              <div className="grid grid-cols-3 gap-4">
                {animeDetails?.streamingEpisodes?.map(
                  (episode: any, index: number) => {
                    return (
                      <div
                        key={index}
                        className="relative h-24"
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
                  }
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
        <div>LIST OF EPISODES</div>
      </Wrapper>
    </>
  );
};

export const getServerSideProps = async (context: any) => {
  const { params, req, res } = context;
  const { animeId } = params;

  const animeDetails = await getAnimeDetails(animeId);

  return {
    props: {
      animeDetails: animeDetails,
    },
  };
};

export default AnimeDetailPage;
