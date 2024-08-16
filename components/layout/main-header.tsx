import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Menu, Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { getGenres } from "@/lib/anilist";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";

const MainHeader = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [genres, setGenres] = useState<Array<string>>([]);
  const { data: session, status } = useSession();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [transparentHeader, setTransparentHeader] = useState(true);
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const scrollHandler = (e: Event) => {
    if (window.scrollY > 80) {
      setTransparentHeader(false);
    } else {
      setTransparentHeader(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);
    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  const fetchGenres = useCallback(async () => {
    try {
      console.log("fetch genres for header");
      const genres = await getGenres();
      setGenres(genres);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    const asyncFunction = async () => {
      try {
        await fetchGenres();
      } catch (err) {
        toast({
          duration: 3000,
          variant: "destructive",
          title: "Authentication failed!",
          description: (err as Error).message,
        });
      }
    };
    asyncFunction();
  }, [fetchGenres, toast]);

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

  const logoutHandler = async () => {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
  };

  return (
    <>
      <header
        className={`${
          transparentHeader ? "bg-kingfisher-daisy/80" : "bg-kingfisher-daisy"
        } text-slate-100 fixed top-0 w-full z-50 hidden md:block`}
      >
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  className="bg-transparent hover:bg-transparent"
                  size="icon"
                >
                  <Menu className="h-8 w-8" />
                </Button>
              </SheetTrigger>
              <SheetContent
                className="flex flex-col bg-kingfisher-daisy text-white border-none pt-8 px-0 gap-0"
                side="left"
              >
                <div className="font-major-mono-display text-3xl pl-3">
                  Project<span className="text-lavender-rose">Anime</span>
                </div>

                <Accordion type="single" collapsible className="w-full mt-8">
                  <AccordionItem
                    value="item-1"
                    className="border-b-2 border-kingfisher-daisy-800/25"
                  >
                    <AccordionTrigger className="p-3 font-space-grotesk text-2xl text-lavender-magenta hover:no-underline">
                      Categories
                    </AccordionTrigger>
                    <AccordionContent className="p-3 pt-0">
                      <SheetClose asChild>
                        <Link
                          className="block font-rajdhani hover:text-medium-red-violet text-lg"
                          href={{
                            pathname: "/anime",
                            query: {
                              sort: "popular",
                            },
                          }}
                        >
                          Popular this season
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          className="block font-rajdhani hover:text-medium-red-violet text-lg"
                          href={{
                            pathname: "/anime",
                            query: {
                              sort: "trending",
                            },
                          }}
                        >
                          Trending
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          className="block font-rajdhani hover:text-medium-red-violet text-lg"
                          href={{
                            pathname: "/anime",
                            query: {
                              sort: "alltimepopular",
                            },
                          }}
                        >
                          All time popular
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          className="block font-rajdhani hover:text-medium-red-violet text-lg"
                          href={{
                            pathname: "/anime",
                            query: {
                              sort: "upcoming",
                            },
                          }}
                        >
                          Upcoming next season
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          className="block font-rajdhani hover:text-medium-red-violet text-lg"
                          href={{
                            pathname: "/anime",
                          }}
                        >
                          A to Z
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          className="block font-rajdhani hover:text-medium-red-violet text-lg"
                          href={{
                            pathname: "/filter",
                          }}
                        >
                          Filter
                        </Link>
                      </SheetClose>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem
                    value="item-2"
                    className="border-b-2 border-kingfisher-daisy-800/25"
                  >
                    <AccordionTrigger className="p-3 font-space-grotesk text-2xl text-lavender-magenta hover:no-underline">
                      Genres
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="grid grid-cols-2 text-lg p-3 pt-0">
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
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="flex items-center justify-end space-x-6 p-3">
                  {status === "unauthenticated" && (
                    <>
                      <Link
                        className="text-white hover:text-lavender-magenta"
                        href={"/auth/signup"}
                      >
                        Sign Up
                      </Link>
                      <Link href={"/auth"}>
                        <Button>Sign In</Button>
                      </Link>
                    </>
                  )}
                  {status === "authenticated" && (
                    <>
                      <Link
                        className="text-white hover:text-lavender-magenta"
                        href={"/profile"}
                      >
                        {session?.user!.name}
                      </Link>

                      <Button
                        type="button"
                        onClick={logoutHandler}
                        disabled={isSigningOut}
                      >
                        Log out
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Link
              className="font-major-mono-display text-2xl sm:text-3xl"
              href={"/home"}
            >
              Project<span className="text-lavender-rose">Anime</span>
            </Link>
            {router.pathname !== "/" && (
              <div className="hidden lg:flex items-stretch bg-white p-1">
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
                  <Link
                    href={{
                      pathname: "/filter",
                    }}
                  >
                    <Button size="sm">Filter</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
          {router.pathname !== "/" && (
            <Button
              className="px-4 block lg:hidden bg-transparent hover:bg-transparent mr-0 sm:mr-auto"
              size="icon"
              onClick={() => setShowSearchBar((prevState) => !prevState)}
            >
              <Search className="h-6 w-6" />
            </Button>
          )}
          <div className="hidden sm:flex items-center space-x-6 ">
            {status === "unauthenticated" && (
              <>
                <Link
                  className="text-white hover:text-lavender-magenta"
                  href={"/auth/signup"}
                >
                  Sign Up
                </Link>
                <Link href={"/auth"}>
                  <Button>Sign In</Button>
                </Link>
              </>
            )}
            {status === "authenticated" && (
              <>
                <Link className="font-space-grotesk" href={"/profile"}>
                  {session?.user!.name}
                </Link>
                <Button
                  type="button"
                  onClick={logoutHandler}
                  disabled={isSigningOut}
                >
                  Log out
                </Button>
              </>
            )}
          </div>
        </div>
        {showSearchBar && (
          <div className="block lg:hidden px-8 py-4">
            <div className="flex w-full tems-stretch bg-white p-1">
              <input
                className="grow text-kingfisher-daisy-800 focus:outline-none pl-3"
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
                <Link
                  href={{
                    pathname: "/filter",
                  }}
                >
                  <Button size="sm">Filter</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default MainHeader;
