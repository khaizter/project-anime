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
};
// detailed Media type
