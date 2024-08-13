import Wrapper from "@/components/wrapper";
import { getAnimeDetails } from "@/lib/anilist";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AnimeType } from "@/lib/types";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import AnimeSidebar from "@/components/anime/sidebar";
import AnimeOverview from "@/components/anime/overview";
import AnimeEpisodes from "@/components/anime/episodes";
import AnimeCharacters from "@/components/anime/characters";
import AnimeStaff from "@/components/anime/staff";
import AnimeRecommendation from "@/components/anime/recommendation";
import { notFound } from "next/navigation";

const TABS: Array<string> = [
  "overview",
  "episodes",
  "characters",
  "staff",
  "recommendation",
];

const AnimeDetailPage = (props: any) => {
  const [anime, setAnime] = useState<AnimeType>(props.animeDetails);
  const { title, bannerImage } = anime;
  const [currentTab, setCurrentTab] = useState("overview");

  useEffect(() => {
    setAnime(props.animeDetails);
    setCurrentTab("overview");
  }, [props.animeDetails]);

  return (
    <>
      <div className="relative w-full h-48 md:h-96">
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
        <div className="grid grid-cols-1 md:grid-cols-4">
          <AnimeSidebar anime={anime} />
          <div className="pb-4 md:p-4 col-span-3 grow relative">
            <div className="mb-6 block md:absolute left-4 -top-12 w-full overflow-x-scroll md:overflow-auto">
              <ToggleGroup
                className="justify-start"
                type="single"
                value={currentTab}
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
            </div>

            {currentTab === "overview" && <AnimeOverview anime={anime} />}

            {currentTab === "episodes" && (
              <AnimeEpisodes anime={anime} setAnime={setAnime} />
            )}

            {currentTab === "characters" && (
              <AnimeCharacters anime={anime} setAnime={setAnime} />
            )}

            {currentTab === "staff" && (
              <AnimeStaff anime={anime} setAnime={setAnime} />
            )}

            {currentTab === "recommendation" && (
              <AnimeRecommendation anime={anime} setAnime={setAnime} />
            )}
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export const getServerSideProps = async (context: any) => {
  const { params } = context;
  const { animeId } = params;

  const animeDetails = await getAnimeDetails(animeId);

  return {
    props: {
      animeDetails: animeDetails,
    },
  };
};

export default AnimeDetailPage;
