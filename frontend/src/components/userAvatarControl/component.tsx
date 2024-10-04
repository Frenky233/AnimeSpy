import { FC } from "react";
import styles from "./styles.module.scss";
import { UserAvatar } from "../userAvatar/component";
import { Button } from "../ui/button/component";
import { useAvatarUpdate } from "./useAvatarUpdate";
import { Popup } from "../popup/component";

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
    submitButtonRef,
    onStartUpload,
    onCancel,
    onChange,
    onDelete,
    onSubmit,
    showPopup,
    terminate,
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
        <Button
          variant="Push"
          disabled={!initialImg}
          onClick={onDelete}
          className={styles.userAvatarControlDelete}
        >
          Удалить
        </Button>
      </div>
      <Button
        variant="Push"
        className={styles.userAvatarControlSubmit}
        onClick={onSubmit}
        forwardRef={submitButtonRef}
      >
        <span>Подтвердить</span>
        <div className={styles.userAvatarControlLoading}></div>
      </Button>
      {showPopup && (
        <Popup
          terminate={terminate}
          variant="Error"
          withProgressBar={true}
          time={1500}
        >
          Максимальный размер файла 1 МБ
        </Popup>
      )}
    </div>
  );
};
