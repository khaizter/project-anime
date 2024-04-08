import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div>SEARCH BAR</div>
      <Link href="/home">
        <Button>Go to Home</Button>
      </Link>
    </main>
  );
}
