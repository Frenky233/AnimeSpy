import { FC } from "react";
import styles from "./styles.module.scss";
import { PackEditSideInfo } from "../packEditSideInfo/component";
import { PackEditItemsList } from "../packEditItemsList/component";
import { PackItem } from "@/db/db";

type Props = {
  items: PackItem[];
  onDeleteItem: (id: string) => void;
  onDeletePack: () => void;
  onCancel: () => void;
};

export const PackEditBody: FC<Props> = ({
  items,
  onDeleteItem,
  onDeletePack,
  onCancel,
}) => {
  return (
    <div className={styles.body}>
      <PackEditItemsList items={items} onDeleteItem={onDeleteItem} />
      <PackEditSideInfo onDeletePack={onDeletePack} onCancel={onCancel} />
    </div>
  );
};
