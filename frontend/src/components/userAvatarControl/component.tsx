import { FC } from "react";
import styles from "./styles.module.scss";
import { UserAvatar } from "../userAvatar/component";
import { Button } from "../ui/button/component";
import { useAvatarUpdate } from "./useAvatarUpdate";

type Props = {
  onClose: () => void;
  initialChar: string;
  initialImg?: string;
};

export const UserAvatarControl: FC<Props> = ({
  onClose,
  initialChar,
  initialImg,
}) => {
  const {
    currentAvatar,
    fileInputRef,
    errorMessageRef,
    onStartUpload,
    onCancel,
    onChange,
    onDelete,
    onSubmit,
  } = useAvatarUpdate(onClose, initialImg);

  return (
    <div className={styles.userAvatarControl}>
      <div className={styles.userAvatarControlInner}>
        <UserAvatar iconChar={initialChar} iconURL={currentAvatar} />
        <Button
          onClick={onStartUpload}
          variant="Push"
          className={styles.userAvatarControlUpload}
        >
          Загрузить
        </Button>
        <input
          onChange={onChange}
          className={styles.userAvatarControlInput}
          type="file"
          ref={fileInputRef}
          accept="image/png, image/jpeg"
        />
        <Button
          variant="Push"
          disabled={
            currentAvatar === initialImg || currentAvatar === initialChar
          }
          onClick={onCancel}
        >
          Отмена
        </Button>
        <Button variant="Push" disabled={!initialImg} onClick={onDelete}>
          Удалить
        </Button>
      </div>
      <Button
        variant="Push"
        className={styles.userAvatarControlSubmit}
        onClick={onSubmit}
      >
        Подтвердить
      </Button>
      <div className={styles.userAvatarControlError} ref={errorMessageRef}>
        Максимальный размер файла 1МБ
      </div>
    </div>
  );
};
