import { FC } from "react";
import styles from "./styles.module.scss";
import { Button } from "../ui/button/component";
import { Timer } from "../timer/component";
import { GameCard } from "../gameCard/component";
import { PackItem } from "@/db/db";
import { voteType } from "@/pages/game/hooks/useControls";

type Props = {
  isSpy: boolean;
  card: PackItem | null;
  isPaused: boolean;
  isGameInProgress: boolean;
  time: number;
  setTime: (time: number) => void;
  onStartVoting: (type: voteType) => void;
  isVoting: boolean;
  isLoading: boolean;
};

export const UserControls: FC<Props> = ({
  isSpy,
  card,
  isPaused,
  isGameInProgress,
  time,
  setTime,
  onStartVoting,
  isVoting,
  isLoading,
}) => {
  return (
    <div className={styles.userControls}>
      <Timer
        pause={isPaused}
        isGameInProgress={isGameInProgress}
        time={time}
        setTime={setTime}
        isLoading={isLoading}
      />
      <Button
        className={styles.userControlsButton}
        variant="Primary"
        disabled={!isGameInProgress || isVoting || (!isSpy && !card)}
        onClick={() => onStartVoting("Player")}
      >
        Голосование
      </Button>
      <GameCard
        isSpy={isSpy}
        card={card}
        isGameInProgress={isGameInProgress}
        onStartVoting={onStartVoting}
      />
    </div>
  );
};
