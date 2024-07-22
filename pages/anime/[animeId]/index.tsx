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
import AnimeSidebar from "@/components/anime/sidebar";

const TABS: Array<string> = [
  "overview",
  "episodes",
  "characters",
  "staff",
  "recommendation",
];

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
    title,
    description,
    trailer,
    bannerImage,
    streamingEpisodes,
    recommendations,
    characters,
    staff: staffs,
  }: AnimeType = props.animeDetails;

  const router = useRouter();

  const [currentTab, setCurrentTab] = useState("overview");

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
          <AnimeSidebar anime={props.animeDetails} />
          <div className="p-4 w-3/4 grow">
            <div className="w-max mb-6 relative">
              <ToggleGroup
                className="justify-start"
                type="single"
                defaultValue="overview"
                onValueChange={(value) => setCurrentTab(value)}
              >
                {TABS.map((tab) => {
                  return (
                    <ToggleGroupItem
                      className="group relative"
                      key={tab}
                      value={tab}
                    >
                      <span className="capitalize">{tab}</span>
                      <span className="absolute z-10 bottom-0 left-0 h-1 w-full bg-transparent group-data-[state=on]:bg-medium-red-violet" />
                    </ToggleGroupItem>
                  );
                })}
              </ToggleGroup>
              {/* <span className="absolute bottom-0 left-0 h-px w-full bg-white/60" /> */}
            </div>
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

            {currentTab === "staff" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  {staffs.edges.map((staff) => {
                    return (
                      <div className="flex justify-between" key={staff.id}>
                        <div className="relative w-16 h-20">
                          <Image
                            src={staff.node.image.medium || ""}
                            alt={`${staff.node.name.full} image`}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                        <div className="text-end">
                          <div>{staff.node.name.full}</div>
                          <div className="text-white/60">{staff.role}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {currentTab === "recommendation" && (
              <>
                <div className="grid grid-cols-5 gap-4">
                  {recommendations.nodes.map((recommendation) => {
                    return (
                      <>
                        <Thumbnail anime={recommendation.mediaRecommendation} />
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
