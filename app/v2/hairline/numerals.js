// Fork's own hairline figure, drawn with the hairline-create kit on ./kernel.js (MIT, @lucasmarkes/hairline).
// The kit's format, unchanged, except that it exports what it would hand to hairline().
import HL from "./kernel";

const hairline = (figure) => figure;

/**
 * Numerals: a version number carved as a seven-segment display. Each digit is
 * up to seven rounded bars standing on one long low plate, each dot a small
 * rounded block. The digit under the pointer lifts off the plate, its
 * neighbours lifting less, staggered outwards from it on the 700ms lift curve,
 * and the segments it does not use appear as dashed ghosts: the 8 it is cut
 * from. The slider is how high it lifts.
 *
 * The string comes from the stage's data-digits attribute, "1.1.0" without it,
 * and the scale is chosen from its length, so any version fits the frame.
 *
 * The row is turned 20 degrees off the camera's diagonal, so the faces of the
 * digits are seen nearly square on and still show a little of their depth.
 *
 * The pattern: discrete items, as Riffle. Tweens, a stagger by distance, and a
 * hit test on the upright plane the digits stand in at rest, which never moves.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rad, reflect, rrect,
  tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid,
} = HL;

/** A digit's cell: width, height, bar thickness, depth, the break between bars. G is the gap between characters, DW a dot's width. */
const W = 26, H = 40, T = 4.4, D = 7, GP = 1, G = 6, DW = 5, B = 1;
/** The plate: its margin at the ends, behind and in front of the digits, its thickness; the reflection's depth; the most a digit lifts. */
const M = 9, BACK = 5, FRONT = 11, PT = 4, RD = 12, LMAX = 22, STEP = 45;
/** The row's direction on the ground, in degrees: -45 would face the camera square on. */
const ROW = -25, CA = Math.cos(rad(ROW)), SA = Math.sin(rad(ROW));
/** How much of the lift a character takes, by its distance from the one picked; the reach ends on a floor. */
const FALL = [1, 0.36, 0.14, 0.06];
/** The segments, a to g, each numeral lights. */
const LIT = ["abcdef", "bc", "abdeg", "abcdg", "bcfg", "acdfg", "acdefg", "abc", "abcdefg", "abcdfg"];
/** The seven bars in a digit's own frame, [u0, u1, z0, z1]: tall pillars at the sides, short slabs between them. */
const SEG = {
  e: [0, T, 0, H / 2 - GP], f: [0, T, H / 2 + GP, H],
  d: [T + GP, W - T - GP, 0, T], g: [T + GP, W - T - GP, H / 2 - T / 2, H / 2 + T / 2], a: [T + GP, W - T - GP, H - T, H],
  c: [W - T, W, 0, H / 2 - GP], b: [W - T, W, H / 2 + GP, H],
};
/** Paint order inside a digit: the left pillars, the slabs, the right pillars, low before high. Nearer comes later. */
const ORDER = "efdgacb";

/** The version to draw: digits and dots only, from the stage's data-digits, or "1.1.0". */
function digitsOf(stage) {
  const s = (stage.getAttribute("data-digits") || "").replace(/[^0-9.]/g, "").slice(0, 8);
  return /[0-9]/.test(s) ? s : "1.1.0";
}

/** A point of the row's own frame, s along it and v out of its face, on the ground. */
const at = (s, v) => [s * CA - v * SA, s * SA + v * CA];
/** A rounded footprint in the row's frame, [ring, crease ring], turned onto the ground, normals and all. */
function foot(s0, v0, s1, v1, r, b) {
  const turn = (ring) => ring.map((q) => ({ u: q.u * CA - q.v * SA, v: q.u * SA + q.v * CA, nu: q.nu * CA - q.nv * SA, nv: q.nu * SA + q.nv * CA }));
  r = Math.min(r, (s1 - s0) / 2, (v1 - v0) / 2);
  return [turn(rrect(s0, v0, s1, v1, r)), turn(rrect(s0 + b, v0 + b, s1 - b, v1 - b, Math.max(0.3, r - b)))];
}

/** Lays the characters along the row, left to right, which is back to front, and says where the plate ends. */
function layout(str) {
  const chars = [];
  let x = 0;
  for (const ch of str) {
    const dot = ch === ".", w = dot ? DW : W;
    chars.push({ ch, dot, x0: x, x1: x + w });
    x += w + G;
  }
  // the plate runs a margin past the ink, not past the cells, so a leading 1 stands near its end
  const ink = (c) => {
    if (c.dot) return [c.x0, c.x1];
    const bars = [...LIT[+c.ch]].map((k) => SEG[k]);
    return [c.x0 + Math.min(...bars.map((b) => b[0])), c.x0 + Math.max(...bars.map((b) => b[1]))];
  };
  return { chars, s0: ink(chars[0])[0] - M, s1: ink(chars[chars.length - 1])[1] + M };
}

/** The camera, scaled to the string and fitted to the plate, its reflection, and a digit at full lift. */
function camera(s0, s1) {
  const pts = [];
  for (const s of [s0, s1]) for (const v of [-D / 2 - BACK, D / 2 + FRONT]) pts.push([...at(s, v), 0], [...at(s, v), -PT - RD]);
  for (const s of [s0, s1]) pts.push([...at(s, -D / 2), H + LMAX]);
  const P1 = proj(Cam(45, 0.5, 1)), q = pts.map((p) => P1(p[0], p[1], p[2]));
  const xs = q.map((p) => p[0]), ys = q.map((p) => p[1]);
  const w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys);
  const C = Cam(45, 0.5, clamp(Math.min(300 / w, 228 / h), 1.2, 2.6));
  fit(C, pts, 200, 166);
  return C;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;

  const { chars, s0, s1 } = layout(digitsOf(stage));
  const C = camera(s0, s1), P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the plate, and its reflection under it
  const [plate, plateIn] = foot(s0, -D / 2 - BACK, s1, D / 2 + FRONT, 6, 1.6);
  reflect(svg, g, P, front, plate, -PT, RD);
  put(solid(g), prism(P, front, plate, plateIn, -PT, 0));

  // the characters, left to right; in each digit the ghosts of its unlit bars go first, behind its lit ones
  let n = 0;
  for (const c of chars) {
    const grp = mk("g", {}, g);
    Object.assign(c, { z: tween(0), drawn: NaN, ghostOn: false, parts: [], ghosts: [] });
    if (c.dot) {
      c.parts.push({ ring: foot(c.x0, -D / 2 + 0.5, c.x1, D / 2 - 0.5, 1.8, B), z0: 0, z1: DW, s: solid(grp) });
      continue;
    }
    c.place = ++n; c.value = +c.ch;
    const lit = LIT[c.value], bar = (k) => {
      const [u0, u1, z0, z1] = SEG[k];
      return { ring: foot(c.x0 + u0, -D / 2, c.x0 + u1, D / 2, 9, B), z0, z1 };
    };
    for (const k of ORDER) if (!lit.includes(k)) c.ghosts.push({ ...bar(k), el: mk("path", { class: "nf dash" }, grp) });
    for (const k of ORDER) if (lit.includes(k)) c.parts.push({ ...bar(k), s: solid(grp) });
  }
  const first = chars.findIndex((c) => !c.dot);

  function draw(c, z) {
    c.drawn = z;
    for (const p of c.parts) put(p.s, prism(P, front, p.ring[0], p.ring[1], p.z0 + z, p.z1 + z));
    for (const p of c.ghosts) p.el.setAttribute("d", c.ghostOn ? prism(P, front, p.ring[0], null, p.z0 + z, p.z1 + z).sil : "");
  }

  const Bk = register(stage, (_dt, now) => {
    let moving = false;
    for (const c of chars) {
      const z = tval(c.z, now);
      if (z !== c.drawn) draw(c, z);
      if (!tdone(c.z, now)) moving = true;
    }
    return moving;
  });
  bag.add(Bk.unregister);

  // hit test: the pointer on the upright plane the digits stand in, as (s, z), at rest.
  // The nearest digit along the row wins; the band is fixed, so a lifting digit cannot flip the choice.
  const o = P(0, 0, 0), px = P(...at(1, 0), 0), pz = P(0, 0, 1);
  const ex = [px[0] - o[0], px[1] - o[1]], ez = [pz[0] - o[0], pz[1] - o[1]], det = ex[0] * ez[1] - ex[1] * ez[0];
  function hit([sx, sy]) {
    const qx = sx - o[0], qy = sy - o[1];
    const x = (qx * ez[1] - qy * ez[0]) / det, z = (ex[0] * qy - ex[1] * qx) / det;
    if (x < s0 || x > s1 || z < -PT - 14 || z > H + 10) return -1;
    let best = -1, bd = Infinity;
    chars.forEach((c, i) => {
      const dd = Math.abs(x - (c.x0 + c.x1) / 2);
      if (!c.dot && dd < bd) { bd = dd; best = i; }
    });
    return best;
  }

  let act = -1;
  /** Lifts digit a (-1 sets them all down). The stagger spreads out from the digit picked, or the one let go. */
  function aim(a, from, stagger) {
    const now = performance.now();
    chars.forEach((c, i) => {
      const k = a < 0 ? 0 : FALL[Math.min(Math.abs(i - a), FALL.length - 1)];
      tset(c.z, k * lift, now, stagger ? Math.abs(i - from) * STEP : 0);
      if (c.dot) return;
      const on = a < 0 ? i === first : i === a;
      for (const p of c.parts) p.s.sil.classList.toggle("hi", on);
      if (c.ghostOn !== (i === a)) { c.ghostOn = i === a; c.drawn = NaN; }
    });
    read.textContent = a < 0 ? "rest" : "digit " + chars[a].place + " · " + chars[a].value;
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
    set: (v) => { lift = v; if (act >= 0) aim(act, act, false); },
    destroy: bag.dispose,
  };
}

export default hairline({
  name: "numerals",
  means: "A version number built from seven-segment bars: point at a digit and it lifts, showing the segments it doesn't use.",
  rules: [1, 2, 6, 9],
  range: [8, 15, 22],
  tour: [[105, 148], [269, 178], [193, 164], null],
  mount,
});
