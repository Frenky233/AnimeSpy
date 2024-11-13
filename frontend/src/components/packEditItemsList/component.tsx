import { FC } from "react";
import styles from "./styles.module.scss";
import { PackEditItem } from "../packEditItem/component";
import { PackItem } from "@/db/db";
import clsx from "clsx";

type Props = {
  items: PackItem[];
  onDeleteItem?: (id: string) => void;
  className?: string;
};

export const PackEditItemsList: FC<Props> = ({
  items,
  onDeleteItem,
  className,
}) => {
  return (
    <div className={clsx(styles.list, className)}>
      {items.map((item) => (
        <PackEditItem item={item} key={item.id} onDeleteItem={onDeleteItem} />
      ))}
    </div>
  );
};
