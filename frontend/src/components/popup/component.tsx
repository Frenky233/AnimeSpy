import { FC, PropsWithChildren, useEffect, useRef } from "react";
import styles from "./styles.module.scss";
import { createPortal } from "react-dom";
import clsx from "clsx";

type Props = PropsWithChildren<{
  variant: "Info" | "Error" | "Success";
  terminate?: () => void;
  withProgressBar: boolean;
  className?: string;
  time?: number;
  startTime?: number;
}>;

export const Popup: FC<Props> = ({
  children,
  variant,
  terminate,
  withProgressBar,
  className,
  time = 2000,
  startTime = 0,
}) => {
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (variant === "Info") return;

    const timer = setTimeout(terminate!, time - startTime + 200);

    if (!withProgressBar) return;

    const interval = startProgressBar(time, progressBarRef, startTime);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [children]);

  const startProgressBar = (
    initialTime: number,
    ref: React.RefObject<HTMLDivElement>,
    startTime: number = 0
  ) => {
    let timeLeft = initialTime - startTime;
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
      interval = window.setInterval(tick, 100);
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
