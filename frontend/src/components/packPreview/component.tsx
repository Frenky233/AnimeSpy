import { FC } from "react";
import styles from "./styles.module.scss";
import { Link } from "react-router-dom";

type Props = {
  id: number;
  title: string;
  imagesPreview: string[];
};

export const PackPreview: FC<Props> = ({ id, title, imagesPreview }) => {
  return (
    <Link className={styles.packPreview} to={`/packs/${id}`}>
      <div className={styles.packPreviewImages}>
        {imagesPreview.map((image, index) => (
          <img src={image} key={index} alt="" />
        ))}
      </div>
      <h3 className={styles.packPreviewTitle}>{title}</h3>
    </Link>
  );
};
