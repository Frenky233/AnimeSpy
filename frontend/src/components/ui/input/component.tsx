import { ChangeEvent, FC, PropsWithChildren } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";

type Props = PropsWithChildren<{
  value: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type: HTMLInputElement["type"];
  id?: string;
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
}>;

export const Input: FC<Props> = ({
  id,
  value,
  onChange,
  type,
  className,
  placeholder,
  autoFocus,
  children,
}) => {
  return (
    <div className={clsx(styles.input, className)}>
      {children && id && <label htmlFor={id}>{children}</label>}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
    </div>
  );
};
