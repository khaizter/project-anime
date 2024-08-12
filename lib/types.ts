export type FilterType = {
  keyword?: string | null;
  genres?: Array<string> | null;
};

// media type
export type AnimeType = {
  id: number;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  description: string;
  coverImage: {
    extraLarge?: string;
    large?: string;
    medium?: string;
    color?: string;
  };
  bannerImage: string;
  escription: string;
  nativeTitle?: string;
  synonyms?: Array<string>;
  startDate: { year: number; month: number; day: number };
  status: string;
  genres: Array<string>;
  trailer: {
    id: string;
    site: string;
    thumbnail: string;
  };
  studios: {
    edges: Array<{
      node: {
        id: string;
        name: string;
      };
      isMain: boolean;
    }>;
  };
  streamingEpisodes: Array<{
    title: string;
    thumbnail: string;
    url: string;
    site: string;
  }>;
  episodes: number;
  season: string;
  seasonYear: number;
  recommendations: {
    nodes: Array<{
      mediaRecommendation: {
        id: number;
        title: {
          romaji: string;
        };
        coverImage: {
          large: string;
        };
      };
    }>;
    pageInfo: {
      currentPage: number;
      hasNextPage: number;
      lastPage: number;
      perPage: number;
      total: number;
    };
  };
  characters: {
    edges: Array<{
      id: number;
      node: {
        id: number;
        name: {
          full: string;
        };
        image: {
          medium: string;
        };
      };
      role: string;
      voiceActors: Array<{
        id: number;
        name: {
          full: string;
        };
        languageV2: string;
        image: {
          medium: string;
        };
      }>;
    }>;
    pageInfo: {
      currentPage: number;
      hasNextPage: number;
      lastPage: number;
      perPage: number;
      total: number;
    };
  };
  staff: {
    edges: Array<{
      id: number;
      node: {
        id: number;
        name: {
          full: string;
        };
        image: {
          medium: string;
        };
      };
      role: string;
    }>;
    pageInfo: {
      currentPage: number;
      hasNextPage: number;
      lastPage: number;
      perPage: number;
      total: number;
    };
  };
};
// detailed Media type

export type SortType = "popular" | "trending" | "alltimepopular" | "upcoming";
