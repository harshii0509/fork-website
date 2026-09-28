import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

const X = "https://x.com/harshii04";
const LINKEDIN = "https://www.linkedin.com/in/harshui/";

// The sign-off at the bottom of every page. The home page also points to What's cooking.
export default function Footer({ className = "", cooking = false }: { className?: string; cooking?: boolean }) {
  return (
    <footer className={`${styles.footer} ${className}`}>
      <Image src="/art/Wave.svg" width={134} height={48} alt="" aria-hidden className={`${styles.doodle} ${styles.wave}`} />
      <p className={styles.signoff}>Built by Harshvardhan :), reach out to me here</p>
      <nav className={styles.socials} aria-label="Harshvardhan elsewhere">
        <a href={X} target="_blank" rel="noopener noreferrer" data-track="social_clicked" data-network="x" aria-label="Harshvardhan on X (Twitter)">
          <Image src="/art/TwitterIcon.svg" width={28} height={24} alt="" />
        </a>
        <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" data-track="social_clicked" data-network="linkedin" aria-label="Harshvardhan on LinkedIn">
          <Image src="/art/LinkedInIcon.svg" width={24} height={24} alt="" />
        </a>
      </nav>
      {cooking && (
        <Link href="/whats-cooking" className={styles.cooking} data-track="cooking_clicked" data-from="footer">
          psst… see what’s cooking →
        </Link>
      )}
    </footer>
  );
}
