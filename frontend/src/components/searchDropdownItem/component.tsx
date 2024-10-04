import { FC } from "react";
import styles from "./styles.module.scss";
import { Button } from "../ui/button/component";
import Close from "@/assets/images/closeIcon.svg?react";
import { PackItem } from "@/db/db";
import LinkIcon from "@/assets/images/linkIcon.svg?react";

type Props = {
  item: PackItem;
  onAddItem: (item: PackItem) => void;
};

export const SearchDropdownItem: FC<Props> = ({ item, onAddItem }) => {
  return (
    <div className={styles.item}>
      <img src={item.posterUrl} alt="" className={styles.itemPreview} />
      <div className={styles.itemData}>
        <div className={styles.itemTitle}>
          <h4 className={styles.itemName} title={item.name}>
            {item.name}
          </h4>
          <a className={styles.itemUrl} href={item.url} target="_blank">
            <LinkIcon />
            <span>Shikimori</span>
          </a>
        </div>
        {item.subInfo && (
          <div className={styles.itemSubInfo}>
            <div className={styles.itemSubInfoData}>
              <span>Тип:</span>
              <span>{item.subInfo.kind}</span>
              <span>{`${item.subInfo.year} год`}</span>
              <span className={styles.itemSubInfoStatus}>
                {item.subInfo.status}
              </span>
              {item.subInfo.studios?.map((studio, index) => (
                <span key={index}>{studio}</span>
              ))}
            </div>
            <div className={styles.itemSubInfoGenres}>
              <span>Жанры:</span>
              {item.subInfo.genres?.map((genre, index) => (
                <span key={index}>{genre}</span>
              ))}
            </div>
          </div>
        )}
      </div>
      <Button
        onClick={() => {
          onAddItem(item);
        }}
        className={styles.itemButton}
        variant="Secondary"
      >
        <Close />
      </Button>
    </div>
  );
};
