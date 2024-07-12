import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Wrapper from "@/components/wrapper";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { Menu, Search } from "lucide-react";

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
    <header className=" bg-kingfisher-daisy text-slate-100">
      <Wrapper className="py-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Button variant="ghost" size="icon">
            <Menu className="h-8 w-8" />
          </Button>
          <Link className="font-major-mono-display text-3xl" href={"/home"}>
            Project<span className="text-lavender-rose">Anime</span>
          </Link>
          {router.pathname !== "/" && (
            <div className="flex items-stretch bg-white p-1">
              <input
                className="text-kingfisher-daisy-800 focus:outline-none pl-3"
                type="text"
                ref={inputRef}
              />
              <button
                className="bg-transparent py-2 px-4 font-space-grotesk"
                onClick={searchHandler}
              >
                <Search className="h-4 w-4" color="#340181" />
              </button>
              <Button size="sm">Filter</Button>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-6">
          {status === "unauthenticated" && (
            <Link href={"/auth"}>
              <Button className="font-space-grotesk bg-lavender-rose">
                Sign In
              </Button>
            </Link>
          )}
          {status === "authenticated" && (
            <>
              <Link className="font-space-grotesk" href={"/profile"}>
                {session?.user!.name}
              </Link>
              <Button
                className="font-space-grotesk bg-lavender-rose"
                type="button"
                onClick={logoutHandler}
              >
                Log out
              </Button>
            </>
          )}
        </div>
      </Wrapper>
    </header>
  );
};

export default MainHeader;
