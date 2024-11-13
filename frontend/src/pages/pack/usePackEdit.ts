import { db, Pack, PackItem } from "@/db/db";
import axios, { AxiosResponse } from "axios";
import { useCallback, useReducer, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

const INITIAL_STATE: Pack = {
  name: "",
  items: [],
  type: "anime",
};

type confirmMessageT = {
  show: boolean;
  message: string;
  onConfirm: (() => void) | null;
  onCancel: (() => void) | null;
  variant: ("Info" | "Error") | null;
  redirect?: string;
};

const confirmInitialState: confirmMessageT = {
  show: false,
  message: "",
  onConfirm: null,
  onCancel: null,
  variant: null,
};

type PopupT = {
  show: boolean;
  message: string;
  terminate: (() => void) | null;
  variant: ("Info" | "Error" | "Success") | null;
  time?: number;
};

const popupInitialState: PopupT = {
  show: false,
  message: "",
  terminate: null,
  variant: null,
};

type Hook = () => Pack & {
  searchItemsData: PackItem[];
  items: PackItem[];
  searchQuery: string;
  isLoading: boolean;
  onSearchQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTypeChange: () => void;
  onSubmit: () => Promise<void>;
  onAddItem: (item: PackItem) => void;
  onDeleteItem: (id: string) => void;
  onDelete: () => void;
  onCancel: () => void;
  message: confirmMessageT;
  popup: PopupT;
};

type State = typeof INITIAL_STATE;
type Action =
  | {
      type: "setName" | "deleteItem";
      payload: string;
    }
  | {
      type: "setType";
      payload: typeof INITIAL_STATE.type;
    }
  | { type: "addItem"; payload: PackItem }
  | { type: "setInit"; payload: Pack };

const reducer = (state: State, { type, payload }: Action): State => {
  switch (type) {
    case "setName":
      return {
        ...state,
        name: payload,
      };
    case "setType":
      return {
        ...state,
        type: payload,
        items: [],
      };
    case "addItem":
      return { ...state, items: [...state.items, payload] };
    case "deleteItem":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== payload),
      };
    case "setInit": {
      return {
        ...payload,
      };
    }
    default:
      return state;
  }
};

export const usePackEdit: Hook = () => {
  const packRaw = useLoaderData();

  const [searchItems, setSearchItemsData] = useState<Array<PackItem>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showMessage, setShowMessage] =
    useState<confirmMessageT>(confirmInitialState);
  const [showPopup, setShowPopup] = useState<PopupT>(popupInitialState);

  const [pack, dispatch] = useReducer(
    reducer,
    packRaw ? (packRaw as Pack) : INITIAL_STATE
  );

  const debounced = useDebouncedCallback(
    (value: string) => setSearchItems(value, pack.type),
    200
  );

  const onSearchQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
      setIsLoading(true);
      debounced(event.target.value);
    },
    [pack.type]
  );
  const onNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const name = event.target.value;
      if (name.length > 16) {
        setShowPopup({
          show: true,
          message: "Максимальная длина 16 символов",
          terminate: () => {
            setShowPopup(popupInitialState);
          },
          variant: "Error",
          time: 1000,
        });
        return;
      }

      dispatch({ type: "setName", payload: name });
    },
    []
  );
  const onTypeChange = useCallback(() => {
    if (pack.items.length === 0) {
      dispatch({
        type: "setType",
        payload: pack.type === "anime" ? "characters" : "anime",
      });
      setSearchQuery("");
      return;
    }

    setShowMessage({
      show: true,
      message: "Все карточки будут удалены",
      onConfirm: () => {
        dispatch({
          type: "setType",
          payload: pack.type === "anime" ? "characters" : "anime",
        });
        setSearchQuery("");
        setShowMessage(confirmInitialState);
      },
      onCancel: () => setShowMessage(confirmInitialState),
      variant: "Info",
    });
  }, [pack.type, pack.items.length]);

  const onAddItem = (item: PackItem) => {
    if (!pack.items.find(({ id }) => id === item.id))
      dispatch({ type: "addItem", payload: item });
    setSearchQuery("");
  };

  const onDeleteItem = useCallback((id: string) => {
    dispatch({ type: "deleteItem", payload: id });
  }, []);

  const onSubmit = async () => {
    if (!pack.name.trim() || pack.items.length < 30) {
      const messageAr: string[] = [];
      if (!pack.name.trim()) messageAr.push("Название не может быть пустым");
      if (pack.items.length < 30)
        messageAr.push("Минимальное количество карточек: 30");

      setShowPopup({
        show: true,
        message: messageAr.join("\n"),
        variant: "Error",
        terminate: () => {
          setShowPopup(popupInitialState);
        },
        time: 2500,
      });

      return;
    }

    setShowPopup({
      show: true,
      message: "Сохранено",
      variant: "Success",
      terminate: () => {
        setShowPopup(popupInitialState);
      },
      time: 1000,
    });

    await db.packs.put(pack);
  };

  const onCancel = () => {
    setShowMessage({
      show: true,
      message: "Все изменения будут удалены",
      onConfirm: () => {
        dispatch({
          type: "setInit",
          payload: packRaw ? (packRaw as Pack) : INITIAL_STATE,
        });
        setShowMessage(confirmInitialState);
      },
      onCancel: () => setShowMessage(confirmInitialState),
      variant: "Error",
    });
  };

  const onDelete = () => {
    setShowMessage({
      show: true,
      message: "Набор будет удалён",
      onConfirm: async () => {
        if (pack.id) await db.packs.where("id").equals(pack.id).delete();
        setShowMessage(confirmInitialState);
      },
      onCancel: () => setShowMessage(confirmInitialState),
      variant: "Error",
      redirect: "/packs",
    });
  };

  const setSearchItems = async (
    search: string,
    type: typeof INITIAL_STATE.type
  ) => {
    if (!search) return;

    const data = await getData(search, type);
    setIsLoading(false);
    setSearchItemsData(data);
  };

  return {
    ...pack,
    searchItemsData: searchItems,
    searchQuery,
    isLoading,
    onNameChange,
    onSearchQueryChange,
    onTypeChange,
    onSubmit,
    onAddItem,
    onDeleteItem,
    onDelete,
    onCancel,
    message: showMessage,
    popup: showPopup,
  };
};

const getData = async (search: string, type: typeof INITIAL_STATE.type) => {
  const data: AxiosResponse<PackItem[]> = await axios.get(
    `/api/search/${type}/${search}`
  );

  return data.data;
};
