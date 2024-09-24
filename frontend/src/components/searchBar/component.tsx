import { FC } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";
import SearchIcon from "@/assets/images/searchIcon.svg?react";
import { Input } from "../ui/input/component";

type Props = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
};

export const SearchBar: FC<Props> = ({
  value,
  onChange,
  placeholder,
  className,
}) => {
  return (
    <form className={clsx(styles.searchBar, className)}>
      <label className={styles.searchBarWrapper}>
        <Input
          className={styles.searchBarInput}
          id="searchQuery"
          value={value}
          type="text"
          onChange={onChange}
          placeholder={placeholder}
        />
        <div className={styles.searchBarLogo}>
          <SearchIcon />
        </div>
      </label>
    </form>
  );
};
