import { AnimeType } from "@/lib/types";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { getAnimeStaffs } from "@/lib/anilist";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

interface AnimeCharactersProps {
  anime: AnimeType;
  setAnime: React.Dispatch<React.SetStateAction<AnimeType>>;
}

const NUMBER_OF_CELLS = 7;

const AnimeStaff: React.FC<AnimeCharactersProps> = (props) => {
  const { setAnime } = props;
  const { id: animeId, staff: staffs } = props.anime;
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchStaffs = useCallback(
    async (id: number) => {
      const media = await getAnimeStaffs(id);
      const newStaff = media.staff;
      setAnime((prevState) => {
        setIsLoading(false);
        return { ...prevState, staff: newStaff };
      });
    },
    [setAnime]
  );

  useEffect(() => {
    const asyncFunction = async () => {
      try {
        if (!staffs) {
          setIsLoading(true);
          await fetchStaffs(animeId);
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
  }, [animeId, staffs, fetchStaffs, toast]);

  if (isLoading) {
    return (
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from(Array(NUMBER_OF_CELLS).keys()).map((item) => {
          return (
            <li
              key={item}
              className="flex items-stretch justify-between space-x-4"
            >
              <Skeleton className="h-[80px] w-1/4 rounded-xl" />
              <div className="h-[80px] w-2/4 flex flex-col items-end space-y-2 mt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-10/12" />
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <>
      {staffs ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {staffs?.edges.map((staff) => {
            return (
              <li className="flex justify-between" key={staff.id}>
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
              </li>
            );
          })}
        </ul>
      ) : (
        <div>Failed to fetch</div>
      )}
    </>
  );
};

export default AnimeStaff;
