import { FC } from "react";
import styles from "./styles.module.scss";
import { Pack } from "@/db/db";
import { PackEditItemsList } from "../packEditItemsList/component";

type Props = {
  pack: Pack | null;
};

export const GamePackItemsList: FC<Props> = ({ pack }) => {
  return (
    <div className={styles.packs}>
      <h5 className={styles.packsTitle}>
        Текущий набор:
        {pack?.name ? (
          pack.name
        ) : (
          <span style={{ fontWeight: "300" }}>нет</span>
        )}
      </h5>
      {pack && (
        <PackEditItemsList items={pack.items} className={styles.packsList} />
      )}
    </div>
  );
};
