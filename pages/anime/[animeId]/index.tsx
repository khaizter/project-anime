import { Button } from "@/components/ui/button";
import Wrapper from "@/components/wrapper";
import { getAnimeDetails } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const AnimeDetailPage = (props: any) => {
  const { animeDetails } = props;

  console.log(animeDetails);

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
            <div>TRAILER</div>
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
