import { AnimeType } from "@/lib/types";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getAnimeStaffs } from "@/lib/anilist";

interface AnimeCharactersProps {
  anime: AnimeType;
  setAnime: React.Dispatch<React.SetStateAction<AnimeType>>;
}

const AnimeStaff: React.FC<AnimeCharactersProps> = (props) => {
  const { setAnime } = props;
  const { id: animeId, staff: staffs } = props.anime;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStaffs = async () => {
      setIsLoading(true);
      const media = await getAnimeStaffs(animeId);
      const newStaff = media.staff;
      setAnime((prevState) => {
        return { ...prevState, staff: newStaff };
      });
      setIsLoading(false);
    };
    if (!staffs) {
      fetchStaffs();
    }
  }, [animeId, setAnime]);

  if (isLoading) {
    return <div>Loading data...</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {staffs?.edges.map((staff) => {
        return (
          <div className="flex justify-between" key={staff.id}>
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
          </div>
        );
      })}
    </div>
  );
};

export default AnimeStaff;
