import { RefObject, type FC, type PropsWithChildren } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { Link } from "react-router-dom";

type Props = PropsWithChildren<{
  to: string;
  className?: string;
  variant?: "Primary" | "Secondary" | "Push";
  disabled?: boolean;
  forwardRef?: RefObject<HTMLAnchorElement>;
}>;

export const LinkButton: FC<Props> = ({
  children,
  to,
  className,
  variant,
  disabled,
  forwardRef,
}) => {
  return disabled ? (
    <span
      className={clsx(
        styles.linkButton,
        className,
        styles[`variant${variant}`]
      )}
      aria-disabled={disabled}
    >
      {children}
    </span>
  ) : (
    <Link
      to={to}
      className={clsx(
        styles.linkButton,
        className,
        styles[`variant${variant}`]
      )}
      aria-disabled={disabled}
      ref={forwardRef}
    >
      {children}
    </Link>
  );
};
