import { FC } from "react";
import styles from "./styles.module.scss";
import { LinkButton } from "../ui/linkButton/component";
import ReturnIcon from "@/assets/images/returnIcon.svg?react";
import { SearchBar } from "../searchBar/component";
import { SearchDropdown } from "../searchDropdown/component";
import { Button } from "../ui/button/component";
import { PackItem } from "@/db/db";

type Props = {
  searchQuery: string;
  onSearchQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  dropdownItems: PackItem[];
  onAddItem: (item: PackItem) => void;
  isLoading: boolean;
  onSubmit: () => Promise<void>;
};

export const PackEditHeader: FC<Props> = ({
  searchQuery,
  onSearchQueryChange,
  dropdownItems,
  onAddItem,
  isLoading,
  onSubmit,
}) => {
  return (
    <div className={styles.header}>
      <LinkButton to="/packs" variant="Primary" className={styles.headerReturn}>
        <ReturnIcon />
        <span>Назад</span>
      </LinkButton>
      <div className={styles.headerSearchBar}>
        <SearchBar
          value={searchQuery}
          onChange={onSearchQueryChange}
          placeholder="Поиск..."
        />
        {searchQuery && (
          <SearchDropdown
            items={dropdownItems}
            onAddItem={onAddItem}
            isLoading={isLoading}
          />
        )}
      </div>
      <Button variant="Push" className={styles.headerSave} onClick={onSubmit}>
        Сохранить
      </Button>
    </div>
  );
};
