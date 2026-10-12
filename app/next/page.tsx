import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import Footer from "../v2/Footer";
import Close from "../v2/mac/Close";
import Cooked from "../v2/mac/Cooked";
import Hero from "../v2/mac/Hero";
import mac from "../v2/mac/mac.module.css";
import MenuBar from "../v2/mac/MenuBar";
import Notes from "../v2/mac/Notes";
import Rows from "../v2/mac/Rows";
import Reveals from "../v2/Reveals";
import styles from "../v2/v2.module.css";

// A preview of the new home page, until it replaces /. Built in heyclicky's way: a Mac menu bar, "Fork" with
// little retro windows around it playing real recordings of Fork, a row per feature, a note from the maker,
// what's been cooking, questions and the download. Copy lives in LANDING in v2/content.ts.

const plex = IBM_Plex_Mono({ weight: ["500", "600"], subsets: ["latin"], variable: "--font-plex" });

export const metadata: Metadata = {
  title: "Fork, the new home page (preview)",
  robots: { index: false, follow: false },
};

export default function Next() {
  return (
    <div className={`${styles.v2} ${mac.mac} ${plex.variable}`}>
      <MenuBar />
      <Hero />
      <main>
        <Rows />
        <Notes />
        <Cooked />
        <Close />
      </main>
      <Footer at="home" />
      <Reveals />
    </div>
  );
}
