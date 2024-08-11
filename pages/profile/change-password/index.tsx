import ChangePasswordForm from "@/components/auth/change-password-form";
import Wrapper from "@/components/wrapper";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import React from "react";

const ChangePasswordPage = () => {
  return (
    <div className="w-[350px] sm:w-[400px] mx-auto py-24">
      <ChangePasswordForm />
    </div>
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

export default ChangePasswordPage;
