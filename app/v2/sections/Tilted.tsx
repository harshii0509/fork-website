import { getImageProps } from "next/image";
import type { Feature } from "../content";
import s from "../story.module.css";

// One part of the page below the hero (direction A in Figma): a heading and one line, then a real Fork screenshot,
// tilted, with a soft light behind it and its bottom fading into the page. Light and dark pictures follow the Mac.
const SIZE = { turn: [1720, 890], changes: [1520, 856], design: [1520, 856] } as const;

export default function Tilted({ f }: { f: Feature }) {
  const [width, height] = SIZE[f.shot];
  const common = { alt: f.alt, width, height, sizes: "(max-width: 760px) 165vw, 1240px" };
  const dark = getImageProps({ ...common, src: `/shots/${f.shot}-dark.webp` }).props;
  const { props: light } = getImageProps({ ...common, src: `/shots/${f.shot}-light.webp` });

  return (
    <section id={f.id} className={s.feature} aria-labelledby={`${f.id}-h`}>
      <div className={s.head} data-reveal>
        <h2 id={`${f.id}-h`} className={s.title}>
          {f.title}
        </h2>
        <p className={s.line}>{f.line}</p>
      </div>
      <div className={`${s.shot} ${f.shot === "turn" ? s.wide : ""}`} data-reveal>
        <span className={s.glow} aria-hidden />
        <picture>
          <source media="(prefers-color-scheme: dark)" srcSet={dark.srcSet} sizes={dark.sizes} />
          <img {...light} alt={f.alt} />
        </picture>
      </div>
    </section>
  );
}
