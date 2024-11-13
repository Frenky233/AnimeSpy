import { type FC, type PropsWithChildren, RefObject } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";

type Props = PropsWithChildren<{
  className?: string | string[];
  disabled?: HTMLButtonElement["disabled"];
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: HTMLButtonElement["type"];
  variant?: "Primary" | "Secondary" | "Push";
  forwardRef?: RefObject<HTMLButtonElement>;
}>;

export const Button: FC<Props> = ({
  children,
  className,
  disabled,
  onClick,
  type = "button",
  variant,
  forwardRef,
}) => {
  return (
    <button
      className={clsx(styles.button, className, styles[`variant${variant}`])}
      type={type}
      onClick={onClick}
      disabled={disabled}
      ref={forwardRef}
    >
      {children}
    </button>
  );
};
