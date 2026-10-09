// Fork's own hairline figure, drawn with the hairline-create kit on ./kernel.js (MIT, @lucasmarkes/hairline).
// The kit's format, unchanged, except that it exports what it would hand to hairline().
import HL from "./kernel";

const hairline = (figure) => figure;

/**
 * Before/after: a tablet lying on the desk, its screen holding one app page
 * twice: a messy before, blocks of odd sizes and sharp corners, and a clean
 * after on one grid. A thin wall stands across the screen with a round handle
 * at its near end; left of it is the after, right of it the before. The
 * pointer's place on the ground moves the wall on a spring, and the blocks it
 * passes rise a little, the nearer the more. The slider is that reach.
 *
 * The pattern: a field on one axis. A spring for where, a falloff by
 * distance, and a hit test on the ground plane, which never moves.
 */
const {
  Cam, clamp, facing, fit, poly, prism, proj, rings, ringAt, rrect, unproj, spring, stepS,
  flatDot, mk, place, pointer, put, register, disposer, solid,
} = HL;

const DW = 150, DD = 108, X0 = 8, X1 = 142, REST = 60, BUMP = 3, GAP = 1.4, WALL = 10, KY = 103, KR = 4.5, KH = 12;
// [x0, y0, x1, y1, height]: the same page twice
const AFTER = [[12, 12, 138, 19, 1], [12, 25, 86, 57, 1.5], [92, 25, 138, 57, 1.5], [12, 63, 50, 92, 1.5], [56, 63, 94, 92, 1.5], [100, 63, 138, 92, 1.5]];
const BEFORE = [[12, 11, 118, 21, 3], [16, 27, 80, 51, 5.5], [86, 30, 134, 60, 2], [12, 64, 44, 88, 4.5], [50, 67, 98, 95, 2.5], [104, 62, 136, 84, 6]];
const NONE = { sil: "", crease: "" };

/** The share of the bump at u reaches from the wall: 1 at the wall, easing to nothing at one reach. */
const falloff = (u) => (u >= 1 ? 0 : (1 - u) * (1 - u));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let R = value;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[0, 0, -6], [DW, DD, -6], [DW, 0, -6], [0, DD, -6], [0, 0, WALL], [X1, DD, KH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // The tablet: a slab with a big round, its screen's edge, and the camera in the far bezel.
  const outer = rrect(0, 0, DW, DD, 12, 14), inner = rrect(2.2, 2.2, DW - 2.2, DD - 2.2, 9.8, 14);
  put(solid(g), prism(P, front, outer, inner, -6, 0));
  mk("path", { class: "nf lo", d: poly(ringAt(P, rrect(6, 6, DW - 6, DD - 10, 6, 8), 0)) }, g);
  place(flatDot(g, C, 0.8, "dot off"), P(DW / 2, 3, 0));

  const after = AFTER.map((b) => ({ b, el: solid(g) }));
  const wall = solid(g);
  const before = BEFORE.map((b) => ({ b, el: solid(g) }));
  const knob = solid(g);
  knob.sil.classList.add("hi");
  const [kr, ki] = [rrect(-KR, -KR, KR, KR, KR, 10), rrect(-KR + 1, -KR + 1, KR - 1, KR - 1, KR - 1, 10)];
  const at = (ring, x, y) => ring.map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

  /** One block cut at the wall: the part on its own side, rounded at the cut, risen by how near the wall it is. */
  function block(it, s, r, side) {
    const [x0, y0, x1, y1, h] = it.b;
    const c0 = side > 0 ? Math.max(x0, s + GAP) : x0, c1 = side > 0 ? x1 : Math.min(x1, s - GAP);
    if (c1 - c0 < 1) return put(it.el, NONE);
    const near = s < x0 ? x0 - s : s > x1 ? s - x1 : 0;
    const top = h + BUMP * falloff(near / r);
    put(it.el, prism(P, front, ...rings(c0, y0, c1, y1, side > 0 ? 0.5 : 3, Math.min(side > 0 ? 0.3 : 1, (c1 - c0) / 2 - 0.1)), 0, top));
  }

  let drawn = NaN;
  function draw(s) {
    if (s === drawn) return;
    drawn = s;
    after.forEach((it) => block(it, s, R, -1));
    put(wall, prism(P, front, ...rings(s - 0.8, 5, s + 0.8, DD - 9, 0.8, 0.3), 0, WALL));
    before.forEach((it) => block(it, s, R, 1));
    put(knob, prism(P, front, at(kr, s, KY), at(ki, s, KY), 0, KH));
  }

  const sp = spring(REST);
  const B = register(stage, (dt) => {
    const m = stepS(sp, dt);
    draw(sp.x);
    return m;
  });
  bag.add(B.unregister);

  function aim(s) {
    sp.t = s == null ? REST : s;
    if (s == null) read.textContent = "rest";
    else {
      const pct = Math.round(((s - X0) / (X1 - X0)) * 100);
      read.textContent = pct <= 3 ? "before" : pct >= 97 ? "after" : pct + "%";
    }
    B.wake();
  }

  read.textContent = "rest";
  bag.add(pointer(stage, {
    move: (p) => {
      const [wx, wy] = unproj(C, p[0], p[1], 0);
      aim(wy < -12 || wy > DD + 12 || wx < -16 || wx > DW + 16 ? null : clamp(wx, X0, X1));
    },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { R = v; drawn = NaN; B.wake(); },
    destroy: bag.dispose,
  };
}

export default hairline({
  name: "beforeafter",
  means: "One page twice on a tablet, before and after: the pointer slides the wall between them, and what it passes rises.",
  rules: [1, 3, 5, 8],
  range: [8, 18, 34],
  tour: [[180, 154], [229, 179], [205, 167], null],
  mount,
});
