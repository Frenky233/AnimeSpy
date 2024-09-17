import { FC } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { Button } from "../ui/button/component";
import { Input } from "../ui/input/component";
import { useJoin } from "./useJoin";

type Props = {
  className?: string;
};

export const JoinRoom: FC<Props> = ({ className }) => {
  const { value, setCode } = useJoin();

  return (
    <div className={clsx(styles.join, className)}>
      <Input
        value={value}
        onChange={setCode}
        type="text"
        className={styles.joinInput}
        placeholder="Код"
      />
      <Button
        variant="Push"
        className={styles.joinButton}
        disabled={value.length < 5}
      >
        Войти
      </Button>
    </div>
  );
};
