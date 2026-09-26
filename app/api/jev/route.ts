// Fork's "Smarter matching" (Jev, by TypeSafe) goes through here, so the TypeSafe key lives only on
// this server (TYPESAFE_API_KEY in Vercel) and never inside the Fork app.
// Only Fork's two questions are accepted, with size limits and a per-address limit, so this can't be
// used as a general AI on Fork's bill. The TypeSafe spending limit is the hard ceiling behind that.
// The Fork side is designer-terminal/jev.mjs; its check.mjs keeps INSTRUCTIONS here in step with it.

const TYPESAFE = "https://api.typesafe.ai/v1/systemone";

// Exactly the instructions Fork sends (jev.mjs). Anything else is refused.
const INSTRUCTIONS = [
  "A designer new to the terminal typed `request` into a command search. Which built-in command does what they asked for? Pick none if none of them does it.",
  "A command failed in a Mac terminal and printed `terminal_output`. Which of these known problems is it? Pick none if it is a different problem.",
];
const STATE_KEYS = ["request", "terminal_output"];
const MAX_OPTIONS = 60, MAX_TEXT = 4000, MAX_CRITERION = 400;

// About 60 asks per 10 minutes from one address: plenty for a person, useless for a script.
// In memory, so it's per server instance and best effort.
const WINDOW_MS = 10 * 60_000, PER_WINDOW = 60;
const seen = new Map<string, { start: number; n: number }>();
function allowed(ip: string) {
  const now = Date.now();
  if (seen.size > 10_000) for (const [k, v] of seen) if (now - v.start > WINDOW_MS) seen.delete(k);
  const s = seen.get(ip);
  if (!s || now - s.start > WINDOW_MS) { seen.set(ip, { start: now, n: 1 }); return true; }
  return ++s.n <= PER_WINDOW;
}

type Question = { type?: unknown; instructions?: unknown; criteria?: unknown };

// The request, or why it's refused.
function valid(body: unknown): { state: Record<string, string>; question: Question } | string {
  if (!body || typeof body !== "object") return "bad body";
  const { state, question } = body as { state?: unknown; question?: Question };
  if (!state || typeof state !== "object" || !question || typeof question !== "object") return "bad body";
  const keys = Object.keys(state);
  if (keys.length !== 1 || !STATE_KEYS.includes(keys[0])) return "bad state";
  const text = (state as Record<string, unknown>)[keys[0]];
  if (typeof text !== "string" || !text.trim() || text.length > MAX_TEXT) return "bad state";
  if (question.type !== "choice" || !INSTRUCTIONS.includes(question.instructions as string)) return "not a Fork question";
  const c = question.criteria;
  if (!c || typeof c !== "object") return "bad criteria";
  const entries = Object.entries(c);
  if (entries.length < 2 || entries.length > MAX_OPTIONS || !("none" in c)) return "bad criteria";
  if (entries.some(([k, v]) => k.length > 100 || typeof v !== "string" || v.length > MAX_CRITERION)) return "bad criteria";
  return { state: { [keys[0]]: text }, question: { type: "choice", instructions: question.instructions, criteria: c } };
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (!allowed(ip)) return Response.json({}, { status: 429 });
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({}, { status: 400 }); }
  const v = valid(body);
  if (typeof v === "string") return Response.json({ error: v }, { status: 400 });
  const key = process.env.TYPESAFE_API_KEY?.trim(); // a pasted key can carry a stray newline
  if (!key) return Response.json({}, { status: 503 });
  try {
    const r = await fetch(TYPESAFE, {
      method: "POST", signal: AbortSignal.timeout(5000),
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "jev-latest", state: v.state, questions: { q: v.question } }),
    });
    if (!r.ok) return Response.json({}, { status: 502 }); // TypeSafe's own error stays here
    const a = (await r.json()).answers?.q;
    return Response.json(a?.choice ? { choice: a.choice, confidence: a.confidence ?? 0 } : {});
  } catch {
    return Response.json({}, { status: 502 });
  }
}
