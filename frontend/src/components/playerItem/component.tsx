import { FC } from "react";
import styles from "./styles.module.scss";
import { UserAvatar } from "../userAvatar/component";

type Props = {
  player: {
    id: string;
    name: string;
    isOnline: boolean;
    avatar?: string;
  };
};

export const PlayerItem: FC<Props> = ({ player }) => {
  return (
    <div className={styles.player}>
      <UserAvatar
        iconURL={player.avatar !== "null" ? player.avatar : undefined}
        iconChar={player.name.charAt(0)}
        className={styles.playerAvatar}
      />
      <div className={styles.playerName}>{player.name}</div>
    </div>
  );
};
