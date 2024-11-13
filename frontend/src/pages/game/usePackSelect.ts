import { db, Pack } from "@/db/db";
import { useState } from "react";

type Hook = () => {
  onOpenSelect: () => Promise<void>;
  onCloseSelect: () => void;
  showSelect: boolean;
  packs: Pack[];
};

export const usePackSelect: Hook = () => {
  const [showSelect, setShowSelect] = useState<boolean>(false);
  const [packs, setPacks] = useState<Pack[]>([]);

  const onOpenSelect = async () => {
    const packs = await db.packs.toArray();
    setPacks(packs);

    setShowSelect(true);
  };

  const onCloseSelect = () => {
    setShowSelect(false);
  };

  return { showSelect, onOpenSelect, onCloseSelect, packs };
};
