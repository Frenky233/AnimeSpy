import { FC, ReactNode } from "react";
import styles from "./styles.module.scss";
import { PlayerItem } from "../playerItem/component";
import clsx from "clsx";
import { voteType } from "@/pages/game/hooks/useControls";
import { User } from "@/pages/game/hooks/useGame";

type Props = {
  players: User[];
  voting: boolean;
  onStartVote: (type: voteType, id: string) => void;
  isLoading: boolean;
  userId?: string;
};

export const PlayersList: FC<Props> = ({
  players,
  voting,
  onStartVote,
  userId,
  isLoading,
}) => {
  return (
    <aside className={clsx(styles.players, voting && styles.playersVoting)}>
      <h5 className={styles.playersTitle}>Игроки</h5>
      <ul className={styles.playersList}>
        {isLoading ? (
          <Suspense />
        ) : (
          players.map((player) => (
            <li key={player.id}>
              <PlayerItem
                player={player}
                className={clsx(
                  styles.playersItem,
                  (player.id === userId || player.isObserver) &&
                    styles.playersNoVote
                )}
                voting={voting}
                onStartVote={player.id !== userId ? onStartVote : null}
              />
            </li>
          ))
        )}
      </ul>
    </aside>
  );
};

const Suspense = () => {
  const arr: ReactNode[] = [];
  for (let i = 0; i < 3; i++) {
    arr.push(
      <div className={styles.loading} key={i}>
        <div
          className={clsx(styles.loadingAvatar, styles.loadingAnimation)}
        ></div>
        <div
          className={clsx(styles.loadingName, styles.loadingAnimation)}
        ></div>
      </div>
    );
  }
  return arr;
};
