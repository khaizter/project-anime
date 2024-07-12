import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Wrapper from "@/components/wrapper";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef } from "react";

const MainHeader = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  console.log(router.pathname);

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

  const logoutHandler = () => {
    console.log("logout");
    signOut();
  };

  return (
    <header className="bg-slate-900 text-slate-100">
      <Wrapper className="py-4 flex items-center space-x-4">
        <Link href={"/home"}>Home</Link>
        <Link href={"/anime"}>Anime</Link>
        <Link href={"/filter"}>Filter</Link>

        {router.pathname !== "/" && (
          <>
            <Input type="text" ref={inputRef} />
            <Button type="button" onClick={searchHandler}>
              Search
            </Button>
          </>
        )}
        {status === "authenticated" && (
          <Link href={"/profile"}>{session?.user!.name}</Link>
        )}
        {status === "unauthenticated" && <Link href={"/auth"}>Sign In</Link>}

        {status === "authenticated" && (
          <Button type="button" onClick={logoutHandler}>
            Log out
          </Button>
        )}
      </Wrapper>
    </header>
  );
};

export default MainHeader;
