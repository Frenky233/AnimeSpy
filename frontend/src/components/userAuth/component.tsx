import { ChangeEvent, FC, useState } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { UserAvatarIndex } from "../userAvatarIndex/component";
import { UserNameInput } from "../userNameInput/component";

type Props = {
  className?: string;
};

export const UserAuth: FC<Props> = ({ className }) => {
  const [user, setUser] = useState<string>("");

  return (
    <div className={clsx(styles.userAuth, className)}>
      <UserAvatarIndex iconChar={(user && user[0].toUpperCase()) || "M"} />
      <UserNameInput
        value={user}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setUser(event.target.value)
        }
      />
    </div>
  );
};
