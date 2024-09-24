import { FC } from "react";
import styles from "./styles.module.scss";
import { LinkButton } from "../ui/linkButton/component";
import ReturnIcon from "@/assets/images/returnIcon.svg?react";
import { SearchBar } from "../searchBar/component";
import { Button } from "../ui/button/component";

type Props = {
  searchQuery: string;
  onSearchQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  returnPath: string;
  onSubmit?: () => void;
};

export const PacksPageHeader: FC<Props> = ({
  searchQuery,
  onSearchQueryChange,
  returnPath,
  onSubmit,
}) => {
  return (
    <div className={styles.packsHeader}>
      <LinkButton
        to={returnPath}
        variant="Primary"
        className={styles.packsReturn}
      >
        <ReturnIcon />
        <span>Назад</span>
      </LinkButton>
      <SearchBar
        value={searchQuery}
        onChange={onSearchQueryChange}
        placeholder="Поиск..."
        className={styles.packsSearchBar}
      />
      {onSubmit ? (
        <Button
          onClick={onSubmit}
          variant="Push"
          className={styles.packsCreate}
        >
          Сохранить
        </Button>
      ) : (
        <LinkButton
          to="/packs/create"
          variant="Push"
          className={styles.packsCreate}
        >
          Создать
        </LinkButton>
      )}
    </div>
  );
};
