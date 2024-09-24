import { ChangeEvent, FC, useContext } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { UserAvatarIndex } from "../userAvatarIndex/component";
import { UserNameInput } from "../userNameInput/component";
import { UserContext, UserSetterContext } from "@/contexts/user";

type Props = {
  className?: string;
};

export const UserAuth: FC<Props> = ({ className }) => {
  const { name, avatarID } = useContext(UserContext);
  const { setUserName } = useContext(UserSetterContext)!;

  return (
    <div className={clsx(styles.userAuth, className)}>
      <UserAvatarIndex
        iconChar={(name && name[0].toUpperCase()) || "M"}
        iconURL={avatarID ? `https://i.imgur.com/${avatarID}.png` : undefined}
      />
      <UserNameInput
        value={name}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setUserName(event.target.value)
        }
      />
    </div>
  );
};
