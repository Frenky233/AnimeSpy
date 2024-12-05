import { FC } from "react";
import styles from "./styles.module.scss";
import { Pack } from "@/db/db";
import { PackEditItemsList } from "../packEditItemsList/component";
import SearchIcon from "@/assets/images/searchIcon.svg?react";
import { Button } from "../ui/button/component";
import { useSearch } from "./useSearch";
import { SearchBar } from "../searchBar/component";
import clsx from "clsx";
import { voteType } from "@/pages/game/hooks/useControls";

type Props = {
  pack: Pack | null;
  voting: boolean;
  onStartVote: (type: voteType, id: string) => void;
  isLoading: boolean;
};

export const GamePackItemsList: FC<Props> = ({
  pack,
  voting,
  onStartVote,
  isLoading,
}) => {
  const { query, onOpen, onClose, isVisible, onChange, items } = useSearch(
    pack?.items
  );

  return (
    <div
      className={clsx(
        styles.packs,
        voting && styles.packsVoting,
        isLoading && styles.loading
      )}
    >
      <h5 className={styles.packsTitle}>
        {isLoading ? (
          <>
            Текущий набор: <div className={styles.loadingTitle}></div>
          </>
        ) : (
          <>
            Текущий набор:{" "}
            {pack?.name ? (
              pack.name
            ) : (
              <em style={{ fontWeight: "300" }}>нет</em>
            )}
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
          </>
        )}
      </h5>
      {isLoading ? (
        <div className={styles.loadingCircle}></div>
      ) : (
        pack && (
          <PackEditItemsList
            items={items}
            className={styles.packsList}
            onStartVote={voting ? onStartVote : undefined}
          />
        )
      )}
    </div>
  );
};
