import Image from "next/image";
import DownloadButton from "../../DownloadButton";
import { DOWNLOAD, INSTALL_CMD } from "../content";
import CopyButton from "../CopyButton";
import s from "../story.module.css";
import v from "../v2.module.css";

// The close: Fork's icon, one button, what it needs, and the one-line install for people who'd rather type it.
export default function Close() {
  return (
    <div className={s.dl} data-reveal>
      <Image className={s.dlIcon} src="/art/fork-icon.png" width={104} height={104} alt="" priority={false} />
      <h2 id="download-h" className={v.h2}>
        Download Fork.
      </h2>
      <p className={`${v.lede} ${s.gap}`}>Free, for Macs with Apple Silicon. Your workspaces come back after every update.</p>
      <div className={s.dlBig}>
        <DownloadButton href={DOWNLOAD} from="download" className={v.btnPrimary} />
      </div>
      <p className={s.dlMicro}>Signed and notarized by Apple · M1 and newer</p>
      <div className={s.install}>
        <span className={s.ps} aria-hidden>
          $
        </span>
        <code>{INSTALL_CMD}</code>
        <CopyButton text={INSTALL_CMD} event="install_copied" label="Copy the install command" />
      </div>
    </div>
  );
}
