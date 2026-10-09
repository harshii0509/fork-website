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
  { id: "more", step: "Value", force: "pull", stage: "activation", question: "What else is in it? (games while you wait, reading, safety, light and dark)" },
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

// The home page's "Also in Fork" has room for four more: what used to be its games and themes sections, plus
// reading and the safety nets. (The Blueprint and Terminal drafts keep MORE as it is.)
export const MORE_HOME = [
  ...MORE,
  {
    id: "safe",
    figure: "padlock",
    title: "Safe while you learn",
    body: "Fork waits for Enter before anything that changes things. Deleting moves files to the Trash, and commands that can’t be undone ask first.",
  },
  {
    id: "wait",
    figure: "phosphor",
    title: "Games while you wait",
    body: "Snake, Stack and Space Run open in a split beside the terminal, so waiting on an agent is less dull.",
  },
  {
    id: "read",
    figure: "riffle",
    title: "Read beside it",
    body: "Open a PDF or EPUB in the panel (⌘P). Fork keeps your place in every book, and says when the agent is done.",
  },
  {
    id: "looks",
    figure: "exploded",
    title: "Light, dark or your Mac",
    body: "Fork follows your Mac’s light or dark look until you pick one in Settings.",
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

// ---- The home page below the hero (9 Oct), in Linear's way ----
// Each section: a heading on the left, one short line on the right, a mono index, then one big figure whose
// mono list drives the product beside it. Few words, no boxes inside boxes. (Mobbin: Linear's 1.0 Intake,
// FIG 2.1, and its numbers-and-a-quote row.)

export type Part = { id: string; index: string; fig: string; title: string; line: string; items: readonly (readonly [string, string])[] };

export const PARTS: Record<"problem" | "workspaces" | "changes" | "breaks", Part> = {
  problem: {
    id: "problem",
    index: "1.0 The problem",
    fig: "FIG 1.1",
    title: "Five agents. One of them is asking you something.",
    line: "Each runs in a window of its own. You find out which one finished, failed or got stuck by clicking through them all.",
    items: [
      ["Today", "Five windows"],
      ["In Fork", "Five tabs"],
    ],
  },
  workspaces: {
    id: "workspaces",
    index: "2.0 Workspaces",
    fig: "FIG 2.1",
    title: "Every project gets a tab.",
    line: "A workspace is a folder: its terminals, files and changes stay together. The square on its tab tells you what’s happening there.",
    items: [
      ["Working", "The square ripples while an agent works."],
      ["Needs you", "Yellow when it’s done or has a question, until you look."],
      ["Failed", "Red when something didn’t work."],
      ["Ready", "Its own colour. Nothing to see."],
    ],
  },
  changes: {
    id: "changes",
    index: "3.0 Changes",
    fig: "FIG 3.1",
    title: "See what the agent changed.",
    line: "Your app, a picture from before and after every turn, and your design system, in a panel beside the terminal.",
    items: [
      ["App", "Your site at localhost, right there."],
      ["Changes", "Before and after. Drag the line."],
      ["Design", "Colours, type and spacing from your own files."],
    ],
  },
  breaks: {
    id: "breaks",
    index: "4.0 When it breaks",
    fig: "FIG 4.1",
    title: "Calm when something breaks.",
    line: "Fork says what went wrong in plain words, types the fix for you to check, and keeps a net under the risky things.",
    items: [
      ["Plain-words errors", "Common ones explained on your Mac."],
      ["Nothing runs until Enter", "Fork types. You decide."],
      ["rm goes to the Trash", "And what can’t be undone asks first."],
    ],
  },
};

export const QUIET = {
  agents: {
    title: "Your agent, as it ships.",
    line: "Fork runs each one exactly as it ships, in a real terminal. Same speed, your login, your plan.",
    cmds: ["claude", "codex", "gemini", "opencode", "aider", "npm run dev"],
  },
  ships: {
    title: "Shipped every few days.",
    line: "Every change is written down, with why it was made.",
    more: "What’s cooking →",
  },
  // The maker's own words, from his thank-you note.
  quote: "I wanted a terminal that felt calmer when I’m juggling a dozen things, and a little more human when I’m figuring things out.",
  by: ["Harshvardhan", "made Fork"],
} as const;
