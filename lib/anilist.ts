import { FilterType } from "@/lib/types";
import { sleep } from "@/lib/utils";

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

export const queryAnilist = async (
  query: String,
  variables: any
): Promise<any> => {
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
      if (
        json.errors[0].message === "Too Many Requests." ||
        response.status === 429
      ) {
        console.log("FETCH COOLDOWN");
        await sleep(10000);
        return await queryAnilist(query, variables);
      }
      throw new Error(json.errors[0].message);
    }

    return json.data;
  } catch (err) {
    throw err;
  }
};

export const getAnimes = async (page: number = 1, perPage: number = 20) => {
  try {
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
          extraLarge
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
    console.log("ANILIST ERROR:", err);
    throw err;
  }
};

export const getPopularAnimes = async (
  page: number = 1,
  perPage: number = 20
) => {
  try {
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
            extraLarge
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
    console.log("ANILIST ERROR:", err);
    throw err;
  }
};

export const getPopularAnimesThisSeason = async (
  page: number = 1,
  perPage: number = 20
) => {
  try {
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
            extraLarge
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
    console.log("ANILIST ERROR:", err);
    throw err;
  }
};

export const getPopularAnimesNextSeason = async (
  page: number = 1,
  perPage: number = 20
) => {
  try {
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
            extraLarge
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
    console.log("ANILIST ERROR:", err);
    throw err;
  }
};

export const getTrendingAnimes = async (
  page: number = 1,
  perPage: number = 20
) => {
  try {
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
          extraLarge
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
    console.log("ANILIST ERROR:", err);
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
  try {
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
    console.log("ANILIST ERROR:", err);
    throw err;
  }
};

export const getAnimeDetails = async (animeId: number) => {
  try {
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
    }
  }
`;
    const variables = {
      id: animeId,
    };
    const data = await queryAnilist(query, variables);
    return data.Media;
  } catch (err) {
    console.log("ANILIST ERROR:", err);
    throw err;
  }
};

export const getAnimeEpisodes = async (animeId: number) => {
  try {
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
  } catch (err) {
    console.log("ANILIST ERROR:", err);
    throw err;
  }
};

export const getAnimeCharacters = async (
  animeId: number,
  language: string,
  page: number = 1,
  perPage: number = 20
) => {
  try {
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
  } catch (err) {
    console.log("ANILIST ERROR:", err);
    throw err;
  }
};

export const getAnimeStaffs = async (
  animeId: number,
  page: number = 1,
  perPage: number = 20
) => {
  try {
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
  } catch (err) {
    console.log("ANILIST ERROR:", err);
    throw err;
  }
};

export const getAnimeRecommendation = async (
  animeId: number,
  page: number = 1,
  perPage: number = 20
) => {
  try {
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
  } catch (err) {
    console.log("ANILIST ERROR:", err);
    throw err;
  }
};

export const getAnimeHoverDetails = async (animeId: number) => {
  try {
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
  } catch (err) {
    console.log("ANILIST ERROR:", err);
    throw err;
  }
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
    console.log("ANILIST ERROR:", err);
    throw err;
  }
};
