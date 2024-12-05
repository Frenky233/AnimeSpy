import styles from "./styles.module.scss";
import { usePackEdit } from "./usePackEdit";
import { PackEditSettings } from "@/components/packEditSettings/component";
import { PackEditHeader } from "@/components/packEditHeader/component";
import { Modal } from "@/components/modal/component";
import { ConfirmPopup } from "@/components/confirmPopup/component";
import { Popup } from "@/components/popup/component";
import { PackEditSideInfo } from "@/components/packEditSideInfo/component";
import { PackEditItemsList } from "@/components/packEditItemsList/component";

export default function PackPage({}) {
  const {
    name,
    type,
    items,
    searchQuery,
    searchItemsData,
    isLoading,
    onNameChange,
    onTypeChange,
    onSearchQueryChange,
    onSubmit,
    onAddItem,
    onDeleteItem,
    onDelete,
    onCancel,
    message,
    popup,
  } = usePackEdit();

  return (
    <div className={styles.pack}>
      <PackEditSettings
        name={name}
        typeChecked={type === "anime" ? false : true}
        onNameChange={onNameChange}
        onTypeChange={onTypeChange}
        className={styles.packSettings}
      />
      <div className={styles.packInner}>
        <PackEditHeader
          searchQuery={searchQuery}
          onSearchQueryChange={onSearchQueryChange}
          isLoading={isLoading}
          onAddItem={onAddItem}
          dropdownItems={searchItemsData}
          className={styles.packHeader}
        />
        <div className={styles.packBody}>
          <PackEditItemsList items={items} onDeleteItem={onDeleteItem} />
        </div>
        <PackEditSideInfo
          onSubmit={onSubmit}
          onDeletePack={onDelete}
          onCancel={onCancel}
          className={styles.packInfo}
        />
      </div>
      {message.show && (
        <Modal onClose={message.onCancel!}>
          <ConfirmPopup
            onConfirm={message.onConfirm!}
            onCancel={message.onCancel!}
            variant={message.variant!}
            redirect={message.redirect}
          >
            {message.message}
          </ConfirmPopup>
        </Modal>
      )}
      {popup.show && (
        <Popup
          variant={popup.variant!}
          terminate={popup.terminate!}
          withProgressBar={true}
          time={popup.time!}
        >
          {popup.message}
        </Popup>
      )}
    </div>
  );
}
