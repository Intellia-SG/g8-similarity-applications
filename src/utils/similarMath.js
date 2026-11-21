// src/utils/similarMath.js
// Mathematical foundation and Figure object generation for SimilarQuest

import { Frac, F, toFrac } from './frac.js';

export const K_ENLARGE = [
  F(3, 2),  // 1.5
  F(2),     // 2.0
  F(5, 2),  // 2.5
  F(3),     // 3.0
  F(4),     // 4.0
  F(5),     // 5.0
  F(4, 3),  // 1.33...
  F(5, 4),  // 1.25
  F(5, 3),  // 1.66...
  F(7, 2),  // 3.5
  F(7, 4),  // 1.75
];

export const TRIPLES = [
  [3, 4, 5],
  [4, 5, 6],
  [5, 6, 7],
  [4, 6, 8],
  [6, 8, 10],
  [5, 7, 9],
  [6, 7, 8],
  [6, 9, 12],
  [8, 10, 12],
  [7, 9, 11],
  [8, 11, 14],
];

export const SIDE_CAP = 60;

export const isClean = (v) => toFrac(v).isClean();

// Calculate realistic triangle angles in degrees from sides a, b, c
export function computeTriangleAngles(a, b, c) {
  const cosA = Math.max(-1, Math.min(1, (b * b + c * c - a * a) / (2 * b * c)));
  const cosB = Math.max(-1, Math.min(1, (a * a + c * c - b * b) / (2 * a * c)));
  
  let angA = Math.round((Math.acos(cosA) * 180) / Math.PI);
  let angB = Math.round((Math.acos(cosB) * 180) / Math.PI);
  let angC = 180 - angA - angB;

  if (angC <= 0) {
    angA -= 1;
    angC = 180 - angA - angB;
  }
  return [angA, angB, angC];
}

// Generate coordinate vertices for a triangle given sides a, b, c for scale-accurate SVG rendering
export function computeTriangleCoords(a, b, c, origin = { x: 50, y: 150 }, scale = 10) {
  // Base along x-axis from (0, 0) to (c, 0)
  // Vertex 3 at (x, y) where x = (b^2 + c^2 - a^2) / (2c), y = sqrt(b^2 - x^2)
  const cosB = (a * a + c * c - b * b) / (2 * a * c);
  const xB = 0;
  const yB = 0;
  const xA = c;
  const yA = 0;
  const xC = a * cosB;
  const yC = -Math.sqrt(Math.max(0, a * a - xC * xC));

  return [
    { x: origin.x + xA * scale, y: origin.y + yA * scale },
    { x: origin.x + xB * scale, y: origin.y + yB * scale },
    { x: origin.x + xC * scale, y: origin.y + yC * scale },
  ];
}

/**
 * Creates a single source of truth Figure object for a similar pair.
 */
export function createFigure({
  kind = 'triangle',
  names = ['A', 'B', 'C'],
  namesScaled = ['D', 'E', 'F'],
  sides = [4, 6, 8],
  k = F(2),
  view = { flip: false, rotate: 0 },
  corr = [0, 1, 2],
}) {
  const kFrac = toFrac(k);
  const sidesScaled = sides.map((s) => toFrac(s).mul(kFrac));
  const angles = kind === 'triangle'
    ? computeTriangleAngles(sides[0], sides[1], sides[2])
    : [90, 90, 90, 90];

  return {
    kind,
    names,
    namesScaled,
    sides,
    sidesScaled,
    angles,
    k: kFrac,
    view,
    corr,
  };
}

export { Frac, F, toFrac };
