import { useEffect, useState } from "react";

type Hook = (isGameInProgress: boolean) => {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useDropdown: Hook = (isGameInProgress) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!isGameInProgress) setIsOpen(false);
  }, [isGameInProgress]);

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    onOpen,
    onClose,
  };
};
