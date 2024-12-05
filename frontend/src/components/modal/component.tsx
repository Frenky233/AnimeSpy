import { FC, PropsWithChildren, useEffect } from "react";
import styles from "./styles.module.scss";
import Close from "@/assets/images/closeIcon.svg?react";
import { Button } from "../ui/button/component";
import { createPortal } from "react-dom";
import clsx from "clsx";

type Props = PropsWithChildren<{
  onClose?: () => void;
  className?: string;
}>;

export const Modal: FC<Props> = ({ children, onClose, className }) => {
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

  return createPortal(
    <div className={styles.backdrop}>
      <div className={clsx(styles.modal, className)}>
        {onClose && (
          <Button onClick={onClose} className={styles.modalExit}>
            <Close />
          </Button>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
};
