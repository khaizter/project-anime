import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AnimeType } from "@/lib/types";
import Thumbnail from "@/components/thumbnail";
import { getAnimeRecommendation } from "@/lib/anilist";

interface AnimeCharactersProps {
  anime: AnimeType;
  setAnime: React.Dispatch<React.SetStateAction<AnimeType>>;
}

const AnimeRecommendation: React.FC<AnimeCharactersProps> = (props) => {
  const { setAnime } = props;
  const { id: animeId, recommendations } = props.anime;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      const media = await getAnimeRecommendation(animeId);
      const newRecommendations = media.recommendations;
      setAnime((prevState) => {
        return { ...prevState, recommendations: newRecommendations };
      });
      setIsLoading(false);
    };
    if (!recommendations) {
      fetchRecommendations();
    }
  }, [animeId, setAnime]);

  if (isLoading) {
    return <div>Loading data...</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4  gap-4">
      {recommendations?.nodes.map((recommendation, index) => {
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
