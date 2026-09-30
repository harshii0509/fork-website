"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DOWNLOAD, GITHUB, HOME } from "./content";
import styles from "./v2.module.css";

// Once the page has scrolled a little, a cream bar fades in behind the links. On the home page the
// links jump to its sections; on other pages (`away`) they lead back to them.
export default function Nav({ brandClass, away = false }: { brandClass: string; away?: boolean }) {
  const at = away ? HOME : "";
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <nav className={styles.nav} data-scrolled={scrolled || undefined} aria-label="Fork">
      <a href={away ? HOME : "#top"} className={`${styles.brand} ${brandClass}`}>
        <Image src="/art/Fork.svg" width={17} height={23} alt="" aria-hidden />
        Fork
      </a>
      <div className={styles.navLinks}>
        <a href={`${at}#features`} data-track="nav_clicked" data-item="features">
          Features
        </a>
        <Link href="/whats-cooking" data-track="cooking_clicked" data-from="nav">
          What’s cooking
        </Link>
        <a href={GITHUB} target="_blank" rel="noopener noreferrer" data-track="github_clicked" data-from="nav">
          GitHub
        </a>
      </div>
      <a className={styles.navDownload} href={DOWNLOAD} data-track="download_clicked" data-from="nav">
        Download
      </a>
    </nav>
  );
}
