import { FilterType } from "@/lib/types";

const SEASON: {
  [key: string]: Array<number>;
} = {
  WINTER: [11, 0, 1],
  SPRING: [2, 3, 4],
  SUMMER: [5, 6, 7],
  FALL: [8, 9, 10],
};

export const getCurrentSeason = (): string => {
  const currentDate = new Date();
  const monthIndex = currentDate.getMonth();

  for (const key of Object.keys(SEASON)) {
    if (SEASON[key].includes(monthIndex)) {
      return key;
    }
  }

  return "";
};

export const getNextSeason = (): string => {
  const seasonKeys = Object.keys(SEASON);

  const currentSeasonIndex = seasonKeys.findIndex(
    (item: string) => item === getCurrentSeason()
  );

  if (currentSeasonIndex == seasonKeys.length - 1) {
    return seasonKeys[0];
  } else {
    return seasonKeys[currentSeasonIndex + 1];
  }
};

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
    if (!response.ok) {
      throw new Error(json.errors[0].message);
    }
    return json.data;
  } catch (err) {
    console.log("ANILIST ERROR:", err);
  }
};

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
         }
        coverImage {
          large
        }
        description
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
          }
          coverImage {
            large
          }
          description
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

export const getPopularAnimesThisSeason = async (
  page: number = 1,
  perPage: number = 20
) => {
  const currentDate = new Date();
  const startingDate = `${currentDate.getFullYear()}0101`;
  const currentSeason = getCurrentSeason();
  const query = `
    query ($page : Int, $perPage : Int, $startingDate : FuzzyDateInt, $currentSeason : MediaSeason){
      Page (page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media (type : ANIME, sort : POPULARITY_DESC, startDate_greater : $startingDate, season : $currentSeason){
          id
          title {
            romaji
          }
          coverImage {
            large
          }
          description
        }
      }
    }
`;
  const variables = {
    page,
    perPage,
    startingDate,
    currentSeason,
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

export const getPopularAnimesNextSeason = async (
  page: number = 1,
  perPage: number = 20
) => {
  const currentDate = new Date();
  const nextSeason = getNextSeason();
  const startingDate = `${
    nextSeason === "WINTER"
      ? currentDate.getFullYear() + 1
      : currentDate.getFullYear()
  }0101`;
  const query = `
    query ($page : Int, $perPage : Int, $startingDate : FuzzyDateInt, $nextSeason : MediaSeason){
      Page (page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media (type : ANIME, sort : POPULARITY_DESC, startDate_greater : $startingDate, season : $nextSeason){
          id
          title {
            romaji
          }
          coverImage {
            large
          }
          description
        }
      }
    }
`;
  const variables = {
    page: page,
    perPage: perPage,
    startingDate,
    nextSeason,
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
        }
        coverImage {
          large
        }
        description
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
        native
      }
      synonyms
      description(asHtml : false)
      status
      startDate {
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
      studios(sort : FAVOURITES_DESC) {
        edges{
          node{
            id
            name
          }
          isMain
        }
      }
      episodes
      season
      seasonYear
      recommendations(sort:RATING_DESC , page:1, perPage:20 ){
        nodes{
          mediaRecommendation{
            id
            title {
              romaji
            }
            coverImage {
              large
            }
          }
        }
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
      }
      staff(sort :RELEVANCE, page:1, perPage: 20) {
      	edges{
          id
          node {
            id
            name {
              full
            }
            image {
              medium
            }
          }
          role
        }
         pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
      }
    }
  }
`;
  const variables = {
    id: animeId,
  };
  const data = await queryAnilist(query, variables);
  return data.Media;
};

export const getAnimeEpisodes = async (animeId: number) => {
  const query = `
   query($id: Int){
    Media (id: $id) {
      streamingEpisodes{
        title
        thumbnail
        url
        site
      }
    }
  }
`;
  const variables = {
    id: animeId,
  };
  const data = await queryAnilist(query, variables);
  return data.Media;
};

export const getAnimeCharacters = async (
  animeId: number,
  language: string,
  page: number = 1,
  perPage: number = 20
) => {
  const query = `
  query($id: Int, $page : Int, $perPage : Int, $language : StaffLanguage){
   Media (id: $id) {
    characters(sort: FAVOURITES_DESC, page: $page, perPage:$perPage ) {
      edges{
        id
        node {
          id
          name {
            full
          }
          image {
            medium
          }
        }
        role
        voiceActors(language : $language, sort : RELEVANCE){
          id
          name {
            full
          }
          languageV2
          image{
            medium
          }
        }
      }
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
    }
   }
 }
`;
  const variables = {
    id: animeId,
    page: page,
    perPage: perPage,
    language: language,
  };
  const data = await queryAnilist(query, variables);
  return data.Media;
};

export const getAnimeStaffs = async (
  animeId: number,
  page: number = 1,
  perPage: number = 20
) => {
  const query = `
  query($id: Int, $page : Int, $perPage : Int){
   Media (id: $id) {
    staff(sort :RELEVANCE, page: $page, perPage: $perPage) {
      	edges{
          id
          node {
            id
            name {
              full
            }
            image {
              medium
            }
          }
          role
        }
         pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
      }
   }
 }
`;
  const variables = {
    id: animeId,
    page: page,
    perPage: perPage,
  };
  const data = await queryAnilist(query, variables);
  return data.Media;
};

export const getAnimeRecommendation = async (
  animeId: number,
  page: number = 1,
  perPage: number = 20
) => {
  const query = `
  query($id: Int, $page : Int, $perPage : Int){
   Media (id: $id) {
     recommendations(sort:RATING_DESC , page:$page, perPage:$perPage ){
        nodes{
          mediaRecommendation{
            id
            title {
              romaji
            }
            coverImage {
              large
            }
          }
        }
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
      }
   }
 }
`;
  const variables = {
    id: animeId,
    page: page,
    perPage: perPage,
  };
  const data = await queryAnilist(query, variables);
  return data.Media;
};

export const getAnimeHoverDetails = async (animeId: number) => {
  const query = `
  query($id: Int){
    Media (id: $id) {
      id
			title {
        romaji
        native
      }
      synonyms
      description(asHtml : false)
      status
      startDate {
        year
        month
        day
      }
      coverImage {
        large
      }
      genres
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

export const getAnimeByIds = async (
  page: number = 1,
  perPage: number = 20,
  animeIds: Array<number>
) => {
  const query = `
  query($page :Int, $perPage:Int,$ids: [Int]){
  Page (page: $page, perPage: $perPage) {
  pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
    media (id_in: $ids) {
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
        nodes : {
          id
          name
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
    page: page,
    perPage: perPage,
    ids: animeIds!,
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
