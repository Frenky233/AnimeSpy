import { useCallback, useReducer } from "react";

type State = {
  cardsForRound: number;
  minutesPerRound: number;
};

type Action = {
  type: "setCards" | "setMinutes";
  payload: number;
};

type Hook = (initialState: State) => {
  settings: {
    cardsForRound: number;
    minutesPerRound: number;
    onCardsAmountChange: (value: number) => void;
    onMinutesAmountChange: (value: number) => void;
  };
};

const reducer = (state: State, { type, payload }: Action): State => {
  switch (type) {
    case "setCards":
      return {
        ...state,
        cardsForRound: payload,
      };
    case "setMinutes":
      return {
        ...state,
        minutesPerRound: payload,
      };
    default:
      return state;
  }
};

export const useSettings: Hook = (initialState) => {
  const [settings, dispatch] = useReducer(reducer, initialState);

  const onCardsAmountChange = useCallback((value: number) => {
    dispatch({ type: "setCards", payload: value });
  }, []);

  const onMinutesAmountChange = useCallback((value: number) => {
    dispatch({ type: "setMinutes", payload: value });
  }, []);

  return {
    settings: {
      ...settings,
      onCardsAmountChange,
      onMinutesAmountChange,
    },
  };
};

export type Settings = State & {
  onCardsAmountChange: (value: number) => void;
  onMinutesAmountChange: (value: number) => void;
};
