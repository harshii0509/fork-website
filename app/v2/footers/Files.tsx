import Link from "next/link";
import Square from "../fork/Square";
import Figure from "../hairline/Figure";
import styles from "../v2.module.css";
import Go from "./Go";
import { type Facts, type FootLink, ico, LINKS } from "./shared";

const row = (l: FootLink, current?: boolean) => (
  <li key={l.cmd}>
    <Go link={l} className={styles.treeRow} current={current}>
      {ico(l.icon)}
      <span>{l.name}</span>
    </Go>
  </li>
);

// Footer A: Fork's links as a folder of files, as the app's Files tab shows them, where Fork is at, and a
// little keyboard spelling FORK at the foot of the page, its case cut off by the edge. `at`: the page you're on.
export default function Files({ at, facts }: { at: "home" | "cooking"; facts: Facts }) {
  const mine = LINKS.slice(0, 4), elsewhere = LINKS.slice(4);
  return (
    <footer className={styles.closing}>
      <div className={styles.footTop}>
        <nav className={styles.tree} aria-label="Fork">
          <Link href="/" className={styles.treeRow} aria-current={at === "home" ? "page" : undefined}>
            {ico("folder-open")}
            <span>fork/</span>
          </Link>
          <ul>
            {mine.map((l) => row(l, l.cmd === "cooking" && at === "cooking"))}
            <li>
              <span className={styles.treeRow}>
                {ico("folder-open")}
                <span>elsewhere/</span>
              </span>
              <ul>{elsewhere.map((l) => row(l))}</ul>
            </li>
          </ul>
        </nav>

        <Status facts={facts} />
      </div>

      <div className={styles.footKeys}>
        <Figure name="keycaps" intensity={0.6} className={styles.footKeysStage} label="A little keyboard with four keys spelling Fork: point at a key and it presses down." />
      </div>
    </footer>
  );
}

// Where Fork is at, beside the app's square.
export function Status({ facts }: { facts: Facts }) {
  return (
    <div className={styles.status}>
      <p className={styles.statusHead}>
        <Square color="var(--ink)" />
        Fork {facts.version}
      </p>
      <p>
        shipped {facts.shipped}
        {facts.cooking > 0 && (
          <>
            {" · "}
            <Link href="/whats-cooking" data-track="cooking_clicked" data-from="footer-status">
              {facts.cooking} {facts.cooking === 1 ? "thing" : "things"} cooking
            </Link>
          </>
        )}
      </p>
      <p className={styles.statusMuted}>Free · for Macs with Apple Silicon</p>
      <p className={styles.signoff}>Built by Harshvardhan :)</p>
    </div>
  );
}
