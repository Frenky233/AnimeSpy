import { FC, PropsWithChildren, useEffect, useRef } from "react";
import styles from "./styles.module.scss";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { RefObject } from "hono/jsx";

type Props = PropsWithChildren<{
  variant: "Info" | "Error" | "Success";
  terminate: () => void;
  withProgressBar: boolean;
  className?: string;
  time?: number;
}>;

export const Popup: FC<Props> = ({
  children,
  variant,
  terminate,
  withProgressBar,
  className,
  time = 2000,
}) => {
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!withProgressBar) return;

    const interval = startProgressBar(time, progressBarRef);
    const timer = setTimeout(terminate, time + 200);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const startProgressBar = (
    initialTime: number,
    ref: RefObject<HTMLDivElement>
  ) => {
    let timeLeft = initialTime;
    let interval: number = Infinity;

    const render = () => {
      const percentage = (1 - timeLeft / initialTime) * 100;

      ref.current!.style.width = percentage + "%";
    };

    const tick = () => {
      timeLeft -= 100;
      if (timeLeft <= 0) {
        clearInterval(interval);
      }

      render();
    };

    const start = () => {
      interval = setInterval(tick, 100);
      render();
    };

    start();

    return interval;
  };

  return createPortal(
    <div className={clsx(styles.popup, className, styles[`variant${variant}`])}>
      {withProgressBar && (
        <div className={styles.popupWrapper}>
          <div ref={progressBarRef} className={styles.popupProgressBar} />
        </div>
      )}
      <div className={styles.popupMessage}>{children}</div>
    </div>,
    document.body
  );
};
