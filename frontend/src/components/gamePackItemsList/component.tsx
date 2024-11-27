import { FC } from "react";
import styles from "./styles.module.scss";
import { Pack } from "@/db/db";
import { PackEditItemsList } from "../packEditItemsList/component";
import SearchIcon from "@/assets/images/searchIcon.svg?react";
import { Button } from "../ui/button/component";
import { useSearch } from "./useSearch";
import { SearchBar } from "../searchBar/component";

type Props = {
  pack: Pack | null;
};

export const GamePackItemsList: FC<Props> = ({ pack }) => {
  const { query, onOpen, onClose, isVisible, onChange, items } = useSearch(
    pack?.items
  );

  return (
    <div className={styles.packs}>
      <h5 className={styles.packsTitle}>
        Текущий набор:{" "}
        {pack?.name ? pack.name : <em style={{ fontWeight: "300" }}>нет</em>}
        {pack && (
          <>
            <Button
              className={styles.packsSearchButton}
              onClick={isVisible ? onClose : onOpen}
            >
              <SearchIcon />
            </Button>
            {isVisible && (
              <SearchBar
                value={query}
                onChange={onChange}
                className={styles.packsSearchBar}
                placeholder="Поиск..."
              />
            )}
          </>
        )}
      </h5>
      {pack && <PackEditItemsList items={items} className={styles.packsList} />}
    </div>
  );
};
