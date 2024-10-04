import type { kindRus, statusRus } from "./search";

type AnimeItem = {
  id: string;
  russian: string;
  kind: keyof typeof kindRus;
  genres: { russian: string }[];
  url: string;
  poster: {
    mainUrl: string;
    main2xUrl: string;
  };
  airedOn: {
    year: number;
  };
  status: keyof typeof statusRus;
  studios: {
    name: string;
  }[];
};

type CharacterItem = {
  id: string;
  russian: string;
  url: string;
  poster: {
    mainUrl: string;
    main2xUrl: string;
  };
};

export type AnimeResponse = {
  animes: AnimeItem[];
};

export type CharacterResponse = {
  characters: CharacterItem[];
};

export type Response = {
  data: AnimeResponse | CharacterResponse;
};
