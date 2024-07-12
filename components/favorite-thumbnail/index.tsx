import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FavoriteThumbnailProps {
  id: number;
  title: string;
  coverImage: string;
  onUnfavorite?: (id: number) => void;
}

const FavoriteThumbnail: React.FC<FavoriteThumbnailProps> = (props) => {
  const { id, title, coverImage, onUnfavorite } = props;

  const [isHover, setIsHover] = useState<boolean>(false);

  const heartClickHandler: React.MouseEventHandler = (e) => {
    e.preventDefault();
    onUnfavorite?.(id);
  };

  return (
    <div className="flex flex-col">
      <Link className="group  grow flex relative" href={`/anime/${id}`}>
        <Image
          className="grow"
          src={coverImage}
          alt={`${title} cover image`}
          width={178}
          height={250}
        />
        <div className="hidden group-hover:block absolute inset-0 bg-[#00000060]">
          <Button
            className="absolute block bottom-0 right-0 rounded-full p-2 h-auto"
            variant="ghost"
            onMouseOver={() => setIsHover(true)}
            onMouseOut={() => setIsHover(false)}
            onClick={heartClickHandler}
          >
            <Heart
              className="h-4 w-4"
              color={isHover ? "#ff0000" : "#ff0000"}
              fill={isHover ? "transparent" : "#ff0000"}
            />
          </Button>
        </div>
      </Link>
      <div className="truncate font-space-grotesk">{title}</div>
    </div>
  );
};

export default FavoriteThumbnail;
