import { FC } from "react";
import styles from "./styles.module.scss";
import { PackEditItem } from "../packEditItem/component";
import { PackItem } from "@/db/db";
import clsx from "clsx";
import { voteType } from "@/pages/game/hooks/useControls";

type Props = {
  items: PackItem[];
  onDeleteItem?: (id: string) => void;
  className?: string;
  onStartVote?: (type: voteType, id: string) => void;
};

export const PackEditItemsList: FC<Props> = ({
  items,
  onDeleteItem,
  className,
  onStartVote,
}) => {
  return (
    <div className={clsx(styles.list, className)}>
      {items.map((item) => (
        <PackEditItem
          item={item}
          key={item.id}
          onDeleteItem={onDeleteItem}
          onStartVote={onStartVote}
        />
      ))}
    </div>
  );
};
