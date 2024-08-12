import { AnimeType } from "@/lib/types";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getAnimeCharacters } from "@/lib/anilist";
import { Skeleton } from "@/components/ui/skeleton";

interface AnimeCharactersProps {
  anime: AnimeType;
  setAnime: React.Dispatch<React.SetStateAction<AnimeType>>;
}

const NUMBER_OF_CELLS = 7;

const AnimeCharacters: React.FC<AnimeCharactersProps> = (props) => {
  const { setAnime } = props;
  const { id: animeId, characters } = props.anime;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCharacters = async () => {
      setIsLoading(true);
      const media = await getAnimeCharacters(animeId, "JAPANESE");
      const newCharacters = media.characters;
      setAnime((prevState) => {
        return { ...prevState, characters: newCharacters };
      });
      setIsLoading(false);
    };
    if (!characters) {
      fetchCharacters();
    }
  }, [animeId, setAnime]);

  if (isLoading) {
    return (
      <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from(Array(NUMBER_OF_CELLS).keys()).map((item) => {
          return (
            <li key={item} className="flex items-stretch space-x-4">
              <div className="h-[80px] w-full flex space-x-2">
                <Skeleton className="h-[80px] w-1/2 rounded-xl" />
                <div className="h-[80px] w-1/2 space-y-2 mt-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-10/12" />
                </div>
              </div>
              <div className="h-[80px] w-full flex space-x-2">
                <div className="h-[80px] w-1/2 space-y-2 mt-2 flex flex-col items-end">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-10/12" />
                </div>
                <Skeleton className="h-[80px] w-1/2 rounded-xl" />
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {characters?.edges.map((character) => {
        return (
          <>
            {character.voiceActors.map((voiceActor) => {
              return (
                <li
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
                </li>
              );
            })}
          </>
        );
      })}
    </ul>
  );
};

export default AnimeCharacters;
