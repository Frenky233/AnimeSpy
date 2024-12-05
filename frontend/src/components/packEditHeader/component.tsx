import { FC } from "react";
import styles from "./styles.module.scss";
import { LinkButton } from "../ui/linkButton/component";
import ReturnIcon from "@/assets/images/returnIcon.svg?react";
import { SearchBar } from "../searchBar/component";
import { SearchDropdown } from "../searchDropdown/component";
import { PackItem } from "@/db/db";
import clsx from "clsx";

type Props = {
  searchQuery: string;
  onSearchQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  dropdownItems: PackItem[];
  onAddItem: (item: PackItem) => void;
  isLoading: boolean;
  className?: string;
};

export const PackEditHeader: FC<Props> = ({
  searchQuery,
  onSearchQueryChange,
  dropdownItems,
  onAddItem,
  isLoading,
  className,
}) => {
  return (
    <div className={clsx(styles.header, className)}>
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
    </div>
  );
};
