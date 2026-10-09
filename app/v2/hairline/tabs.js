// Fork's own hairline figure, drawn with the hairline-create kit on ./kernel.js (MIT, @lucasmarkes/hairline).
// The kit's format, unchanged, except that it exports what it would hand to hairline().
import HL from "./kernel";

const hairline = (figure) => figure;

/**
 * Tabs: a window's top strip holding five workspace tabs of different widths,
 * each a plate with a status square at its left end and a name bar. The tab
 * under the pointer lifts, its neighbours part to make room, staggered
 * outwards, and its square splits into a 3 × 3 lattice, the sign that the
 * workspace is working. At rest the second tab is the open one. The slider is
 * the stagger, in ms.
 *
 * The pattern: one of many. Tweens, a stagger by distance, and a hit test on
 * the row's screen x at rest, so a lifted tab never moves out from under the
 * pointer.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, seg, unproj,
  tween, tset, tval, tdone, disposer, mk, pointer, put, register, solid,
} = HL;

const WS = [54, 40, 48, 34, 46], NAME = [0.8, 0.5, 0.9, 0.3, 0.65], GAP = 6, D = 30, TT = 4;
const SQ = 14, SQH = 3, CB = 4, CG = (SQ - 3 * CB) / 2, LAT = [6, 4, 5, 4, 9, 4.5, 5, 4.5, 7];
const LIFT = 20, REST = 7, PART = 5, HOME = 1, CARD = 74;
const X0 = WS.map((_, i) => WS.slice(0, i).reduce((a, w) => a + w + GAP, 0));
const L = X0[4] + WS[4];
/** The lattice's cubes, back to front, with how far each sits from the centre: the order they rise in. */
const CUBES = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((k) => ({ k, a: k % 3, b: Math.floor(k / 3) }))
  .sort((p, q) => p.a + p.b - (q.a + q.b)).map((c) => ({ ...c, ring: Math.abs(c.a - 1) + Math.abs(c.b - 1) }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value, act = -1;

  // Fitted with a tab lifted and its lattice up, so nothing leaves the frame.
  const C = Cam(45, 0.5, 1.1);
  fit(C, [[-12, -12, -6], [L + 12, -12, -6], [-12, D + 18 + CARD, -6], [L + 12, D + 18 + CARD, -6], [-12, -12, LIFT + TT + 9]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // The window: a slab, its strip at the back holding the tabs, and the card in front, split into two panes.
  const [wr, wi] = rings(-12, -12, L + 12, D + 18 + CARD, 10, 2.2);
  put(solid(g), prism(P, front, wr, wi, -6, 0));

  const tabs = WS.map((w, i) => {
    const grp = mk("g", {}, g), on = i === HOME;
    const body = solid(grp), name = mk("path", { class: "nf lo" }, grp), sq = solid(grp);
    const cubes = CUBES.map((c) => ({ ...c, el: solid(grp), h: tween(on ? LAT[c.k] : 0) }));
    body.sil.classList.toggle("hi", on);
    return { w, body, name, sq, cubes, z: tween(on ? REST : 0), dx: tween(0), q: tween(on ? 1 : 0), drawn: "" };
  });

  const [cr, ci] = rings(-4, D + 10, L + 4, D + 10 + CARD, 6, 1.4);
  put(solid(g), prism(P, front, cr, ci, 0, 3));
  const px = L * 0.56;
  mk("path", { class: "nf lo", d: seg(P(px, D + 14, 3), P(px, D + 6 + CARD, 3)) }, g);

  function draw(t, i, now) {
    const z = tval(t.z, now), x0 = X0[i] + tval(t.dx, now), q = tval(t.q, now), hs = t.cubes.map((c) => tval(c.h, now));
    const key = [z, x0, q, ...hs].join("|");
    if (key === t.drawn) return;
    t.drawn = key;
    const top = z + TT, sx = x0 + 6, sy = (D - SQ) / 2;
    put(t.body, prism(P, front, ...rings(x0, 0, x0 + t.w, D, 4, 1.2), z, top));
    const n0 = sx + SQ + 6, n1 = n0 + (x0 + t.w - 7 - n0) * NAME[i];
    t.name.setAttribute("d", seg(P(n0, D / 2, top), P(n1, D / 2, top)));
    const h = SQH * (1 - q);
    put(t.sq, h > 0.05 ? prism(P, front, ...rings(sx, sy, sx + SQ, sy + SQ, 2.2, 0.8), top, top + h) : { sil: "", crease: "" });
    t.cubes.forEach((c, j) => {
      const cx = sx + c.a * (CB + CG), cy = sy + c.b * (CB + CG);
      put(c.el, hs[j] > 0.4 ? prism(P, front, ...rings(cx, cy, cx + CB, cy + CB, 0.9, 0.5), top, top + hs[j]) : { sil: "", crease: "" });
    });
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    tabs.forEach((t, i) => {
      draw(t, i, now);
      if (!tdone(t.z, now) || !tdone(t.dx, now) || !tdone(t.q, now) || t.cubes.some((c) => !tdone(c.h, now))) moving = true;
    });
    return moving;
  });
  bag.add(B.unregister);

  // The hit test reads the pointer's screen x along the row, at rest: a tab lifting moves straight up, so the choice never changes under a still pointer.
  function hit([x, y]) {
    const [wx, wy] = unproj(C, x, y, TT);
    if (wy < -26 || wy > D + 8) return -1;
    const u = wx - wy + D / 2;
    if (u < -GAP || u > L + GAP) return -1;
    let best = 0;
    for (let i = 1; i < WS.length; i++) if (u >= X0[i] - GAP / 2) best = i;
    return clamp(best, 0, WS.length - 1);
  }

  /** Opens tab a (-1 goes back to rest, the home tab open). Everything spreads out from the tab chosen, or the one let go. */
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act, open = a < 0 ? HOME : a;
    act = a;
    tabs.forEach((t, i) => {
      const delay = Math.abs(i - from) * stag, on = i === open;
      tset(t.z, on ? (a < 0 ? REST : LIFT) : 0, now, delay);
      tset(t.dx, a < 0 || i === a ? 0 : i < a ? -PART : PART, now, delay);
      tset(t.q, on ? 1 : 0, now, delay);
      t.cubes.forEach((c) => tset(c.h, on ? LAT[c.k] : 0, now, delay + (on ? c.ring * 50 : 0)));
      t.body.sil.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "tab " + (a + 1);
    B.wake();
  }

  read.textContent = "rest";
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { stag = v; },
    destroy: bag.dispose,
  };
}

export default hairline({
  name: "tabs",
  means: "Five workspace tabs on a window's strip: the one under the pointer lifts, its neighbours part, and its square splits.",
  rules: [1, 2, 4, 5],
  range: [0, 40, 90],
  tour: [[156, 122], [237, 162], [309, 198], null],
  mount,
});
