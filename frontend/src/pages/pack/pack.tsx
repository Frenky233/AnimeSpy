import styles from "./styles.module.scss";
import { PacksPageHeader } from "@/components/packsPageHeader/component";
import { Input } from "@/components/ui/input/component";
import { Toggler } from "@/components/ui/toggler/component";
import { usePackEdit } from "./usePackEdit";

export default function PackPage({}) {
  const {
    name,
    type,
    searchQuery,
    onNameChange,
    onTypeChange,
    onSearchQueryChange,
    onSubmit,
  } = usePackEdit();

  return (
    <div className={styles.packs}>
      <div className={styles.packsSettings}>
        <Input
          value={name}
          onChange={onNameChange}
          type="text"
          placeholder="Название..."
          className={styles.packsName}
        />
        <div className={styles.packsType}>
          <span>Тип карточек в наборе:</span>
          <Toggler
            left="Аниме"
            right="Персонажи"
            checked={type === "Anime" ? false : true}
            onChange={onTypeChange}
            className={styles.packsToggler}
          />
        </div>
      </div>
      <PacksPageHeader
        searchQuery={searchQuery}
        onSearchQueryChange={onSearchQueryChange}
        returnPath="/packs"
        onSubmit={onSubmit}
      />
    </div>
  );
}
