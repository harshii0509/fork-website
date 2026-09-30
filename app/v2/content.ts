// Everything the v2 page says, in one place, plus the story framework behind it.
//
// Three layers, from the Allie landing framework:
//   1. April Dunford's pitch order sets the order of the sections (insight → value → proof →
//      objections → close). The page leads with the problem, not the features.
//   2. Jobs to be Done "forces": each section pushes people away from the old way, pulls them
//      toward Fork, or settles a worry about trying it.
//   3. AARRR is how each section is measured, never the story. Clicks carry data-from=<id>.
//
// Copy rules: no em dashes, plain words, only claims the app backs (each checked against
// designer-terminal: 35 errors in errors.mjs, 27 themes in themes.js, 30 ⌘K commands).

export const DOWNLOAD = "https://github.com/harshii0509/Fork/releases/latest/download/Fork.dmg";
export const GITHUB = "https://github.com/harshii0509/Fork";
export const INSTALL_CMD = "curl -fsSL https://raw.githubusercontent.com/harshii0509/Fork/main/install.sh | bash";
// Where the home page lives: links from other pages (What's cooking) point here.
export const HOME = "/";
// The shaders behind the panels (Apache-2.0), credited in the thanks letter.
export const PAPER = "https://shaders.paper.design";
export const PAPER_CMD = "npm i @paper-design/shaders-react";

type Force = "push" | "pull" | "push + pull" | "habit + anxiety";
type Stage = "acquisition" | "activation" | "retention" | "referral" | "revenue" | null;

export const NARRATIVE: { id: string; step: string; force: Force; stage: Stage; question: string }[] = [
  { id: "top", step: "Hook", force: "push + pull", stage: "acquisition", question: "What is this, and is it for me?" },
  { id: "insight", step: "Insight", force: "push", stage: "acquisition", question: "Why is the terminal so hard?" },
  { id: "features", step: "Value", force: "pull", stage: "activation", question: "What does Fork do for me?" },
  { id: "wait", step: "Value", force: "pull", stage: "retention", question: "What do I do while I wait?" },
  { id: "yours", step: "Value", force: "pull", stage: "retention", question: "Will it feel like mine?" },
  { id: "cooking", step: "Proof", force: "pull", stage: "referral", question: "Is anyone still working on this?" },
  { id: "faq", step: "Alternatives + objections", force: "habit + anxiety", stage: null, question: "Do I need AI? Is it safe?" },
  { id: "download", step: "Close", force: "pull", stage: "acquisition", question: "How do I get it?" },
  { id: "thanks", step: "Close", force: "pull", stage: "referral", question: "Who made this?" },
];

// The blob on every tab, and what each look means (designer-terminal/renderer.js LOOKS).
export const BLOB_LOOKS = [
  { key: "ready", label: "Ready", state: "idle", expression: null, bad: false },
  { key: "running", label: "Running", state: "thinking", expression: null, bad: false },
  { key: "failed", label: "Last command failed", state: "idle", expression: "sad", bad: true },
  { key: "done", label: "Finished while you were away", state: "notify", expression: null, bad: false },
  { key: "dozing", label: "Dozing", state: "sleep", expression: null, bad: false },
] as const;

export const FEATURES = [
  {
    id: "cmdk",
    title: "Say it in plain words",
    body: "Press ⌘K and type what you want, like “take me up one folder”. Fork finds the right command, shows what it does, and waits for you to run it.",
  },
  {
    id: "oops",
    title: "Know what went wrong",
    body: "When a command fails, one click explains it in plain words and types the fix for you to check. 35 common errors are answered offline, no AI needed.",
  },
  {
    id: "nudge",
    title: "Next steps, with safety nets",
    body: "Suggestions for the folder you’re in, like Start the app or See what changed. rm moves things to the Trash, and anything that can’t be undone asks first.",
  },
  {
    id: "see",
    title: "See your work beside it",
    body: "Preview images, Markdown and code next to the terminal. When your app starts, Fork offers to show it right there.",
  },
] as const;

// A few of the app's 27 themes (designer-terminal/themes.js), as the variables ForkApp reads.
export const THEMES = [
  { name: "Designer", bg: "#141416", text: "#ececf1", accent: "#7c6cff", dark: true },
  { name: "Rosé Pine", bg: "#191724", text: "#e0def4", accent: "#c4a7e7", dark: true },
  { name: "Tokyo Night", bg: "#1a1b26", text: "#c0caf5", accent: "#7aa2f7", dark: true },
  { name: "Gruvbox Dark", bg: "#282828", text: "#ebdbb2", accent: "#fabd2f", dark: true },
  { name: "Vesper", bg: "#101010", text: "#ffffff", accent: "#e6b99d", dark: true },
  { name: "Catppuccin Latte", bg: "#eff1f5", text: "#4c4f69", accent: "#1e66f5", dark: false },
  { name: "Rosé Pine Dawn", bg: "#faf4ed", text: "#575279", accent: "#907aa9", dark: false },
  { name: "Gruvbox Light", bg: "#fbf1c7", text: "#3c3836", accent: "#458588", dark: false },
] as const;

export type Theme = (typeof THEMES)[number];

// ForkApp's --t-* variables for a theme. The sidebar stands in for the app's frosted glass.
export function themeVars(t: Theme): React.CSSProperties {
  return {
    "--t-bg": t.bg,
    "--t-text": t.text,
    "--t-accent": t.accent,
    "--t-accent-text": t.accent,
    "--t-dim": `color-mix(in srgb, ${t.text} 58%, ${t.bg})`,
    "--t-side": t.dark ? `color-mix(in srgb, ${t.text} 9%, ${t.bg})` : `color-mix(in srgb, ${t.text} 7%, ${t.bg})`,
  } as React.CSSProperties;
}

export const FAQ = [
  {
    q: "Do I need AI to use Fork?",
    a: "No. ⌘K’s built-in commands, the suggestions and the error library all work without AI, and you can run any tool you like in it. If you use Claude Code, Ask AI and the unusual-error explainer use it, with your own login.",
  },
  {
    q: "I’m new to the terminal. Is it safe?",
    a: "That’s who Fork is for. It types real commands for you and waits for Enter before anything that changes things. rm moves files to the Trash, and commands that can’t be undone ask first.",
  },
  {
    q: "What does Fork send anywhere?",
    a: "Anonymous usage only: which features get used, with a random ID per install. Never your commands, paths, file names or output. You can turn it off from the start screen or Settings.",
  },
  {
    q: "Why does my Mac warn me when I open it?",
    a: "Fork isn’t notarized by Apple yet. Open System Settings → Privacy & Security and choose Open Anyway, or install with the one-line command below, which skips the warning.",
  },
  {
    q: "Which Macs does it run on?",
    a: "Macs with Apple Silicon (M1 and newer). It’s free. When a new version is out, a small pill in the top bar says so, and Update and restart brings your tabs back afterwards.",
  },
  {
    q: "Is this the Git app called Fork?",
    a: "No, that’s a different app (fork.dev). This Fork is a terminal.",
  },
] as const;
