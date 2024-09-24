import { LinkButton } from "@/components/ui/linkButton/component";
import styles from "./styles.module.scss";
import HouseIcon from "@/assets/images/houseIcon.svg?react";

export default function ErrorPage({}) {
  return (
    <div className={styles.error}>
      <div className={styles.errorCode}>404</div>
      <h1 className={styles.errorTitle}>Страница не найдена</h1>
      <LinkButton className={styles.errorButton} variant="Primary" to="/">
        <HouseIcon />
        Вернуться
      </LinkButton>
    </div>
  );
}
