import Link from "next/link";
import React from "react";

const MainFooter = () => {
  return (
    <footer className="bg-black p-8 text-white grid grid-cols-2 gap-4">
      <div className="space-y-4">
        <div className="font-space-grotesk text-xl">Links</div>
        <ul className="text-white/60 grid grid-cols-2 gap-1">
          <li>
            <Link
              className="block font-rajdhani hover:text-medium-red-violet text-lg"
              href={{
                pathname: "/anime",
                query: {
                  sort: "popular",
                },
              }}
            >
              Popular this season
            </Link>
          </li>
          <li>
            <Link
              className="block font-rajdhani hover:text-medium-red-violet text-lg"
              href={{
                pathname: "/anime",
                query: {
                  sort: "trending",
                },
              }}
            >
              Trending
            </Link>
          </li>
          <li>
            <Link
              className="block font-rajdhani hover:text-medium-red-violet text-lg"
              href={{
                pathname: "/anime",
                query: {
                  sort: "alltimepopular",
                },
              }}
            >
              All time popular
            </Link>
          </li>
          <li>
            <Link
              className="block font-rajdhani hover:text-medium-red-violet text-lg"
              href={{
                pathname: "/anime",
                query: {
                  sort: "upcoming",
                },
              }}
            >
              Upcoming next season
            </Link>
          </li>
          <li>
            <Link
              className="block font-rajdhani hover:text-medium-red-violet text-lg"
              href={{
                pathname: "/anime",
              }}
            >
              A to Z
            </Link>
          </li>
          <li>
            <Link
              className="block font-rajdhani hover:text-medium-red-violet text-lg"
              href={{
                pathname: "/filter",
              }}
            >
              Filter
            </Link>
          </li>
        </ul>
      </div>
      <div className="space-y-4">
        <div className="font-space-grotesk text-xl">About us</div>
        <div className="font-rajdhani text-base text-white/60">
          Project Anime is for non-commercial use only. It allows you to
          discover animes including latest ones and add it to your favorite
          list. Data used were from AniList API.
        </div>
        <div className="font-rajdhani text-base text-white/60">
          © 2024 Project Anime. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
