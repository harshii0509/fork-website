import Image from "next/image";
import CookingNote from "./CookingNote";
import DownloadButton from "./DownloadButton";
import Footer from "./Footer";
import ForkApp from "./ForkApp";
import Noodle from "./Noodle";
import NoodleBowl from "./NoodleBowl";
import Snowman from "./Snowman";
import styles from "./page.module.css";

// Always the newest release: every build is named Fork.dmg, so GitHub's "latest" link never changes.
const DOWNLOAD = "https://github.com/harshii0509/Fork/releases/latest/download/Fork.dmg";
const GITHUB = "https://github.com/harshii0509/Fork";

// Doodles are decoration only: hidden from screen readers, and never block clicks.
function Doodle({ src, width, height, className }: { src: string; width: number; height: number; className: string }) {
  return <Image src={src} width={width} height={height} alt="" aria-hidden className={`${styles.doodle} ${className}`} />;
}

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <Noodle className={styles.noodle} />
        <NoodleBowl className={styles.bowl} />
        <Doodle src="/art/Fork.svg" width={76} height={102} className={styles.fork} />

        <h1 className={styles.headline}>
          Fork is a terminal for people who build things. A fast, thoughtful place to code, experiment, break
          stuff, and turn ideas into something real.
        </h1>

        <div className={styles.actions}>
          <DownloadButton href={DOWNLOAD} />
          <a className={styles.github} href={GITHUB} target="_blank" rel="noopener noreferrer" data-track="github_clicked">
            <Image src="/art/github.svg" width={20} height={20} alt="" aria-hidden />
            View on Github
          </a>
        </div>

        <div className={styles.stage}>
          <ForkApp className={styles.screenshot} />
          <CookingNote />
        </div>
      </header>

      <main>
        <section className={styles.story} aria-labelledby="why">
          <div className={styles.why}>
            <Doodle src="/art/MagnifyingGlass.svg" width={75} height={103} className={styles.magnifier} />
            <h2 id="why" className={styles.note}>
              Why I made this?
            </h2>
          </div>
          <p>
            I spend a lot of my time in terminals. For me, they’re often where ideas start taking shape with a blank
            prompt, a blinking cursor, and a command that could take you pretty much anywhere. But somewhere along the
            way, terminals became tools you tolerate rather than places you enjoy being in.
          </p>
          <p>
            I wanted to change that. I wanted a terminal that felt faster when you need it, calmer when you’re
            juggling a dozen things, and a little more human when you’re figuring things out.
          </p>
          <p>
            Fork came from that idea, something I’d actually want to open every morning. Something that keeps up when
            I’m moving fast, gets out of the way when I’m deep in the work, and makes the little moments in between
            feel a bit nicer.
          </p>
        </section>

        <section className={styles.thanks} aria-labelledby="thanks">
          <Snowman />
          <h2 id="thanks" className={`${styles.note} ${styles.thanksNote}`}>
            THANKS A TON!
          </h2>
          <p className={styles.bio}>
            I’m Harshvardhan, I love building stupid things that help me work better. If you need help or have any
            questions, please send me a message on twitter. I would be happy to help you!
          </p>
        </section>
      </main>

      <Footer cooking />
    </div>
  );
}
