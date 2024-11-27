import { RefObject, useCallback, useEffect, useRef, useState } from "react";

type Hook = () => {
  setCode: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  linkRef: RefObject<HTMLAnchorElement>;
};

export const useJoin: Hook = () => {
  const [value, setValue] = useState<string>("");
  const linkRef = useRef<HTMLAnchorElement>(null);

  const setCode = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 5) return;
    setValue(event.target.value);
  }, []);

  useEffect(() => {
    const onEnterDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter") return;
      if (!linkRef.current) return;

      linkRef.current.click();
    };

    document.addEventListener("keydown", onEnterDown);

    return () => {
      document.removeEventListener("keydown", onEnterDown);
    };
  }, []);

  return {
    value,
    setCode,
    linkRef,
  };
};
