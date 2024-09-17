import { FC, useState } from "react";
import styles from "./styles.module.scss";
import { UserAvatar } from "../userAvatar/component";
import AvatarControlIcon from "@/assets/images/avatarControlIcon.svg?react";
import { Button } from "../ui/button/component";
import { Modal } from "../modal/component";
import { UserAvatarControl } from "../userAvatarControl/component";

type Props = {
  iconChar: string;
  iconURL?: string;
};

export const UserAvatarIndex: FC<Props> = ({ iconChar, iconURL }) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const onOpen = () => {
    setShowModal(true);
  };

  const onClose = () => {
    setShowModal(false);
  };

  return (
    <div className={styles.userAvatarIndex}>
      <UserAvatar iconChar={iconChar} iconURL={iconURL} />
      <Button className={styles.userAvatarIndexButton} onClick={onOpen}>
        <AvatarControlIcon />
      </Button>
      {showModal && (
        <Modal onClose={onClose}>
          <UserAvatarControl
            initialImg={iconURL}
            initialChar={iconChar}
            onClose={onClose}
          />
        </Modal>
      )}
    </div>
  );
};
