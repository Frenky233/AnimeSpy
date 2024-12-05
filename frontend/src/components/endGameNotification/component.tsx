import { FC, useEffect } from "react";
import styles from "./styles.module.scss";
import { User } from "@/pages/game/hooks/useGame";
import { PackItem } from "@/db/db";
import clsx from "clsx";
import { PackEditItem } from "../packEditItem/component";
import { Button } from "../ui/button/component";
import Close from "@/assets/images/closeIcon.svg?react";
import { PlayerItem } from "../playerItem/component";

type Props = {
  notification: {
    isSpyWon: boolean;
    spy: User;
    card: PackItem;
  };
  onClose: () => void;
  className?: string;
};

export const EndGameNotification: FC<Props> = ({
  notification,
  onClose,
  className,
}) => {
  useEffect(() => {
    const onEscapePress = (event: KeyboardEvent) => {
      if (event.key === "Escape" && onClose) {
        onClose();
      }
    };

    document.addEventListener("keydown", onEscapePress);

    return () => {
      document.removeEventListener("keydown", onEscapePress);
    };
  }, [onClose]);

  return (
    <div
      className={clsx(
        styles.notification,
        className,
        notification.isSpyWon
          ? styles.notificationSpyWon
          : styles.notificationSpyLost
      )}
    >
      <h4 className={styles.notificationTitle}>
        {notification.isSpyWon ? "Победа шпиона!" : "Победа нешпионов!"}
        <Button onClick={onClose} className={styles.notificationClose}>
          <Close />
        </Button>
      </h4>
      <div className={styles.notificationData}>
        <div>
          <span>Шпионом был(a): </span>
          <PlayerItem player={{ ...notification.spy, isVoted: null }} />
        </div>
        <div>
          <span>Загаданная карта: </span>
          <PackEditItem item={notification.card} />
        </div>
      </div>
    </div>
  );
};
