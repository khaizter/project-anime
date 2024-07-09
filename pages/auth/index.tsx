import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Wrapper from "@/components/wrapper";
import React, { useState } from "react";
import SignInForm from "@/components/auth/sign-in-form";
import SignUpForm from "@/components/auth/sign-up-form";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

const AuthPage = () => {
  const [currentTab, setCurrentTab] = useState<"signin" | "signup">("signin");
  return (
    <Wrapper>
      <Tabs value={currentTab} className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin" onClick={() => setCurrentTab("signin")}>
            Sign In
          </TabsTrigger>
          <TabsTrigger value="signup" onClick={() => setCurrentTab("signup")}>
            Sign Up
          </TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <SignInForm />
        </TabsContent>
        <TabsContent value="signup">
          <SignUpForm setCurrentTab={setCurrentTab} />
        </TabsContent>
      </Tabs>
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

export default AuthPage;
