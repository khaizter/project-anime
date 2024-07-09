import Wrapper from "@/components/wrapper";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

const ProfilePage = () => {
  const { data: session, status } = useSession();
  console.log(session, status);
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
      </div>
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);

  console.log("MY SESSIOn", session);

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
