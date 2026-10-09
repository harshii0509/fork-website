// Fork's own hairline figure, drawn with the hairline-create kit on ./kernel.js (MIT, @lucasmarkes/hairline).
// The kit's format, unchanged, except that it exports what it would hand to hairline().
import HL from "./kernel";

const hairline = (figure) => figure;

/**
 * Keycaps: four mechanical keys on a low case, spelling FORK. Each cap tapers
 * to a dished top that leans back, its letter engraved on it, and stands on a
 * switch you can see under its skirt. The key under the pointer presses down
 * on its switch; its neighbours dip less, staggered outwards from it on the
 * 700ms curve. At rest the K is half pressed and bright, a key mid-type. The
 * slider is how far a key travels.
 *
 * The row is turned 9 degrees off the camera's diagonal, so the legends read
 * nearly upright and the caps still show their sides.
 *
 * The pattern: discrete items, as Riffle. Tweens, a stagger by distance, and a
 * hit test on the plane of the caps' tops at rest, which never moves.
 */
const {
  Cam, clamp, facing, fillet, fit, hull, open, poly, prism, proj, rad, ringAt, rrect, run, unproj,
  tdone, tset, tval, tween, disposer, mk, pointer, put, reflect, register, solid,
} = HL;

/** A cap's foot (square), its gap to the next, the top's inset at the sides, back and front, its height; where its foot sits. */
const K = 24, GAP = 5, IS = 3.6, IB = 4.6, IF = 2.2, KH = 11, ZF = 10;
/** The switch under each cap: its inset from the foot, its height. The case: margin round the keys, thickness. */
const SI = 4, SH = 5, M = 9, CT = 7, RD = 12;
/** How much of the travel a key takes, by distance from the one pressed; the K's share at rest. */
const FALL = [1, 0.32, 0.1], KREST = 0.5, STEP = 45;
/** The row's direction on the ground, in degrees: -45 would face the camera square on. */
const ROW = -36, CA = Math.cos(rad(ROW)), SA = Math.sin(rad(ROW));
/** Each legend as strokes in its own box, 8 wide and 10 tall, y up: [polyline, ...]. */
const GLYPHS = {
  f: [[[8, 10], [0, 10], [0, 0]], [[0, 5.2], [6, 5.2]]],
  o: null,
  r: [[[0, 0], [0, 10], [5, 10], [7.4, 9.1], [8, 7.6], [7.4, 6.1], [5, 5.2], [0, 5.2]], [[4.2, 5.2], [8, 0]]],
  k: [[[0, 0], [0, 10]], [[8, 10], [0, 3.6]], [[2.6, 5.7], [8, 0]]],
};
const WORD = ["f", "o", "r", "k"];

/** A point of the row's frame, s along it and v toward the viewer, on the ground. */
const at = (s, v) => [s * CA - v * SA, s * SA + v * CA];
/** The row's frame from a ground point: the inverse of at. */
const back = (x, y) => [x * CA + y * SA, -x * SA + y * CA];
/** A rounded footprint in the row's frame, turned onto the ground, normals and all. */
function ring(s0, v0, s1, v1, r, n) {
  r = Math.min(r, (s1 - s0) / 2, (v1 - v0) / 2);
  return rrect(s0, v0, s1, v1, r, n).map((q) => ({ u: q.u * CA - q.v * SA, v: q.u * SA + q.v * CA, nu: q.nu * CA - q.nv * SA, nv: q.nu * SA + q.nv * CA }));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let travel = value;

  const S1 = 4 * K + 3 * GAP;
  const C = Cam(45, 0.5, 2.35);
  const pts = [];
  for (const s of [-M, S1 + M]) for (const v of [-K / 2 - M, K / 2 + M]) pts.push([...at(s, v), 0], [...at(s, v), -CT - RD]);
  for (const s of [0, S1]) pts.push([...at(s, -K / 2 + IB), ZF + KH]);
  fit(C, pts, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the case, and its reflection
  const caseR = ring(-M, -K / 2 - M, S1 + M, K / 2 + M, 7, 6), caseIn = ring(-M + 1.6, -K / 2 - M + 1.6, S1 + M - 1.6, K / 2 + M - 1.6, 5.4, 6);
  reflect(svg, g, P, front, caseR, -CT, RD);
  put(solid(g), prism(P, front, caseR, caseIn, -CT, 0));

  // the keys, left to right, which is back to front: a switch, then the cap over it
  const keys = WORD.map((ch, i) => {
    const s0 = i * (K + GAP), grp = mk("g", {}, g);
    const sw = ring(s0 + SI, -K / 2 + SI, s0 + K - SI, K / 2 - SI, 2, 4), swIn = ring(s0 + SI + 1, -K / 2 + SI + 1, s0 + K - SI - 1, K / 2 - SI - 1, 1, 4);
    put(solid(grp), prism(P, front, sw, swIn, 0, SH));
    const cap = solid(grp);
    const dish = mk("path", { class: "nf lo" }, grp);
    const legend = mk("path", { class: "nf" }, grp);
    return { ch, s0, cap, dish, legend, z: tween(0), drawn: NaN };
  });

  /** A legend's strokes on a cap's top at height z: its box centred on the top, y running away from the viewer. */
  function legendPath(k, z) {
    const sc = k.s0 + K / 2, vc = (-K / 2 + IB + K / 2 - IF) / 2;
    const w = (x, y) => P(...at(sc + (x - 4) * 0.82, vc - (y - 5) * 0.82), z);
    if (k.ch === "o") return poly(fillet([[0, 0], [8, 0], [8, 10], [0, 10]], [3.2, 3.2, 3.2, 3.2], 4).map(([x, y]) => w(x, y)));
    return GLYPHS[k.ch].map((line) => open(line.map(([x, y]) => w(x, y)))).join("");
  }

  function draw(k, dz) {
    k.drawn = dz;
    const z0 = ZF + dz, z1 = ZF + KH + dz;
    const foot = ring(k.s0, -K / 2, k.s0 + K, K / 2, 3.2, 4);
    const top = ring(k.s0 + IS, -K / 2 + IB, k.s0 + K - IS, K / 2 - IF, 2.6, 4);
    const topIn = ring(k.s0 + IS + 1, -K / 2 + IB + 1, k.s0 + K - IS - 1, K / 2 - IF - 1, 1.8, 4);
    const dish = ring(k.s0 + IS + 2.6, -K / 2 + IB + 2.6, k.s0 + K - IS - 2.6, K / 2 - IF - 2.6, 1.4, 4);
    put(k.cap, { sil: poly(hull(ringAt(P, foot, z0).concat(ringAt(P, top, z1)))), crease: open(ringAt(P, run(topIn, front), z1)) });
    k.dish.setAttribute("d", poly(ringAt(P, dish, z1 - 0.5)));
    k.legend.setAttribute("d", legendPath(k, z1 - 0.5));
  }

  const Bk = register(stage, (_dt, now) => {
    let moving = false;
    for (const k of keys) {
      const z = tval(k.z, now);
      if (z !== k.drawn) draw(k, z);
      if (!tdone(k.z, now)) moving = true;
    }
    return moving;
  });
  bag.add(Bk.unregister);

  // hit test: the pointer on the plane of the caps' tops at rest, in the row's frame. The plane never moves,
  // and the key nearest along the row wins, so a key pressing away cannot flip the choice.
  function hit([sx, sy]) {
    const [s, v] = back(...unproj(C, sx, sy, ZF + KH));
    if (s < -M / 2 || s > S1 + M / 2 || v < -K / 2 - M || v > K / 2 + M) return -1;
    return clamp(Math.floor((s + GAP / 2) / (K + GAP)), 0, keys.length - 1);
  }

  let act = -1;
  const last = keys.length - 1;
  /** Presses key a, or at rest (-1) half presses the K. The stagger spreads out from the key pressed, or the one let go. */
  function aim(a, from, stagger) {
    const now = performance.now();
    keys.forEach((k, i) => {
      const share = a < 0 ? (i === last ? KREST : 0) : FALL[Math.min(Math.abs(i - a), FALL.length - 1)];
      tset(k.z, -share * travel, now, stagger ? Math.abs(i - from) * STEP : 0);
      const on = a < 0 ? i === last : i === a;
      k.cap.sil.classList.toggle("hi", on);
      k.legend.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "key " + keys[a].ch;
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
    set: (v) => { travel = v; aim(act, act, false); },
    destroy: bag.dispose,
  };
}

export default hairline({
  name: "keycaps",
  means: "Four keys on a little keyboard spell Fork: point at one and it presses down on its switch, its neighbours dipping less.",
  rules: [1, 2, 6, 9],
  range: [2.5, 4, 5],
  tour: [[120, 150], [280, 170], [170, 155], null],
  mount,
});
