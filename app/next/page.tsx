import { permanentRedirect } from "next/navigation";

// The new home page was previewed here; it's on / now, so old review links land there.
export default function Next() {
  permanentRedirect("/");
}
