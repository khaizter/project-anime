import React from "react";
import Image from "next/image";
import { AnimeType } from "@/lib/types";
import Thumbnail from "@/components/thumbnail";

interface AnimeCharactersProps {
  anime: AnimeType;
}

const AnimeRecommendation: React.FC<AnimeCharactersProps> = (props) => {
  const { recommendations } = props.anime;
  return (
    <div className="grid grid-cols-5 gap-4">
      {recommendations.nodes.map((recommendation) => {
        return (
          <Thumbnail
            key={recommendation.mediaRecommendation.id}
            anime={recommendation.mediaRecommendation}
          />
        );
      })}
    </div>
  );
};

export default AnimeRecommendation;
