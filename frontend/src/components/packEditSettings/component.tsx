import { FC } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { Input } from "../ui/input/component";
import { Toggler } from "../ui/toggler/component";

type Props = {
  name: string;
  onNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  typeChecked: boolean;
  onTypeChange: () => void;
  className?: string;
};

export const PackEditSettings: FC<Props> = ({
  name,
  onNameChange,
  typeChecked,
  onTypeChange,
  className,
}) => {
  return (
    <div className={clsx(styles.settings, className)}>
      <Input
        value={name}
        onChange={onNameChange}
        type="text"
        placeholder="Название..."
        className={styles.settingsName}
      />
      <div className={styles.settingsType}>
        <span>Тип карточек в наборе:</span>
        <Toggler
          left="Аниме"
          right="Персонажи"
          checked={typeChecked}
          onChange={onTypeChange}
          className={styles.settingsToggler}
        />
      </div>
    </div>
  );
};
