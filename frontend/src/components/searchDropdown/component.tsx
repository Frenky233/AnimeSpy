import { FC } from "react";
import styles from "./styles.module.scss";
import { SearchDropdownItem } from "../searchDropdownItem/component";
import { SearchDropdownItemLoading } from "../searchDropdownItem/loading";
import { PackItem } from "@/db/db";

type Props = {
  items: PackItem[];
  onAddItem: (item: PackItem) => void;
  isLoading: boolean;
};

export const SearchDropdown: FC<Props> = ({ items, onAddItem, isLoading }) => {
  return (
    <div className={styles.searchDropdown}>
      {isLoading ? (
        <>
          <SearchDropdownItemLoading />
          <SearchDropdownItemLoading />
          <SearchDropdownItemLoading />
        </>
      ) : (
        items.map((item) => (
          <SearchDropdownItem item={item} onAddItem={onAddItem} key={item.id} />
        ))
      )}
    </div>
  );
};
