import { FC, PropsWithChildren } from "react";
import styles from "./styles.module.scss";
import Close from "@/assets/images/closeIcon.svg?react";
import { Button } from "../ui/button/component";
import { createPortal } from "react-dom";

type Props = PropsWithChildren<{
  onClose: () => void;
}>;

export const Modal: FC<Props> = ({ children, onClose }) => {
  return createPortal(
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.modalTitle}>
          <Button onClick={onClose} className={styles.modalExit}>
            <Close />
          </Button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
};
