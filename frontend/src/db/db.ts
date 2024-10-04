import Dexie, { Table } from "dexie";

export type PackItem = {
  id: string;
  name: string;
  url: string;
  posterUrl: string;
  poster2xUrl: string;
  subInfo?: {
    kind?: string;
    status?: string;
    genres?: string[];
    year?: string;
    studios?: string[];
  };
};

export type Pack = {
  id?: number;
  type: "anime" | "characters";
  name: string;
  items: PackItem[];
};

export const db = new Dexie("AnimeSpyDatabase") as Dexie & {
  packs: Table<Pack, "id">;
};

db.version(1).stores({
  packs: "++id, name, type, items",
});
