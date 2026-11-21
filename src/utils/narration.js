// src/utils/narration.js
// Narration script builder and mathematical speech normalizer (TRD §11, PRD §11)

// Helper words for numbers in ratios/scales
const NUMBER_WORDS = {
  1000: 'one thousand',
  2000: 'two thousand',
  5000: 'five thousand',
  10000: 'ten thousand',
  20000: 'twenty thousand',
  25000: 'twenty-five thousand',
  50000: 'fifty thousand',
  100000: 'one hundred thousand',
  200: 'two hundred',
  50: 'fifty',
  40: 'forty',
  10: 'ten',
};

export function spellNumber(n) {
  const num = parseInt(n, 10);
  if (NUMBER_WORDS[num]) return NUMBER_WORDS[num];
  return String(num);
}

/**
 * Normalizes symbols, vertices, scales, and metric units for ElevenLabs Alice narration
 */
export function normalizeNarration(text) {
  if (!text) return '';

  let s = String(text);

  // 1. Scales 1 : n -> "one to {n spoken}"
  s = s.replace(/1\s*:\s*([\d\s]+)/g, (_, n) => {
    const cleanN = n.replace(/\s+/g, '');
    return `one to ${spellNumber(cleanN)}`;
  });

  // 2. Triangle vertices △ABC -> "triangle A B C"
  s = s.replace(/△\s*([A-Za-z]{3})/g, (_, v) => {
    return `triangle ${v.split('').join(' ')}`;
  });

  // 3. Decimals (e.g. 2.5 -> "two point five")
  s = s.replace(/\b(\d+)\.(\d+)\b/g, '$1 point $2');

  // 4. Singular metric units: 1 m -> "one metre", 1 cm -> "one centimetre"
  s = s.replace(/\b1\s*km\b/gi, 'one kilometre');
  s = s.replace(/\b1\s*m\b/gi, 'one metre');
  s = s.replace(/\b1\s*cm\b/gi, 'one centimetre');
  s = s.replace(/\b1\s*mm\b/gi, 'one millimetre');

  // 5. Mathematical symbols and plural metric units
  const replacements = [
    [/∼/g, ' is similar to '],
    [/∥/g, ' is parallel to '],
    [/≠/g, ' is not equal to '],
    [/×/g, ' multiplied by '],
    [/÷/g, ' divided by '],
    [/=/g, ' equals '],
    [/\+/g, ' plus '],
    [/°/g, ' degrees '],
    [/\bkm\b/gi, 'kilometres'],
    [/\bcm\b/gi, 'centimetres'],
    [/\bmm\b/gi, 'millimetres'],
    [/\bm\b/gi, 'metres'],
    [/\bAA\b/g, 'angle angle'],
  ];

  for (const [pattern, rep] of replacements) {
    s = s.replace(pattern, rep);
  }

  // Ensure no stray ':' colon remains in spoken output
  s = s.replace(/:/g, ' to ');

  // Collapse multiple spaces
  return s.replace(/\s+/g, ' ').trim();
}

export function say(text) {
  return { text: normalizeNarration(text), style: 'statement' };
}

export function ask(text) {
  return { text: normalizeNarration(text), style: 'question' };
}

export function cheer(text) {
  return { text: normalizeNarration(text), style: 'celebration' };
}

export function emphasize(text) {
  return { text: normalizeNarration(text), style: 'emphasis' };
}

export function think(text) {
  return { text: normalizeNarration(text), style: 'thinking' };
}

export function instruct(text) {
  return { text: normalizeNarration(text), style: 'instruction' };
}

// ─── Wonder Phase Narration ───────────────────────────────────────
export function wonderNarration() {
  return [
    ask("A 2 metre pole casts a 3 metre shadow. The tree next to it casts a 12 metre shadow. How tall is the tree without climbing it?"),
    think("Drag the sun across the sky to observe how both shadows change together in proportion!"),
  ];
}

// ─── Story Phase Narration (4 Panels) ─────────────────────────────
export function storyNarration(panelIndex) {
  switch (panelIndex) {
    case 0:
      return [
        say("The Survey Crew needs the height of a towering tree that nobody can climb."),
        say("Maya places a 2 metre survey pole into the ground, and it casts a 3 metre shadow. At the same moment, the tree casts a 12 metre shadow."),
        think("Leo says: The shadow is 9 metres longer, so the tree must be 9 metres taller: 11 metres!"),
        say("Maya frowns: That does not look right. When Echo drops a pole beside the tree, the shapes do not match!"),
      ];
    case 1:
      return [
        say("Maya overlays the two triangles: pole and shadow, and tree and shadow."),
        emphasize("The corresponding angles are equal, and the sides grow by the exact same multiplier: 12 divided by 3 equals 4."),
        say("Adding does not keep the shape. Multiplying by a scale factor does!"),
        say("When figures have the same shape and size, the scale factor is 1, which means they are congruent."),
      ];
    case 2:
      return [
        say("Now Maya uses the scale factor to find the tree's true height: 2 metres multiplied by 4 equals 8 metres!"),
        say("Next, they enlarge a survey photo from 6 centimetres by 4 centimetres to 15 centimetres wide."),
        say("The scale factor is 15 divided by 6, which equals 2 point 5."),
        say("So the new height is 4 multiplied by 2 point 5, which equals 10 centimetres. Maya's rule is: match sides first, find the scale factor, and check if the answer makes sense."),
      ];
    case 3:
      return [
        say("For their final survey, a sheer cliff is too steep to climb."),
        say("Maya places a mirror flat on the ground 15 metres from the cliff base, then steps back 2 metres until she sees the cliff peak reflected in the centre."),
        say("Her eye height is 1 point 6 metres. Since the triangles are similar, the scale factor is 15 divided by 2, which equals 7 point 5."),
        say("The cliff height is 1 point 6 multiplied by 7 point 5, which equals 12 metres!"),
        cheer("And what happens to the area when lengths double? That is a story for another day!"),
      ];
    default:
      return [];
  }
}

// ─── Simulate Station Intros ──────────────────────────────────────
export function simStationIntro(stationIndex) {
  switch (stationIndex) {
    case 0:
      return [
        instruct("Welcome to Station 1: Zoom Lens Lab! Drag the scale factor slider and corner handles to explore enlargement and reduction. Toggle additive growth to see why adding warps the shape!"),
      ];
    case 1:
      return [
        instruct("Welcome to Station 2: Match the Model! Drag the corner handle to resize the model triangle until it snaps into the target outline."),
      ];
    case 2:
      return [
        instruct("Welcome to Station 3: River Survey! Place your stakes, measure the baselines with the tape, match corresponding sides, and turn the dial to measure across the river!"),
      ];
    case 3:
      return [
        instruct("Welcome to Station 4: Replay Review! Scrub the surveyor's calculation steps, spot the error, and drag the repair cards to correct the flaw!"),
      ];
    default:
      return [];
  }
}

// ─── Practice Phase Narration ─────────────────────────────────────
export function playQuestionNarration(questionText) {
  return [ask(questionText)];
}

export function playCorrectNarration(streak) {
  if (streak >= 5) {
    return [cheer("Outstanding streak! You are surveying like a master!")];
  }
  if (streak >= 3) {
    return [cheer("Brilliant! Three in a row!")];
  }
  return [cheer("Spot on! That is exactly right! 🎯")];
}

export function playWrongNarration() {
  return [think("Not quite — check the corresponding sides, use the hint, and try again! 💡")];
}

export function playHintNarration(hintText) {
  return [say(hintText)];
}

export function districtCompleteNarration() {
  return [cheer("Survey Site Complete! Spectacular work mapping this region!")];
}

// ─── Boss Battle Narration ────────────────────────────────────────
export function bossStartNarration(bossName) {
  return [emphasize(`The Site Boss ${bossName} has arrived! Answer all similarity challenges to win the badge!`)];
}

export function bossWinNarration(bossReward) {
  return [cheer(`Victory! You conquered the Site Boss and claimed the ${bossReward}!`)];
}

// ─── Reflect Phase Narration ──────────────────────────────────────
export function reflectNarration() {
  return [say("Welcome to the Reflect Phase. Let's review what we learned about scale factors, corresponding sides, and indirect measurement.")];
}

export function reflectCompleteNarration() {
  return [cheer("Survey Expedition Complete! You have mastered similarity applications and scale factors!")];
}
