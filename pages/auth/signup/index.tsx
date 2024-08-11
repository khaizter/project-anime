import SignUpForm from "@/components/auth/sign-up-form";
import Wrapper from "@/components/wrapper";
import React from "react";

const SignUpPage = () => {
  return (
    <div className="w-[350px] sm:w-[400px] mx-auto py-40">
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
