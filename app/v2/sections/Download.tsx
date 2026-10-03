import Image from "next/image";
import { DOWNLOAD, INSTALL_CMD } from "../content";
import CopyButton from "../CopyButton";
import styles from "../v2.module.css";

// Two ways in: the .dmg, or the one-line install. Both open without a warning (Fork is notarized).
export default function Download() {
  return (
    <div className={styles.dlRows}>
      <a className={`${styles.dlRow} ${styles.dlMain}`} href={DOWNLOAD} data-track="download_clicked" data-from="download">
        <Image src="/art/apple.svg" width={20} height={20} alt="" aria-hidden className={styles.dlApple} />
        <span className={styles.dlText}>
          <b>Download for Mac</b>
          <small>Fork.dmg · Apple Silicon</small>
        </span>
        <span className={styles.dlArrow} aria-hidden>
          ↓
        </span>
      </a>
      <div className={styles.dlRow}>
        <span className={styles.dlTerm} aria-hidden>
          ❯_
        </span>
        <span className={styles.dlText}>
          <b>Or install from the terminal</b>
          <code>{INSTALL_CMD}</code>
        </span>
        <CopyButton text={INSTALL_CMD} event="install_copied" label="Copy the install command" />
      </div>
    </div>
  );
}
