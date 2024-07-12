import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Wrapper from "@/components/wrapper";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";

export default function Home() {
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
    <Wrapper>
      <div className="flex items-center">
        <Input type="text" ref={inputRef} />
        <Button type="button" onClick={searchHandler}>
          Search
        </Button>
      </div>
      <Link href="/home">
        <Button>Go to Home</Button>
      </Link>
    </Wrapper>
  );
}
