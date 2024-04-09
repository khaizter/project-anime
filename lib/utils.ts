import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type FilterType = {
  keyword?: string;
  genres?: Array<string>;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const queryAnilist = async (query: String, variables: any) => {
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

  return json.data;
};

// sort by romaji name
export const getAnimes = async (page: number = 1, perPage: number = 20) => {
  var query = `
  query ($page : Int, $perPage : Int){
    Page (page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }

			media(type:ANIME, sort : TITLE_ROMAJI) {
        id
        title {
          romaji
          english
         }
      coverImage {
          extraLarge
          large
          medium
          color
        }
      }    	
    }
  }
`;
  var variables = {
    page: page,
    perPage: perPage,
  };

  const data = await queryAnilist(query, variables);
  const animeList = data.Page.media;
  const pageInfo = data.Page.pageInfo;
  return {
    pageInfo: {
      total: pageInfo.total,
      currentPage: pageInfo.currentPage,
      lastPage: pageInfo.lastPage,
      hasNextPage: pageInfo.hasNextPage,
      perPage: pageInfo.perPage,
    },
    animeList,
  };
};

export const getPopularAnimes = async (
  page: number = 1,
  perPage: number = 20
) => {
  var query = `
    query ($page : Int, $perPage : Int){
      Page (page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media (type : ANIME, sort : POPULARITY_DESC ){
          id
          title {
          romaji
          english
          
          }
        coverImage {
          extraLarge
          large
          medium
          color
        }
        bannerImage
        }
      }
    }
`;
  var variables = {
    page: page,
    perPage: perPage,
  };

  const data = await queryAnilist(query, variables);
  const animeList = data.Page.media;
  const pageInfo = data.Page.pageInfo;
  return {
    pageInfo: {
      total: pageInfo.total,
      currentPage: pageInfo.currentPage,
      lastPage: pageInfo.lastPage,
      hasNextPage: pageInfo.hasNextPage,
      perPage: pageInfo.perPage,
    },
    animeList,
  };
};

export const getTrendingAnimes = async (
  page: number = 1,
  perPage: number = 20
) => {
  var query = `
  query ($page : Int, $perPage : Int){
    Page (page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media (type : ANIME, sort : TRENDING_DESC ){
        id
        title {
        romaji
        english
        
        }
      coverImage {
        extraLarge
        large
        medium
        color
      }
      bannerImage
      }
    }
  }
`;
  var variables = {
    page: page,
    perPage: perPage,
  };

  const data = await queryAnilist(query, variables);
  const animeList = data.Page.media;
  const pageInfo = data.Page.pageInfo;
  return {
    pageInfo: {
      total: pageInfo.total,
      currentPage: pageInfo.currentPage,
      lastPage: pageInfo.lastPage,
      hasNextPage: pageInfo.hasNextPage,
      perPage: pageInfo.perPage,
    },
    animeList,
  };
};

export const getAnimesWithFilter = async (
  page: number = 1,
  perPage: number = 20,
  filter: FilterType = {
    keyword: "",
    genres: [],
  }
) => {
  var query = ` query($page :Int, $perPage:Int,$keyword :String){
    Page (page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media (type : ANIME, sort : START_DATE_DESC, search : $keyword ){
        id
        title {
         romaji
         english
        
        }
       coverImage {
         extraLarge
         large
         medium
         color
       }
       bannerImage
      }
    }
  }`;
  var variables = {
    page: page,
    perPage: perPage,
    keyword: filter.keyword,
  };
  const data = await queryAnilist(query, variables);
  const animeList = data.Page.media;
  const pageInfo = data.Page.pageInfo;
  return {
    pageInfo: {
      total: pageInfo.total,
      currentPage: pageInfo.currentPage,
      lastPage: pageInfo.lastPage,
      hasNextPage: pageInfo.hasNextPage,
      perPage: pageInfo.perPage,
    },
    animeList,
  };
};

export const getAnimeDetails = async (animeId: number) => {
  var query = `
  query($id: Int){
    Media (id: $id) {
			title {
        romaji
        english
      }
      description(asHtml : true)
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      trailer {
        id
      }
      coverImage {
        extraLarge
        large
        medium
        color
      }
      bannerImage
      genres
      tags {
        id
      }
      studios(sort : FAVOURITES_DESC ,isMain : true) {
        edges {
          id
        }
      }
    }
  }
`;
  var variables = {
    id: animeId,
  };
  const data = await queryAnilist(query, variables);
  return data.Media;
};
