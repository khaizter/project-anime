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
    <Link href={`/anime/${id}`}>
      <div>
        <Image
          src={coverImage}
          alt={`${title} cover image`}
          width={178}
          height={250}
        />
        <p>{title}</p>
      </div>
    </Link>
  );
};

export default Thumbnail;
