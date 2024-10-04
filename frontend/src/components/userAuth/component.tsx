import { ChangeEvent, FC, useContext, useState } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { UserAvatarIndex } from "../userAvatarIndex/component";
import { UserNameInput } from "../userNameInput/component";
import { UserContext, UserSetterContext } from "@/contexts/user";
import { Popup } from "../popup/component";

type Props = {
  className?: string;
};

export const UserAuth: FC<Props> = ({ className }) => {
  const { name, avatarID } = useContext(UserContext);
  const { setUserName } = useContext(UserSetterContext)!;
  const [showPopup, setShowPopup] = useState<boolean>(false);

  return (
    <div className={clsx(styles.userAuth, className)}>
      <UserAvatarIndex
        iconChar={(name && name[0].toUpperCase()) || "M"}
        iconURL={avatarID ? `https://i.imgur.com/${avatarID}.png` : undefined}
      />
      <UserNameInput
        value={name}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const name = event.target.value;
          if (name.length > 16) {
            setShowPopup(true);
            return;
          }

          setUserName(event.target.value);
        }}
      />
      {showPopup && (
        <Popup
          terminate={() => setShowPopup(false)}
          withProgressBar={true}
          variant="Error"
          time={2000}
        >
          Минимальная длина 16 символов
        </Popup>
      )}
    </div>
  );
};
