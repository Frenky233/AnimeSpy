import { FC } from "react";
import styles from "./styles.module.scss";
import { UserAvatar } from "../userAvatar/component";
import clsx from "clsx";
import { voteType } from "@/pages/game/hooks/useControls";
import { User } from "@/pages/game/hooks/useGame";

type Props = {
  player: User;
  voting?: boolean;
  onStartVote?: ((type: voteType, id: string) => void) | null;
  className?: string;
};

export const PlayerItem: FC<Props> = ({
  player,
  className,
  voting,
  onStartVote,
}) => {
  return (
    <div
      className={clsx(
        styles.player,
        (!player.isOnline || player.isObserver) && styles.offline,
        player.isVoted !== null &&
          (player.isVoted ? styles.playerVotedYes : styles.playerVotedNo),
        className
      )}
      onClick={
        voting
          ? () => {
              onStartVote && onStartVote("Player", player.id);
            }
          : undefined
      }
    >
      <UserAvatar
        iconURL={player.avatar !== "null" ? player.avatar : undefined}
        iconChar={player.name.charAt(0)}
        className={styles.playerAvatar}
      />
      <div className={styles.playerName} title={player.name}>
        {player.name}
      </div>
      <span className={styles.playerScore} title="Score">
        {player.score}
      </span>
    </div>
  );
};
