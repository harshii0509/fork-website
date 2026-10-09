import Image from "next/image";
import DownloadButton from "../../DownloadButton";
import { DOWNLOAD, GITHUB, INSTALL_CMD } from "../content";
import CopyButton from "../CopyButton";
import s from "../story.module.css";
import v from "../v2.module.css";

// The close, short and centred: one line, the button, what it needs, and the one-line install.
export default function Close() {
  return (
    <section id="download" className={s.part} aria-labelledby="download-h">
      <div className={s.close} data-reveal>
        <h2 id="download-h" className={s.title}>
          Download Fork.
        </h2>
        <p className={s.line}>Free, for Macs with Apple Silicon. Your workspaces come back after every update.</p>
        <div className={s.closeCtas}>
          <DownloadButton href={DOWNLOAD} from="download" className={v.btnPrimary} />
          <a className={v.btnSoft} href={GITHUB} target="_blank" rel="noopener noreferrer" data-track="github_clicked" data-from="download">
            <Image src="/art/github.svg" width={18} height={18} alt="" aria-hidden className={v.ghIcon} />
            View on GitHub
          </a>
        </div>
        <p className={s.micro}>Signed and notarized by Apple · M1 and newer</p>
        <div className={s.install}>
          <code>$ {INSTALL_CMD}</code>
          <CopyButton text={INSTALL_CMD} event="install_copied" label="Copy the install command" />
        </div>
      </div>
    </section>
  );
}
