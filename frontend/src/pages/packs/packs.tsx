import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { PacksPageHeader } from "@/components/packsPageHeader/component";
import { PacksPageBody } from "@/components/packsPageBody/component";
import { db, Pack } from "@/db/db";

export default function PacksPage({}) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [packs, setPacks] = useState<Pack[]>([]);

  useEffect(() => {
    const loadPacks = async () => {
      const packs = await db.packs.toArray();
      await new Promise((r) => setTimeout(r, 200));
      setPacks(packs);
      setIsLoading(false);
    };

    loadPacks();
  }, []);

  return (
    <div className={styles.packs}>
      <PacksPageHeader
        searchQuery={searchQuery}
        onSearchQueryChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setSearchQuery(event.target.value)
        }
      />
      <PacksPageBody isLoading={isLoading} packs={packs} />
    </div>
  );
}
