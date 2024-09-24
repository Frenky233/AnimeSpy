import { FC } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";

type Props = {
  left: string;
  right: string;
  onChange: () => void;
  checked: boolean;
  className?: string;
};

export const Toggler: FC<Props> = ({
  left,
  right,
  onChange,
  checked,
  className,
}) => {
  return (
    <label className={clsx(styles.toggler, className)}>
      <input
        className={styles.togglerInput}
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <div className={styles.togglerState}>
        <span>{left}</span>
        <div className={styles.togglerControl}>
          <div className={styles.togglerCircle}></div>
        </div>
        <span>{right}</span>
      </div>
    </label>
  );
};
