import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ComponentProps {
  id: number;
  title: string;
  coverImage: string;
}

const Thumbnail = (props: ComponentProps) => {
  const { id, title, coverImage } = props;

  // on click thumbnail go to animeid page

  return (
    <Link className="flex flex-col" href={`/anime/${id}`}>
      <Image
        className="grow"
        src={coverImage}
        alt={`${title} cover image`}
        width={178}
        height={250}
      />
    </Link>
  );
};

export default Thumbnail;
