import SignUpForm from "@/components/auth/sign-up-form";
import Wrapper from "@/components/wrapper";
import React from "react";

const SignUpPage = () => {
  return (
    <Wrapper>
      <div className="w-[400px] mx-auto py-24">
        <SignUpForm />
      </div>
    </Wrapper>
  );
};

export default SignUpPage;
