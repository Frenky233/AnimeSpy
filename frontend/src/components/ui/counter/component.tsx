import { FC } from "react";
import styles from "./styles.module.scss";
import { Button } from "../button/component";
import ArrowIcon from "@/assets/images/dropdownIcon.svg?react";
import clsx from "clsx";

type Props = {
  value: number;
  onClick: (value: number) => void;
  min?: number;
  max?: number;
};

export const Counter: FC<Props> = ({ value, onClick, max, min }) => {
  return (
    <div className={styles.counter}>
      <Button
        disabled={value === min}
        onClick={() => value >= (min || -Infinity) && onClick(value - 1)}
        className={styles.counterButton}
        variant="Third"
      >
        <ArrowIcon />
      </Button>
      <span className={styles.counterValue}>{value}</span>
      <Button
        disabled={value === max}
        onClick={() => value <= (max || Infinity) && onClick(value + 1)}
        className={clsx(styles.counterButton, styles.counterUp)}
      >
        <ArrowIcon />
      </Button>
    </div>
  );
};
