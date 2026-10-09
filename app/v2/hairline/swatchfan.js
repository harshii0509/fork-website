// Fork's own hairline figure, drawn with the hairline-create kit on ./kernel.js (MIT, @lucasmarkes/hairline).
// The kit's format, unchanged, except that it exports what it would hand to hairline().
import HL from "./kernel";

const hairline = (figure) => figure;

/**
 * Swatchfan: a paint-chip fan deck. Seven long chips, round at both ends, lie
 * stacked on the table, pinned together by a rivet through their near ends
 * and fanned in an arc. Each chip has an inset block near its free end, where
 * its colour would be. The chip under the pointer holds still and its
 * neighbours part from it, the ones below swinging one way and the ones above
 * the other, staggered outwards from it on the 700ms lift curve. The slider is
 * how far they part, in degrees.
 *
 * The pattern: discrete items, as Riffle. Tweens, a stagger by distance, and a
 * hit test on the chips' REST angles about the rivet, so a chip swinging away
 * from under the pointer cannot flip the choice.
 */
const {
  Cam, circ, facing, fit, poly, prism, proj, rad, ringAt, rrect,
  tdone, tset, tval, tween, unproj, disposer, mk, pointer, put, register, solid,
} = HL;

const N = 7, L = 128, W = 20, T = 2.6, B = 0.8, STEP = 45;
const RV = 4.4, RH = 2.2, DMAX = 26;
/** Rest angles about the rivet, bottom chip first: a hand-opened fan, the gaps closing a little towards the top. */
const GAPS = [12.5, 11.5, 10.5, 10, 9.5, 9];
const REST = GAPS.reduce((a, g) => (a.push(a[a.length - 1] + g), a), [-118]);
const ZTOP = N * T;

/** One chip in its own frame: the rivet at the origin, the chip running out along +u. */
const OUTER = rrect(-W / 2, -W / 2, L, W / 2, W / 2, 8);
const INNER = rrect(-W / 2 + B, -W / 2 + B, L - B, W / 2 - B, W / 2 - B, 8);
const PATCH = rrect(L - 46, -W / 2 + 3.6, L - 16, W / 2 - 3.6, 2, 4);
const HOLE = circ(RV + 1.6, 28);

/** A ring turned th degrees about the rivet, normals and all. */
function turn(ring, th) {
  const c = Math.cos(rad(th)), s = Math.sin(rad(th));
  return ring.map((q) => ({ u: c * q.u - s * q.v, v: s * q.u + c * q.v, nu: c * q.nu - s * q.nv, nv: s * q.nu + c * q.nv }));
}

/** The camera, fitted to the widest the fan can open: the rest pose parted by the slider's far end on both sides. */
function camera() {
  const C = Cam(45, 0.5, 2.0), pts = [];
  for (let th = REST[0] - DMAX; th <= REST[N - 1] + DMAX + 0.01; th += 2)
    for (const q of turn(OUTER, th)) pts.push([q.u, q.v, 0], [q.u, q.v, ZTOP + RH]);
  fit(C, pts, 200, 166);
  return C;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let part = value;

  const C = camera(), P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // bottom chip first: each one lies on the last, so painting up the stack is back to front
  const chips = [];
  for (let i = 0; i < N; i++) {
    const s = solid(g);
    const patch = mk("path", { class: "nf" }, s.g), washer = mk("path", { class: "nf lo" }, s.g);
    chips.push({ s, patch, washer, z0: i * T, z1: i * T + T, a: tween(REST[i]), drawn: NaN });
  }

  // the rivet's head, standing on the top chip: the one bright mark at rest
  const rivet = solid(g);
  put(rivet, prism(P, front, circ(RV, 28), circ(RV - 1.1, 28), ZTOP, ZTOP + RH));
  rivet.sil.classList.add("hi");

  function draw(cd, th) {
    if (th === cd.drawn) return;
    cd.drawn = th;
    put(cd.s, prism(P, front, turn(OUTER, th), turn(INNER, th), cd.z0, cd.z1));
    cd.patch.setAttribute("d", poly(ringAt(P, turn(PATCH, th), cd.z1)));
    cd.washer.setAttribute("d", poly(ringAt(P, HOLE, cd.z1)));
  }

  const Bk = register(stage, (_dt, now) => {
    let moving = false;
    for (const cd of chips) { draw(cd, tval(cd.a, now)); if (!tdone(cd.a, now)) moving = true; }
    return moving;
  });
  bag.add(Bk.unregister);

  // hit test: the pointer on each chip's own top, read as an angle about the rivet and matched
  // to that chip's REST angle; the nearest wins. Rest never moves, so neither do the hit areas.
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    chips.forEach((cd, i) => {
      const [x, y] = unproj(C, sx, sy, cd.z1);
      const r = Math.hypot(x, y), d = Math.abs(Math.atan2(y, x) * 180 / Math.PI - REST[i]);
      if (r < 26 || r > L + W / 2 + 4 || d > Math.atan2(W / 2 + 3, r) * 180 / Math.PI + 1) return;
      if (d < bd) { bd = d; best = i; }
    });
    return best;
  }

  let act = -1;
  /** Opens the fan at chip a (-1 closes it). The stagger spreads out from the chip picked, or the one let go. */
  function aim(a, from, stagger) {
    const now = performance.now();
    chips.forEach((cd, i) => {
      const th = a < 0 ? REST[i] : REST[i] + Math.sign(i - a) * part;
      tset(cd.a, th, now, stagger ? Math.abs(i - from) * STEP : 0);
      cd.s.sil.classList.toggle("hi", i === a);
      cd.patch.classList.toggle("hi", i === a);
    });
    rivet.sil.classList.toggle("hi", a < 0);
    read.textContent = a < 0 ? "rest" : "chip " + (a + 1);
    Bk.wake();
  }
  function setActive(a) {
    if (a === act) return;
    const from = a >= 0 ? a : act;
    act = a;
    aim(a, from, true);
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  read.textContent = "rest";

  return {
    set: (v) => { part = v; if (act >= 0) aim(act, act, false); },
    destroy: bag.dispose,
  };
}

export default hairline({
  name: "swatchfan",
  means: "A swatch deck of your project's colours: point at a chip and it swings out.",
  rules: [1, 2, 5, 9],
  range: [10, 18, 26],
  tour: [[196, 134], [271, 159], [292, 179], null],
  mount,
});
