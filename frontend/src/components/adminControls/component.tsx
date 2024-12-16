import { FC, useEffect } from "react";
import styles from "./styles.module.scss";
import { Button } from "../ui/button/component";
import PauseIcon from "@/assets/images/pauseIcon.svg?react";
import ResumeIcon from "@/assets/images/resumeIcon.svg?react";
import { Counter } from "../ui/counter/component";
import { Settings } from "@/pages/game/hooks/useSettings";

type Props = {
  onSelectPack: () => Promise<void>;
  onGameStart: (cardsForRound: number, minutesPerRound: number) => void;
  onGameAbort: () => void;
  onGamePause: () => void;
  onGameResume: () => void;
  isGameInProgress: boolean;
  isPaused: boolean;
  isPackSet: boolean;
  settings: Settings & {
    cardsMax: number;
  };
};

export const AdminControls: FC<Props> = ({
  onSelectPack,
  onGameStart,
  onGameAbort,
  onGamePause,
  onGameResume,
  isGameInProgress,
  isPaused,
  isPackSet,
  settings,
}) => {
  useEffect(() => {
    settings.onCardsAmountChange(settings.cardsMax);
  }, [settings.cardsMax]);

  return (
    <div className={styles.adminControls}>
      <Button
        onClick={onSelectPack}
        className={styles.adminControlsButton}
        variant="Primary"
        disabled={isGameInProgress}
      >
        Выбрать набор
      </Button>
      <Button
        onClick={
          isGameInProgress
            ? onGameAbort
            : () =>
                onGameStart(settings.cardsForRound, settings.minutesPerRound)
        }
        className={styles.adminControlsButton}
        variant="Primary"
        disabled={!isPackSet}
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
      {!isGameInProgress && (
        <>
          <div className={styles.adminControlsSetting}>
            <span>
              Карт на <br></br> раунд:{" "}
            </span>
            <Counter
              value={settings.cardsForRound}
              onClick={settings.onCardsAmountChange}
              min={isPackSet ? 2 : 0}
              max={settings.cardsMax}
            />
          </div>
          <div className={styles.adminControlsSetting}>
            <span>
              Минут на <br></br> раунд:{" "}
            </span>
            <Counter
              value={settings.minutesPerRound}
              onClick={settings.onMinutesAmountChange}
              min={1}
              max={60}
            />
          </div>
        </>
      )}
    </div>
  );
};
