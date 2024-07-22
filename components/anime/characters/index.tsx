import { AnimeType } from "@/lib/types";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getAnimeCharacters } from "@/lib/anilist";

interface AnimeCharactersProps {
  anime: AnimeType;
  setAnime: React.Dispatch<React.SetStateAction<AnimeType>>;
}

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
    return <div>Loading data...</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {characters?.edges.map((character) => {
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
  );
};

export default AnimeCharacters;
