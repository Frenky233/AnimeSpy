import { ChangeEvent, FC } from "react";
import styles from "./styles.module.scss";
import { Input } from "../ui/input/component";

type Props = {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const UserNameInput: FC<Props> = ({ value, onChange }) => {
  return (
    <Input
      value={value}
      onChange={onChange}
      type="text"
      id="userName"
      placeholder="МЕССИ10"
      className={styles.userNameInput}
    >
      ВВЕДИТЕ ИМЯ
    </Input>
  );
};
