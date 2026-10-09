import Image from "next/image";
import DownloadButton from "../../DownloadButton";
import { DOWNLOAD, GITHUB } from "../content";
import s from "../story.module.css";
import v from "../v2.module.css";

// The close, short and centred: one line and the two buttons.
export default function Close() {
  return (
    <section id="download" className={s.close} aria-labelledby="download-h" data-reveal>
      <h2 id="download-h" className={s.title}>
        Download Fork.
      </h2>
      <p className={s.line}>Free, for Macs with Apple Silicon.</p>
      <div className={s.closeCtas}>
        <DownloadButton href={DOWNLOAD} from="download" className={v.btnPrimary} />
        <a className={v.btnSoft} href={GITHUB} target="_blank" rel="noopener noreferrer" data-track="github_clicked" data-from="download">
          <Image src="/art/github.svg" width={18} height={18} alt="" aria-hidden className={v.ghIcon} />
          View on GitHub
        </a>
      </div>
    </section>
  );
}
