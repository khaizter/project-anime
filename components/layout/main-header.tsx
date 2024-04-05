import Wrapper from "@/components/wrapper";
import Link from "next/link";
import React from "react";

const MainHeader = () => {
  return (
    <header className="bg-slate-900 text-slate-100">
      <Wrapper className="py-4">
        <Link href={"/home"}>Home</Link>
      </Wrapper>
    </header>
  );
};

export default MainHeader;
