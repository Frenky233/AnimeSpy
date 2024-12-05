import { FC } from "react";
import styles from "./styles.module.scss";
import { PackItem } from "@/db/db";
import DropdownIcon from "@/assets/images/dropdownIcon.svg?react";
import { PackEditItem } from "../packEditItem/component";
import { useDropdown } from "./useDropdown";
import clsx from "clsx";
import { Button } from "../ui/button/component";
import { voteType } from "@/pages/game/hooks/useControls";

type Props = {
  isSpy: boolean;
  card: PackItem | null;
  isGameInProgress: boolean;
  onStartVoting: (type: voteType) => void;
};

export const GameCard: FC<Props> = ({
  isSpy,
  card,
  isGameInProgress,
  onStartVoting,
}) => {
  const { isOpen, onOpen, onClose } = useDropdown(isGameInProgress);

  return (
    <div className={clsx(styles.card, isOpen && styles.open)}>
      <Button
        className={styles.cardTitle}
        onClick={isOpen ? onClose : onOpen}
        disabled={!isGameInProgress || (!isSpy && !card)}
      >
        <DropdownIcon />
        <h5>Ваша карта</h5>
      </Button>
      {isOpen &&
        (isSpy ? (
          <div className={clsx(styles.cardData, styles.cardSpy)}>
            <div className={styles.cardUpper}>
              <h6>Шпион</h6>
            </div>
            <Button
              className={clsx(styles.cardTitle, styles.cardVote)}
              onClick={() => {
                onClose();
                onStartVoting("Card");
              }}
            >
              Угадать
            </Button>
          </div>
        ) : (
          card && <PackEditItem item={card} className={styles.cardData} />
        ))}
    </div>
  );
};
