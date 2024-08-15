import { Button } from "@/components/ui/button";
import {
  Flame,
  LogIn,
  LogOut,
  Menu,
  Search,
  Star,
  UserRound,
  UserRoundPlus,
  X,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { status } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  const logoutHandler = async () => {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
  };

  return (
    <div className="block md:hidden fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <Button
          className="bg-medium-red-violet"
          size="icon"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-8 w-8" />
        </Button>
      )}
      {isOpen && (
        <div className="bg-kingfisher-daisy rounded-xl p-2 grid grid-cols-3 gap-2">
          <Button
            className="w-full h-auto flex flex-col items-center bg-transparent p-2"
            onClick={() => {
              router.push({
                pathname: "/anime",
                query: {
                  sort: "popular",
                },
              });
              setIsOpen(false);
            }}
          >
            <Star className="h-6 w-6" />
            <div className="text-xs">Popular</div>
          </Button>
          <Button
            className="h-auto flex flex-col items-center bg-transparent p-2"
            onClick={() => {
              router.push({
                pathname: "/anime",
                query: {
                  sort: "trending",
                },
              });
              setIsOpen(false);
            }}
          >
            <Flame className="h-6 w-6" />
            <div className="text-xs">Trending</div>
          </Button>

          <Button
            className="h-auto flex flex-col items-center bg-transparent p-2"
            onClick={() => {
              router.push({
                pathname: "/filter",
              });
              setIsOpen(false);
            }}
          >
            <Search className="h-6 w-6" />
            <div className="text-xs">Filter</div>
          </Button>
          {status === "unauthenticated" && (
            <>
              <Button
                className="h-auto flex flex-col items-center bg-transparent p-2"
                onClick={() => {
                  router.push("/auth/signup");
                  setIsOpen(false);
                }}
              >
                <UserRoundPlus className="h-6 w-6" />
                <div className="text-xs">Sign Up</div>
              </Button>
              <Button
                className="h-auto flex flex-col items-center bg-transparent p-2"
                onClick={() => {
                  router.push("/auth");
                  setIsOpen(false);
                }}
              >
                <LogIn className="h-6 w-6" />
                <div className="text-xs">Log in</div>
              </Button>
            </>
          )}
          {status === "authenticated" && (
            <>
              <Button
                className="h-auto flex flex-col items-center bg-transparent p-2"
                onClick={() => {
                  router.push("/profile");
                  setIsOpen(false);
                }}
              >
                <UserRound className="h-6 w-6" />
                <div className="text-xs">Profile</div>
              </Button>
              <Button
                className="h-auto flex flex-col items-center bg-transparent p-2"
                onClick={() => {
                  logoutHandler();
                  setIsOpen(false);
                }}
                disabled={isSigningOut}
              >
                <LogOut className="h-6 w-6" />
                <div className="text-xs">Log out</div>
              </Button>
            </>
          )}

          <Button
            className="h-auto flex flex-col items-center bg-transparent p-2"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" fill="#FFF" />
            <div className="text-xs">Close</div>
          </Button>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
