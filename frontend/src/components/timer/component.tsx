import { FC } from "react";
import styles from "./styles.module.scss";
import { useTimer } from "./useTimer";
import clsx from "clsx";

type Props = {
  time: number;
  pause: boolean;
  isGameInProgress: boolean;
  setTime: (time: number) => void;
  isLoading: boolean;
};

export const Timer: FC<Props> = ({
  time,
  pause,
  isGameInProgress,
  setTime,
  isLoading,
}) => {
  const { minutes, seconds } = useTimer(time, pause, isGameInProgress, setTime);

  return (
    <div
      className={clsx(
        styles.timer,
        isGameInProgress && pause && styles.paused,
        isLoading && styles.loading
      )}
    >
      {minutes.toLocaleString("ru-RU", { minimumIntegerDigits: 2 })}
      {" : "}
      {seconds.toLocaleString("ru-RU", { minimumIntegerDigits: 2 })}
    </div>
  );
};
