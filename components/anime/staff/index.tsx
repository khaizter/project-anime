import { AnimeType } from "@/lib/types";
import React from "react";
import Image from "next/image";

interface AnimeCharactersProps {
  anime: AnimeType;
}

const AnimeStaff: React.FC<AnimeCharactersProps> = (props) => {
  const { staff: staffs } = props.anime;
  return (
    <div className="grid grid-cols-2 gap-4">
      {staffs.edges.map((staff) => {
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
