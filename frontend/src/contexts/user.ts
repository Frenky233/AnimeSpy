import React from "react";

type UserContext = {
  name: string;
  avatarID: string;
};

type UserSetterContext = {
  setUserName: (name: string) => void;
  setUserAvatar: (avatarID: string) => void;
};

export const UserContext = React.createContext<UserContext>({
  name: "",
  avatarID: "",
});

export const UserSetterContext = React.createContext<UserSetterContext | null>(
  null
);
