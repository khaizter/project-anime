import Wrapper from "@/components/wrapper";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import React from "react";

const ProfilePage = () => {
  return (
    <Wrapper>
      <div className="flex">
        <div>Username:</div>
        <div>USERNAME</div>
      </div>
      <div>
        <div>My Favorites</div>
        <div>SHOW GRID OF FAVORITES</div>
      </div>
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

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
