import { FC } from "react";
import styles from "./styles.module.scss";
import { PackEditItem } from "../packEditItem/component";
import { PackItem } from "@/db/db";

type Props = {
  items: PackItem[];
  onDeleteItem: (id: string) => void;
};

export const PackEditItemsList: FC<Props> = ({ items, onDeleteItem }) => {
  return (
    <div className={styles.list}>
      {items.map((item) => (
        <PackEditItem item={item} key={item.id} onDeleteItem={onDeleteItem} />
      ))}
    </div>
  );
};
