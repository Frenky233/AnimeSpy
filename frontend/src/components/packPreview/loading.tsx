import { FC } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";

export const PackPreviewLoading: FC = ({}) => {
  return (
    <div className={clsx(styles.packPreview, styles.loading)}>
      <div className={styles.packPreviewImages}></div>
      <h3 className={styles.packPreviewTitle}></h3>
    </div>
  );
};
