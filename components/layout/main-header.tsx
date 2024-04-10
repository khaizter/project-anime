import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Wrapper from "@/components/wrapper";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef } from "react";

const MainHeader = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchHandler = () => {
    if (!inputRef || !inputRef.current) {
      throw Error("no input ref");
    }
    router.push({
      pathname: "/filter",
      query: {
        keyword: inputRef.current.value,
      },
    });
  };
  return (
    <header className="bg-slate-900 text-slate-100">
      <Wrapper className="py-4 flex">
        <Link href={"/home"}>Home</Link>
        <Link href={"/anime"}>Anime</Link>
        <Input type="text" ref={inputRef} />
        <Button type="button" onClick={searchHandler}>
          Search
        </Button>
      </Wrapper>
    </header>
  );
};

export default MainHeader;
