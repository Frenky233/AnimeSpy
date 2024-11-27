import { PackItem } from "@/db/db";
import { useEffect, useState } from "react";

type Hook = (initialItems?: PackItem[]) => {
  isVisible: boolean;
  onOpen: () => void;
  onClose: () => void;
  query: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  items: PackItem[];
};

export const useSearch: Hook = (initialItems) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [items, setItems] = useState<PackItem[]>(initialItems || []);

  useEffect(() => {
    if (!initialItems) return;

    setItems(initialItems);
  }, [initialItems?.length]);

  const onOpen = () => {
    setIsVisible(true);
  };

  const onClose = () => {
    setIsVisible(false);
    setItems(initialItems!);
    setQuery("");
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);

    if (event.target.value.length > 0)
      setItems(
        items.filter(({ name }) =>
          name.toLocaleLowerCase().includes(event.target.value.toLowerCase())
        )
      );
    else {
      setItems(initialItems!);
    }
  };

  return {
    isVisible,
    onOpen,
    onClose,
    query,
    onChange,
    items,
  };
};
