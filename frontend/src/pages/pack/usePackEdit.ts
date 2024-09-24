import { db, Pack } from "@/db/db";
import { useCallback, useReducer } from "react";
import { useLoaderData } from "react-router-dom";

type EditPack = Pack & { searchQuery?: string };

const INITIAL_STATE: EditPack = {
  name: "",
  items: {},
  type: "Anime",
  searchQuery: "",
};

type ItemDataRaw = {
  id: string;
  name: string;
  url: string;
  posterUrl: string;
};

type Hook = () => Pack & {
  searchQuery: string;
  onSearchQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTypeChange: () => void;
  onSubmit: () => Promise<void>;
};

type State = typeof INITIAL_STATE;
type Action =
  | {
      type: "setName" | "setSearchQuery";
      payload: string;
    }
  | {
      type: "setType";
      payload: typeof INITIAL_STATE.type;
    }
  | { type: "addItem" | "deleteItem"; payload: ItemDataRaw };

const reducer = (state: State, { type, payload }: Action): State => {
  switch (type) {
    case "setName":
      return {
        ...state,
        name: payload,
      };
    case "setSearchQuery":
      return {
        ...state,
        searchQuery: payload,
      };
    case "setType":
      return {
        ...state,
        type: payload,
      };
    case "addItem":
      state.items[payload.id] = {
        name: payload.name,
        url: payload.url,
        posterUrl: payload.posterUrl,
      };
      return state;
    case "deleteItem":
      delete state.items[payload.id];
      return state;
    default:
      return state;
  }
};

export const usePackEdit: Hook = () => {
  const packRaw = useLoaderData();

  const [pack, dispatch] = useReducer(
    reducer,
    packRaw ? { ...(packRaw as Pack), searchQuery: "" } : INITIAL_STATE
  );

  const onSearchQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({ type: "setSearchQuery", payload: event.target.value });
    },
    []
  );
  const onNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({ type: "setName", payload: event.target.value });
    },
    []
  );
  const onTypeChange = useCallback(() => {
    dispatch({
      type: "setType",
      payload: pack.type === "Anime" ? "Characters" : "Anime",
    });
  }, [pack.type]);

  const onSubmit = async () => {
    const savePack = { ...pack };
    delete savePack["searchQuery"];
    await db.packs.put(savePack);
  };
  return {
    ...pack,
    searchQuery: pack.searchQuery!,
    onNameChange,
    onSearchQueryChange,
    onTypeChange,
    onSubmit,
  };
};
