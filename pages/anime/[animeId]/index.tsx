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
import AnimeOverview from "@/components/anime/overview";
import AnimeEpisodes from "@/components/anime/episodes";
import AnimeCharacters from "@/components/anime/characters";
import AnimeStaff from "@/components/anime/staff";
import AnimeRecommendation from "@/components/anime/recommendation";

const TABS: Array<string> = [
  "overview",
  "episodes",
  "characters",
  "staff",
  "recommendation",
];

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
              <AnimeOverview anime={props.animeDetails} />
            )}

            {currentTab === "episodes" && (
              <AnimeEpisodes anime={props.animeDetails} />
            )}

            {currentTab === "characters" && (
              <AnimeCharacters anime={props.animeDetails} />
            )}

            {currentTab === "staff" && (
              <AnimeStaff anime={props.animeDetails} />
            )}

            {currentTab === "recommendation" && (
              <AnimeRecommendation anime={props.animeDetails} />
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
