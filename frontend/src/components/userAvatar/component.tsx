import React, { FC } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";

type Props = {
  iconChar: string;
  iconURL?: string;
  className?: string;
};

export const Component: FC<Props> = ({ iconURL, iconChar, className }) => {
  return (
    <div className={clsx(styles.userAvatar, className)}>
      {iconURL ? (
        <img className={styles.userAvatarImage} src={iconURL} alt="user icon" />
      ) : (
        <span className={styles.userAvatarChar}>{iconChar}</span>
      )}
    </div>
  );
};

export const UserAvatar = React.memo(Component);