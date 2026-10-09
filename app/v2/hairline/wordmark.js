// Fork's own hairline figure, drawn with the hairline-create kit on ./kernel.js (MIT, @lucasmarkes/hairline).
// The kit's format, unchanged, except that it exports what it would hand to hairline().
import HL from "./kernel";

const hairline = (figure) => figure;

/**
 * Wordmark: the word FORK built as four block letters standing on one long
 * low plate. Each letter is a few rounded bars, the strokes of R's leg and K's
 * arms leaning bars, with a hairline gap wherever two bars meet. The letter
 * under the pointer lifts off the plate, its neighbours lifting less,
 * staggered outwards from it on the 700ms lift curve, and a dashed ghost stays
 * on the plate where it stood. At rest the K is a little raised and bright:
 * the one that forks off. The slider is how high a letter lifts.
 *
 * The row is turned 9 degrees off the camera's diagonal, less than the numerals
 * are, so the word reads nearly flat across and still shows its depth.
 *
 * The pattern: discrete items, as Riffle. Tweens, a stagger by distance, and a
 * hit test on the upright plane the letters stand in at rest, which never moves.
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, prism, proj, rad, ringAt, rrect, run,
  tdone, tset, tval, tween, disposer, mk, pointer, put, reflect, register, solid,
} = HL;

/** A letter's height, bar thickness and depth; the break between bars; the gap between letters. */
const H = 40, T = 7, D = 8, GP = 1.2, G = 8, B = 1;
/** The plate: its margin at the ends, behind and in front of the letters, its thickness; the reflection's depth. */
const M = 10, BACK = 5, FRONT = 12, PT = 4, RD = 12, LMAX = 22, STEP = 45, KREST = 5;
/** The row's direction on the ground, in degrees: -45 would face the camera square on. */
const ROW = -36, CA = Math.cos(rad(ROW)), SA = Math.sin(rad(ROW));
/** How much of the lift a letter takes, by its distance from the one picked; the reach ends on a floor. */
const FALL = [1, 0.4, 0.16];
const h = H / 2;
/**
 * The letters, each a width and its bars in its own frame, low before high and left to right.
 * A straight bar is [u0, u1, z0, z1]; a leaning one is [u0, u1, z0, u0', u1', z1], its foot and its top.
 */
const LETTERS = [
  { ch: "f", w: 26, bars: [[0, T, 0, H], [T + GP, 21, h - 3, h + 4], [T + GP, 26, H - T, H]] },
  { ch: "o", w: 30, bars: [[0, T, 0, H], [T + GP, 30 - T - GP, 0, T], [T + GP, 30 - T - GP, H - T, H], [30 - T, 30, 0, H]] },
  { ch: "r", w: 30, bars: [[0, T, 0, H], [23, 30, 0, 12, 19, h - 4], [T + GP, 30 - T - GP, h - 3, h + 4], [T + GP, 30 - T - GP, H - T, H], [30 - T, 30, h - 3, H]] },
  { ch: "k", w: 30, bars: [[0, T, 0, H], [23, 30, 0, T + GP, 2 * T + GP, h - GP], [T + GP, 2 * T + GP, h + GP, 23, 30, H]] },
];

/** A point of the row's own frame, s along it and v out of its face, on the ground. */
const at = (s, v) => [s * CA - v * SA, s * SA + v * CA];
/** A rounded footprint in the row's frame, [ring, crease ring], turned onto the ground, normals and all. */
function foot(s0, v0, s1, v1, r, b) {
  const turn = (ring) => ring.map((q) => ({ u: q.u * CA - q.v * SA, v: q.u * SA + q.v * CA, nu: q.nu * CA - q.nv * SA, nv: q.nu * SA + q.nv * CA }));
  r = Math.min(r, (s1 - s0) / 2, (v1 - v0) / 2);
  return [turn(rrect(s0, v0, s1, v1, r)), turn(rrect(s0 + b, v0 + b, s1 - b, v1 - b, Math.max(0.3, r - b)))];
}

/** Lays the letters along the row, left to right, which is back to front, and says where the plate ends. */
function layout() {
  let x = 0;
  const letters = LETTERS.map((l) => {
    const c = { ...l, x0: x, x1: x + l.w };
    x += l.w + G;
    return c;
  });
  return { letters, s0: -M, s1: x - G + M };
}

/** The camera, fitted to the plate, its reflection, and a letter at full lift. */
function camera(s0, s1) {
  const pts = [];
  for (const s of [s0, s1]) for (const v of [-D / 2 - BACK, D / 2 + FRONT]) pts.push([...at(s, v), 0], [...at(s, v), -PT - RD]);
  for (const s of [s0, s1]) pts.push([...at(s, -D / 2), H + LMAX]);
  const C = Cam(45, 0.5, 1.9);
  fit(C, pts, 200, 166);
  return C;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;

  const { letters, s0, s1 } = layout();
  const C = camera(s0, s1), P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the plate, and its reflection under it
  const [plate, plateIn] = foot(s0, -D / 2 - BACK, s1, D / 2 + FRONT, 6, 1.6);
  reflect(svg, g, P, front, plate, -PT, RD);
  put(solid(g), prism(P, front, plate, plateIn, -PT, 0));

  /** A bar's two strings at a lift of z: a straight bar is a prism, a leaning one the hull of its foot and its top. */
  function bar(c, b, z) {
    const lean = b.length === 6;
    const [f, fi] = foot(c.x0 + b[0], -D / 2, c.x0 + b[1], D / 2, 2, B);
    if (!lean) return prism(P, front, f, fi, b[2] + z, b[3] + z);
    const [t, ti] = foot(c.x0 + b[3], -D / 2, c.x0 + b[4], D / 2, 2, B);
    return {
      sil: poly(hull(ringAt(P, f, b[2] + z).concat(ringAt(P, t, b[5] + z)))),
      crease: open(ringAt(P, run(ti, front), b[5] + z)),
    };
  }

  // the letters, back to front; in each, its ghost goes first, behind its bars
  letters.forEach((c, i) => {
    const grp = mk("g", {}, g);
    c.ghost = mk("path", { class: "nf dash" }, grp);
    c.ghost.setAttribute("d", "");
    c.parts = c.bars.map((b) => ({ b, s: solid(grp) }));
    c.z = tween(0);
    c.drawn = NaN;
    c.ghostOn = false;
    c.i = i;
  });
  const K = letters.length - 1;

  function draw(c, z) {
    c.drawn = z;
    for (const p of c.parts) put(p.s, bar(c, p.b, z));
    c.ghost.setAttribute("d", c.ghostOn && z > 0.5 ? c.bars.map((b) => bar(c, b, 0).sil).join(" ") : "");
  }

  const Bk = register(stage, (_dt, now) => {
    let moving = false;
    for (const c of letters) {
      const z = tval(c.z, now);
      if (z !== c.drawn) draw(c, z);
      if (!tdone(c.z, now)) moving = true;
    }
    return moving;
  });
  bag.add(Bk.unregister);

  // hit test: the pointer on the upright plane the letters stand in, as (s, z), at rest.
  // The nearest letter along the row wins; the band is fixed, so a lifting letter cannot flip the choice.
  const o = P(0, 0, 0), px = P(...at(1, 0), 0), pz = P(0, 0, 1);
  const ex = [px[0] - o[0], px[1] - o[1]], ez = [pz[0] - o[0], pz[1] - o[1]], det = ex[0] * ez[1] - ex[1] * ez[0];
  function hit([sx, sy]) {
    const qx = sx - o[0], qy = sy - o[1];
    const x = (qx * ez[1] - qy * ez[0]) / det, z = (ex[0] * qy - ex[1] * qx) / det;
    if (x < s0 || x > s1 || z < -PT - 14 || z > H + 10) return -1;
    let best = -1, bd = Infinity;
    letters.forEach((c, i) => {
      const dd = Math.abs(x - (c.x0 + c.x1) / 2);
      if (dd < bd) { bd = dd; best = i; }
    });
    return best;
  }

  let act = -1;
  /** Lifts letter a, or at rest (-1) raises the K a little. The stagger spreads out from the letter picked, or the one let go. */
  function aim(a, from, stagger) {
    const now = performance.now();
    letters.forEach((c, i) => {
      const k = a < 0 ? (i === K ? KREST / clamp(lift, 1, LMAX) : 0) : FALL[Math.min(Math.abs(i - a), FALL.length - 1)];
      tset(c.z, k * lift, now, stagger ? Math.abs(i - from) * STEP : 0);
      const on = a < 0 ? i === K : i === a;
      for (const p of c.parts) p.s.sil.classList.toggle("hi", on);
      if (c.ghostOn !== (i === a)) { c.ghostOn = i === a; c.drawn = NaN; }
    });
    read.textContent = a < 0 ? "rest" : "letter " + (a + 1) + " · " + letters[a].ch;
    Bk.wake();
  }
  function setActive(a) {
    if (a === act) return;
    const from = a >= 0 ? a : act;
    act = a;
    aim(a, from, true);
  }
  aim(-1, -1, false);

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { lift = v; aim(act, act, false); },
    destroy: bag.dispose,
  };
}

export default hairline({
  name: "wordmark",
  means: "The word Fork in block letters on one plate: point at a letter and it lifts, leaving a dashed ghost where it stood.",
  rules: [1, 2, 6, 9],
  range: [8, 15, 22],
  tour: [[94, 150], [304, 160], [161, 150], null],
  mount,
});
