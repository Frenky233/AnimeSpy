import styles from "./styles.module.scss";
import { PlayersList } from "@/components/playersList/component";
import { LinkButton } from "@/components/ui/linkButton/component";
import ReturnIcon from "@/assets/images/returnIcon.svg?react";
import { useGame } from "./hooks/useGame";
import { Modal } from "@/components/modal/component";
import { usePackSelect } from "./hooks/usePackSelect";
import { PackSelect } from "@/components/packSelect/component";
import { GamePackItemsList } from "@/components/gamePackItemsList/component";
import { AdminControls } from "@/components/adminControls/component";
import { Popup } from "@/components/popup/component";
import { UserControls } from "@/components/userControls/component";
import { useControls } from "./hooks/useControls";
import { Button } from "@/components/ui/button/component";
import { EndGameNotification } from "@/components/endGameNotification/component";
import clsx from "clsx";
import { VotingDialog } from "@/components/votingDialog/component";
import { useSettings } from "./hooks/useSettings";

export default function GamePage({}) {
  const { showCancel, voteType, onCancelVoting, onStartVoting } = useControls();
  const {
    id,
    users,
    pack,
    isAdmin,
    isGameInProgress,
    isPaused,
    isSpy,
    card,
    cardsForRound,
    onSelect,
    onStart,
    onAbort,
    onPause,
    onResume,
    onStartVote,
    time,
    setTime,
    endGameNotification,
    onCloseNotification,
    voting,
    onSubmitVote,
    userId,
    isLoading,
  } = useGame(onCancelVoting);
  const { onOpenSelect, onCloseSelect, showSelect, packs } = usePackSelect();
  const { settings } = useSettings({
    cardsForRound: pack?.items.length ? pack.items.length : 0,
    minutesPerRound: 10,
  });

  return (
    <>
      <div className={styles.game}>
        <div className={styles.gameHeader}>
          <div className={styles.gameButtonsRow}>
            <LinkButton to="/" variant="Primary" className={styles.gameButton}>
              <ReturnIcon />
              <span>Выйти</span>
            </LinkButton>
            <div className={clsx(styles.gameCode, !id && styles.loading)}>
              Код: {id ? id : "00000"}
            </div>
            <UserControls
              isSpy={isSpy}
              card={card}
              isPaused={!isGameInProgress || (isGameInProgress && isPaused)}
              isGameInProgress={isGameInProgress}
              time={time}
              setTime={setTime}
              onStartVoting={onStartVoting}
              isVoting={showCancel}
              isLoading={isLoading}
            />
          </div>
          {isAdmin && (
            <AdminControls
              onSelectPack={onOpenSelect}
              onGameStart={onStart}
              onGameAbort={onAbort}
              onGamePause={onPause}
              onGameResume={onResume}
              isGameInProgress={isGameInProgress}
              isPaused={isPaused}
              isPackSet={!!pack}
              settings={{
                ...settings,
                cardsMax: pack?.items.length ? pack.items.length : 0,
              }}
            />
          )}
        </div>
        <div className={styles.gameBody}>
          <PlayersList
            players={users}
            voting={voteType === "Player"}
            onStartVote={onStartVote}
            userId={userId}
            isLoading={isLoading}
          />
          <GamePackItemsList
            pack={pack}
            cardsForRound={cardsForRound}
            voting={voteType === "Card"}
            onStartVote={onStartVote}
            isLoading={isLoading}
          />
        </div>
      </div>
      {showSelect && (
        <Modal onClose={onCloseSelect}>
          <PackSelect
            packs={packs}
            onSelect={(pack) => {
              onSelect(pack);
              onCloseSelect();
            }}
          />
        </Modal>
      )}
      {isPaused && !voting.isVoting && (
        <Popup
          variant="Info"
          withProgressBar={false}
          className={styles.gamePause}
        >
          Пауза
        </Popup>
      )}
      {voting.isVoting && (
        <>
          <Popup
            variant="Success"
            withProgressBar={true}
            terminate={voting.terminate!}
            time={10000}
            startTime={
              voting.votingStartTime ? Date.now() - voting.votingStartTime : 0
            }
          >
            Голосование
          </Popup>
          {voting.isVoted === null && (
            <Modal className={styles.gameModal}>
              <VotingDialog
                userId={userId}
                initiator={users.find(({ id }) => id === voting.userId)!}
                target={users.find(({ id }) => id === voting.targetId)!}
                onSubmitVote={onSubmitVote}
              />
            </Modal>
          )}
        </>
      )}
      {showCancel && (
        <Popup
          variant="Info"
          withProgressBar={false}
          className={styles.gameVote}
        >
          <Button onClick={onCancelVoting} variant="Primary">
            Отмена
          </Button>
        </Popup>
      )}
      {endGameNotification && (
        <Popup
          variant="Info"
          withProgressBar={false}
          className={styles.gameEnd}
        >
          <EndGameNotification
            notification={endGameNotification}
            onClose={onCloseNotification}
          />
        </Popup>
      )}
    </>
  );
}
