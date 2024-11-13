import { FC, useState } from "react";
import styles from "./styles.module.scss";
import { Button } from "../ui/button/component";
import DeleteIcon from "@/assets/images/deleteIcon.svg?react";
import LinkIcon from "@/assets/images/linkIcon.svg?react";
import InfoIcon from "@/assets/images/infoIcon.svg?react";
import { PackItem } from "@/db/db";
import { Modal } from "../modal/component";
import { PackItemInfo } from "../packItemInfo/component,";
import { SuspenseImage } from "../ui/suspenseImage/component";

type Props = {
  item: PackItem;
  onDeleteItem?: (id: string) => void;
};

export const PackEditItem: FC<Props> = ({ item, onDeleteItem }) => {
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

  const onOpen = () => {
    setShowInfoModal(true);
  };

  const onClose = () => {
    setShowInfoModal(false);
  };

  return (
    <>
      <div className={styles.item}>
        <SuspenseImage
          src={item.posterUrl}
          srcSet={`${item.poster2xUrl} 2x`}
          className={styles.itemImg}
          alt="poster img"
        />
        <div className={styles.itemBottom}>
          <h4 className={styles.itemTitle} title={item.name}>
            {item.name}
          </h4>
        </div>
        <aside className={styles.itemControl}>
          <Button className={styles.itemInfo} onClick={onOpen}>
            <InfoIcon />
          </Button>
          <Button
            onClick={() => window.open(item.url, "_blank")}
            className={styles.itemLink}
          >
            <LinkIcon />
          </Button>
          {onDeleteItem && (
            <Button
              onClick={() => onDeleteItem(item.id)}
              className={styles.itemDelete}
            >
              <DeleteIcon />
            </Button>
          )}
        </aside>
      </div>
      {showInfoModal && (
        <Modal onClose={onClose}>
          <PackItemInfo item={item} />
        </Modal>
      )}
    </>
  );
};
