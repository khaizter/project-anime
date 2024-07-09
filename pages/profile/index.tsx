import Wrapper from "@/components/wrapper";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<Array<number>>([]);

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

      setFavorites(result.data);
    };
    fetchFavorites();
  }, []);

  const unfavoriteHandler = (animeId: number) => {
    console.log("unfavorite: ", animeId);
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
        {favorites.map((item: number) => {
          return (
            <Button key={item} onClick={unfavoriteHandler.bind(null, item)}>
              {item}
            </Button>
          );
        })}
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
