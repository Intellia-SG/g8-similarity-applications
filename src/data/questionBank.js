// src/data/questionBank.js
// Procedural question generator for SimilarQuest — 100 questions (10 worlds × 10 Qs)
// Adheres strictly to PRD §9, TRD §4.3, and clean-number constraints

import { WORLDS } from '../config/worlds.config.js';
import { F, toFrac } from '../utils/frac.js';
import {
  TRIPLES,
  createFigure,
} from '../utils/similarMath.js';
import { getRandomName } from '../utils/namePool.js';

export const DISTRICTS = WORLDS.map((w, idx) => ({
  id: w.id,
  num: idx + 1,
  name: w.name,
  icon: w.emoji,
  accent: w.accent,
  desc: w.description,
  concept: w.conceptFocus,
  boss: w.boss,
}));

const INVENTED_PLACES = [
  'Pine Bay', 'Harbour Rock', 'Maple Ridge', 'Cedar Valley',
  'Sunny Peak', 'River Bend', 'Eagle Crest', 'Willow Creek',
  'Beacon Point', 'Silver Falls'
];

function makeOptions(correctAnswer, candidates) {
  const opts = [correctAnswer];
  for (const c of candidates) {
    if (c !== null && c !== undefined && c !== correctAnswer && !opts.includes(c)) {
      opts.push(c);
    }
    if (opts.length === 4) break;
  }
  let fallbackNum = parseFloat(correctAnswer) || 10;
  let counter = 1;
  while (opts.length < 4) {
    const unitMatch = String(correctAnswer).match(/[a-zA-Z]+/);
    const unit = unitMatch ? ` ${unitMatch[0]}` : '';
    const fallback = `${Number((fallbackNum + counter * 2).toFixed(1))}${unit}`;
    if (!opts.includes(fallback) && fallback !== correctAnswer) {
      opts.push(fallback);
    }
    counter++;
  }
  return opts;
}

/**
 * Procedural generation for World 0: Look-Alike Lab (similar-or-not)
 */
function genWorld0Question(qIdx) {
  const isSimilar = qIdx % 2 === 0;
  const useAdditiveTrap = !isSimilar && qIdx % 4 === 1;

  if (isSimilar) {
    const k = [2, 2.5, 3, 1.5][qIdx % 4];
    const origW = [4, 6, 8, 10][qIdx % 4];
    const origH = [6, 8, 10, 12][qIdx % 4];
    const scaledW = origW * k;
    const scaledH = origH * k;

    const fig = createFigure({
      kind: 'rectangle',
      names: ['A', 'B', 'C', 'D'],
      namesScaled: ['E', 'F', 'G', 'H'],
      sides: [origW, origH, origW, origH],
      k: F(k),
    });

    const correctAnswer = `Yes — all angles are 90° and side ratios are equal (${scaledW} ÷ ${origW} = ${scaledH} ÷ ${origH} = ${k})`;
    const options = [
      correctAnswer,
      `No — rectangle B is larger than rectangle A`,
      `Yes — but only because both shapes are standing upright`,
      `No — the diagonals must be measured first`,
    ];

    return {
      category: 'SIMILARITY TEST',
      visual: 'twoFigures',
      visualData: {
        figure: fig,
        origLabel: `Rectangle A (${origW} cm × ${origH} cm)`,
        scaledLabel: `Rectangle B (${scaledW} cm × ${scaledH} cm)`,
        highlight: 'compare',
      },
      questionText: `Rectangle A is ${origW} cm × ${origH} cm. Rectangle B is ${scaledW} cm × ${scaledH} cm. Are the two rectangles similar?`,
      options,
      correctAnswer,
      explanation: `Both shapes have equal 90° angles and all pairs of corresponding sides have the same ratio (${scaledW} ÷ ${origW} = ${scaledH} ÷ ${origH} = ${k}).`,
      hint1: `First find the ratio of widths and the ratio of heights: ${scaledW} ÷ ${origW} and ${scaledH} ÷ ${origH}.`,
      hint2: `Similar figures must have equal angles AND corresponding sides in the exact same ratio.`,
    };
  } else {
    let origW = 4, origH = 6, scaledW, scaledH, diff;
    if (useAdditiveTrap) {
      diff = [2, 4, 6, 5][qIdx % 4];
      origW = [4, 5, 6, 8][qIdx % 4];
      origH = [6, 8, 10, 12][qIdx % 4];
      scaledW = origW + diff;
      scaledH = origH + diff;
    } else {
      origW = 4;
      origH = 6;
      scaledW = 10;
      scaledH = 12;
      diff = 6;
    }

    const r1 = (scaledW / origW).toFixed(2);
    const r2 = (scaledH / origH).toFixed(2);

    const fig = createFigure({
      kind: 'rectangle',
      names: ['A', 'B', 'C', 'D'],
      namesScaled: ['E', 'F', 'G', 'H'],
      sides: [origW, origH, origW, origH],
      k: F(scaledW, origW),
    });

    const correctAnswer = `No — side ratios are not equal (${scaledW} ÷ ${origW} = ${r1} ≠ ${scaledH} ÷ ${origH} = ${r2})`;
    const options = [
      correctAnswer,
      `Yes — each side grew by the exact same difference (+${diff} cm)`,
      `Yes — both are rectangles so all angles are 90°`,
      `Cannot tell without knowing the perimeter`,
    ];

    return {
      category: 'SIMILARITY TEST',
      visual: 'twoFigures',
      visualData: {
        figure: fig,
        origLabel: `Rectangle A (${origW} cm × ${origH} cm)`,
        scaledLabel: `Rectangle B (${scaledW} cm × ${scaledH} cm)`,
        highlight: 'compare',
      },
      questionText: `Rectangle A is ${origW} cm × ${origH} cm. Rectangle B is ${scaledW} cm × ${scaledH} cm. Are the two rectangles similar?`,
      options,
      correctAnswer,
      explanation: `Side ratios are not equal (${scaledW} ÷ ${origW} = ${r1} while ${scaledH} ÷ ${origH} = ${r2}). Adding the same amount (${diff} cm) does not preserve shape!`,
      hint1: `First calculate the ratio of matching sides: ${scaledW} ÷ ${origW} and ${scaledH} ÷ ${origH}.`,
      hint2: `Equal additions (+${diff} cm) do NOT keep a shape similar — only a constant multiplier does.`,
    };
  }
}

/**
 * Procedural generation for World 1: Zoom Workshop (find-scale-factor)
 */
function genWorld1Question(qIdx) {
  const isEnlarge = qIdx % 3 !== 2;
  const kOptions = [F(3, 2), F(2), F(5, 2), F(3), F(4)];
  const kReductions = [F(1, 2), F(2, 5), F(1, 4), F(1, 5)];

  const k = isEnlarge ? kOptions[qIdx % kOptions.length] : kReductions[qIdx % kReductions.length];
  const baseSides = [4, 6, 8, 10, 12];
  const sideOrig = baseSides[qIdx % baseSides.length];
  const sideScaled = toFrac(sideOrig).mul(k);

  const a = sideOrig;
  const b = sideScaled.toPretty();
  const ansStr = k.toPretty();

  // Distractor candidates
  const cAdditive = sideScaled.sub(toFrac(sideOrig)).toPretty();
  const cInverse = k.reciprocal().toPretty();
  const cProduct = toFrac(sideOrig).mul(sideScaled).toPretty();
  const cPlusOne = k.add(F(1)).toPretty();

  const dists = [cAdditive, cInverse, cProduct, cPlusOne].filter(
    (d) => d !== ansStr && Number(d) > 0 && String(d) !== 'NaN'
  );

  const options = makeOptions(ansStr, dists);

  const direction = isEnlarge ? 'enlargement from △ABC to △DEF' : 'reduction from △ABC to △DEF';

  return {
    category: 'SCALE FACTOR',
    visual: 'twoFigures',
    visualData: {
      given: `AB = ${a} cm, DE = ${b} cm`,
      a,
      b,
      k: ansStr,
    },
    questionText: `△ABC ∼ △DEF. Side AB = ${a} cm corresponds to side DE = ${b} cm. What is the scale factor k for the ${direction}?`,
    options,
    correctAnswer: ansStr,
    explanation: `Scale factor k = (new length) ÷ (original length) = ${b} ÷ ${a} = ${ansStr}.`,
    hint1: `First divide the matching side in the new triangle by the side in the original triangle.`,
    hint2: `Formula: k = DE ÷ AB = ${b} ÷ ${a}.`,
  };
}

/**
 * Procedural generation for World 2: Missing Side Mill (missing-side)
 */
function genWorld2Question(qIdx) {
  const triple = TRIPLES[qIdx % TRIPLES.length];
  const k = [F(2), F(5, 2), F(3), F(3, 2), F(4)][qIdx % 5];
  const [a, b, c] = triple;
  const [sa, sb, sc] = triple.map((s) => toFrac(s).mul(k));

  const askLongest = qIdx % 2 === 0;
  const targetOrig = askLongest ? c : b;
  const targetScaled = askLongest ? sc : sb;
  const knownOrig = a;
  const knownScaled = sa;

  const ansVal = targetScaled.toPretty();
  const ansStr = `${ansVal} cm`;

  // Distractors
  const dAdditive = toFrac(targetOrig).add(knownScaled.sub(toFrac(knownOrig))).toPretty();
  const dInverse = toFrac(targetOrig).mul(toFrac(knownOrig)).div(knownScaled).toPretty();
  const dCopy = toFrac(knownScaled).toPretty();
  const dProduct = toFrac(targetOrig).mul(knownScaled).toPretty();

  const candidates = [
    `${dAdditive} cm`,
    `${dInverse} cm`,
    `${dCopy} cm`,
    `${dProduct} cm`,
    `${(Number(ansVal) + 2).toFixed(1)} cm`,
  ].filter((d) => d !== ansStr);

  const options = makeOptions(ansStr, candidates);

  return {
    category: 'MISSING SIDE',
    visual: 'twoFigures',
    visualData: {
      origSides: [a, b, c],
      scaledSides: [sa.toPretty(), sb.toPretty(), sc.toPretty()],
      askedIndex: askLongest ? 2 : 1,
    },
    questionText: `A triangle has sides ${a} cm, ${b} cm, and ${c} cm. A similar triangle has shortest side ${knownScaled.toPretty()} cm. Find its ${askLongest ? 'longest' : 'middle'} side.`,
    options,
    correctAnswer: ansStr,
    explanation: `The scale factor is ${knownScaled.toPretty()} ÷ ${knownOrig} = ${k.toPretty()}. The ${askLongest ? 'longest' : 'middle'} side is ${targetOrig} × ${k.toPretty()} = ${ansVal} cm.`,
    hint1: `First find the scale factor: divide the known matching shortest side (${knownScaled.toPretty()} cm) by ${knownOrig} cm.`,
    hint2: `Multiply the target side (${targetOrig} cm) by the scale factor ${k.toPretty()}.`,
  };
}

/**
 * Procedural generation for World 3: Mix-Up Junction (corresponding-sides)
 */
function genWorld3Question(qIdx) {
  const triple = TRIPLES[qIdx % TRIPLES.length];
  const [a, b, c] = triple;
  const [sa, sb, sc] = triple.map((s) => s * 2);

  const askSides = [
    { orig: a, scaled: sa, pos: 'shortest' },
    { orig: b, scaled: sb, pos: 'middle' },
    { orig: c, scaled: sc, pos: 'longest' },
  ];
  const pick = askSides[qIdx % 3];

  const ansStr = `${pick.scaled} cm`;
  const otherOptions = askSides
    .filter((s) => s.scaled !== pick.scaled)
    .map((s) => `${s.scaled} cm`);

  const options = [
    ansStr,
    ...otherOptions,
    `${pick.orig} cm`, // mismatch copy error
  ].slice(0, 4);

  return {
    category: 'CORRESPONDING SIDES',
    visual: 'overlay',
    visualData: {
      origSides: [a, b, c],
      scaledSides: [sa, sb, sc],
      highlightSide: pick.orig,
      flipped: true,
    },
    questionText: `△1 has sides ${a} cm, ${b} cm, and ${c} cm. △2 is similar with sides ${sa} cm, ${sb} cm, and ${sc} cm, drawn flipped. Which side of △2 corresponds to the ${pick.orig} cm (${pick.pos}) side of △1?`,
    options,
    correctAnswer: ansStr,
    explanation: `In similar triangles, corresponding sides always match by relative length (shortest to shortest, middle to middle, longest to longest). The ${pick.pos} side (${pick.orig} cm) corresponds to the ${pick.pos} side (${pick.scaled} cm).`,
    hint1: `First sort the sides of both triangles from shortest to longest.`,
    hint2: `Orientation or flipping does not change correspondence: shortest pairs with shortest!`,
  };
}

/**
 * Procedural generation for World 4: Angle Agency (aa-criterion)
 */
function genWorld4Question(qIdx) {
  const angleSets = [
    [50, 60, 70],
    [40, 65, 75],
    [45, 55, 80],
    [30, 70, 80],
    [35, 65, 80],
  ];
  const [a1, a2, a3] = angleSets[qIdx % angleSets.length];

  if (qIdx % 2 === 0) {
    // Both are similar because two angles match
    const correctAnswer = `Yes — the third angles are ${a3}° and ${a1}°, so all three angles match (${a1}°, ${a2}°, ${a3}°)`;
    const options = [
      correctAnswer,
      `No — only one pair of given angles matches`,
      `No — the triangles have different given numbers`,
      `Cannot tell without knowing the side lengths`,
    ];

    return {
      category: 'AA CRITERION',
      visual: 'anglePair',
      visualData: {
        t1Angles: [a1, a2],
        t2Angles: [a2, a3],
      },
      questionText: `Triangle 1 has angles ${a1}° and ${a2}°. Triangle 2 has angles ${a2}° and ${a3}°. Are the triangles similar?`,
      options,
      correctAnswer,
      explanation: `Angles in a triangle sum to 180°. The third angle of Triangle 1 is 180° − (${a1}° + ${a2}°) = ${a3}°. Both triangles share two equal angles, so by the AA criterion they are similar.`,
      hint1: `First find the third angle of each triangle: subtract the given angles from 180°.`,
      hint2: `If two angles of one triangle match two angles of another, the triangles are similar (AA criterion).`,
    };
  } else {
    // Missing angle in similar triangles
    const ansStr = `${a3}°`;
    const options = [
      ansStr,
      `${a1 + a2}°`,
      `${180 - a1}°`,
      `${a2}°`,
    ];

    return {
      category: 'AA CRITERION',
      visual: 'anglePair',
      visualData: {
        t1Angles: [a1, a2],
        t2Angles: [a1, '?'],
      },
      questionText: `△ABC ∼ △DEF. If ∠A = ${a1}° and ∠B = ${a2}°, what is the measure of ∠F in the similar triangle?`,
      options,
      correctAnswer: ansStr,
      explanation: `Since △ABC ∼ △DEF, corresponding angles are equal. ∠C = 180° − (${a1}° + ${a2}°) = ${a3}°, so ∠F = ${a3}°.`,
      hint1: `First find the missing third angle ∠C in △ABC using 180° − ∠A − ∠B.`,
      hint2: `In similar triangles, corresponding angles are identical: ∠F = ∠C.`,
    };
  }
}

/**
 * Procedural generation for World 5: Shadow Fields (shadow-height)
 */
function genWorld5Question(qIdx) {
  const isMirror = qIdx % 3 === 2;

  if (!isMirror) {
    // Shadow method: h / s = H / S
    const poleHeights = [1.5, 2, 2.4, 3];
    const poleShadows = [2, 3, 3.2, 4];
    const kMultipliers = [6, 8, 10, 12, 15];

    const h = poleHeights[qIdx % poleHeights.length];
    const s = poleShadows[qIdx % poleShadows.length];
    const mult = kMultipliers[qIdx % kMultipliers.length];
    const S = Number((s * mult).toFixed(1));
    const H = Number((h * mult).toFixed(1));

    const ansStr = `${H} m`;
    const dAdditive = `${Number((S - (s - h)).toFixed(1))} m`;
    const dInverse = `${Number(((S * s) / h).toFixed(1))} m`;
    const dProduct = `${Number((S * h).toFixed(1))} m`;

    const options = makeOptions(ansStr, [dAdditive, dInverse, dProduct, `${Number((H + 2).toFixed(1))} m`, `${Number((H * 2).toFixed(1))} m`]);

    return {
      category: 'INDIRECT MEASUREMENT',
      visual: 'shadowScene',
      visualData: { h, s, S, H },
      questionText: `A surveyor's pole ${h} m tall casts a shadow ${s} m long. At the exact same time, a building casts a shadow ${S} m long. How tall is the building?`,
      options,
      correctAnswer: ansStr,
      explanation: `The sun's rays create similar right-angled triangles. Scale factor k = ${S} ÷ ${s} = ${mult}. Building height = ${h} m × ${mult} = ${H} m.`,
      hint1: `First find the scale factor by dividing the building's shadow (${S} m) by the pole's shadow (${s} m).`,
      hint2: `Multiply the pole's height (${h} m) by the scale factor ${mult}.`,
    };
  } else {
    // Mirror method: eye / d1 = H / d2
    const eye = 1.6;
    const d1 = 2;
    const d2List = [10, 15, 20, 25];
    const d2 = d2List[qIdx % d2List.length];
    const k = d2 / d1;
    const H = Number((eye * k).toFixed(1));

    const ansStr = `${H} m`;
    const dAdditive = `${Number((d2 + eye).toFixed(1))} m`;
    const dInverse = `${Number(((d2 * d1) / eye).toFixed(1))} m`;
    const dCopy = `${d2} m`;

    const options = makeOptions(ansStr, [dAdditive, dInverse, dCopy, `${Number((H + 3).toFixed(1))} m`, `${Number((H / 2).toFixed(1))} m`]);

    return {
      category: 'MIRROR METHOD',
      visual: 'mirrorScene',
      visualData: { eye, d1, d2, H },
      questionText: `Maya places a mirror flat on the ground ${d2} m from a cliff base. When she stands ${d1} m from the mirror, her eye level (${eye} m) sees the top of the cliff. How tall is the cliff?`,
      options,
      correctAnswer: ansStr,
      explanation: `The angle of incidence equals the angle of reflection, forming similar triangles. Scale factor k = ${d2} ÷ ${d1} = ${k}. Cliff height = ${eye} × ${k} = ${H} m.`,
      hint1: `First find the scale factor from the ground distances: ${d2} m ÷ ${d1} m.`,
      hint2: `Multiply Maya's eye height (${eye} m) by the scale factor ${k}.`,
    };
  }
}

/**
 * Procedural generation for World 6: Parallel Pass (nested-triangles)
 */
function genWorld6Question(qIdx) {
  // In △ABC, DE ∥ BC. AD, DB, DE given. AB = AD + DB. BC = DE * (AB / AD)
  const configs = [
    { ad: 4, db: 6, de: 6 },   // AB = 10, k = 2.5, BC = 15
    { ad: 3, db: 6, de: 5 },   // AB = 9, k = 3, BC = 15
    { ad: 2, db: 4, de: 4 },   // AB = 6, k = 3, BC = 12
    { ad: 5, db: 5, de: 7 },   // AB = 10, k = 2, BC = 14
    { ad: 4, db: 2, de: 6 },   // AB = 6, k = 1.5, BC = 9
  ];
  const { ad, db, de } = configs[qIdx % configs.length];
  const ab = ad + db;
  const k = ab / ad;
  const bc = de * k;

  const ansStr = `${bc} cm`;
  const dWholeForPart = `${Number(((de * db) / ad).toFixed(1))} cm`;
  const dAdditive = `${de + db} cm`;
  const dCopy = `${ab} cm`;

  const options = makeOptions(ansStr, [dWholeForPart, dAdditive, dCopy, `${de * db} cm`, `${bc + 3} cm`, `${bc - 3} cm`]);

  return {
    category: 'PARALLEL PASS',
    visual: 'nested',
    visualData: { ad, db, de, bc, ab },
    questionText: `In △ABC, D is on AB and E is on AC such that DE ∥ BC. If AD = ${ad} cm, DB = ${db} cm, and DE = ${de} cm, find the length of BC.`,
    options,
    correctAnswer: ansStr,
    explanation: `Since DE ∥ BC, △ADE ∼ △ABC. The full side AB = AD + DB = ${ad} + ${db} = ${ab} cm. The scale factor k = AB ÷ AD = ${ab} ÷ ${ad} = ${k}. Thus, BC = DE × ${k} = ${de} × ${k} = ${bc} cm.`,
    hint1: `First find the full length of side AB by adding AD (${ad} cm) + DB (${db} cm) = ${ab} cm.`,
    hint2: `Find the scale factor k = AB ÷ AD, then multiply DE by k.`,
  };
}

/**
 * Procedural generation for World 7: Map & Model Room (scale-drawing-map)
 */
function genWorld7Question(qIdx) {
  const isMapToReal = qIdx % 2 === 0;
  const scales = [1000, 2000, 5000, 10000, 20000, 25000, 50000, 100000];
  const scale = scales[qIdx % scales.length];
  const place1 = INVENTED_PLACES[qIdx % INVENTED_PLACES.length];
  const place2 = INVENTED_PLACES[(qIdx + 3) % INVENTED_PLACES.length];

  if (isMapToReal) {
    const mapDistCm = [2, 3.5, 4, 5, 6.5][qIdx % 5];
    const realDistCm = mapDistCm * scale;
    const realKm = Number((realDistCm / 100000).toFixed(2));
    const unit = realKm >= 1 ? 'km' : 'm';
    const val = realKm >= 1 ? realKm : realDistCm / 100;

    const ansStr = `${val} ${unit}`;
    const dUnitSlip1 = `${(val * 10).toFixed(1)} ${unit}`;
    const dUnitSlip2 = `${(val / 10).toFixed(2)} ${unit}`;
    const dInverse = `${Number((mapDistCm / 10).toFixed(1))} ${unit}`;

    const options = makeOptions(ansStr, [dUnitSlip1, dUnitSlip2, dInverse, `${(val * 2).toFixed(1)} ${unit}`]);

    return {
      category: 'MAP SCALES',
      visual: 'mapRuler',
      visualData: { scale, mapDistCm, val, unit },
      questionText: `A survey map has a scale of 1 : ${scale.toLocaleString()}. On the map, ${place1} and ${place2} are ${mapDistCm} cm apart. What is the actual distance in ${unit}?`,
      options,
      correctAnswer: ansStr,
      explanation: `Actual distance = ${mapDistCm} cm × ${scale.toLocaleString()} = ${realDistCm.toLocaleString()} cm. Converting cm to ${unit} gives ${ansStr}.`,
      hint1: `First multiply the map distance (${mapDistCm} cm) by the scale number (${scale.toLocaleString()}).`,
      hint2: `Convert centimetres to ${unit} (remember: 100 cm = 1 m, 100 000 cm = 1 km).`,
    };
  } else {
    // Model scale: real size in m to model in cm
    const modelScale = [20, 25, 40, 50, 100][qIdx % 5];
    const realMeters = [4, 6, 8, 10, 12][qIdx % 5];
    const modelCm = (realMeters * 100) / modelScale;

    const ansStr = `${modelCm} cm`;
    const dUnitSlip = `${modelCm * 10} cm`;
    const dForgotConversion = `${Number((realMeters / modelScale).toFixed(2))} cm`;
    const dProduct = `${Number((realMeters * modelScale).toFixed(0))} cm`;

    const options = makeOptions(ansStr, [dUnitSlip, dForgotConversion, dProduct, `${modelCm * 2} cm`]);

    return {
      category: 'SCALE MODELS',
      visual: 'mapRuler',
      visualData: { scale: modelScale, realMeters, modelCm },
      questionText: `An architectural model of a bridge is built at a scale of 1 : ${modelScale}. A real support beam is ${realMeters} m long. How long is the beam on the model in cm?`,
      options,
      correctAnswer: ansStr,
      explanation: `Convert real length to centimetres: ${realMeters} m = ${realMeters * 100} cm. Divide by the scale factor ${modelScale}: ${realMeters * 100} ÷ ${modelScale} = ${modelCm} cm.`,
      hint1: `First convert the real length into centimetres: ${realMeters} m × 100 = ${realMeters * 100} cm.`,
      hint2: `Divide the centimetre length by the model scale number ${modelScale}.`,
    };
  }
}

/**
 * Procedural generation for World 8: Inspector's Desk (multistep-error)
 */
function genWorld8Question(qIdx) {
  if (qIdx % 2 === 0) {
    // Spot the mistake: additive claim
    const origW = 6, origH = 8, diff = 3;
    const newW = origW + diff;
    const newH = origH + diff;
    const name = getRandomName();

    const correctAnswer = `No — ${newW} ÷ ${origW} = ${(newW / origW).toFixed(2)} while ${newH} ÷ ${origH} = ${(newH / origH).toFixed(2)}, so side ratios are not equal`;
    const options = [
      correctAnswer,
      `Yes — each side increased by the exact same length (+${diff} cm)`,
      `Yes — both are rectangles so angles remain 90°`,
      `Only if the perimeter doubled`,
    ];

    return {
      category: 'ERROR DETECTIVE',
      visual: 'workingCard',
      visualData: {
        lines: [
          `Original: ${origW} cm × ${origH} cm`,
          `Enlarged: ${newW} cm × ${newH} cm`,
          `Claim: "+${diff} cm to both sides preserves similarity"`,
        ],
        faultIndex: 2,
      },
      questionText: `${name} enlarges a ${origW} cm × ${origH} cm rectangle to ${newW} cm × ${newH} cm and claims: "Each side grew by ${diff} cm, so the shapes are similar." Is ${name} right?`,
      options,
      correctAnswer,
      explanation: `Adding the same amount (+${diff} cm) does not produce equal ratios (${newW}/${origW} ≠ ${newH}/${origH}). A shape is only similar when every side is multiplied by the same scale factor.`,
      hint1: `First check the ratios of corresponding sides: ${newW} ÷ ${origW} and ${newH} ÷ ${origH}.`,
      hint2: `Adding the same number warps the shape; only multiplication keeps it similar!`,
    };
  } else {
    // Two-step problem: perimeter of enlarged figure
    const triple = TRIPLES[qIdx % TRIPLES.length];
    const k = 2.5;
    const [a, b, c] = triple;
    const pOrig = a + b + c;
    const pScaled = pOrig * k;

    const ansStr = `${pScaled} cm`;
    const dAdditive = `${pOrig + (a * (k - 1))} cm`;
    const dEachSidePlus = `${pOrig + (3 * a)} cm`;
    const dLongestOnly = `${c * k} cm`;

    const options = makeOptions(ansStr, [dAdditive, dEachSidePlus, dLongestOnly, `${pScaled + 5} cm`]);

    return {
      category: 'TWO-STEP SURVEY',
      visual: 'twoFigures',
      visualData: { origSides: [a, b, c], k },
      questionText: `A triangle has sides ${a} cm, ${b} cm, and ${c} cm. It is enlarged with scale factor k = ${k}. What is the perimeter of the new enlarged triangle?`,
      options,
      correctAnswer: ansStr,
      explanation: `Original perimeter = ${a} + ${b} + ${c} = ${pOrig} cm. In similar figures, perimeter scales by k: ${pOrig} × ${k} = ${pScaled} cm.`,
      hint1: `First find the perimeter of the original triangle by adding all three sides: ${a} + ${b} + ${c}.`,
      hint2: `Multiply the original perimeter by the scale factor k = ${k}.`,
    };
  }
}

/**
 * Procedural generation for World 9: Grand Survey Finale (mixed-review)
 */
function genWorld9Question(_qIdx) {
  // Chains shadow height followed by model scale
  const poleH = 1.8;
  const poleS = 2.4;
  const towerShadow = 32;
  const towerHeight = (poleH * towerShadow) / poleS; // 24 m = 2400 cm
  const modelScale = 200;
  const modelHeightCm = (towerHeight * 100) / modelScale; // 12 cm

  const ansStr = `${modelHeightCm} cm`;
  const dForgotScale = `${towerHeight * 100} cm`;
  const dUsedShadow = `${Number(((towerShadow * 100) / modelScale).toFixed(1))} cm`;
  const dUnitSlip = `${Number((towerHeight / modelScale).toFixed(2))} cm`;

  const options = makeOptions(ansStr, [dForgotScale, dUsedShadow, dUnitSlip, `${modelHeightCm + 4} cm`]);

  return {
    category: 'GRAND FINALE',
    visual: 'shadowScene',
    visualData: { h: poleH, s: poleS, S: towerShadow, H: towerHeight, modelScale },
    questionText: `A surveyor ${poleH} m tall casts a ${poleS} m shadow. At the same moment, a telecom tower casts a ${towerShadow} m shadow. A model of the tower is built at scale 1 : ${modelScale}. How tall is the model tower in cm?`,
    options,
    correctAnswer: ansStr,
    explanation: `Step 1: Tower height = ${poleH} × (${towerShadow} ÷ ${poleS}) = ${towerHeight} m = ${towerHeight * 100} cm. Step 2: Model height = ${towerHeight * 100} cm ÷ ${modelScale} = ${modelHeightCm} cm.`,
    hint1: `First calculate the real tower height using the shadow ratio: ${poleH} × (${towerShadow} ÷ ${poleS}).`,
    hint2: `Convert the tower height into centimetres and divide by the model scale (${modelScale}).`,
  };
}

/**
 * Generates the full bank of 100 questions (10 worlds × 10 Qs)
 */
export function generateQuestionBank() {
  const bank = [];
  let globalId = 1;

  for (let w = 0; w < 10; w++) {
    for (let q = 0; q < 10; q++) {
      let qData;
      switch (w) {
        case 0: qData = genWorld0Question(q); break;
        case 1: qData = genWorld1Question(q); break;
        case 2: qData = genWorld2Question(q); break;
        case 3: qData = genWorld3Question(q); break;
        case 4: qData = genWorld4Question(q); break;
        case 5: qData = genWorld5Question(q); break;
        case 6: qData = genWorld6Question(q); break;
        case 7: qData = genWorld7Question(q); break;
        case 8: qData = genWorld8Question(q); break;
        case 9: qData = genWorld9Question(q); break;
        default: qData = genWorld0Question(q); break;
      }

      bank.push({
        id: globalId++,
        districtId: w,
        worldId: w,
        ...qData,
      });
    }
  }

  return bank;
}

export const questionBank = generateQuestionBank();
export default questionBank;
