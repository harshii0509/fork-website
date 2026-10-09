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
// designer-terminal docs/IA.md: workspaces, status squares, the panel's Changes and Design tabs).
// Platform-neutral: "an agent", not one AI tool, except where a feature depends on it.

export const DOWNLOAD = "https://github.com/harshii0509/Fork/releases/latest/download/Fork.dmg";
export const GITHUB = "https://github.com/harshii0509/Fork";
export const INSTALL_CMD = "curl -fsSL https://raw.githubusercontent.com/harshii0509/Fork/main/install.sh | bash";
// Where the home page lives: links from other pages (What's cooking) point here.
export const HOME = "/";
// The line drawings (MIT), credited in the thanks letter.
export const HAIRLINE = "https://hairline.lucasmarkes.com";
export const HAIRLINE_CMD = "npm i @lucasmarkes/hairline";

type Force = "push" | "pull" | "push + pull" | "habit + anxiety";
type Stage = "acquisition" | "activation" | "retention" | "referral" | "revenue" | null;

export const NARRATIVE: { id: string; step: string; force: Force; stage: Stage; question: string }[] = [
  { id: "top", step: "Hook", force: "push + pull", stage: "acquisition", question: "What is this, and is it for me?" },
  { id: "insight", step: "Insight", force: "push", stage: "acquisition", question: "Why is working with agents so hard to keep track of?" },
  { id: "workspaces", step: "Value", force: "pull", stage: "activation", question: "How do I know what each agent is doing?" },
  { id: "design", step: "Value", force: "pull", stage: "activation", question: "Can I see what my project looks like, as it changes?" },
  { id: "more", step: "Value", force: "pull", stage: "activation", question: "What else is in it?" },
  { id: "wait", step: "Value", force: "pull", stage: "retention", question: "What do I do while I wait?" },
  { id: "yours", step: "Value", force: "pull", stage: "retention", question: "Will it feel like mine?" },
  { id: "cooking", step: "Proof", force: "pull", stage: "referral", question: "Is anyone still working on this?" },
  { id: "faq", step: "Alternatives + objections", force: "habit + anxiety", stage: null, question: "Do I need AI? Is it safe?" },
  { id: "download", step: "Close", force: "pull", stage: "acquisition", question: "How do I get it?" },
  { id: "thanks", step: "Close", force: "pull", stage: "referral", question: "Who made this?" },
];

// "Also in Fork": smaller things, each a line figure and two lines of words. No demos.
export const MORE = [
  {
    id: "changes",
    figure: "beforeafter",
    title: "Before and after",
    body: "Each time an agent finishes, Fork takes a picture of your app from before and after. Compare them side by side or with a slider.",
  },
  {
    id: "oops",
    figure: "query",
    title: "Know what went wrong",
    body: "When a command fails, one click explains it in plain words and types the fix for you to check. Common errors are answered offline.",
  },
  {
    id: "words",
    figure: "terminal",
    title: "Say it in plain words",
    body: "Press ⌘⇧K and type what you want, like “take me up one folder”. Fork finds the command and waits for you to run it.",
  },
  {
    id: "files",
    figure: "loupe",
    title: "Your files, right there",
    body: "Search every file with ⌘K. Preview code, Markdown and images beside the terminal, and put the lines you pick into it.",
  },
] as const;

export const FAQ = [
  {
    q: "Do I need AI to use Fork?",
    a: "No. It’s a terminal first: search, the panel, the command palette and the error library all work without AI, and you can run any tool you like in it. If you use Claude Code, Ask AI and the unusual-error explainer use it, with your own login.",
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
    q: "Will my Mac warn me when I open it?",
    a: "No. Fork is signed and notarized by Apple, so it opens like any other Mac app. The first time, macOS just checks you meant to open something you downloaded.",
  },
  {
    q: "Which Macs does it run on?",
    a: "Macs with Apple Silicon (M1 and newer). It’s free. When a new version is out, a small pill in the top strip says so, and restarting into it brings your workspaces back.",
  },
  {
    q: "Do the before and after pictures leave my Mac?",
    a: "No. Fork takes them on your Mac from your own app at localhost, keeps the last 20 per workspace, and never uploads them. You can turn them off in Settings.",
  },
  {
    q: "Is this the Git app called Fork?",
    a: "No, that’s a different app (fork.dev). This Fork is a terminal.",
  },
] as const;

// The home page's sections, in NARRATIVE's order, as both new directions show them (app/blueprint, app/terminal).
// `title` is split round the one phrase each direction emphasises (Blueprint sets it in italic, Terminal in
// colour). `cmd` is how the Terminal direction opens the section: as a command you could type.
export type Section = {
  id: string;
  eyebrow: string;
  title: [string, string, string];
  lede?: string;
  cmd: string;
};

export const SECTIONS: Record<string, Section> = {
  top: {
    id: "top",
    eyebrow: "Fork for Mac",
    title: ["A terminal that ", "tells you", " when an agent is done."],
    lede: "Every project in its own tab, a square that says what’s happening there, and your app, its changes and its design system right beside the terminal.",
    cmd: "fork",
  },
  insight: {
    id: "insight",
    eyebrow: "The problem",
    title: ["You started three agents. Which one is ", "waiting on you", "?"],
    lede: "Agents work in terminals you can’t see. One finished ten minutes ago, one is stuck on a question, and you only find out by clicking through every window. Fork gives every project its own tab, and the tab tells you.",
    cmd: "fork --why",
  },
  workspaces: {
    id: "workspaces",
    eyebrow: "Workspaces",
    title: ["One tab per project. ", "One square", " that tells you."],
    lede: "A workspace is a folder: its terminals, files, search and changes stay together. The square on its tab is the status, so you can work in one project and still see the others.",
    cmd: "fork --workspaces",
  },
  design: {
    id: "design",
    eyebrow: "Design tab",
    title: ["Your design system, ", "live", " beside the terminal."],
    lede: "The Design tab reads colours, type, spacing and radii from your project’s own files, light and dark side by side, and redraws when an agent changes one. Click a token to copy it.",
    cmd: "fork --design",
  },
  more: {
    id: "more",
    eyebrow: "Also in Fork",
    title: ["And the things that make a terminal ", "kind", "."],
    cmd: "fork --more",
  },
  yours: {
    id: "yours",
    eyebrow: "Appearance",
    title: ["Light, dark, or ", "follow your Mac", "."],
    lede: "Pick one and the window takes it, the way Fork does.",
    cmd: "fork --appearance",
  },
  cooking: {
    id: "cooking",
    eyebrow: "Changelog",
    title: ["Cooked ", "in the open", "."],
    lede: "Every change to Fork is written down, with why it was made.",
    cmd: "fork changelog --latest",
  },
  faq: {
    id: "faq",
    eyebrow: "Questions",
    title: ["Before you ", "download", "."],
    cmd: "fork --help",
  },
  download: {
    id: "download",
    eyebrow: "Download",
    title: ["Free, for Macs with ", "Apple Silicon", "."],
    lede: "Signed and notarized. Your workspaces come back after every update.",
    cmd: "fork install",
  },
  thanks: {
    id: "thanks",
    eyebrow: "Made by",
    title: ["Made by Harshvardhan, ", "for people who build things", "."],
    lede: "I spend my days in terminals, and I wanted one that felt calmer when I’m juggling a dozen things and a little more human when I’m figuring things out. So I made Fork.",
    cmd: "whoami",
  },
};
