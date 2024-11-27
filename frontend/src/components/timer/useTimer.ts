import { useEffect, useState } from "react";

type Hook = (
  initialTime: number,
  pause: boolean,
  isGameInProgress: boolean,
  setTimeLeft: (time: number) => void
) => {
  seconds: number;
  minutes: number;
};

export const useTimer: Hook = (
  initialTime,
  pause,
  isGameInProgress,
  setTimeLeft
) => {
  const [time, setTime] = useState<number>(initialTime);
  const [timer, setTimer] = useState<number>(0);

  useEffect(() => {
    if (isGameInProgress && !pause) {
      setTimer(startTimer());
    } else {
      clearInterval(timer);

      setTimer(time);

      setTimeLeft(time);
    }
  }, [pause, initialTime]);

  useEffect(() => {
    resetTimer();
  }, [isGameInProgress]);

  const startTimer = () => {
    let timeLeft = initialTime;
    let interval: number = Infinity;

    const tick = () => {
      timeLeft -= 1;
      if (timeLeft <= 0) {
        clearInterval(interval);
      }

      setTime(timeLeft);
    };

    const start = () => {
      interval = window.setInterval(tick, 1000);
    };

    start();

    return interval;
  };

  const resetTimer = () => {
    setTime(initialTime);
    setTimeLeft(initialTime);
    clearInterval(timer);
  };

  return {
    minutes: Math.floor(time / 60),
    seconds: Math.floor(time - Math.floor(time / 60) * 60),
  };
};
