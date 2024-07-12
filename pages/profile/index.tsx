import Wrapper from "@/components/wrapper";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { Button } from "@/components/ui/button";
import { getAnimeByIds } from "@/lib/utils";
import CustomPagination from "@/components/custom-pagination";
import FavoriteThumbnail from "@/components/favorite-thumbnail";

const unfavorite = async (
  animeId: string | number,
  remove: boolean = false
) => {
  const response = await fetch("/api/user/favorite", {
    method: "PATCH",
    body: JSON.stringify({ animeId, remove }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong!");
  }

  return data;
};

const ProfilePage = () => {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<Array<number>>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(20);
  const [animes, setAnimes] = useState<Array<any>>([]);
  const [loadingAnimes, setLoadingAnimes] = useState<boolean>(false);

  const fetchAnimes = async (ids: Array<number>, page: number) => {
    setLoadingAnimes(true);
    const { pageInfo, animeList } = await getAnimeByIds(page, 24, ids);
    setLastPage(pageInfo.lastPage);
    setAnimes(animeList);
    setLoadingAnimes(false);
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      const response = await fetch("/api/user/favorite", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong!");
      }

      // fetch anime details
      setFavorites(result.data);
      fetchAnimes(result.data, currentPage);
    };
    fetchFavorites();
  }, []);

  const pageChangedHandler = (page: number) => {
    setCurrentPage((_) => {
      fetchAnimes(favorites, page);
      return page;
    });
  };

  const unfavoriteHandler = async (animeId: number) => {
    console.log(animeId);
    return;
    try {
      const result = await unfavorite(animeId, true);
      console.log(result);
      setFavorites((prevState: Array<number>) => {
        return prevState.filter((item: number) => item !== animeId);
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Wrapper>
      <div className="flex">
        <div>Username:</div>
        <div>{session?.user!.name}</div>
      </div>
      <Link href={"/profile/change-password"}>Change Password</Link>
      <div>
        <div>My Favorites</div>
        <div>SHOW GRID OF FAVORITES</div>
        {/* {favorites.map((item: number) => {
          return (
            <Button key={item} onClick={unfavoriteHandler.bind(null, item)}>
              {item}
            </Button>
          );
        })} */}
        {!loadingAnimes ? (
          <ul className="grid grid-cols-6 gap-4">
            {animes.map((anime: any) => {
              return (
                <FavoriteThumbnail
                  key={anime.id}
                  id={anime.id}
                  title={anime.title.romaji}
                  coverImage={anime.coverImage.large}
                  onUnfavorite={unfavoriteHandler}
                />
              );
            })}
          </ul>
        ) : (
          <div>Loading animes...</div>
        )}
        <CustomPagination
          currentPage={+currentPage}
          lastPage={+lastPage}
          onPageChanged={pageChangedHandler}
        />
      </div>
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

export default ProfilePage;
