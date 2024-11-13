import { FC, ReactNode } from "react";
import styles from "./styles.module.scss";
import { PackPreviewLoading } from "../packPreview/loading";
import { Pack } from "@/db/db";
import { PackPreview } from "../packPreview/component";
import { Link } from "react-router-dom";

type Props = {
  isLoading: boolean;
  packs?: Pack[];
};

export const PacksPageBody: FC<Props> = ({ isLoading, packs }) => {
  return (
    <div className={styles.packsBody}>
      {isLoading ? (
        suspense()
      ) : packs?.length === 0 ? (
        <div className={styles.packsBodyEmpty}>Наборы не найдены</div>
      ) : (
        packs?.map((pack) => (
          <Link to={`/packs/${pack.id}`} key={pack.id!}>
            <PackPreview
              title={pack.name}
              imagesPreview={Object.entries(pack.items)
                .slice(0, 4)
                .map(([_id, { posterUrl }]) => posterUrl)}
            />
          </Link>
        ))
      )}
    </div>
  );
};

const suspense = () => {
  const arr: ReactNode[] = [];
  for (let i = 0; i < 5; i++) {
    arr.push(<PackPreviewLoading key={i} />);
  }
  return arr;
};
