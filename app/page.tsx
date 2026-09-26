import Image from "next/image";
import styles from "./page.module.css";

// Always the newest release: every build is named Fork.dmg, so GitHub's "latest" link never changes.
const DOWNLOAD = "https://github.com/harshii0509/Fork/releases/latest/download/Fork.dmg";
const GITHUB = "https://github.com/harshii0509/Fork";
const X = "https://x.com/harshii04";
const LINKEDIN = "https://www.linkedin.com/in/harshui/";

// Doodles are decoration only: hidden from screen readers, and never block clicks.
function Doodle({ src, width, height, className }: { src: string; width: number; height: number; className: string }) {
  return <Image src={src} width={width} height={height} alt="" aria-hidden className={`${styles.doodle} ${className}`} />;
}

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <Doodle src="/art/Fallingnoodle.svg" width={231} height={975} className={styles.noodle} />
        <Doodle src="/art/NoodleBowl.svg" width={89} height={98} className={styles.bowl} />
        <Doodle src="/art/Fork.svg" width={76} height={102} className={styles.fork} />

        <h1 className={styles.headline}>
          Fork is a terminal for people who build things. A fast, thoughtful place to code, experiment, break
          stuff, and turn ideas into something real.
        </h1>

        <div className={styles.actions}>
          <a className={styles.download} href={DOWNLOAD}>
            <Image src="/art/apple.svg" width={20} height={20} alt="" aria-hidden />
            Download for Mac
          </a>
          <a className={styles.github} href={GITHUB} target="_blank" rel="noopener noreferrer">
            <Image src="/art/github.svg" width={20} height={20} alt="" aria-hidden />
            View on Github
          </a>
        </div>

        <Image
          className={styles.screenshot}
          src="/app-screenshot.png"
          width={2784}
          height={1824}
          sizes="(max-width: 1100px) 100vw, 1011px"
          alt="Fork: a sidebar with the folder's files and open terminals, next to Claude working in the terminal"
          preload
        />
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
          <Doodle src="/art/Snowman.svg" width={119} height={139} className={styles.snowman} />
          <h2 id="thanks" className={`${styles.note} ${styles.thanksNote}`}>
            THANKS A TON!
          </h2>
          <p className={styles.bio}>
            I’m Harshvardhan, I love building stupid things that help me work better. If you need help or have any
            questions, please send me a message on twitter. I would be happy to help you!
          </p>
        </section>
      </main>

      <footer className={styles.footer}>
        <Doodle src="/art/Wave.svg" width={134} height={48} className={styles.wave} />
        <p className={styles.signoff}>Built by Harshvardhan :), reach out to me here</p>
        <nav className={styles.socials} aria-label="Harshvardhan elsewhere">
          <a href={X} target="_blank" rel="noopener noreferrer" aria-label="Harshvardhan on X (Twitter)">
            <Image src="/art/TwitterIcon.svg" width={28} height={24} alt="" />
          </a>
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="Harshvardhan on LinkedIn">
            <Image src="/art/LinkedInIcon.svg" width={24} height={24} alt="" />
          </a>
        </nav>
      </footer>
    </div>
  );
}
