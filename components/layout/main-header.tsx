import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Wrapper from "@/components/wrapper";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Menu, Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { getGenres } from "@/lib/anilist";

const MainHeader = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [genres, setGenres] = useState<Array<string>>([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genres = await getGenres();
        setGenres(genres);
      } catch (err) {
        console.log(err);
      }
    };
    fetchGenres();
  }, []);

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
          <Sheet>
            <SheetTrigger asChild>
              <Button
                className="hover:text-kingfisher-daisy"
                variant="ghost"
                size="icon"
              >
                <Menu className="h-8 w-8" />
              </Button>
            </SheetTrigger>
            <SheetContent
              className="flex flex-col bg-kingfisher-daisy text-white border-none pt-16 px-0 gap-0"
              side="left"
            >
              <ul className="font-space-grotesk text-2xl text-white">
                <li className="py-3 px-3 border-b-2 border-kingfisher-daisy-800/25">
                  <SheetClose asChild>
                    <Link href={"/home"}>Home</Link>
                  </SheetClose>
                </li>
                <li className="py-3 px-3 border-b-2 border-kingfisher-daisy-800/25">
                  <SheetClose asChild>
                    <Link href={"/popular"}>Popular</Link>
                  </SheetClose>
                </li>
                <li className="py-3 px-3 border-b-2 border-kingfisher-daisy-800/25">
                  <SheetClose asChild>
                    <Link href={"/trending"}>Trending</Link>
                  </SheetClose>
                </li>
              </ul>
              <div className="font-space-grotesk text-2xl p-3 text-lavender-magenta">
                Genre
              </div>
              <ul className="grid grid-cols-2 gap-2 text-lg p-3">
                {genres.map((item: string, index: number) => {
                  return (
                    <li key={index}>
                      <SheetClose asChild>
                        <Link
                          className="font-rajdhani hover:text-medium-red-violet"
                          href={{
                            pathname: "/filter",
                            query: {
                              genres: [item],
                            },
                          }}
                        >
                          {item}
                        </Link>
                      </SheetClose>
                    </li>
                  );
                })}
              </ul>
            </SheetContent>
          </Sheet>

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
                <Search className="h-4 w-4" color="#3B0086" />
              </button>
              <div className="bg-kingfisher-daisy rounded-md">
                <Button size="sm">Filter</Button>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-6">
          {status === "unauthenticated" && (
            <Link href={"/auth"}>
              <Button>Sign In</Button>
            </Link>
          )}
          {status === "authenticated" && (
            <>
              <Link className="font-space-grotesk" href={"/profile"}>
                {session?.user!.name}
              </Link>
              <Button type="button" onClick={logoutHandler}>
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
