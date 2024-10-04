import { FC } from "react";
import styles from "./styles.module.scss";
import { PackItem } from "@/db/db";
import LinkIcon from "@/assets/images/linkIcon.svg?react";

type Props = {
  item: PackItem;
};

export const PackItemInfo: FC<Props> = ({ item }) => {
  return (
    <div className={styles.info}>
      <img
        className={styles.infoImg}
        src={item.posterUrl}
        srcSet={item.poster2xUrl}
        alt="poster"
      />
      <div className={styles.infoList}>
        <div className={styles.infoTitle}>
          <h3>{item.name}</h3>
          <a className={styles.infoUrl} href={item.url} target="_blank">
            <LinkIcon />
            <span>Shikimori</span>
          </a>
        </div>
        {item.subInfo && (
          <>
            {Object.entries(item.subInfo).map(([key, data], index) => {
              return (
                <div key={index} className={styles.infoItem}>
                  <h6>{translate[key]}:</h6>
                  {typeof data === "string" ? (
                    <span>{data}</span>
                  ) : (
                    <ul>
                      {data.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

const translate: {
  [key: string]: string | string[] | undefined;
} = {
  kind: "Тип",
  status: "Статус",
  year: "Год",
  studios: "Студия",
  genres: "Жанры",
};
