import { FC } from "react";
import styles from "./styles.module.scss";
import { Button } from "../ui/button/component";

type Props = {
  onDeletePack: () => void;
  onCancel: () => void;
};

export const PackEditSideInfo: FC<Props> = ({ onDeletePack, onCancel }) => {
  return (
    <div className={styles.info}>
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
    </div>
  );
};
