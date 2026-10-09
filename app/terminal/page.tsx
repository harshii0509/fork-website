import type { Metadata } from "next";
import Link from "next/link";
import DownloadButton from "../DownloadButton";
import CopyButton from "../v2/CopyButton";
import { DOWNLOAD, INSTALL_CMD, MORE, SECTIONS } from "../v2/content";
import { DesignDemo, WorkspacesDemo } from "../v2/fork/Demos";
import ForkWindow from "../v2/fork/ForkWindow";
import Figure from "../v2/hairline/Figure";
import Reveals from "../v2/Reveals";
import { chapters, clock, day } from "../whats-cooking/chapters";
import { Looks, Questions } from "./Bits";
import { Bar, Cmd, mono, Title, Wordmark } from "./Parts";
import Prompt from "./Prompt";
import styles from "./terminal.module.css";

// Direction B, "Terminal": the home page is one terminal session. Each section opens as a command that types
// itself, and its output prints underneath. A real prompt near the top takes commands. Dark, mono, and colour only
// from the terminal's own palette. Same story as the other direction (SECTIONS and NARRATIVE in v2/content.ts).

export const metadata: Metadata = {
  title: "Fork, a terminal that tells you when an agent is done",
  description: SECTIONS.top.lede,
  robots: { index: false }, // a direction to compare; the home page stays at /
};

const MARK = { new: "+", better: "~", fixed: "!", kitchen: "#" } as const;

export default function Terminal() {
  const S = SECTIONS;
  const latest = chapters().flatMap((c) => c.entries).slice(0, 5);
  const rev = chapters().find((c) => c.version)?.version;
  return (
    <div className={`${styles.t} ${mono.variable}`}>
      <Bar title="fork · ~/fork · zsh" />

      <main className={styles.session}>
        <Cmd cmd={S.top.cmd} id="top" className={styles.hero}>
          <p className={styles.meta}>
            Fork {rev} for Mac · free · Apple Silicon · signed and notarized
          </p>
          <Title s={S.top} as="h1" />
          <p className={styles.lede}>{S.top.lede}</p>
          <div className={styles.ctas}>
            <DownloadButton href={DOWNLOAD} from="top" className={styles.btn} />
            <div className={styles.install}>
              <code>{INSTALL_CMD}</code>
              <CopyButton text={INSTALL_CMD} event="install_copied" label="Copy the install command" className={styles.copy} />
            </div>
          </div>
          <div className={styles.window}>
            <ForkWindow play mode="dark" label="The Fork window: three workspaces as tabs, an agent making a page calmer in the terminal, and the panel showing the page before and after." />
          </div>
        </Cmd>

        <Prompt />

        <Cmd cmd={S.insight.cmd} id="insight">
          <div className={styles.split}>
            <div>
              <Title s={S.insight} />
              <p className={styles.lede}>{S.insight.lede}</p>
            </div>
            <Figure name="tabs" className={styles.figure} intensity={0.6} label="Five workspace tabs: the one you point at lifts, and its square splits into a lattice, the sign that it’s working." />
          </div>
        </Cmd>

        <Cmd cmd={S.workspaces.cmd} id="workspaces">
          <Title s={S.workspaces} />
          <p className={styles.lede}>{S.workspaces.lede}</p>
          <div className={styles.pair}>
            <div className={styles.pane}>
              <WorkspacesDemo mode="dark" />
            </div>
            <Figure name="folders" className={styles.figure} label="Four folders on a shelf, each holding a terminal: the one you point at opens and its window slides up." />
          </div>
        </Cmd>

        <Cmd cmd={S.design.cmd} id="design">
          <Title s={S.design} />
          <p className={styles.lede}>{S.design.lede}</p>
          <div className={`${styles.pair} ${styles.flip}`}>
            <Figure name="swatchfan" className={styles.figure} label="A swatch deck of your project’s colours: point at a chip and it swings out." />
            <div className={styles.pane}>
              <DesignDemo mode="dark" />
            </div>
          </div>
        </Cmd>

        <Cmd cmd={S.more.cmd} id="more">
          <Title s={S.more} />
          <ul className={styles.ls}>
            {MORE.map((m) => (
              <li key={m.id}>
                <Figure name={m.figure} className={styles.figure} label={m.title} />
                <h3>{m.title}</h3>
                <p>{m.body}</p>
              </li>
            ))}
          </ul>
        </Cmd>

        <Cmd cmd={S.yours.cmd} id="yours">
          <Title s={S.yours} />
          <p className={styles.lede}>{S.yours.lede}</p>
          <div className={styles.looks}>
            <Looks />
          </div>
        </Cmd>

        <Cmd cmd={S.cooking.cmd} id="cooking">
          <Title s={S.cooking} />
          <p className={styles.lede}>{S.cooking.lede}</p>
          <ol className={styles.log}>
            {latest.map((e) => (
              <li key={e.at + e.title} data-kind={e.kind}>
                <span className={styles.mark}>{MARK[e.kind]}</span>
                <span className={styles.when}>
                  {day(e.at)} {clock(e.at)}
                </span>
                <span className={styles.what}>{e.title}</span>
                <span className={styles.where}>{e.version ? `v${e.version}` : e.where}</span>
              </li>
            ))}
          </ol>
          <Link className={styles.link} href="/terminal/cooking" data-track="cooking_clicked" data-from="cooking-more">
            $ fork changelog <span>→ every change, release by release</span>
          </Link>
        </Cmd>

        <Cmd cmd={S.faq.cmd} id="faq">
          <Title s={S.faq} />
          <Questions />
        </Cmd>

        <Cmd cmd={S.download.cmd} id="download">
          <Title s={S.download} />
          <p className={styles.lede}>{S.download.lede}</p>
          <div className={styles.ctas}>
            <DownloadButton href={DOWNLOAD} from="download" className={styles.btn} />
            <div className={styles.install}>
              <code>{INSTALL_CMD}</code>
              <CopyButton text={INSTALL_CMD} event="install_copied" label="Copy the install command" className={styles.copy} />
            </div>
          </div>
        </Cmd>

        <Cmd cmd={S.thanks.cmd} id="thanks">
          <div className={styles.split}>
            <div>
              <Title s={S.thanks} />
              <p className={styles.lede}>{S.thanks.lede}</p>
            </div>
            <Figure name="laptop" className={styles.figure} intensity={0.6} label="A thin laptop: point higher and the lid opens wider." />
          </div>
        </Cmd>
      </main>

      <Wordmark />
      <Reveals />
    </div>
  );
}
