import { FC } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { Button } from "../ui/button/component";
import { JoinRoom } from "../joinRoom/component";

type Props = {
  className?: string;
};

export const IndexControls: FC<Props> = ({ className }) => {
  return (
    <div className={clsx(styles.indexControls, className)}>
      <Button variant="Push" className={styles.indexControlsCreate}>
        Создать
      </Button>
      <JoinRoom className={styles.indexControlsJoin} />
      <Button variant="Primary">Наборы</Button>
    </div>
  );
};
