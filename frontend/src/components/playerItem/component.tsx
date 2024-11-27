import { FC } from "react";
import styles from "./styles.module.scss";
import { UserAvatar } from "../userAvatar/component";
import clsx from "clsx";

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
    <div className={clsx(styles.player, !player.isOnline && styles.offline)}>
      <UserAvatar
        iconURL={player.avatar !== "null" ? player.avatar : undefined}
        iconChar={player.name.charAt(0)}
        className={styles.playerAvatar}
      />
      <div className={styles.playerName} title={player.name}>
        {player.name}
      </div>
    </div>
  );
};
