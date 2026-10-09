import Arcade from "./footers/Arcade";
import Files from "./footers/Files";
import Prompt from "./footers/Prompt";
import { facts } from "./footers/shared";
import Switch from "./footers/Switch";

// The end of every page. Three footers are on trial (?footer=a, b or c); the one picked stays, the others go.
// `at` is the page you're on.
export default function Footer({ at }: { at: "home" | "cooking" }) {
  const f = facts();
  return <Switch a={<Files at={at} facts={f} />} b={<Prompt facts={f} />} c={<Arcade facts={f} />} />;
}
