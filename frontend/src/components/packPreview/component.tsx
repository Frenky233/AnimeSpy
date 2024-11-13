import { FC } from "react";
import styles from "./styles.module.scss";

type Props = {
  title: string;
  imagesPreview: string[];
};

export const PackPreview: FC<Props> = ({ title, imagesPreview }) => {
  return (
    <div className={styles.packPreview}>
      <div className={styles.packPreviewImages}>
        {imagesPreview.map((image, index) => (
          <img src={image} key={index} alt="" />
        ))}
      </div>
      <h3 className={styles.packPreviewTitle}>{title}</h3>
    </div>
  );
};
