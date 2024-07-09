import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { FilterType } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const queryAnilist = async (query: String, variables: any) => {
  try {
    const url = "https://graphql.anilist.co",
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
  } catch (err) {
    throw err;
  }
};

// sort by romaji name
export const getAnimes = async (page: number = 1, perPage: number = 20) => {
  const query = `
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
  const variables = {
    page: page,
    perPage: perPage,
  };
  try {
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
  } catch (err) {
    throw err;
  }
};

export const getPopularAnimes = async (
  page: number = 1,
  perPage: number = 20
) => {
  const query = `
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
  const variables = {
    page: page,
    perPage: perPage,
  };
  try {
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
  } catch (err) {
    throw err;
  }
};

export const getTrendingAnimes = async (
  page: number = 1,
  perPage: number = 20
) => {
  const query = `
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
        description(asHtml : true)
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
  const variables = {
    page: page,
    perPage: perPage,
  };
  try {
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
  } catch (err) {
    throw err;
  }
};

export const getAnimesWithFilter = async (
  page: number = 1,
  perPage: number = 20,
  filter: FilterType = {
    keyword: null,
    genres: null,
  }
) => {
  const query = ` query($page :Int, $perPage:Int,$keyword :String, $genres : [String]){
    Page (page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media (type : ANIME, sort : TITLE_ROMAJI, search : $keyword, genre_in : $genres ){
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
  const variables = {
    page: page,
    perPage: perPage,
    keyword: filter.keyword || null,
    genres: filter.genres?.length ? filter.genres : null,
  };
  try {
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
  } catch (err) {
    throw err;
  }
};

export const getAnimeDetails = async (animeId: number) => {
  const query = `
  query($id: Int){
    Media (id: $id) {
      id
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
        site
        thumbnail
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
      streamingEpisodes{
        title
        thumbnail
        url
        site
      }
      siteUrl
    }
  }
`;
  const variables = {
    id: animeId,
  };
  const data = await queryAnilist(query, variables);
  return data.Media;
};

export const getGenres = async () => {
  const query = `query {
    GenreCollection
  }`;
  const variables = {};
  const data = await queryAnilist(query, variables);
  return data.GenreCollection;
};

export const getAnimeByIds = async (animeIds: Array<number>) => {
  const query = `
  query($page :Int, $perPage:Int,$ids: [Int]){
  Page (page: $page, perPage: $perPage) {
    Media (id_in: $ids) {
      id
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
        site
        thumbnail
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
      streamingEpisodes{
        title
        thumbnail
        url
        site
      }
      siteUrl
    }
}
  }
`;
  const variables = {
    page: 1,
    perPage: 24,
    ids: animeIds,
  };
  const data = await queryAnilist(query, variables);
  return data.Media;
};
