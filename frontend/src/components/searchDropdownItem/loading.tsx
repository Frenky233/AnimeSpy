import { FC } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";

export const SearchDropdownItemLoading: FC = ({}) => {
  return (
    <div className={clsx(styles.item, styles.loading)}>
      <div className={styles.itemPreview}></div>
      <div className={styles.loadingData}></div>
    </div>
  );
};
