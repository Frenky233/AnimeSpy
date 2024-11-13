import { FC } from "react";
import styles from "./styles.module.scss";
import { Button } from "../ui/button/component";
import PauseIcon from "@/assets/images/pauseIcon.svg?react";
import ResumeIcon from "@/assets/images/resumeIcon.svg?react";

type Props = {
  onSelectPack: () => Promise<void>;
  onGameStart: () => void;
  onGameAbort: () => void;
  onGamePause: () => void;
  onGameResume: () => void;
  isGameInProgress: boolean;
  isPaused: boolean;
};

export const AdminControls: FC<Props> = ({
  onSelectPack,
  onGameStart,
  onGameAbort,
  onGamePause,
  onGameResume,
  isGameInProgress,
  isPaused,
}) => {
  return (
    <div className={styles.adminControls}>
      <Button
        onClick={onSelectPack}
        className={styles.adminControlsButton}
        variant="Primary"
      >
        Выбрать набор
      </Button>
      <Button
        onClick={isGameInProgress ? onGameAbort : onGameStart}
        className={styles.adminControlsButton}
        variant="Primary"
      >
        {isGameInProgress ? "Отмена" : "Начать"}
      </Button>
      <Button
        onClick={isPaused ? onGameResume : onGamePause}
        className={[styles.adminControlsButton, styles.adminControlsPause]}
        variant="Primary"
        disabled={!isGameInProgress}
      >
        {isPaused ? <ResumeIcon /> : <PauseIcon />}
      </Button>
    </div>
  );
};
