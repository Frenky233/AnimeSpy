import { FC } from "react";
import styles from "./styles.module.scss";
import { PlayerItem } from "../playerItem/component";

type Props = {
  players: {
    id: string;
    name: string;
    avatar?: string;
    isOnline: boolean;
  }[];
};

export const PlayersList: FC<Props> = ({ players }) => {
  return (
    <aside className={styles.players}>
      <h5 className={styles.playersTitle}>Игроки</h5>
      <ul className={styles.playersList}>
        {players.map((player) => (
          <li key={player.id}>
            <PlayerItem player={player} />
          </li>
        ))}
      </ul>
    </aside>
  );
};
