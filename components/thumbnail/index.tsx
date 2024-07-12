import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ThumbnailProps {
  id: number;
  title: string;
  coverImage: string;
}

const Thumbnail: React.FC<ThumbnailProps> = (props) => {
  const { id, title, coverImage } = props;

  return (
    <Link className="flex flex-col" href={`/anime/${id}`}>
      <Image
        className="grow"
        src={coverImage}
        alt={`${title} cover image`}
        width={178}
        height={250}
      />
      <div className="truncate font-space-grotesk">{title}</div>
    </Link>
  );
};

export default Thumbnail;
