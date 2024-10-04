import { Hono } from "hono";
import type { AnimeResponse, CharacterResponse, Response } from "./type";

export const statusRus = {
  anons: "Анонс",
  ongoing: "Онгониг",
  released: "Вышло",
};

export const kindRus = {
  tv: "TV Сериал",
  movie: "Фильм",
  ova: "OVA",
  ona: "ONA",
  special: "Спецвыпуск",
  tv_special: "TV Спецвыпуск",
  music: "Клип",
  pv: "Реклама",
  cm: "Проморолик",
};

const searchRoute = new Hono().get("/:type/:query", async (c) => {
  const { type, query } = c.req.param();

  const headers = new Headers();
  headers.append("User-Agent", Bun.env.SHIKIMORI_CLIENT_ID!);
  headers.append("Content-Type", "application/json");

  const response = await fetch(Bun.env.SHIKIMORI_API_URL!, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      query: type === "anime" ? animeQuery : characterQuery,
      variables: {
        search: query,
      },
    }),
  });
  const dataRaw: Response = await response.json();
  const data = parseData(dataRaw, type as "anime" | "characters");

  return c.json(data);
});

export default searchRoute;

const animeQuery = `query($search: String!){
        animes(search: $search, limit: 3) {
            id
            russian
            status
            airedOn { year }
            url
            poster { mainUrl main2xUrl}
            kind
            genres { russian }
            studios { name }
        }
    }`;

const characterQuery = `
    query($search: String!){
        characters(page: 1, limit: 3, search: $search) {
            id
            russian
            url
            poster { mainUrl main2xUrl}
        }
    }`;

const parseData = (data: Response, type: "anime" | "characters") => {
  const result =
    type === "anime"
      ? (data.data as AnimeResponse).animes.map((anime) => ({
          id: anime.id,
          name: anime.russian,
          url: anime.url,
          posterUrl: anime.poster.mainUrl,
          poster2xUrl: anime.poster.main2xUrl,
          year: String(anime.airedOn.year) || null,
          subInfo: {
            kind: kindRus[anime.kind],
            status: statusRus[anime.status],
            genres: anime.genres?.map(({ russian }) => russian) || null,
            studios: anime.studios.map(({ name }) => name),
          },
        }))
      : (data.data as CharacterResponse).characters.map((character) => ({
          id: character.id,
          name: character.russian,
          url: character.url,
          posterUrl: character.poster.mainUrl,
          poster2xUrl: character.poster.main2xUrl,
        }));
  return result;
};
