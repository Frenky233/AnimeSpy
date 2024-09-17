import { IndexControls } from "@/components/indexControls/component";
import styles from "./styles.module.scss";
import { UserAuth } from "@/components/userAuth/component";

export default function HomePage({}) {
  return (
    <div className={styles.home}>
      <h1 className={styles.homeTitle}>ANIME SPY</h1>
      <div className={styles.homeInner}>
        <div className={styles.homeControls}>
          <UserAuth className={styles.homeUser} />
          <IndexControls />
        </div>
        <div className={styles.homeRules}>RULES TODO</div>
      </div>
    </div>
  );
}
