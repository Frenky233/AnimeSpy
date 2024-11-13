import styles from "./styles.module.scss";
import { PlayersList } from "@/components/playersList/component";
import { LinkButton } from "@/components/ui/linkButton/component";
import ReturnIcon from "@/assets/images/returnIcon.svg?react";
import { useGame } from "./useGame";
import { Modal } from "@/components/modal/component";
import { usePackSelect } from "./usePackSelect";
import { PackSelect } from "@/components/packSelect/component";
import { GamePackItemsList } from "@/components/gamePackItemsList/component";
import { AdminControls } from "@/components/adminControls/component";
import { Popup } from "@/components/popup/component";

export default function GamePage({}) {
  const {
    id,
    users,
    pack,
    isAdmin,
    isGameInProgress,
    isPaused,
    onSelect,
    onStart,
    onAbort,
    onPause,
    onResume,
  } = useGame();
  const { onOpenSelect, onCloseSelect, showSelect, packs } = usePackSelect();

  return (
    <>
      <div className={styles.game}>
        <div className={styles.gameHeader}>
          <LinkButton to="/" variant="Primary" className={styles.gameButton}>
            <ReturnIcon />
            <span>Выйти</span>
          </LinkButton>
          <div className={styles.gameCode}>Код: {id}</div>
          {isAdmin && (
            <AdminControls
              onSelectPack={onOpenSelect}
              onGameStart={onStart}
              onGameAbort={onAbort}
              onGamePause={onPause}
              onGameResume={onResume}
              isGameInProgress={isGameInProgress}
              isPaused={isPaused}
            />
          )}
        </div>
        <div className={styles.gameBody}>
          <PlayersList players={users} />
          <GamePackItemsList pack={pack} />
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
      {isPaused && (
        <Popup
          variant="Info"
          withProgressBar={false}
          className={styles.gamePause}
        >
          Пауза
        </Popup>
      )}
    </>
  );
}
