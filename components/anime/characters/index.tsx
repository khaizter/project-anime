import { AnimeType } from "@/lib/types";
import React from "react";
import Image from "next/image";

interface AnimeCharactersProps {
  anime: AnimeType;
}

const AnimeCharacters: React.FC<AnimeCharactersProps> = (props) => {
  const { characters } = props.anime;
  return (
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
  );
};

export default AnimeCharacters;
