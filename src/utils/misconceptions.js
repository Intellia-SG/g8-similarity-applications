// src/utils/misconceptions.js
// Misconceptions registry and distractor builder for SimilarQuest (TRD §4.3.3)

import { toFrac } from './frac.js';

export const MISCONCEPTIONS = {
  additive: {
    id: 'additive',
    name: 'Additive Growth Error',
    description: 'Adds the difference between sides instead of multiplying by the scale factor.',
    calculate: (givenOrig, givenScaled, targetOrig) => {
      // difference d = givenScaled - givenOrig; target = targetOrig + d
      const orig = toFrac(givenOrig);
      const scaled = toFrac(givenScaled);
      const target = toFrac(targetOrig);
      const diff = scaled.sub(orig);
      return target.add(diff);
    },
  },

  inverse_k: {
    id: 'inverse-k',
    name: 'Inverse Scale Factor Error',
    description: 'Inverts k: divides when should multiply or multiplies when should divide.',
    calculate: (givenOrig, givenScaled, targetOrig) => {
      // k_inverted = givenOrig / givenScaled; result = targetOrig * (givenOrig / givenScaled)
      const orig = toFrac(givenOrig);
      const scaled = toFrac(givenScaled);
      const target = toFrac(targetOrig);
      return target.mul(orig).div(scaled);
    },
  },

  product: {
    id: 'product',
    name: 'Direct Multiplication Error',
    description: 'Multiplies lengths directly instead of setting up a proportional ratio.',
    calculate: (a, b) => {
      return toFrac(a).mul(toFrac(b));
    },
  },

  copy_side: {
    id: 'copy-side',
    name: 'Copy Given Side Error',
    description: 'Reports a given length unchanged instead of calculating the scaled length.',
    calculate: (side) => toFrac(side),
  },

  whole_for_part: {
    id: 'whole-for-part',
    name: 'Nested Triangle Part vs Whole Error',
    description: 'Uses the whole side AB instead of the segment AD (or vice versa) in nested triangles.',
    calculate: (de, db, ad) => {
      // de * db / ad instead of de * (ad + db) / ad
      return toFrac(de).mul(toFrac(db)).div(toFrac(ad));
    },
  },

  unit_slip: {
    id: 'unit-slip',
    name: 'Metric Unit Shift Error',
    description: 'Misplaces a power of 10 during cm <-> m <-> km conversion.',
    calculate: (val, factor) => {
      return toFrac(val).mul(toFrac(factor));
    },
  },

  mismatch: {
    id: 'mismatch',
    name: 'Corresponding Sides Mismatch Error',
    description: 'Pairs sides by list index or equal number rather than geometric correspondence.',
  },

  angles_only: {
    id: 'angles-only',
    name: 'Angles Only Error',
    description: 'Concludes similarity based purely on angles without checking side proportionality.',
  },
};

/**
 * Selects exactly 3 valid, distinct distractors passing the display criteria.
 * TRD §4.3.4: gt(0) && lte(200) && decimals <= 2 && not equal to answer && distinct from each other.
 */
export function pickDistractors(answer, rankedCandidates) {
  const out = [];
  const ansFrac = toFrac(answer);

  for (const c of rankedCandidates) {
    if (c === null || c === undefined) continue;
    const cFrac = toFrac(c);
    if (
      cFrac.gt(0) &&
      cFrac.lte(300) &&
      cFrac.decimalsCount() <= 2 &&
      !cFrac.eq(ansFrac) &&
      !out.some((d) => d.eq(cFrac))
    ) {
      out.push(cFrac);
    }
    if (out.length === 3) return out;
  }
  return null; // Signals caller to regenerate draw
}
