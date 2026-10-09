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

// ---- The home page below the hero (9 Oct): problem, reframe, three chapters, agents, small things, proof ----
// Structure from Mobbin research: name the pain first (Beside, Front), a row-by-row "today vs Fork" reframe
// (Ploy, V7), numbered chapters that each zoom into one part of the window (Vercel), a mixed-size bento for the
// smaller things (Attio), a maker's note, then a calm, centred download (Linear).

export const PROBLEM = {
  title: "You started five agents. Which one needs you?",
  lede: "Each one works in a window of its own. One finished ten minutes ago, one is asking you a question, one failed, and you only find out by clicking through them all.",
  before: "Five windows. One of them is asking you something.",
  after: "In Fork each one is a tab, and its square tells you.",
} as const;

export const REFRAME = {
  title: "A terminal, without the guesswork.",
  lede: "What changes when your terminal is Fork.",
  today: "The terminal today",
  fork: "In Fork",
  rows: [
    {
      id: "status",
      today: "Clicking through windows to find the one that’s done.",
      fork: "The square on each tab says it: working, needs you or failed.",
    },
    {
      id: "changes",
      today: "An agent changed your app, and you can’t see what.",
      fork: "A picture from before and after every turn, side by side.",
    },
    {
      id: "errors",
      today: "A wall of red text you paste somewhere to understand.",
      fork: "What went wrong, in plain words, with the fix typed for you to check.",
    },
    {
      id: "trash",
      today: "One wrong rm and a file is gone for good.",
      fork: "Deleting moves files to the Trash. Commands that can’t be undone ask first.",
    },
    {
      id: "words",
      today: "Looking up a command you’ll use once.",
      fork: "Say what you want in plain words, and Fork finds the command.",
    },
  ],
} as const;

export type Chapter = { n: string; label: string; title: string; lede: string; notes: readonly (readonly [string, string])[] };

export const CHAPTERS: Record<"know" | "see" | "learn", Chapter> = {
  know: {
    n: "01",
    label: "Know",
    title: "See every project at a glance.",
    lede: "Every project is a tab, and its square is the status. Work in one and still see the others.",
    notes: [
      ["Yellow until you look", "Finished, or asking you something. It stays yellow until you’ve seen it."],
      ["Told, even in another app", "The notch, a Mac notification or the Dock badge says when something’s done."],
      ["A workspace is a folder", "Its terminals, files, search and changes stay together in its tab."],
    ],
  },
  see: {
    n: "02",
    label: "See",
    title: "Watch your work change, not just the code.",
    lede: "Your app, what each agent turn changed, and your design system, in a panel beside the terminal. Drag the line.",
    notes: [
      ["Before and after, every turn", "Fork takes the pictures on your Mac, from your app at localhost. They never leave it."],
      ["Your design system, from your files", "Colours, type, spacing and radii from your CSS, Tailwind or tokens.json, light and dark side by side."],
      ["Your app, right there", "When your app starts, its address shows in the sidebar. Click it to open the app in the panel."],
    ],
  },
  learn: {
    n: "03",
    label: "Learn",
    title: "Kind to people new to the terminal.",
    lede: "Fork explains what went wrong, types the fix for you to check, and keeps a safety net under the risky things.",
    notes: [
      ["Errors in plain words", "Common errors are explained on your Mac, without sending anything anywhere."],
      ["Nothing runs until you press Enter", "Fork types commands for you and waits. You stay in charge."],
      ["A safety net", "rm moves files to the Trash, and commands that can’t be undone ask first."],
    ],
  },
};

export const AGENTS = {
  title: "Bring the agent you already use.",
  lede: "Fork runs each one exactly as it ships, in a real terminal. Same speed, your own login, your own plan, nothing in between.",
  // Commands, not brands: what you'd type. The last line is the point: anything that runs in a terminal.
  cmds: ["claude", "codex", "gemini", "opencode", "aider", "npm run dev"],
  rest: "or anything else that runs in a terminal",
} as const;

export const SMALL = {
  title: "And the small things.",
  lede: "The bits that make a long afternoon with agents nicer.",
  games: ["Games while you wait", "Snake, Stack and Space Run open in a split beside the terminal. When the agent is done, the game pauses and asks."],
  read: ["Read beside it", "Open a PDF or EPUB in the panel. Fork keeps your place in every book."],
  looks: ["Light, dark or your Mac", "Fork follows your Mac until you pick one. Try it here."],
  files: ["Your files, right there", "Search every file, and preview code, Markdown and images beside the terminal."],
  signed: ["Opens like any Mac app", "Signed and notarized by Apple. Updates bring your workspaces back."],
  free: ["Free, and out in the open", "No account and no trial. The code is on GitHub."],
} as const;

export const PROOF = {
  title: "Built in the open.",
  // {n} releases in {days} days: filled in from RELEASES.
  lede: (n: number, days: number) => `${n} releases in ${days} days, and every change written down with why it was made.`,
  more: "See everything that’s cooking →",
} as const;
