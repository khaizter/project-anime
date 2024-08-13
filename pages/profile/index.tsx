import Wrapper from "@/components/wrapper";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { getAnimeByIds } from "@/lib/anilist";
import CustomPagination from "@/components/custom-pagination";
import Thumbnail from "@/components/thumbnail";
import { Pen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { AnimeType } from "@/lib/types";

const NUMBER_OF_CELLS = 6;

const ProfilePage = () => {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<Array<number>>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [animes, setAnimes] = useState<Array<AnimeType> | null>(null);
  const [loadingAnimes, setLoadingAnimes] = useState<boolean>(true);
  const { toast } = useToast();

  const fetchAnimes = useCallback(async (ids: Array<number>, page: number) => {
    const { pageInfo, animeList } = await getAnimeByIds(page, 24, ids);
    setLastPage(pageInfo.lastPage);
    setAnimes((_) => {
      setLoadingAnimes(false);
      return animeList;
    });
  }, []);

  const fetchFavorites = useCallback(async () => {
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

    setFavorites((_: Array<number>) => {
      return result.data;
    });
    await fetchAnimes(result.data, 1);
  }, [fetchAnimes]);

  useEffect(() => {
    const asyncFunction = async () => {
      try {
        setLoadingAnimes(true);
        await fetchFavorites();
      } catch (err) {
        setLoadingAnimes(false);
        toast({
          duration: 3000,
          variant: "destructive",
          title: "Something went wrong!",
          description: "You may also refresh the page or try again later",
        });
      }
    };
    asyncFunction();
  }, [fetchFavorites, toast]);

  const pageChangedHandler = (page: number) => {
    setCurrentPage((_) => {
      fetchAnimes(favorites, page);
      return page;
    });
  };

  return (
    <Wrapper className="py-10 md:py-24 space-y-4">
      <div>
        <span className="mr-2">Username:</span>
        <span className="text-white/60">{session?.user!.name}</span>
      </div>
      <div>
        <Link className="flex items-center" href={"/profile/change-password"}>
          Change Password
          <Pen className="w-4 h-4 ml-2" />
        </Link>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-space-grotesk text-medium-red-violet">
          My Favorites
        </h2>
        {loadingAnimes && (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from(Array(NUMBER_OF_CELLS).keys()).map((item) => {
              return (
                <div key={item} className="space-y-2">
                  <Skeleton className="h-[250px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              );
            })}
          </ul>
        )}
        {!loadingAnimes && animes ? (
          <>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {animes.map((anime: any, index: number) => {
                return <Thumbnail key={anime.id} anime={anime} />;
              })}
            </ul>
            <CustomPagination
              currentPage={+currentPage}
              lastPage={+lastPage}
              onPageChanged={pageChangedHandler}
            />
          </>
        ) : (
          <div>Failed to fetch</div>
        )}
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
