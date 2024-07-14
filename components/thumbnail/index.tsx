import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
interface ThumbnailProps {
  id: number;
  title: string;
  coverImage: string;
  description: string;
}

const Thumbnail: React.FC<ThumbnailProps> = (props) => {
  const { id, title, coverImage, description } = props;
  console.log(description);
  return (
    <Link
      className="group flex flex-col bg-jacaranda relative overflow-hidden"
      href={`/anime/${id}`}
    >
      <div className="grow relative ">
        <Image
          src={coverImage}
          alt={`${title} cover image`}
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-full opacity-100"
        />
        <div className="group-hover:-translate-y-12 absolute inset-0 bg-gradient-to-t from-jacaranda to-transparent to-30% group-hover:to-jacaranda/50" />
        {/* <Eye
          className="absolute hidden group-hover:block left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 w-10 h-10"
          color="#EA7AF4"
        /> */}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 h-20 bg-jacaranda group-hover:h-32">
        <div className="line-clamp-2 font-space-grotesk bg-jacaranda min-h-12">
          {title}
        </div>
        <div
          className="font-rajdhani hidden group-hover:line-clamp-2"
          dangerouslySetInnerHTML={{
            __html: description || "",
          }}
        ></div>
      </div>
      <div className="h-20"></div>
    </Link>
  );
};

export default Thumbnail;
