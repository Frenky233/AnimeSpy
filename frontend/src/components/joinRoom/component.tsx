import { FC } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { Input } from "../ui/input/component";
import { useJoin } from "./useJoin";
import { LinkButton } from "../ui/linkButton/component";

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
      <LinkButton
        to={`/game/${value}`}
        variant="Push"
        className={styles.joinButton}
        disabled={value.length < 5}
      >
        Войти
      </LinkButton>
    </div>
  );
};
