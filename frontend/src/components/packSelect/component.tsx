import { FC } from "react";
import styles from "./styles.module.scss";
import { Pack } from "@/db/db";
import { PackPreview } from "../packPreview/component";

type Props = {
  packs: Pack[];
  onSelect: (pack: Pack) => void;
};

export const PackSelect: FC<Props> = ({ packs, onSelect }) => {
  return (
    <div className={styles.select}>
      <h3 className={styles.selectTitle}>Выбрать набор</h3>
      <div className={styles.selectPacks}>
        {packs.map((pack) => (
          <button
            className={styles.selectButton}
            onClick={() => onSelect(pack)}
            key={pack.id}
          >
            <PackPreview
              key={pack.id!}
              title={pack.name}
              imagesPreview={Object.entries(pack.items)
                .slice(0, 4)
                .map(([_id, { posterUrl }]) => posterUrl)}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
