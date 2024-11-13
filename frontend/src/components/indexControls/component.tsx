import { FC } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { Button } from "../ui/button/component";
import { JoinRoom } from "../joinRoom/component";
import { LinkButton } from "../ui/linkButton/component";

type Props = {
  className?: string;
};

export const IndexControls: FC<Props> = ({ className }) => {
  return (
    <div className={clsx(styles.indexControls, className)}>
      <LinkButton
        to="/game"
        variant="Push"
        className={styles.indexControlsCreate}
      >
        Создать
      </LinkButton>
      <JoinRoom className={styles.indexControlsJoin} />
      <LinkButton to="packs" variant="Primary">
        Наборы
      </LinkButton>
    </div>
  );
};
