import type { CSSProperties, ReactNode } from "react";
import type { Tint } from "../content";
import s from "./mac.module.css";

// The window every picture on the home page sits in: a retro Mac title bar, tinted (green, blue, rose, sand,
// teal), with shiny traffic lights and an X on the right, a near-black outline and a white body.
export default function Window({
  tint = "green",
  title,
  small = false,
  className = "",
  style,
  children,
}: {
  tint?: Tint;
  title?: string;
  small?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div className={`${s.win} ${small ? s.small : ""} ${className}`} data-tint={tint} style={style}>
      <div className={s.bar} data-bar>
        <span className={s.lights} aria-hidden>
          <i />
          <i />
          <i />
        </span>
        {title && <span className={s.wtitle}>{title}</span>}
        <svg className={s.x} viewBox="0 0 256 256" aria-hidden focusable="false">
          <path d="M214.75,211.71l-62.6-98.38,61.77-67.95a8,8,0,0,0-11.84-10.76L143.24,99.34,102.75,35.71A8,8,0,0,0,96,32H48a8,8,0,0,0-6.75,12.3l62.6,98.37-61.77,68a8,8,0,1,0,11.84,10.76l58.84-64.72,40.49,63.63A8,8,0,0,0,160,224h48a8,8,0,0,0,6.75-12.29ZM164.39,208,62.57,48h29L193.43,208Z" />
        </svg>
      </div>
      <div className={s.body}>{children}</div>
    </div>
  );
}
