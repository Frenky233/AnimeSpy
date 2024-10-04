import { FC, PropsWithChildren } from "react";
import styles from "./styles.module.scss";
import { Button } from "../ui/button/component";
import clsx from "clsx";
import { Link } from "react-router-dom";

type Props = PropsWithChildren<{
  onConfirm: () => void;
  onCancel: () => void;
  variant: "Info" | "Error";
  redirect?: string;
}>;

export const ConfirmPopup: FC<Props> = ({
  children,
  onConfirm,
  onCancel,
  variant,
  redirect,
}) => {
  return (
    <div className={clsx(styles.popup, styles[`variant${variant}`])}>
      <h5 className={styles.popupTitle}>Внимание</h5>
      <div className={styles.popupMessage}>{children}</div>
      <div className={styles.popupButtons}>
        {redirect ? (
          <Link to={redirect}>
            <Button onClick={onConfirm} variant="Push">
              Да
            </Button>
          </Link>
        ) : (
          <Button onClick={onConfirm} variant="Push">
            Да
          </Button>
        )}
        <Button onClick={onCancel} variant="Push">
          Нет
        </Button>
      </div>
    </div>
  );
};
