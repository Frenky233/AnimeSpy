import { useCallback, useState } from "react";

type Hook = () => {
  setCode: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
};

export const useJoin: Hook = () => {
  const [value, setValue] = useState<string>("");

  const setCode = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 5) return;
    setValue(event.target.value);
  }, []);

  return {
    value,
    setCode,
  };
};
