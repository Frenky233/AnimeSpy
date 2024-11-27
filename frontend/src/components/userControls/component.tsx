import { FC } from "react";
import styles from "./styles.module.scss";
import { Button } from "../ui/button/component";
import { Timer } from "../timer/component";
import { GameCard } from "../gameCard/component";
import { PackItem } from "@/db/db";

type Props = {
  isSpy: boolean;
  card: PackItem | null;
  isPaused: boolean;
  isGameInProgress: boolean;
  time: number;
  setTime: (time: number) => void;
};

export const UserControls: FC<Props> = ({
  isSpy,
  card,
  isPaused,
  isGameInProgress,
  time,
  setTime,
}) => {
  return (
    <div className={styles.userControls}>
      <Timer
        pause={isPaused}
        isGameInProgress={isGameInProgress}
        time={time}
        setTime={setTime}
      />
      <Button
        className={styles.userControlsButton}
        variant="Primary"
        disabled={!isGameInProgress}
      >
        Голосование
      </Button>
      <GameCard isSpy={isSpy} card={card} isGameInProgress={isGameInProgress} />
    </div>
  );
};
