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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Link from "next/link";
import Thumbnail from "@/components/thumbnail";

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
    recommendations,
    characters,
  }: AnimeType = props.animeDetails;
  console.log(props.animeDetails);
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
        <div className="flex">
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
          <div className="p-4 w-3/4 grow">
            <ToggleGroup
              type="single"
              defaultValue="overview"
              onValueChange={(value) => setCurrentTab(value)}
            >
              <ToggleGroupItem value="overview">Overview</ToggleGroupItem>
              <ToggleGroupItem value="episodes">Episodes</ToggleGroupItem>
              <ToggleGroupItem value="characters">Characters</ToggleGroupItem>
              <ToggleGroupItem value="staff">Staff</ToggleGroupItem>
              <ToggleGroupItem value="reviews">Reviews</ToggleGroupItem>
            </ToggleGroup>

            {currentTab === "overview" && (
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
                <div className="text-green-500">RECOMMENDATIONS</div>
                <div className="grid grid-cols-5 gap-4">
                  {recommendations.nodes.map((recommendation) => {
                    return (
                      <>
                        <Thumbnail anime={recommendation.mediaRecommendation} />
                      </>
                    );
                  })}
                </div>
              </div>
            )}

            {currentTab === "episodes" && (
              <>
                {/* <ScrollArea className="h-72 rounded-md border p-1"> */}
                <div className="grid grid-cols-3 gap-4">
                  {streamingEpisodes?.map((episode: any, index: number) => {
                    return (
                      <div
                        key={index}
                        className="relative h-24 rounded-sm overflow-hidden"
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
                {/* </ScrollArea> */}
              </>
            )}

            {currentTab === "characters" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  {characters.edges.map((character) => {
                    return (
                      <>
                        {character.voiceActors.map((voiceActor) => {
                          return (
                            <div
                              className="flex justify-between font-rajdhani"
                              key={character.id}
                            >
                              <div className="flex w-full">
                                <div className="relative w-16 h-20">
                                  <Image
                                    src={character.node.image.medium || ""}
                                    alt={`${character.node.name.full} image`}
                                    layout="fill"
                                    objectFit="cover"
                                  />
                                </div>

                                <div className="w-auto p-2 pr-0">
                                  <div>{character.node.name.full}</div>
                                  <div className="text-white/60 capitalize">
                                    {character.role}
                                  </div>
                                </div>
                              </div>
                              <div className="flex w-full justify-end">
                                <div className="w-auto p-2 pl-0 text-end">
                                  <div>{voiceActor.name.full}</div>
                                  <div className="text-white/60">
                                    {voiceActor.languageV2}
                                  </div>
                                </div>
                                <div className="relative w-16 h-20">
                                  <Image
                                    src={voiceActor.image.medium || ""}
                                    alt={`${voiceActor.name.full} image`}
                                    layout="fill"
                                    objectFit="cover"
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    );
                  })}
                </div>
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
