import { FC } from "react";
import styles from "./styles.module.scss";
import { Button } from "../ui/button/component";
import clsx from "clsx";

type Props = {
  onSubmit: () => Promise<void>;
  onDeletePack: () => void;
  onCancel: () => void;
  className?: string;
};

export const PackEditSideInfo: FC<Props> = ({
  onSubmit,
  onDeletePack,
  onCancel,
  className,
}) => {
  return (
    <aside className={clsx(styles.info, className)}>
      <Button variant="Push" className={styles.infoSave} onClick={onSubmit}>
        Сохранить
      </Button>
      <Button variant="Push" className={styles.infoCancel} onClick={onCancel}>
        Отмена
      </Button>
      <Button
        variant="Push"
        className={styles.infoDelete}
        onClick={onDeletePack}
      >
        Удалить
      </Button>
      <h2 className={styles.infoTitle}>Правила создания</h2>
      <ul className={styles.infoList}>
        <li>1. Минимальное количество карточек 30</li>
        <li>
          2. Количество карточек на игру в зависимости от количества игроков:
          <br />
          3-4: 20 <br /> 5-6: 25 <br /> 7-8: 30
        </li>
      </ul>
    </aside>
  );
};
