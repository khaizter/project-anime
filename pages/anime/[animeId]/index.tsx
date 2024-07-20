import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Wrapper from "@/components/wrapper";
import { getAnimeDetails } from "@/lib/anilist";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { AnimeType } from "@/lib/types";

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
  const {
    id: animeId,
    title,
    synonyms,
    description,
    status: animeStatus,
    startDate,
    trailer,
    coverImage,
    bannerImage,
    genres,
    studios,
    streamingEpisodes,
    episodes,
    season,
    seasonYear,
  }: AnimeType = props.animeDetails;

  const router = useRouter();
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentTab, setCurrentTab] = useState("overview");

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
    <>
      <div className="relative w-full h-96">
        <Image
          src={bannerImage}
          fill
          priority
          className="object-cover"
          alt={`${title.romaji} banner image`}
        />
        <div className="absolute w-full h-full bg-gradient-to-t from-black to-transparent"></div>
      </div>
      <Wrapper>
        <div className="flex items-start">
          <div className="relative m-4 min-w-52">
            <Image
              src={coverImage.large || ""}
              alt={`${title.romaji} cover image`}
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
                color={isFavorite ? "#ff0000" : "#ff0000"}
                fill={isFavorite ? "#ff0000" : "transparent"}
              />
              Add to Favorites
            </Button>
            <div>
              <span>Episodes:</span>
              <span className="text-white/60">{episodes}</span>
            </div>
            <div>
              <span>Status:</span>
              <span className="text-white/60">{animeStatus}</span>
            </div>
            <div>
              <span>Aired:</span>
              <span className="text-white/60">
                {new Date(
                  startDate.year,
                  startDate.month,
                  startDate.day
                ).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span>Season:</span>
              <span className="text-white/60">{`${season} ${seasonYear}`}</span>
            </div>
            <div>
              <span>Studios:</span>
              {mainStudios.map((studio) => {
                return (
                  <div className="text-white/60" key={studio.node.id}>
                    {studio.node.name},
                  </div>
                );
              })}
            </div>
            <div>
              <span>Producers:</span>
              {producers.map((studio) => {
                return (
                  <div className="text-white/60" key={studio.node.id}>
                    {studio.node.name},
                  </div>
                );
              })}
            </div>
            <div>
              <span>Genre:</span>
              {genres.map((genre, index) => {
                return (
                  <div className="text-white/60" key={index}>
                    {genre},
                  </div>
                );
              })}
            </div>
            <div>
              <span>Romaji:</span>
              <span className="text-white/60">{title.romaji}</span>
            </div>
            <div>
              <span>English:</span>
              <span className="text-white/60">{title.english}</span>
            </div>
            <div>
              <span>Native:</span>
              <span className="text-white/60">{title.native}</span>
            </div>
            <div>
              <span>Synonyms:</span>
              {synonyms?.map((synonym, index) => {
                return (
                  <div className="text-white/60" key={index}>
                    {synonym},
                  </div>
                );
              })}
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center">
              <Button onClick={() => setCurrentTab("overview")}>
                Overview
              </Button>
              <Button onClick={() => setCurrentTab("episodes")}>
                Episodes
              </Button>
              <Button onClick={() => setCurrentTab("characters")}>
                Characters
              </Button>
              <Button onClick={() => setCurrentTab("staff")}>Staff</Button>
              <Button onClick={() => setCurrentTab("Reviews")}>Reviews</Button>
            </div>
            {currentTab === "overview" && (
              <>
                <h1>{title.romaji}</h1>
                <div dangerouslySetInnerHTML={{ __html: description }} />
                {trailer?.id && (
                  <>
                    <div>TRAILER</div>
                    <iframe
                      width="560"
                      height="315"
                      src={`https://www.youtube.com/embed/${trailer.id}`}
                      title="Anime trailer"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                      allowFullScreen
                    ></iframe>
                  </>
                )}
              </>
            )}

            {currentTab === "episodes" && (
              <>
                <ScrollArea className="h-72 rounded-md border p-1">
                  <div className="grid grid-cols-3 gap-4">
                    {streamingEpisodes?.map((episode: any, index: number) => {
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
                    })}
                  </div>
                </ScrollArea>
              </>
            )}
          </div>
        </div>
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
