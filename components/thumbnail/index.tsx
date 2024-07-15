import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
interface ThumbnailProps {
  id: number;
  title: string;
  coverImage: string;
  description: string;
}

const Thumbnail: React.FC<ThumbnailProps> = (props) => {
  const { id, title, coverImage, description } = props;
  const [showDetails, setShowDetails] = useState(false);
  return (
    <Link
      className="group flex flex-col bg-jacaranda relative overflow-visible"
      href={`/anime/${id}`}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
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
        <div className="absolute inset-0 bg-gradient-to-t from-jacaranda to-transparent to-30% group-hover:to-jacaranda/50" />
        <Eye
          className="absolute hidden group-hover:block left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 w-10 h-10"
          color="#EA7AF4"
        />
      </div>
      <div className="h-20 p-3">
        <div className="line-clamp-2 font-space-grotesk min-h-12">{title}</div>
      </div>
      {showDetails && (
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-kingfisher-daisy z-10">
          <div>{title}</div>
          <div
            className="line-clamp-3"
            dangerouslySetInnerHTML={{ __html: description }}
          />
          <Button>Add to Favorites</Button>
        </div>
      )}
    </Link>
  );
};

export default Thumbnail;
