import { FC } from "react";
import styles from "./styles.module.scss";
import { LinkButton } from "../ui/linkButton/component";
import ReturnIcon from "@/assets/images/returnIcon.svg?react";
import { SearchBar } from "../searchBar/component";

type Props = {
  searchQuery: string;
  onSearchQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const PacksPageHeader: FC<Props> = ({
  searchQuery,
  onSearchQueryChange,
}) => {
  return (
    <div className={styles.packsHeader}>
      <LinkButton to="/" variant="Primary" className={styles.packsReturn}>
        <ReturnIcon />
        <span>Назад</span>
      </LinkButton>
      <SearchBar
        value={searchQuery}
        onChange={onSearchQueryChange}
        placeholder="Поиск..."
        className={styles.packsSearchBar}
      />
      <LinkButton
        to="/packs/create"
        variant="Push"
        className={styles.packsCreate}
      >
        Создать
      </LinkButton>
    </div>
  );
};
