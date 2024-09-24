import Dexie, { Table } from "dexie";

export type PackItems = Record<
  string,
  { name: string; url: string; posterUrl: string }
>;

export type Pack = {
  id?: number;
  type: "Anime" | "Characters";
  name: string;
  items: PackItems;
};

export const db = new Dexie("AnimeSpyDatabase") as Dexie & {
  packs: Table<Pack, "id">;
};

db.version(1).stores({
  packs: "++id, name, type, items",
});
