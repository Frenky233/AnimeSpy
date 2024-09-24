import { type FC, type PropsWithChildren } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { Link } from "react-router-dom";

type Props = PropsWithChildren<{
  to: string;
  className?: string;
  variant?: "Primary" | "Secondary" | "Push";
}>;

export const LinkButton: FC<Props> = ({ children, to, className, variant }) => {
  return (
    <Link
      to={to}
      className={clsx(
        styles.linkButton,
        className,
        styles[`variant${variant}`]
      )}
    >
      {children}
    </Link>
  );
};
