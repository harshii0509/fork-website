// Icons in the Fork window snippets: Central Icons (round-outlined, radius 2, stroke 1.5), the same set and the
// same picks as the app (designer-terminal icons/central.json). Paid: the licence allows them inside an end
// product like this site, but not shared on their own, so the repo only names them. The package installs with
// CENTRAL_LICENSE_KEY set (on Vercel, an environment variable); no SVG source is committed here.

import { IconBranch } from "@central-icons-react/round-outlined-radius-2-stroke-1.5/IconBranch";
import { IconChanges } from "@central-icons-react/round-outlined-radius-2-stroke-1.5/IconChanges";
import { IconChevronGrabberVerticalToward } from "@central-icons-react/round-outlined-radius-2-stroke-1.5/IconChevronGrabberVerticalToward";
import { IconChevronDownSmall } from "@central-icons-react/round-outlined-radius-2-stroke-1.5/IconChevronDownSmall";
import { IconChevronRightSmall } from "@central-icons-react/round-outlined-radius-2-stroke-1.5/IconChevronRightSmall";
import { IconCode } from "@central-icons-react/round-outlined-radius-2-stroke-1.5/IconCode";
import { IconConsoleSimple } from "@central-icons-react/round-outlined-radius-2-stroke-1.5/IconConsoleSimple";
import { IconCrossSmall } from "@central-icons-react/round-outlined-radius-2-stroke-1.5/IconCrossSmall";
import { IconFolder1 } from "@central-icons-react/round-outlined-radius-2-stroke-1.5/IconFolder1";
import { IconGift1 } from "@central-icons-react/round-outlined-radius-2-stroke-1.5/IconGift1";
import { IconGlobe } from "@central-icons-react/round-outlined-radius-2-stroke-1.5/IconGlobe";
import { IconLayoutColumn } from "@central-icons-react/round-outlined-radius-2-stroke-1.5/IconLayoutColumn";
import { IconLayoutHalfFull } from "@central-icons-react/round-outlined-radius-2-stroke-1.5/IconLayoutHalfFull";
import { IconMagnifyingGlass } from "@central-icons-react/round-outlined-radius-2-stroke-1.5/IconMagnifyingGlass";
import { IconMarkdown } from "@central-icons-react/round-outlined-radius-2-stroke-1.5/IconMarkdown";
import { IconPlusSmall } from "@central-icons-react/round-outlined-radius-2-stroke-1.5/IconPlusSmall";
import { IconQuestionmarkCircle } from "@central-icons-react/round-outlined-radius-2-stroke-1.5/IconQuestionmarkCircle";
import { IconSettingsGear2 } from "@central-icons-react/round-outlined-radius-2-stroke-1.5/IconSettingsGear2";
import { IconSidebarSimpleLeftWide } from "@central-icons-react/round-outlined-radius-2-stroke-1.5/IconSidebarSimpleLeftWide";

const ICONS = {
  "git-branch": IconBranch,
  "plus-minus": IconChanges,
  globe: IconGlobe,
  "magnifying-glass": IconMagnifyingGlass,
  "square-split-horizontal": IconLayoutColumn,
  "square-split-vertical": IconLayoutHalfFull,
  "sidebar-simple": IconSidebarSimpleLeftWide,
  terminal: IconConsoleSimple,
  folder: IconFolder1,
  "file-code": IconCode,
  "file-md": IconMarkdown,
  "caret-right": IconChevronRightSmall,
  "caret-down": IconChevronDownSmall,
  "arrows-in-line-vertical": IconChevronGrabberVerticalToward,
  x: IconCrossSmall,
  plus: IconPlusSmall,
  gear: IconSettingsGear2,
  question: IconQuestionmarkCircle,
  gift: IconGift1,
} as const;

export type IconName = keyof typeof ICONS;

export default function Icon({ name, size = 16, className }: { name: IconName; size?: number; className?: string }) {
  const Central = ICONS[name];
  // `raw`: plain strokes in currentColor, without the mask the package wraps them in by default.
  return <Central size={size} mode="raw" className={className} focusable="false" />;
}
