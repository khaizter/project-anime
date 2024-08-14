import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimeType } from "@/lib/types";
import Thumbnail from "@/components/thumbnail";
import { getAnimeRecommendation } from "@/lib/anilist";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import RobotError from "@/components/robot-error";
import EmptyBox from "@/components/empty-box";

interface AnimeCharactersProps {
  anime: AnimeType;
  setAnime: React.Dispatch<React.SetStateAction<AnimeType>>;
}
const NUMBER_OF_CELLS = 7;

const AnimeRecommendation: React.FC<AnimeCharactersProps> = (props) => {
  const { setAnime } = props;
  const { id: animeId, recommendations } = props.anime;
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchRecommendations = useCallback(
    async (id: number) => {
      const media = await getAnimeRecommendation(id);
      const newRecommendations = media.recommendations;
      setAnime((prevState) => {
        setIsLoading(false);
        return { ...prevState, recommendations: newRecommendations };
      });
    },
    [setAnime]
  );

  useEffect(() => {
    const asyncFunction = async () => {
      try {
        if (!recommendations) {
          setIsLoading(true);
          await fetchRecommendations(animeId);
        }
      } catch (err) {
        setIsLoading(false);
        toast({
          duration: 3000,
          variant: "destructive",
          title: "Something went wrong!",
          description: "You may also refresh the page or try again later",
        });
      }
    };
    asyncFunction();
  }, [animeId, recommendations, fetchRecommendations, toast]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4  gap-4">
        {Array.from(Array(NUMBER_OF_CELLS).keys()).map((item) => {
          return (
            <div key={item} className="space-y-2">
              <Skeleton className="h-[250px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <>
      {recommendations ? (
        <>
          {recommendations.nodes.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4  gap-4">
              {recommendations.nodes.map((recommendation, index) => {
                return (
                  <Thumbnail
                    key={recommendation.mediaRecommendation.id}
                    anime={recommendation.mediaRecommendation}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyBox />
          )}
        </>
      ) : (
        <RobotError />
      )}
    </>
  );
};

export default AnimeRecommendation;
