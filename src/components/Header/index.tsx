import todoLogoSvg from "../../assets/images/logo.svg";

import styles from "./styles.module.scss";

export function Header() {
  return (
    <header className={styles.header}>
      <img src={todoLogoSvg} alt="To-Do Logo" />
    </header>
  );
}
