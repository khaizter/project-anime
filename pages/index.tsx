import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home(props: any) {
  console.log(props.data);
  return (
    <main>
      <div>SEARCH BAR</div>
      <Link href="/home">
        <Button>Go to Home</Button>
      </Link>
    </main>
  );
}

export const getStaticProps = async (context: any) => {
  var query = `
  query ($page : Int, $perPage : Int) {
    Page (page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media (type : ANIME) {
        id
        title {
          romaji
        }
      }
    }
  }
`;
  var variables = {
    page: 1,
    perPage: 20,
  };

  var url = "https://graphql.anilist.co",
    options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    };
  const response = await fetch(url, options);
  const json = await response.json();
  return {
    props: {
      data: json,
    },
  };
};
