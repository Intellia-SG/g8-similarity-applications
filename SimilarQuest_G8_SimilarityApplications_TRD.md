# SimilarQuest — Module TRD
**Grade 8 · Similarity Applications**

*Technical companion to `SimilarQuest_G8_SimilarityApplications_PRD.md`, produced from `Intellia_Module_Blueprint_TRD_v3.1.md`. Repo: `similar-quest-main`. Clone source: `G2-Money-Money-main`.*

**Traceability.** Special instructions: none supplied (defaults D1–D4 in PRD §6). Platform standards: **S1** → §6.4, §12.6 · **S2** → §8, §12.7 · **S3** → §9, §12.8 · **S4** → §10, §12.9 · **G1** → §4.4, §12.18.

**Fixed vs. module content.** Sections marked **[FIXED]** are carried from the blueprint with their values; the only module slots are called out in **bold "Module slot"** lines. Appendix A of the blueprint (the `usePointerDrag` skeleton, the Reflect layout CSS, the Home-screen one-line Playwright test) is used unchanged and is not repeated here.

---

## 1. Reference Analysis Notes — Gotcha Check **[FIXED + module risk]**

Re-verify each against the repo actually cloned.

**Dead and duplicate code** (trace imports from `main.jsx` → `App.jsx`):
1. The live tree is `src/components/**`, `src/config/worlds.config.js`, `src/data/*`, `src/hooks/useAudio.js`, `src/utils/*`. **Do not copy or edit** `src/features/*`, `src/core/*` (including `useViewport` and `audio/useAudio`) or the unused `TopBar.jsx`, `PhaseNav.jsx`, `XPBar.jsx`, `FloatingSymbols.jsx`.
2. `src/index.css` is never imported (`main.jsx` imports only `styles/globals.css`).

**Undefined CSS variables:** 3. Components use `--text-primary`, `--text-secondary`, `--text-muted`, `--radius-xl`, `--transition`, which `design-tokens.css` does not define. Define them (§5.1).

**Layout bugs inherited from the zip:**
4. `.phase-content` uses `100vh` while `.app-shell` uses `100dvh` → use `100dvh` and `--header-h` (§5.3).
5. Mobile header hides phase labels ≤ 768 px — kept; the one-line names requirement is met on the Home screen (§6.4).
6. Viewport meta has `maximum-scale=1.0, user-scalable=no` → remove (WCAG 1.4.4); needs sign-off (PRD §15.10).
7. `generateSessionQuestions` only sorts by `id`; `LOAD_QUESTIONS` fires on every Begin → replays repeat unless the bank is regenerated (needed for the unlock rule, §7.4).
8. Two ElevenLabs voice-settings tables (`scripts/generate_audio.js` vs `hooks/useAudio.js`) → unify on one (§11).
9. Hardcoded reducer counts: `storyPanel >= 3`, `ADVANCE_SIM_STATION` capped at 3, `NEXT_QUESTION` uses `% 10` and `< 100`. SimilarQuest uses the **defaults** (4 panels, 4 stations, 10 worlds, 100 questions), so the literals happen to be correct — **still move them to named constants** (`STORY_PANELS.length`, `STATIONS.length`) so a later change cannot silently break, and unit-test panel 4 → phase advance.
10. Leftover branding: `index.html` `<title>`/description, `package.json` `name` (`moneyquest`), `README.md`, `narration.js`, emoji/class names such as `.coin-btn-emoji`. Set `<title>` to **Intellia Global**; `package.json` name `similar-quest`.
11. Mouse-only interaction risk and fixed-pixel assumptions in inherited station components (§9, §10).
12. **Locale leftovers (G1).** The zip is a *money* module: its story, question bank, narration, audio `phrases` and station copy contain currency and shop content (Coin Register, Market Scanner, Change Maker, Receipt Detective, `$`, "change", "receipt"). Grep and rewrite all of it; the locale audit (§12.18) enforces it. Character names follow §4.4.

**Module-specific risk (the one most likely to corrupt correctness): a diagram, question text or answer that disagrees about which side corresponds to which.** Similarity questions fail silently when a figure is flipped or rotated, a letter order is permuted, or a distractor is derived from the wrong pair. **Guardrail — one source of truth:** every figure is a single `Figure` object (vertices, side lengths, angles, and an explicit `corr` map from each vertex of the original to the matching vertex of the scaled copy) built in `utils/similarMath.js`. The question text, the correct answer, **every distractor**, the explanation and the `SimilarVisual` data are all derived from that object; nothing is typed by hand per question. The independent oracle (§12.2) recomputes every answer from `visualData` alone.

---

## 2. Tech Stack **[FIXED — exact versions from the zip's `package.json`]**

| Item | Version / setting |
|---|---|
| React / React DOM | `^19.2.7` |
| Vite / `@vitejs/plugin-react` | `^8.1.0` / `^6.0.2` (`base: '/'`, manual `vendor` chunk) |
| Framer Motion | `^12.42.0` |
| lucide-react | `^1.22.0` |
| Tailwind CSS (+ PostCSS, Autoprefixer) | `^3.4.4` (`@tailwind base/components/utilities` imported in `globals.css`; empty `theme.extend`) |
| Lint | `oxlint ^1.69.0` (`react/rules-of-hooks: error`, `react/only-export-components: warn`) |
| Audio tooling (dev) | `dotenv`, `node-fetch` (scripts `generate-audio`, `clean-audio`) |
| Hosting | `vercel.json` single-page rewrite to `/index.html` |
| Fonts | Google Fonts: **Fredoka** 400–700, **Nunito** 400/600/700/800/900, **Quicksand** 500–700 (`index.html`) |

No new runtime dependencies. Dev-only additions for §12: Playwright and axe-core.

---

## 3. Folder Structure **[FIXED skeleton; module files filled]**

```
similar-quest-main/
├── public/ (assets/audio, assets/story, favicon.svg)
├── scripts/ generate_audio.js, clean_audio.js,
│            stress_test.mjs (NEW), oracle.mjs (NEW), layout_tests.spec.mjs (NEW),
│            locale_audit.mjs (NEW), freeze_questionbank.mjs (NEW, seeded bank for the answer-leak test)
├── src/
│   ├── main.jsx                      # imports styles/globals.css only
│   ├── App.jsx / App.css             # reducer (+ unlock rule, §7.4), app-shell, app-header
│   ├── styles/ design-tokens.css (§5.1), globals.css
│   ├── config/ worlds.config.js, audio.config.js, characters.config.js   # Maya / Leo / Echo; no locale.config.js (no currency; metric only)
│   ├── hooks/ useAudio.js, usePointerDrag.js (NEW), useVisualScale.js (NEW)
│   ├── data/ storyContent.js, questionBank.js
│   ├── utils/ audio.js, audioMap.js (generated), narration.js, badgeEngine.js, scoring.js, shuffle.js,
│   │          similarMath.js (NEW — §4.3), namePool.js (NEW — §4.4)
│   └── components/
│       ├── IntroScreen.jsx/.css      # REWRITE to screenshot 1 (§6)
│       ├── ProgressMap.jsx/.css      # header phase nav — reuse as-is
│       ├── shared/ Mascot (Echo the Bat), FeedbackOverlay, FloatingNumbers (reskin: ∼ △ × ÷),
│       │           SimilarVisual.jsx (NEW — §4.5)
│       ├── gamification/ KingdomMap (REWRITE to screenshot 2, §7), StarRating
│       ├── quiz/ QuestionRenderer, BossBattleModal              # reuse
│       ├── phases/ WonderPhase, StoryPhase, SimulatePhase, PlayPhase (map per §7), ReflectPhase (stepped, §8) + reflect/*
│       └── simulations/ ZoomLensLab.jsx, MatchTheModel.jsx, RiverSurvey.jsx, ReplayReview.jsx, Stations.css
└── index.html, package.json, vite.config.js, tailwind.config.js, postcss.config.js, vercel.json, .oxlintrc.json, README.md
```
Do **not** copy: `src/features/*`, `src/core/*`, `index.css`, `TopBar`, `PhaseNav`, `XPBar`, `FloatingSymbols`, `CoinDisplay`, `MoneyVisual`, `moneyMath.js`.

---

## 4. Data Layer

### 4.1 `config/worlds.config.js`
Ten entries `{ id, name, emoji, accent, description, conceptFocus, boss: { name, emoji, reward } }`; `id` 9 is the finale. The map card shows `emoji`, `name`, and a **derived** question range `Q{10i+1}–{10i+10}`. **Module slot — accents use the zip's ten, in order:**

| id | World | `accent` (`--world-n`) | `conceptFocus` | Boss | Reward |
|---|---|---|---|---|---|
| 0 | Look-Alike Lab 🔬 | `#FFD700` | `similar-or-not` | The Imposter 🎭 | Twin Spotter Badge |
| 1 | Zoom Workshop 🔭 | `#FF6F61` | `find-scale-factor` | The Zoom Wizard 🧙 | Scale Setter Badge |
| 2 | Missing Side Mill 🏭 | `#4CAF50` | `missing-side` | The Gap Giant 🗿 | Side Solver Badge |
| 3 | Mix-Up Junction 🔀 | `#AB47BC` | `corresponding-sides` | The Twister 🌀 | Match Maker Badge |
| 4 | Angle Agency 🕵️ | `#29B6F6` | `aa-criterion` | The Angle Thief 🥷 | Angle Ace Badge |
| 5 | Shadow Fields 🌳 | `#EC407A` | `shadow-height` | The Long Shadow 🌒 | Shadow Measurer Badge |
| 6 | Parallel Pass ⛰️ | `#FF9800` | `nested-triangles` | The Cliff Keeper 🗻 | Pass Finder Badge |
| 7 | Map & Model Room 🗺️ | `#26A69A` | `scale-drawing-map` | The Map Maker 🧭 | Scale Navigator Badge |
| 8 | Inspector's Desk 🧾 | `#5C6BC0` | `multistep-error` | Inspector Slip 🕶️ | Error Hunter Badge |
| 9 | Grand Survey Finale 🏆 | `#FFC107` | `mixed-review` | The Chief Surveyor 👑 | Master Surveyor Badge |

Descriptions are those in PRD §9. `characters.config.js`: `{ maya: 'Maya', leo: 'Leo' }` and `MASCOT = { name: 'Echo the Bat', emoji: '🦇' }`; no component, story string or narration string hard-codes these names.

### 4.2 `data/storyContent.js`
`STORY_PANELS` (length 4; the reducer reads `STORY_PANELS.length`). Every number is a **fixed literal**, checked once at build time by `tests/story_facts.test.mjs` against `similarMath.js`:

| Panel | Literals | Assertion |
|---|---|---|
| 1 | pole 2 m, shadow 3 m, tree shadow 12 m; Leo's wrong answer 11 m | `2 + (12 − 3) === 11` |
| 2 | scale factor 12 ÷ 3 = 4 | `12 / 3 === 4` |
| 3 | tree 2 × 4 = 8 m; photo 6 cm × 4 cm → 15 cm wide: k = 2.5, height 10 cm, reverse 15 ÷ 2.5 = 6 cm | `15/6 === 2.5 && 4*2.5 === 10 && 15/2.5 === 6` |
| 4 | mirror 15 m from the cliff, eye height 1.6 m, 2 m from the mirror; k = 15 ÷ 2 = 7.5; cliff 1.6 × 7.5 = 12 m | `1.6 * (15/2) === 12` (checked with exact rational arithmetic) |

Panel objects: `{ panel, title, text, highlight, character, characterEmoji, imageBg, imageEmoji }`. Add a scan for stray leading quotation marks in panel text (a defect found in an earlier build).

### 4.3 Question bank — procedural generation **[FIXED architecture + module detail]**
Fixed architecture (blueprint §4.3): one source of truth, whole-number by construction, named-misconception distractors from a registry, **regenerate don't pad**, coincidence guards, shared logic, explanations rendered from the solution trace, context variety.

**Schema (unchanged):** `{ id, districtId, category, visual, questionText, options (4), correctAnswer, explanation, hint1, hint2, visualData }`; export `DISTRICTS` derived from `WORLDS`.

#### 4.3.1 The `Figure` object (`utils/similarMath.js`)
```js
// A Figure is the single source of truth for one similar pair.
{
  kind: 'triangle' | 'rectangle' | 'polygon',
  names: ['A','B','C'],           // vertex letters of the ORIGINAL
  namesScaled: ['D','E','F'],     // letters of the copy; position i corresponds to names[i]
  sides: [4, 6, 8],               // original side lengths, indexed by side i = (vertex i -> i+1)
  angles: [..],                   // degrees; angles of the copy are identical
  k: F(5,2),                      // exact rational scale factor, ORIGINAL -> COPY
  sidesScaled: [10, 15, 20],      // computed: sides[i] * k
  view: { flip: bool, rotate: 0|90|180|270 },   // presentation only; never changes correspondence
  corr: [0,1,2],                  // corr[i] = index in the copy of original side i (a permutation when the copy is listed in a different order)
}
```
All rational arithmetic uses a tiny exact-fraction helper (`frac.js`) — **no floating-point equality anywhere**.

#### 4.3.2 Pools and forward generation
```js
export const K_ENLARGE = [F(3,2), F(2), F(5,2), F(3), F(4), F(5), F(4,3), F(5,4), F(5,3), F(7,2), F(7,4)];
// Reductions use the reciprocal (0 < k < 1) by swapping which figure is "original".
export const TRIPLES = [[3,4,5],[4,5,6],[5,6,7],[4,6,8],[6,8,10],[5,7,9],[6,7,8],[6,9,12],[8,10,12],[7,9,11],[8,11,14]];
export const SIDE_CAP = 60;                 // no displayed length above 60 in a shape context
export const isClean = (v) => isInt(v.mul(2));   // whole number or ends in .5
```
**Governing rule — generate forward, then mask:** (1) draw `k` and a triple (optionally × 1–3); (2) reject-and-retry unless **every** scaled side `isClean` and `≤ SIDE_CAP` (never clamp); (3) compute all lengths; (4) choose the *given pair* and the *asked side*; (5) mask the asked value. In a count of the pools above (original sides 2–20, the eleven enlargement factors) there are **128 whole-number two-side pairs** (165 if a .5 result is allowed); the largest scaled side is 100, so the 60 cap in step 2 removes the largest draws (15 of the 128 pairs), and the triple-based generators have **876 triple/k/side-pair draws** under the cap.

#### 4.3.3 Misconception registry (`utils/misconceptions.js`)
Every distractor and seeded error carries a `misconceptionId`; the registry maps each id to the wrong procedure.

| Id | Wrong procedure (as a function of the Figure) |
|---|---|
| `additive` | add the difference of the given pair to the target side: `c + (b − a)` |
| `angles-only` | answer "similar" because angles match (or the figures are both rectangles) |
| `mismatch` | pair by position or by equal number, not by correspondence: return the same-index side of the *wrong* list, or the longest/shortest regardless of position |
| `inverse-k` | use `1/k`: `c × a ÷ b` |
| `copy-side` | return a given length unchanged |
| `product` | `a × b` (or `c × b`) |
| `whole-for-part` | in nested triangles, use `AB` where `AD` belongs: `de × (db ÷ ad)` |
| `unit-slip` | misplace a cm→m→km conversion by a power of ten, or leave a result in the wrong unit |

#### 4.3.4 Per-world generator map
| World | Generator | Asked quantity (mask) | `visual` | Ranked distractor candidates (first = highest priority) |
|---|---|---|---|---|
| 0 | `genSimilarOrNot` | verdict + reason; 50 % similar, 50 % not | `twoFigures` | reason-matched options: `additive` ("each side is d longer"), `angles-only`, "cannot tell", the correct reason |
| 1 | `genFindK` | k (enlarge **or** reduce) | `twoFigures` | `additive` (b − a), `inverse-k`, `product`, `(b ÷ a) + 1`, `b ÷ 2` |
| 2 | `genMissingSide` | counterpart of side c (small→large and large→small) | `twoFigures` | `additive`, `inverse-k`, `copy-side` (b), `product` (c·b), `c·(b − a)` |
| 3 | `genCorrespondingSides` | which side of the copy matches a highlighted side (copy flipped/rotated) | `overlay` | `mismatch` ×2 (same number; longest), "cannot tell" or the adjacent side |
| 4 | `genAA` | similar? **or** the missing angle | `anglePair` | "only one pair matches", "different given angles", "cannot know without sides", plus `angles-only` |
| 5 | `genShadow` / `genMirror` | height H = S × h ÷ s (shadow) or eye × d₂ ÷ d₁ (mirror) | `shadowScene`, `mirrorScene` | `additive` (S − (s − h)), `inverse-k` (S·s ÷ h), `product` (S·h), `copy-side` (S) |
| 6 | `genNested` | a side of the large triangle given a parallel line, or a side of the small one | `nested` | `whole-for-part` (de·db ÷ ad), `additive` (de + db), `copy-side` (AB), `de·db`, `bc + ab − ad` |
| 7 | `genMapModel` | actual from drawing **or** drawing from actual; units cm/m/km | `mapRuler` | `unit-slip` ×2 (×10, ×100 or ÷10), `inverse-k` (÷ instead of ×), the figure left in cm |
| 8 | `genInspector` + `genTwoStep` | true/false or find-the-fault claim; two-step perimeter-of-scaled-figure | `workingCard` | fixed text options for claims; for the perimeter variant: `additive` (p + (b − a)), each-side-plus, longest side only |
| 9 | `genMixed` | chains two of worlds 5–8 (for example shadow → model scale) | (inherited per step) | candidates of each step, including the forgot-the-second-step value and `unit-slip` |

**Distractor policy (ranked candidates, not a fixed trio).** A fixed set of three named-misconception distractors collides with the answer or with each other in a measurable share of draws, so each generator supplies 5–7 ranked candidates and picks the first three that are positive, distinct from the answer and from each other, and pass the display rule below. If fewer than three survive, the generator **rejects the draw and regenerates** (never pads with random numbers).

```js
function pickDistractors(answer, ranked) {
  const out = [];
  for (const c of ranked) {
    if (c.gt(0) && c.lte(200) && decimalsOf(c) <= 2 && !c.eq(answer) && !out.some(d => d.eq(c))) out.push(c);
    if (out.length === 3) return out;
  }
  return null;       // caller regenerates (terms, k)
}
```
**Measured yield** (script run while drafting, ranked lists as above and the ≤ 2-decimal display rule): *missing side, enlargement* 93 % of draws usable first time; *missing side, reduction* 81 %; other generators ≥ 99 % in the earlier check without the decimal rule (scale factor 100 %, shadow 100 %, map 100 %, nested 99 %, perimeter 100 %). The remainder are regenerated; §12.1 fails the build if any generator retries more than 20 % of its draws, so the **reduction** list should be extended with a seventh candidate before it is accepted.

**Constraints.**
- *World 0:* when the pair is not similar, **at least half the draws** use equal differences (the `additive` trap); a "not similar" pair always has at least one unequal ratio verified by cross-multiplication.
- *World 3:* the copy is drawn flipped or rotated (`view`), but `corr` is never reordered by presentation; the highlighted side's counterpart is read from `corr`.
- *World 4:* angles are integers 20°–120°; two given angles per triangle; the third angle is computed (180 − sum), and the verdict is "similar" iff the angle multisets are equal.
- *World 5:* shadow heights come from `h ∈ {1.5, 1.8, 2, 2.4, 3, 4}` m with shadows `s` so that `H = S × h ÷ s` is a whole number or ends in .5; mirror: `eye × d₂ ÷ d₁` likewise.
- *World 6:* `DE ∥ BC`; `AD`, `DB` integers 2–8, `AD ≠ DB`; `BC = DE × (AD + DB) ÷ AD` must be clean; the diagram is drawn from coordinates so the parallel line really is parallel.
- *World 7:* scale `n ∈ {1000, 2000, 5000, 10 000, 20 000, 25 000, 50 000, 100 000}`; drawing lengths 0.5–14.5 cm in steps of 0.5; every answer in km or m has **at most one decimal place** and is at least 1 km (or 50 m); place names come from an invented list (for example "Pine Bay", "Harbour Rock", "Maple Ridge"); never a real place.
- *No area, volume, SAS, or coordinate-dilation* question is generated (PRD §3.3).
- **Context variety:** across the 100 questions, no context (shadow, mirror, photo, map, model, screen, blueprint) accounts for more than 25 % of the bank.

### 4.4 Locale and names **[FIXED rules; lists filled]**
1. **Names.** Characters are **Maya** and **Leo** (common English first names, gender-balanced, easy for the Alice voice, distinct from sibling pairs). They live **only** in `characters.config.js` and are passed into templates. Background names in generated questions come from `utils/namePool.js`, a pool of common English first names, for example *Ava, Noah, Emma, Liam, Olivia, Ethan, Sophia, Jack, Grace, Ben, Chloe, Sam, Ella, Max, Lily, Tom, Ruby, Jake, Anna, Dan*; never a locale-specific list.
2. **Curriculum-neutral wording:** no level labels such as Year n, Secondary n, Class n, Standard n, or named programmes in learner-facing text; "grade", "class" and "club" only. Framework names appear in the PRD/TRD only.
3. **Money, units, dates, places, holidays, food, brands:** none appear. Units are metric (mm, cm, m, km); place names on maps are invented. Because the topic needs **no currency or regional unit**, **no `config/locale.config.js` is created.**
4. **Notation and terminology house style:** ∼, "scale factor", "corresponding sides", "AA", scales written `1 : n` and spoken "one to n" — as declared in PRD §3.6.
5. **Spelling:** international/UK ("metres", "centimetres"); learner-facing text uses symbols wherever possible.
6. **Audio:** names, letters and terms are checked by ear in the generated clips; if a name is mispronounced, **replace the name**, not its spelling. Spoken vertex letters are checked for ambiguity (for example "A" vs "eh", "D" vs "E") in a short audio review.

### 4.5 `SimilarVisual.jsx` contract
```jsx
<SimilarVisual type={String} data={Object} compact={Boolean} reveal={Boolean} />
```
`reveal` **defaults to `false`** and hides the asked-for quantity; only Simulate stations pass `reveal`. All colours come from CSS variables; **every vertex, side and angle has a text label**, and corresponding parts also carry **shape markers** (single tick, double tick, circle) so colour is never the only cue. Figures are **drawn to scale** from `Figure` data (§14 of the PRD).

| `type` | Renders | `data` |
|---|---|---|
| `twoFigures` | The original and the copy side by side with labelled sides, correspondence ticks | `{ figure, given, asked }` |
| `overlay` | The copy rotated/flipped beside the original with one side highlighted | `{ figure, highlightSide }` |
| `anglePair` | Two triangles with two labelled angle arcs each | `{ t1, t2 }` |
| `shadowScene` | Pole + tall object with their shadows and the sun ray | `{ h, s, S, H? }` |
| `mirrorScene` | Person, mirror on the ground, cliff/tower, three distances | `{ eye, d1, d2, H? }` |
| `nested` | Triangle ABC with DE ∥ BC, labelled segments | `{ ad, db, de, bc? }` |
| `mapRuler` | A map fragment with a ruler and a scale bar | `{ n, d, actual? , unit }` |
| `workingCard` | A worked-solution card (used by World 8, Station 4 and Reflect) | `{ lines, faultIndex?, misconceptionId? }` |

On narrow screens the figure scales to its container width via `useVisualScale`; label sizes never fall below 12 px (a figure scales its *view*, not the stated lengths).

---

## 5. Design System **[FIXED — from the zip]**

### 5.1 `styles/design-tokens.css`
Reuse the zip's file verbatim, then **append** the five tokens its components use but never defined:

| Token | Value |
|---|---|
| `--color-bg` | `#0a0a2e` |
| `--color-surface` | `rgba(30, 30, 100, 0.7)` |
| `--color-primary` / `--gold` | `#ffc107` (`--gold-light` `#ffe082`) |
| `--color-secondary` / `--purple` | `#7c5cbf` (`--purple-light` `#9c7fd8`) |
| `--color-accent` / `--green` | `#4caf50` |
| `--color-error` / `--red` | `#ef5350` |
| `--color-text` / `--color-text-muted` | `#ffffff` / `rgba(255,255,255,0.4)` |
| `--font-display` / `--font-body` / `--font-emoji` | Fredoka / Nunito (each with the system fallback chain) / the colour-emoji font stack |
| `--radius-sm / md / lg / pill` | `8px / 14px / 22px / 999px` |
| `--shadow-sm / md` | `0 2px 8px rgba(0,0,0,.25)` / `0 6px 24px rgba(0,0,0,.35)` |
| `--shadow-glow-gold` | `0 0 24px rgba(255,193,7,.35)` |
| `--transition-fast / base / spring` | `0.18s ease` / `0.3s ease` / `0.6s cubic-bezier(0.34,1.56,0.64,1)` |
| **Append** `--text-primary` | `#ffffff` |
| **Append** `--text-secondary` | `rgba(255,255,255,0.75)` |
| **Append** `--text-muted` | `rgba(255,255,255,0.45)` |
| **Append** `--radius-xl` | `22px` |
| **Append** `--transition` | `0.25s cubic-bezier(0.4,0,0.2,1)` |

**World accents** `--world-0 … --world-9`: the zip's ten, in the order of §4.1. **Recurring literals:** amber CTA gradient `#fbb03b → #f59e0b` (border `#fbbf24`, text `#18181b`); primary button `linear-gradient(135deg,#ffc107,#ff9800)`; success `#22c55e`; option correct `#00e676`, wrong `#ff5252`; Home title orange `#ff9f43`, subtitle gold `#feca57`; station title `#fcd34d`; hint purple (bg `rgba(124,92,191,.22)`, border `rgba(124,92,191,.5)`, text `#f3e8ff`).
**Surfaces:** `.glass-card` `rgba(22,22,80,.72)`, blur 14 px, border `1px rgba(255,255,255,.1)`, radius 22; Wonder/Simulate/Story cards `rgba(26,20,68,.85–.88)` blur 20–24 px, border `1–1.5px rgba(130,110,210,.25–.3)`, radius 22; header pill/audio button `rgba(20,20,45,.78)`; Home journey card `rgba(30,30,65,.65)` blur 14, radius 20; Home chips `rgba(30,30,60,.6)`, pill; feedback/boss overlays as in the zip. `body` is flat `#0a0a2e`; `FloatingNumbers` (fixed, z-index 0, 2.4 rem, `rgba(255,255,255,.045)`, 22 s float) sits behind every phase (**module slot: its glyphs are ∼ △ × ÷ 1 : n, not money symbols**); the Home screen alone adds a radial gradient (§6.2).

### 5.2 Typography
Fredoka (700–900) for headings/buttons; Nunito (600–800) for UI text. Home title `clamp(2.4rem,4.8vw,3.8rem)`/900; Home subtitle ≈ 18 px/800; Wonder title `clamp(1.4rem,2.4vw,1.95rem)`/900; Story title/text `clamp(1.45rem,2.2vw,2rem)` / `clamp(1.08rem,1.3vw,1.28rem)` (line-height 1.6); question text `clamp(1.35rem,2vw,1.75rem)`/900 (line-height 1.45); option `1.05rem`, min-height 48/700; station title/guide `clamp(1.1rem,1.35vw,1.35rem)` / `clamp(.92rem,1.05vw,1.05rem)`; Reflect title `clamp(1.5rem,2.5vw,2.1rem)`/900; header label `1rem`/800; buttons `1rem` (`.btn-sm` `.88rem`, `.btn-lg` `1.15rem`)/700. Emoji use `--font-emoji` (extend the zip's emoji class list for this module's own classes).

### 5.3 App shell and header
| Item | Desktop | ≤ 768 px | ≤ 540 px |
|---|---|---|---|
| `.app-header` height / padding | 56 / `0 16` | 50 / `0 8` | 46 |
| `.phase-content` padding-top | 58 | 50 | 46 |
| `.phase-content` padding-bottom | 6 | `max(60px, 40px + safe-area)` | `max(70px, 45px + safe-area)` |
| `.home-btn` | `top 8, left 16`, border `1.5px #f59e0b`, bg `rgba(22,18,48,.9)`, text `#fbbf24`, `.92rem`, padding `6px 16px` | `top 7, left 8`, `.84rem` | text hidden |
| Phase pill / step circle / label | padding `8px 20px`, gap 14 / 30 px / Fredoka `1rem` 800 | padding `4px 8px`, gap 4 / 26 px / hidden | same |
| Audio button | 44 × 44 | 34 × 34 | same |

Step-circle states: done `#22c55e` ✓; active `#fbb03b` (text `#18181b`); idle `rgba(255,255,255,.15)`. The header is hidden on the Home screen. **The audio toggle sits immediately right of the phase pill (gap 12).** Fix for gotcha 4: define `--header-h` (56 / 50 / 46) and use `height: calc(100dvh - var(--header-h))`.

### 5.4 Per-phase layout metrics (zip)
Wonder: max-width 660; dashed gold number display; CTA `1.1rem`, min-height 44. Story: container `min(1160px,96vw)`; grid `1.15fr 1fr`; radius 22; max-height `calc(100vh - 140px)` (→ `100dvh`); dots 12 px (active 28 px); single column ≤ 768. Simulate: `.sim-card` max `min(1080px,98vw)`; tabs min-height 32 (28); footer buttons min-height 36 (34). Station: `station-grid-2col` `1fr 1fr`, one column at ≤ 768; success panel `rgba(18,16,52,.96)`, `2px rgba(34,197,94,.7)`. Practice question: `.play-wrap` max 800; `.qr-wrap` max 740; options grid 2 × gap 10; prev/next min-height 44. Feedback overlay: max 520, auto-dismiss 2.2 s. Boss modal: max 540 (battle 760). Reflect: `.reflect-card` max 760, trophy 620.

### 5.5 Breakpoints and motion
Breakpoints: **768** (primary), 600, **540**, 500, **480**. No new primary breakpoints. Motion: hover `translateY(-1…-3px)` with amber glow; press `scale(.97)`; wrong option shake `0.38s`; spring `0.6s cubic-bezier(.34,1.56,.64,1)` for celebratory pops.

---

## 6. Home Screen **[FIXED structure — screenshot 1]**

### 6.1 Structure
Top chip → title → subtitle → mascot row → journey card (all five phases in **one row** joined by `→`) → CTA → three info chips. No header, no description paragraph. **Module slots:** chip `✨ Curriculum · Similarity Applications Grade 8`; title **Similar** (orange) **Quest** (white); subtitle `Measure the unmeasurable with similar shapes`; bubble "Same shape, different size? Multiply every side by the same **scale factor** — never just add!"; descriptors Wonder "Shadow stick puzzle", Story "4 survey adventures", Simulate "4 interactive labs", Practice "10 worlds & bosses", Reflect "Review & scorecard"; chips `🎯 100 Questions`, `📐 Scale & Shape`, `✨ Badges & XP`.

### 6.2 Measurements at 1366 × 681 *(measured, ±3 px)*
Top chip ≈ 450 × 33 (x 458–908, y 55–88); title cap-height ≈ 40, y ≈ 136–181; subtitle y ≈ 188–205, ≈ 18 px/800 `#feca57`; mascot avatar ≈ 48 px (`radial-gradient(circle,#ffd54f,#ff9f43)`); speech bubble ≈ 720 × 58 (x 353–1073, y 253–311), white, radius ≈ 20, text ≈ 15 px/800 `#2b2b2b`; **journey card ≈ 860 × 123** (x 253–1113, y 354–477), `rgba(30,30,65,.65)`, border `1px rgba(255,255,255,.14)`, radius 20, blur 14; heading ≈ 13 px/900 `#feca57`, letter-spacing 1 px, y ≈ 374; items row centre y ≈ 430, **pitch ≈ 173**, icon circle ≈ 36 px, name ≈ 15 px/800 white, descriptor ≈ 12 px `#a4b0be`; arrows `rgba(255,255,255,.25)` ≈ 20 px; **CTA ≈ 272 × 57** (x 547–819, y 520–577), `#fbb03b → #f59e0b`, text `#18181b` ≈ 19 px/800, radius ≈ 18, glow `0 6px 20px rgba(245,158,11,.4)`; chips y 585–624 (≈ 39 h), widths ≈ 145 / 161 / 139, gap ≈ 13. No scroll at 1366 × 681. Page background `radial-gradient(ellipse at 50% 40%, #1b1143 0%, #09051c 100%)` (approximate).

### 6.3 Reference CSS
Adapt the zip's `IntroScreen.css` as in the blueprint: `.intro-wrap` radial background; `.journey-card { max-width:860px; padding:16px 26px; border-radius:20px }`; `.journey-steps-container { display:flex; justify-content:space-between }`; `.journey-step-item { flex:1 1 0; min-width:0 }`; `.journey-item-title { white-space:nowrap; font-size:clamp(.72rem,1.1vw,1.05rem); font-weight:800 }`; `.journey-item-desc { font-size:clamp(.66rem,.9vw,.8rem); -webkit-line-clamp:2 }`; `.intro-cta-main { border-radius:18px; padding:16px 44px; font-size:1.2rem; background:linear-gradient(180deg,#fbb03b,#f59e0b); color:#18181b }`; bottom chips pill-shaped, `padding:9px 16px`, `gap:8px`.

### 6.4 One-line phase names (S1) and mobile behaviour
The five names are `white-space: nowrap` and never truncated from 320 px up; descriptors ≤ ≈ 22 characters, line-clamped to two lines, equal-height items. **≥ 641 px:** one row, icon beside text, arrows visible. **≤ 640 px:** one row, icon above name, arrows and descriptors hidden, names `clamp(10.5px,3.2vw,15px)`, icon circle 28 px. **≤ 380 px:** page padding 12, card padding 8, item gap 0 (the longest name, "Simulate", must fit ≈ 56 px at 320 px); below 340 px icons may be hidden to protect the names. The page scrolls vertically when shorter than its content.

### 6.5 Defects not to reproduce
Screenshot 1's three-line "Simulate" descriptor misaligns the row; use the clamped, equal-height items.

---

## 7. Practice Phase — World Map **[FIXED structure — screenshot 2]**

### 7.1 Structure
One glass card with a title row, a 5 × 2 world grid and a button row. **Module slot:** title `Similarity Game Worlds`; subtitle `10 Themed Worlds · Need 4/10 Correct to Unlock Next World`; star pill `⭐ {stars} / 30`; a short teal accent line at the card's top edge. Each world card: `W{n}` badge, `Q{a}–{b}` range, centred icon (🔒 when locked), name, status (`Play →` current / `Locked` / `Ready` / stars + `n/10`). Buttons: `👑 Boss Battle: {current world's boss}` and `📓 Jump to Reflect Phase →`. Clicking the current world enters it.

### 7.2 Measurements at 1361 × 654 *(measured, ±3 px)*
Card ≈ 948 × 462 (x 209–1157, y 131–593), fill ≈ `#131432`, border `1px #262745`, radius ≈ 22; accent line ≈ 65 × 3 at card top + 20, `#08bd88`; title Fredoka 900 ≈ 24 px `#1fda96`; subtitle ≈ 14 px/700 `#a4a8c5`; star pill ≈ 95 × 34, fill `#0c0d21`, star `#fdcb38`; grid y 239–521, 5 columns × 2 rows, gaps ≈ 13 × 14; world card ≈ 134 h, padding ≈ 10 × 12, radius ≈ 14, locked fill ≈ `#181736` (≈ 60 % opacity content); `W{n}` badge ≈ 28 × 18 `#201f3e`; `Q` range ≈ 11–12 px/800 `≈ #3bb0e8` (current: mint); icon ≈ 28 px; name ≈ 14 px/800 `≈ #d3d0ed`; `Locked` `≈ #6c6f93`; `Play →` mint `#18cb89`/800; current card border `1.5px #1fda96`, fill `≈ #101532`; buttons y 538–569 (≈ 32 h), gap ≈ 12 (Boss: gold `#f3c563`, border `rgba(255,193,7,.5)`; Reflect: grey `#a8aec8`, border `rgba(255,255,255,.12)`; fill `≈ #22223e`).

### 7.3 Reference CSS
```css
.play-map-card { width:100%; max-width:950px; padding:24px 25px; border-radius:22px;
  background:#131432; border:1px solid #262745; position:relative; }
.play-map-card::before { content:''; position:absolute; top:20px; left:50%; transform:translateX(-50%);
  width:65px; height:3px; border-radius:999px; background:#08bd88; }
.world-grid { display:grid; grid-template-columns:repeat(5, minmax(0,1fr)); gap:14px 13px; margin-top:16px; }
.world-card { height:134px; padding:10px 12px; border-radius:14px; background:#181736; border:1px solid rgba(255,255,255,.09); }
.world-card.locked  { opacity:.6; cursor:not-allowed; }
.world-card.current { border:1.5px solid #1fda96; background:#101532; }
```
Below 768 px: 3 columns ≤ 768, 2 columns ≤ 480, cards auto height.

### 7.4 Behaviour and reducer changes
- **Unlock rule:** world *n + 1* unlocks when world *n* is scored **≥ 4 of 10**. The reducer gains a per-world `unlocked` flag, a **replay** path for scores below 4 (the world's questions are **regenerated**, not repeated — gotcha 7), and a unit test at the threshold (3 → locked, 4 → unlocked).
- **Stars:** 0–30 total from `calcStars` (≥ 9 → 3, ≥ 7 → 2, ≥ 5 → 1).
- The Boss button targets the **current** world's boss; **Jump to Reflect Phase** dispatches `SET_PHASE: reflect`.
- Verify the three defects found in earlier builds are absent in the clone: the Boss modal must open the **selected** world's boss; the advertised boss XP must be awarded; Independent Practice must not be selectable for already-completed worlds.

### 7.5 Defects not to reproduce
Use equal columns (`minmax(0,1fr)`) with the card's full padding (screenshot 2 shows unequal columns and a clipped Home button).

---

## 8. Reflect Phase — Stepped (S2) **[FIXED structure; recap content filled]**

| Step | Content | Zip elements reused |
|---|---|---|
| 1 · Quick check (3 screens, one prompt each) | **Module slot —** (1) `additive`: a 6 × 8 rectangle grew to 9 × 11; **tap** the part of the diagram or the "×" vs "+" chip that shows the error. (2) `mismatch`: two flipped triangles; **tap** the side that corresponds to the highlighted one. (3) `inverse-k`: a large picture to be reduced; **tap** the correct arrow (× k or ÷ k). Each is a direct interaction on a `SimilarVisual`. | `reflect-badge` ("📓 Learning Reflection & Scorecard"), `reflect-title`, `reflect-quiz-container` |
| 2 · Think it over | **Module slot —** "Before you use a scale factor, what is the first thing you check, and why does adding the same length to every side not keep a shape the same?" Chips: "angles are equal", "sides in the same ratio", "multiply, don't add", "match the corresponding sides"; textarea | `reflect-journal`, `quick-insert-btn`, `reflect-textarea` |
| 3 · Scorecard | Three stat tiles (correct / XP / best streak), one line `⭐ {stars} / 30`, a closed "Badges unlocked (n)" disclosure, **Play Again** and **Home** | `trophy-card`, `trophy-stat`, `badge-list`, `btn btn-primary`, `btn btn-outline` |

Rules (each tested in §12.7): card max-width 760 (trophy 620), padding `clamp(20px,3.5vw,32px)`, gap 18; mascot `sm` (48 px) hidden when viewport height < 600 px; a **sticky bottom action bar** (Back/Next, min-height 52, safe-area padding) and a "Step n of 3" indicator (12 px dots, active 28 px); ≤ 5 interactive controls per step; body ≥ 16 px; targets ≥ 48 × 48; no nested scroll — steps 1 and 2 fit 360 × 640 without scrolling; one short celebration (none under reduced motion); focus moves to each step heading and changes are announced via `aria-live="polite"`; Reflect is reachable in one tap (header nav, the map button, the Practice-complete card).

---

## 9. Responsive System (S3) **[FIXED]**

Desktop (≥ 1024 px) is pixel-identical to the zip/screenshot specs; mobile extends the zip's 768 / 540 / 480 rules. Verified 320 × 568 to 1920 × 1080, portrait and landscape.
1. `100dvh` everywhere; safe-area insets on the header, sticky bars and Home bottom.
2. Header unchanged from the zip (labels hidden ≤ 768; Home text hidden ≤ 540).
3. Home per §6.4. 4. Map grid 5 / 3 / 2 columns.
5. **Stations** collapse to one column at ≤ 768. **Module override: all four SimilarQuest stations set `data-stack-below="1024"`** because the geometry needs width; the figure goes **on top**, controls below. In phone landscape (height < 500) controls move to a collapsible side panel.
6. `touch-action: manipulation` on buttons/steppers; `touch-action: none` **only** on draggable elements; in-station targets ≥ 48 × 48.
7. Drag uses Pointer Events with tap-to-select-then-tap and keyboard equivalents (§10).
8. SVG visuals scale to container width with a minimum rendered label size of 12 px (`useVisualScale`).
9. No horizontal overflow at any width. 10. ⚠ Remove `maximum-scale=1.0, user-scalable=no` from the viewport meta (pending sign-off).

---

## 10. Simulate Stations (S4) **[FIXED rules; table filled]**

**Shell:** the zip's `SimulatePhase` — `sim-card`, tab bar (name + icon, ✅ when done, locked until the previous is complete), station area, footer (← Previous Station / progress dots / Next Station →, becoming "Practice! 🎮" once the last is complete). **Skeleton:** `station-wrap` → `station-header` → `station-grid-2col` → `station-guide-card` → `station-actions`; completion shows `station-success`.

**Hard rules (§12.9):** no option component or quiz renderer in `components/simulations/`; the Lab has no questions, scoring, timer or confirmation question; every station responds to manipulation with live, meaningful motion; every interaction has touch / mouse / keyboard equivalents.

**Drag primitive:** `usePointerDrag` (Pointer Events, pointer capture, 6 px threshold, `touchAction:'none'` on draggable items only). Equivalents: tap-to-select-then-tap, and keyboard (Enter/Space pick up, arrows cycle targets, Enter drop, Esc cancel) with a polite live region. Animation: Framer Motion springs ≈ 350 ms; fades 150–200 ms; reduced motion → instant moves with a brief fade.

| Component | Archetype | Student manipulates | Live animated feedback | Completion gate |
|---|---|---|---|---|
| `ZoomLensLab` | Concept Discovery Lab (**free-play**) | scale-factor slider 0.25–4 with +/− (step 0.25), a corner handle, a "Grow by adding" toggle, flip/rotate buttons, a "Show matching sides" button | side lengths, the three corresponding-side ratios and the three angles update every frame; in additive mode the angles warp and the ratios disagree; the match animation slides the copy over the original so pairs light up | **exploration flags only:** `triedEnlarge && triedReduce && triedOne && toggledAdditive && usedFlipRotate && playedMatch` — no questions |
| `MatchTheModel` | Build-to-Target | a proportional corner handle (and flip button in round 3) | live `similar ✓/✗` plus three side ratios; lock animation snaps the model when it fits the target outline | 3 rounds matched (enlarge to a marked length; reduce to fit a case outline; flipped target); free retries |
| `RiverSurvey` | Multi-Step / Composite | **Step 1** drag two stakes and a sun/mirror marker; **Step 2** scrub a tape along two baselines; **Step 3** drag labelled sides into a ratio frame that accepts only corresponding pairs; **Step 4** turn a scale-factor dial | AA arcs light up when angles match; tape values appear as it stretches; the small triangle grows across the river as the dial turns; later steps locked until the previous passes a live check | all four steps in both rounds (a shadow job and a river job) |
| `ReplayReview` | Error-Detective | scrub a replay timeline; **tap the exact faulty step**; repair by manipulation: drag an "×" card over a "+" card; drag side labels to correct pairs; drag the scale arrow to flip its direction | the replay animates the diagram step by step; the faulty step visibly breaks the shape or the match; a wrong tap shakes with a reason; a repair re-runs the live check and the shape snaps back | fault located **and** repaired in all three rounds (`additive`, `mismatch`, `inverse-k`) |

All arithmetic goes through `similarMath.js`; no station reimplements a formula. Station state is self-contained (no reducer dependency beyond `onComplete`). Every station renders figures through `SimilarVisual` with `reveal` set.

---

## 11. Gamification and Audio **[FIXED + module narration rules]**

**Gamification:** `calcXP(attempts, hints, streak)` — base 12 / 8 / 5 by attempt, −2 per hint, +5 at streak ≥ 3, +10 at ≥ 5, floor 2; `calcStars` ≥ 9 → 3, ≥ 7 → 2, ≥ 5 → 1; 8 badge triggers in `badgeEngine.js` (first correct; streak 5; streak 10; all stations; a 3-star world; boss defeated; 20+ answered; full journey) — only the `BADGES` display strings change (PRD §10). Practice modes: Guided (5Q), Independent (10Q), Timed (8Q / 60 s), Boss (5Q / 3 lives).

**Audio:** ElevenLabs only, **Alice**, voice ID `Xb7hH8MSUJpSbSDYk0k2`, model `eleven_multilingual_v2`, no browser TTS fallback. Pre-generated settings (stability / similarity / style; speaker boost on): statement/instruction `0.65 / 0.80 / 0.30`, question `0.55 / 0.75 / 0.50`, encouragement `0.50 / 0.85 / 0.60`, emphasis `0.75 / 0.90 / 0.20`, thinking `0.70 / 0.78 / 0.40`, celebration `0.45 / 0.85 / 0.80` — **six presets; the same table drives runtime dynamic narration** (gotcha 8). Every question and hint is narrated (dynamic path cached by text hash); Wonder narration auto-starts after **Begin Your Journey**; the audio toggle is beside the phase pill.

**Module narration normaliser (`utils/narration.js`),** applied to every string before it reaches the audio layer:
```js
const speakScale   = (s) => s.replace(/1\s*:\s*([\d ]+)/g, (_, n) => `one to ${spellNumber(n.replace(/ /g,''))}`);
const speakVertices= (s) => s.replace(/△\s*([A-Z]{3})/g, (_, v) => `triangle ${v.split('').join(' ')}`);
const SPOKEN = { '∼':'is similar to', '∥':'is parallel to', '≠':'is not equal to', '×':'multiplied by',
                 '÷':'divided by', '=':'equals', '+':'plus', '°':'degrees',
                 'cm':'centimetres', 'm':'metres', 'km':'kilometres', 'mm':'millimetres', 'AA':'angle angle' };
// decimals: 2.5 -> "two point five"; units are singular when the count is exactly 1
```
Rules (tested in §12.13): **no ":" survives** into any audio string (scales are always "one to n"); vertex letters are spoken singly; "scale factor" is never reduced to "k"; singular/plural of units is correct (for example "one metre"); every hint opens with the first thing to do.

---

## 12. Build, QA, and Delivery **[FIXED list + module checks]**

1. **Question-bank stress test** (`scripts/stress_test.mjs`, ≥ 300 runs, 30,000 questions): no duplicates, `NaN`, `undefined`; schema complete; exactly 4 distinct options with `correctAnswer` among them; exactly 10 questions per world; module invariants — every scaled length `isClean` and ≤ `SIDE_CAP`; every map/model answer ≤ 1 decimal; no area/volume wording; **no generator retries more than 20 % of draws**; no context above 25 % of the bank.
2. **Independent-oracle audit** (`scripts/oracle.mjs`): a solver that shares **no code** with the generator recomputes every answer **from `visualData` only**, using integer cross-multiplication (for example checking `a·d = b·c`) rather than the generator's forward-construction path; also re-derives similar/not-similar verdicts and every missing angle.
3. **Distractor-provenance audit:** every distractor and every seeded error has a `misconceptionId` registered in `misconceptions.js`; the audit recomputes the registered procedure and confirms it yields the shown value.
4. **Degenerate-case audit:** k = 1 never generated except in Station 1 free-play; no zero or negative lengths; no two equal "different" options; reduction answers are never larger than the original; no similar pair with `k` given as a whole-number side swap.
5. **Module-specific audit:** (a) **figure-to-scale** — rendered side ratios equal the stated ratios within 1 %; (b) **correspondence integrity** — letter order of every `△ ∼ △` statement maps to the sides drawn (`corr` consumed, never re-derived by the view); (c) **parallelism** — in World 6 the drawn `DE` is parallel to `BC` to within a pixel; (d) **no-area/volume scan**; (e) **World 0** is 50 % similar / 50 % not and the `additive` trap appears in ≥ 50 % of "not similar" draws; (f) **sibling-leakage grep** (money, coin, receipt, cash, change, price).
6. **S1 Home-screen test (Playwright)** — widths 320, 340, 360, 375, 390, 412, 600, 640, 768, 1024, 1280, 1366, 1440, 1920: the five `.journey-item-title` elements each render on one line (`getClientRects().length === 1`), share a top offset (±1 px), do not overflow, use no ellipsis, and the page has no horizontal overflow; real fonts loaded (blueprint Appendix A.3).
7. **S2 Reflect test** — 360 × 640, 390 × 844, 768 × 1024, 1280 × 800: steps 1–2 fit at 360 × 640 without scrolling; ≤ 5 controls per step; controls ≥ 48 × 48; body ≥ 16 px; no overlaps; focus lands on each step heading; Reflect reachable in one tap.
8. **S3 device matrix** — 320×568, 360×640, 390×844, 412×915, 768×1024, 1024×768, 844×390, 1280×800, 1366×681, 1920×1080: full journey, no horizontal overflow, no clipped controls; every station completed **touch-only**, **mouse-only**, **keyboard-only**.
9. **S4 interactivity audit** — grep fails the build if `components/simulations/` imports the option component or quiz renderer; walkthrough confirms manipulation-driven stations and a question-free `ZoomLensLab`.
10. **Layout-anchor fidelity test (Home and Practice map)** — at 1366 × 681 (Home) and 1361 × 654 (Practice), assert bounding boxes against §6.2 / §7.2 within ±4 px (chip, title, bubble, journey card ≈ 860 w, CTA ≈ 272 × 57, chips row; map card ≈ 948 w, five equal columns, buttons row). Reference screenshots stored under `tests/reference/`.
11. **Token-parity test** — computed styles of `body`, `.glass-card`, `.btn-primary`, `.sim-tab.active`, `.progress-bar-pill`, `.reflect-card` equal the zip's; a script greps every `var(--x)` against `:root` (catches the five undefined tokens).
12. **Reduced-motion and performance** — no springs under `prefers-reduced-motion`; ≈ 50 fps or better for the heaviest drag (RiverSurvey Step 1) under 4× CPU throttle.
13. **Audio parity** — every narrated string has an `audioMap` entry or is intentionally dynamic; runtime voice settings equal the pre-generated table; **no ":" and no unconverted symbol** in any audio string; unit tests for `speakScale`, `speakVertices` and decimals (for example `1 : 50 000`, `△ABC`, `2.5`, `1 m`).
14. **Full-journey walkthrough** — Home → Wonder → Story (all 4 panels, last advances the phase) → Simulate (4 stations) → Practice (map, 4/10 unlock rule, replay regenerates, all 4 modes, 10 bosses, badges) → Reflect (3 steps) — zero console errors (a 403 for Google Fonts in a sandbox is a network block, not an app bug).
15. **Production build** — `npm install && npm run build` from a clean extract.
16. **Accessibility** — axe-core: no serious/critical issues; non-colour cues (shape markers on corresponding parts); announcements; focus visible.
17. **Delivery** — zip excludes `node_modules/`, `dist/`; 4 story placeholders + art-brief README; branding cleaned (gotchas 10, 12); `.env.local.example` documents `VITE_ELEVENLABS_API_KEY`.
18. **Locale-neutrality audit (G1)** — `scripts/locale_audit.mjs` fails the build if any file under `src/`, `public/`, `index.html`, `README.md` or the audio `phrases` array contains a deny-list term. **Deny-list seed:** `Singapore`, `Singaporean`, `MOE`, `HDB`, `CCA`, `S$`, `SGD`, `Singlish`, patterns `Secondary [0-9]`, `Primary [0-9]`, `Sec [0-9]`, `Year [0-9]`, `Class [0-9]`, plus **sibling names** (`Zara`, `Milo`, `Nina`, `Kai`, `Jack`, `Mia`, `Zoe`, `Arjun`, `Dev`, `Xin Yi`, `Rina`, `Wei Jie`, `Aisyah`, `Rohan`, `Priya`, `Farhan`, `Hui Min`, `Imran`, `Tally`, `Pip`, `Dash`, `Bobo`, `Bo the Beaver`), **the money clone source** (`coin`, `cash`, `receipt`, `Register`, `Market Scanner`, `Change Maker`), and any real country, city, currency or brand. **Matching is whole-word and case-sensitive** so short names do not trigger false positives (for example `Dev` in "device", `Pip` in "pipe", `Bo` in "both", `coin` in "coincide"). It also verifies that every name in `characters.config.js` and `namePool.js` is on the English first-name list and that learner-facing level labels are Intellia grade labels only. Framework names are allowed in PRD/TRD files, never in `src/`.

---

## 13. Risks **[FIXED + module]**

**Fixed**
- **Screenshot-derived values are approximate** (JPEG): treat §6.2 / §7.2 as ±6 channel / ±3 px; replace with exact source values if available.
- **Divergence between the two image-driven screens and the zip** — keep the fidelity tests (§12.10–§12.11) in CI.
- **Undefined tokens** reappearing if `design-tokens.css` is re-cloned without the five appended tokens — the token-parity test catches it.
- **Home-screen one-line guarantee** depends on font metrics — run §12.6 with the real font after any label or font change.
- **Unlock-rule change** (≥ 4 / 10) alters progression for every module — confirm before shipping (PRD §15.8).
- **Reflect creep** — enforce the per-step budget via §12.7.
- **Pointer/scroll conflicts** from `touch-action: none` — keep it on draggable items only.
- **Animation drifting from data** — one source of truth (§4.3) and the module audit.
- **Static-station regression** — §12.9.
- **Locale leakage (G1)** — cloned money content or sibling names reappearing in stories, questions, narration or audio; the deny-list audit must run in CI and be updated when a new sibling is used as a clone source.

**Module-specific**
| Risk | Impact | Mitigation |
|---|---|---|
| **Correspondence errors** — a flipped or rotated figure paired with the wrong side | A correct-looking question with a wrong answer | `Figure.corr` is the only mapping; the view never reorders it; oracle and §12.5(b) |
| **Diagram contradicts its numbers** (drawn by hand or rounded) | Students learn to distrust the figure, or answer from the picture | Figures drawn from the same data; ±1 % ratio check (§12.5a) |
| **Distractor collisions and ugly decimals** in the reduction generators | Duplicate options, or answers like 3.2 cm that look arbitrary | Ranked candidates, ≤ 2-decimal rule, regenerate-don't-pad, ≤ 20 % retry gate; extend the reduction candidate list (§4.3.4) |
| **Area/volume creep** — a "scale factor" question quietly asks for an area | Tests content outside the Grade 8 scope cap | §12.5(d) scan; PRD §3.3 boundary |
| **Spoken vertex letters** misheard by the voice ("A", "D", "E") | Students cannot follow which side is meant | By-ear review of generated clips; rename vertices if needed (§4.4.6) |
| **Parallel line drawn inexactly** in World 6 | The diagram undermines the premise of the question | Draw from coordinates; §12.5(c) |
| **Wide figures on phones** | Labels overlap or shrink below 12 px | `useVisualScale` with a 12 px floor; stations stack below 1024 px; §12.8 matrix |
| **Gold-adjacent accents** (World 0 `#FFD700`, World 9 `#FFC107`) look alike on the map | Hard to tell worlds apart | Defaults kept per the blueprint; names and icons always accompany colour; contrast check in §12.11 |
