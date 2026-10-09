import Square from "../fork/Square";
import { WaitWindow } from "../sections/WhileYouWait";
import styles from "../v2.module.css";
import Go from "./Go";
import { type Facts, ico, LINKS } from "./shared";

// Footer C: something to do while you wait. One quiet row with where Fork is at and its links, then the
// window from the app: a workspace at work, and a real game of Snake beside its terminal.
export default function Arcade({ facts }: { facts: Facts }) {
  return (
    <footer className={styles.closing}>
      <div className={`${styles.footTop} ${styles.arcadeTop}`}>
        <p className={styles.statusHead}>
          <Square color="var(--ink)" />
          Fork {facts.version}
          <span className={styles.statusMuted}>shipped {facts.shipped}</span>
        </p>
        <nav className={styles.arcadeLinks} aria-label="Fork">
          {LINKS.map((l) => (
            <Go key={l.cmd} link={l} className={styles.treeRow}>
              {ico(l.icon)}
              <span>{l.cmd}</span>
            </Go>
          ))}
        </nav>
      </div>
      <div className={styles.arcade}>
        <p className={styles.arcadeTitle}>Something to do while you wait</p>
        <WaitWindow reveal={false} className={styles.arcadeWin} />
        <div className={styles.arcadeFoot}>
          <p className={styles.statusMuted}>Free · for Macs with Apple Silicon · arrows or WASD to play</p>
          <p className={styles.signoff}>Built by Harshvardhan :)</p>
        </div>
      </div>
    </footer>
  );
}
