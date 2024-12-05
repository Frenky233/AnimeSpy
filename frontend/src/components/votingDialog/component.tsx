import { FC } from "react";
import styles from "./styles.module.scss";
import { Button } from "../ui/button/component";
import { User } from "@/pages/game/hooks/useGame";
import { PlayerItem } from "../playerItem/component";

type Props = {
  userId: string;
  target: User;
  initiator: User;
  onSubmitVote: (userId: string, vote: boolean) => void;
};

export const VotingDialog: FC<Props> = ({
  userId,
  target,
  initiator,
  onSubmitVote,
}) => {
  return (
    <div className={styles.votingDialog}>
      <h4 className={styles.votingDialogTitle}>Голосование</h4>
      <div className={styles.votingDialogUpper}>
        <PlayerItem player={{ ...initiator, isVoted: null }} />
        <span className={styles.votingDialogAlert}>ПРОТИВ</span>
        <PlayerItem player={{ ...target, isVoted: null }} />
      </div>
      <div className={styles.votingDialogButtons}>
        <Button
          onClick={() => onSubmitVote(userId, true)}
          className={styles.votingDialogYes}
          variant="Push"
        >
          Да
        </Button>
        <Button
          onClick={() => onSubmitVote(userId, false)}
          className={styles.votingDialogNo}
          variant="Push"
        >
          Нет
        </Button>
      </div>
    </div>
  );
};
