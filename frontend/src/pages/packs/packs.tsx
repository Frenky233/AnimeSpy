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
      await new Promise((r) => setTimeout(r, 200));
      const packs = await db.packs.toArray();
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
        returnPath="/"
      />
      <PacksPageBody isLoading={isLoading} packs={packs} />
    </div>
  );
}
