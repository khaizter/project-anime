import ChangePasswordForm from "@/components/auth/change-password-form";
import Wrapper from "@/components/wrapper";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import React from "react";

const ChangePasswordPage = () => {
  return (
    <Wrapper>
      <h1>ChangePasswordPage</h1>
      <ChangePasswordForm />
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

export default ChangePasswordPage;
