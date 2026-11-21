# SimilarQuest — Module PRD
**Grade 8 · Similarity Applications**

*Produced from `Intellia_Module_Blueprint_PRD_v3.1.md`. Inputs: `{{GRADE}}` = Grade 8; `{{TOPIC}}` = Similarity applications; `{{CURRICULUM}}` = Global (multi-framework: Singapore MOE, England National Curriculum, US Common Core, India NCERT/CBSE, Cambridge IGCSE) — default comparison set, none specified by the requester; `{{SPECIAL_INSTRUCTIONS}}` = none.*

**Module name:** SimilarQuest · **Repo slug:** `similar-quest-main` · **Paired TRD:** `SimilarQuest_G8_SimilarityApplications_TRD.md`

---

## 1. Overview

SimilarQuest teaches students to **decide** whether two figures are similar, **find** the scale factor between them, **use** it to find unknown lengths, and **apply** it to real situations: heights from shadows and mirrors, lengths across a river or up a slope using a parallel line, and the real size of things shown on maps, drawings and models. The central idea in one sentence: *similar figures have equal angles and every length is multiplied by the same scale factor, so one matching pair of sides unlocks all the others — adding the same amount to every side does not keep a shape the same.* The theme is a small **survey crew** that measures things that cannot be reached with a tape measure. The module teaches by manipulation, not theory questions: students stretch, match, place and repair figures and watch the numbers respond (S4).

---

## 2. Background

- **Position in the series.** First Grade 8 geometry module in the Intellia registry I have records of; it starts a *similarity and scale* strand. Open question §15.5 asks whether companion modules are wanted.
- **Prerequisites (assumed, not re-taught):** ratio and proportion, equivalent fractions and decimals, angle facts for triangles (angles sum to 180°) and parallel lines, and reading a simple labelled diagram. The module recaps "same shape, different size" in Story panel 2 but does not test it in isolation.
- **Neighbouring modules and overlaps to avoid.** Any ratio or proportion module (for example RatioCraft, Grade 6) owns *writing and simplifying ratios*; SimilarQuest uses ratios but never tests them as a stand-alone skill. Any perimeter/area/volume module owns *computing* measures; SimilarQuest never asks for an area or volume. Congruence (same size and shape) is *contrasted* in one Story beat but not tested.
- **Reuse.** Reuses `G2-Money-Money-main`'s five-phase architecture per platform convention.

---

## 3. Standards Alignment

### 3.1 Source and crosswalk

Sources were checked in this session; their strength is noted honestly because the blueprint prefers official and school sources over tuition-site blogs.

| Framework | Level where taught | Depth / notes | Source (strength) |
|---|---|---|---|
| **Singapore MOE** | **Secondary 2** (similar figures; properties of similar triangles and polygons — corresponding sides proportional; enlargement and reduction of a plane figure; solving simple problems on congruence and similarity; **map scales**, listed under ratio and proportion). **Secondary 3–4** (scale drawings; determining whether two triangles are similar; **ratio of areas** of similar plane figures; **ratio of volumes** of similar solids). | The syllabus text does not use the phrase "scale factor"; "enlargement and reduction" is the nearest wording. Area and volume ratios come later than similarity itself. | MOE 2020 Express/N(A) mathematics syllabus (official) |
| **England National Curriculum** | **Year 9** — "Understand and use similarity and congruence" (KS3 guidance, autumn term of Year 9); enlargement itself appears earlier (Year 7, summer). A school Year 9 topic summary covers scale factor, missing lengths and similar-triangle problems and **does not** list area or volume scale factors; area and volume scale factors sit in **KS4** similarity units (Years 10–11). | Procedural and practical at Year 9: scale factors, missing lengths, similar-triangle problems (the harder ones marked Higher). | DfE/NCETM KS3 non-statutory guidance (official; the fetched copy was truncated, so Year 8 detail was not seen); school Year 9 summary (school source); National Academy KS4 unit titles (listing only) |
| **US Common Core** | **Grade 8** — 8.G.A.4: a figure is similar to another if one can be obtained from the other by rotations, reflections, translations and **dilations**; describe the sequence. 8.G.A.5 (angle-angle criterion for similar triangles) also sits in this cluster. Scale drawings are a **Grade 7** topic (7.G.A.1). Area/volume ratios of similar figures and similarity proofs sit in **high-school geometry**. | The Grade 8 approach is transformation-based; the product treats dilations as the "scale factor" idea but does not teach coordinate dilations (see §3.2). | Illustrative Mathematics task page for 8.G.A.4 (education-nonprofit source). **Not retrieved this session:** the 8.G.A.5 and 7.G.A.1 wording and the high-school placements — they are from my knowledge of the standards and should be re-checked. |
| **India NCERT / CBSE** | **Class 10**, chapter "Triangles": similar triangles, criteria **AA, SSS, SAS**, the Basic Proportionality Theorem and its converse, areas of similar triangles (ratio of areas = square of ratio of sides). | **Later** than Grade 8 for the formal treatment. A Class 8 similarity chapter was not found; this absence is **not verified**. | Collegedunia chapter summary (a commercial summary — the official NCERT text was not opened) |
| **Cambridge IGCSE (Extended, Years 10–11)** | IGCSE years: similar shapes with **length, area and volume scale factors** (area = k², volume = k³). | Later than Grade 8. Cambridge Lower Secondary Stage 8–9 and IB were **not checked**. | Save My Exams revision notes (revision site — the official syllabus was not opened) |

### ⚠ Grade-level scope flag
Similarity is placed **later than the Intellia Grade 8 / age 13–14 level** in a meaningful share of the frameworks: formally in India (Class 10) and IGCSE (Years 10–11), and **area and volume scale factors** are later almost everywhere (Singapore Secondary 3–4, England KS4, IGCSE, US high school). It sits **at** Grade 8 level in Singapore (Secondary 2), England (Year 9) and the US (Grade 8, via dilations and angle-angle).

**Scope cap applied:** build to the content common at or near Grade 8 — *similar figures, scale factor (enlargement and reduction), missing lengths, corresponding sides, the AA criterion, indirect measurement with shadows and mirrors, one parallel line inside a triangle, and linear scales on drawings, maps and models.* Area and volume scale factors, SAS/SSS similarity criteria, coordinate dilations, and proofs are **bridge-only or excluded** (§3.3). If sources conflict, I relied on the official syllabus (Singapore) and the official national curriculum guidance (England) for placement, and flagged where only secondary sources were available (India, Cambridge).

### 3.2 In-scope skills (each maps to a Learning Objective, §4)
1. Judge whether two figures are similar: **equal corresponding angles AND all corresponding sides in the same ratio**.
2. Find the **scale factor** between two similar figures, in both directions (enlargement k > 1, reduction 0 < k < 1).
3. Use the scale factor to find a **missing side** of a similar figure, going from smaller to larger and from larger to smaller.
4. Identify **corresponding vertices and sides** when figures are rotated, flipped or nested.
5. Use the **AA criterion** to show two triangles are similar and find an unknown angle.
6. **Indirect measurement:** the shadow method and the mirror method.
7. **Nested triangles:** a line parallel to one side of a triangle creates a smaller similar triangle.
8. **Scale drawings, maps and models:** convert between drawing and real size in either direction, with scales written 1 : n and unit conversion.
9. **Multi-step problems** (for example a shadow measurement followed by a model scale; a scaled triangle's perimeter) and **diagnosing worked errors**.

### 3.3 Adjacent skills treated as bridge only
| Content | Treatment | Why |
|---|---|---|
| **Area and volume scale factors** (k², k³) | One-line teaser in Story panel 4 ("what happens to the area is a story for another day"); **not tested**; no area or volume question anywhere in the bank | Taught later in most frameworks (see flag above). A strong candidate for a companion module (§15.5). |
| **SSS and SAS similarity criteria** | "All three sides in the same ratio" is *used* in World 0 as the definition-based check; SAS is not named | India teaches them in Class 10; Singapore at Secondary 3–4. |
| **Similarity via transformations (dilation from a centre, coordinates)** | Excluded; Station 1 lets students flip and rotate a figure to show it stays similar | US-specific Grade 8 framing; needs a coordinate-plane module. |
| **Trigonometric ratios from similar triangles** | Excluded | Later topic. |
| **Congruence** | Contrasted in one Story sentence ("congruent means scale factor 1"); not tested | Separate topic. |
| **Formal proofs of similarity** | Excluded | Later topic. |

### 3.4 Common misconceptions (each becomes a named distractor or seeded error)
| Id | Misconception | Appears as |
|---|---|---|
| `additive` | "Every side grew by the same amount, so the shape is the same" — adding instead of multiplying | distractor in Worlds 0, 2, 5, 6; Station 4 error 1; Reflect prompt 1 |
| `angles-only` | "Both are rectangles / both have a right angle, so they're similar" (angles alone, sides not checked) | World 0 distractor |
| `mismatch` | Pairing sides by *position in the list* or by the same length rather than by corresponding position (shortest ↔ shortest) | World 3 distractors; Station 4 error 2; Reflect prompt 2 |
| `inverse-k` | Using k when 1/k is needed (multiplying to go from large to small) | Worlds 1, 2, 7 distractors; Station 4 error 3; Reflect prompt 3 |
| `copy-side` | Reporting a given side instead of computing the requested one | distractor in Worlds 2, 6 |
| `whole-for-part` | In nested triangles, using the whole side (AB) where the small side (AD) belongs | World 6 distractors |
| `unit-slip` | Forgetting a cm → m or cm → km conversion on a map or model | World 7 distractors |
| `product` | Multiplying the two given lengths instead of forming a ratio | distractor in Worlds 1, 2 |

### 3.5 Domain conventions
- **Similar** is written with ∼ (for example △ABC ∼ △DEF) and means: equal corresponding angles and proportional corresponding sides. **The order of letters carries the correspondence** (A↔D, B↔E, C↔F).
- **Scale factor k** = (length in the new figure) ÷ (matching length in the original). k > 1 enlarges; 0 < k < 1 reduces. The direction is always stated ("from △ABC to △DEF").
- **Worked solutions always follow one order:** sketch and label → match corresponding sides → find the scale factor from the one known pair → apply it → sense-check ("is the answer bigger or smaller, as expected?").
- A **map or model scale** is written 1 : n (drawing : real).
- **All lengths are metric** (mm, cm, m, km).
- **Diagrams are drawn to scale** from the same data as the question, so the picture never contradicts the numbers (§14).

### 3.6 Terminology and notation variants
**House style (used in narration, visuals and distractors):** "similar" with the symbol ∼; "**scale factor**" (always with k); "**corresponding sides**" and "corresponding angles"; "**AA** (angle-angle)"; "**reduction**" and "**enlargement**"; scales written "1 : 50" and spoken "one to fifty"; units written as symbols (m, cm, km) and spoken in full as "metres", "centimetres", "kilometres" (the **international/UK spelling** is the house variant; learner-facing text uses symbols wherever possible to avoid spelling variation).

**Variants a student may meet elsewhere:** "~" for similar (typed); "dilation" and "dilation factor" (US) or "enlargement factor" (England/Singapore) for scale factor; "ratio of similitude"; "AAA" (older and some national texts) for the angle criterion; "geometrically similar" (England, IGCSE); "proportional sides"; "meters/meter" (US spelling); "model scale" or "representative fraction" for 1 : n.

### 3.7 Locale-neutral content check (G1)
Contexts used: shadows, mirrors, rivers, hills, maps, scale models, photo prints, screens. None needs a country-specific place, currency, holiday, food or brand. Money does not appear. Place names on maps are invented (for example "Pine Bay", "Harbour Rock"). Only Intellia grade labels appear in the UI. Framework names appear in this PRD and the TRD only.

---

## 4. Learning Objectives

By the end of this module, a student can:

1. **Decide** whether two figures are similar by checking both angles and the ratios of corresponding sides.
2. **Find** the scale factor between two similar figures, as an enlargement or a reduction.
3. **Use** the scale factor to find a missing side, in either direction.
4. **Identify** corresponding vertices and sides in similar triangles that are rotated, flipped or overlapping.
5. **Use** the AA criterion to show two triangles are similar and find a missing angle.
6. **Measure** a height indirectly using shadows or a mirror.
7. **Use** a line parallel to one side of a triangle to form similar triangles and find an unknown length.
8. **Convert** between a scale drawing, map or model and the real object, in both directions, including unit conversion.
9. **Solve** multi-step similarity problems and **diagnose** the error in a flawed solution.

Ordering runs foundational → applied; it drives the worlds (§9): one objective per world for Worlds 0–8, and World 9 is the mixed review.

---

## 5. Inherited Standards **[FIXED — copied unchanged from the blueprint]**

- **Five-phase architecture:** Wonder → Story → Simulate → Practice → Reflect ("Play" in code; **"Practice"** in the UI).
- **Look and feel:** the zip's design system — dark navy `#0a0a2e` base, gold `#ffc107` primary, purple `#7c5cbf` secondary, green `#4caf50` success, red `#ef5350` error; **Fredoka** (display) and **Nunito** (body); glass-card surfaces; radii 8 / 14 / 22 / pill — exactly as in the TRD §5. No module redefines them.
- **Shell and navigation:** the zip's header — **Home** button at top-left, a centred **numbered phase pill** (01 Wonder … 05 Reflect) and the **audio toggle immediately to the right of the pill**. The header is hidden on the Home screen. (This replaces the earlier "audio toggle at right-centre" wording.)
- **Home screen (S1):** per screenshot 1 — all five phase names on one line (§8.0).
- **Practice map:** per screenshot 2 (§8.4).
- **Reflect (S2):** stepped and uncongested, reusing the zip's Reflect styling (§8.5).
- **Responsive (S3):** mobile-first, 320 px to 1920 px, portrait and landscape; touch, mouse, and keyboard (§12).
- **Simulate (S4):** exactly 4 archetype-mapped stations in the zip's station shell, animated, interactive, none a multiple-choice quiz (§8.3).
- **Gamification:** XP per question, 0–3 stars per world (≥ 9 → 3, ≥ 7 → 2, ≥ 5 → 1 correct of 10), streaks, 8 fixed badge triggers (§10), 10 Boss Battles (5Q / 3 lives).
- **Practice modes:** Guided (5Q, hints, untimed), Independent (10Q, no hints), Timed Challenge (8Q, 60 s), Boss Battle (5Q, 3 lives).
- **Audio pipeline:** ElevenLabs **Alice** only, 6 emotional presets (one table used for both pre-generated and dynamic clips), pre-generated + dynamic narration, no browser TTS fallback, strict 1:1 narration/on-screen-text parity. Every question and every hint has its own narration. Wonder narration auto-starts right after **Begin Your Journey**.
- **Question bank:** 10 worlds × 10 questions = 100 (platform minimum 20+), procedurally generated, ≥ 300-run stress test, fixed schema, World 9 is the mixed-review finale.
- **Feedback system:** correct — green highlight, success animation, positive sound, encouraging message; incorrect — red highlight, gentle shake, retry sound, hint, another attempt; popups/modals animated and consistent; buttons have hover / active / focus / disabled states.
- **Delivery:** zip with placeholder story art and an art-brief README.
- **Global and language conventions (G1):** English-language content for a global audience; characters have common English first names; learner-facing text uses only Intellia grade labels and generic school words ("club", "class", "grade"), with no country-specific terms, currencies, places, holidays, or brands unless the topic requires them (then isolated behind one locale setting, TRD §4.4); one notation and spelling house style per module, declared in §3.

---

## 6. Enhancement Requests / Special Instructions

**None supplied. Defaults applied:**

| # | Default | Where satisfied |
|---|---|---|
| D1 | 4-panel Story | PRD §8.2; TRD §4.2 |
| D2 | Common English first names, curriculum-neutral content | PRD §3.7, §7; TRD §4.4 |
| D3 | Module-specific mascot with rationale | PRD §7 |
| D4 | Standard 4-station Simulate; the Concept Discovery Lab is **pure free-play** with no confirmation question | PRD §8.3; TRD §10 |

---

## 7. Module Identity

- **Module name:** `SimilarQuest`; the Home title splits as **Similar** (orange) + **Quest** (white).
- **Story theme:** **The Survey Crew.** Two young surveyors take jobs where the thing they need to measure cannot be reached or climbed: a tall tree, a lighthouse, the width of a river, a cliff, a distant hill on a map, a model of a bridge. Every world is a job site. It is **new** (no sibling uses a surveying theme), **age-appropriate** for 12–14-year-olds (real-world, practical, a touch of detective work, no childish framing — Appendix A), and a natural fit: indirect measurement is the oldest real use of similar figures.
- **Named characters (common English first names, no surnames):**
  - **Maya** — the careful surveyor; sketches and labels before she calculates, and checks every answer for sense. Models the careful habit.
  - **Leo** — the quick, enthusiastic one; keeps reaching for "just add the difference". Makes the common mistake.
- **Mascot:** **Echo the Bat 🦇** — a bat finds distances it cannot touch by sending out a sound and timing the return, the same spirit as measuring the unreachable by indirect means. Appears in the Home speech bubble, Wonder, Story, and Reflect.
- **Global-content check (G1):** passed — see §3.7. No country-specific school terms, currencies, places, holidays, foods or brands. Background names in generated questions come from the shared pool of common English first names (TRD §4.4).
- **Collision check:** compared against the module records I have (equal-groups, ratio notation, equivalent ratios, speed & rate, mass conversions, word problems, CubeQuest, CuboidQuest, VolumeQuest, ShareQuest, RatioCraft and others). Character pairs in those modules (Zara/Milo, Nina/Kai, Jack/Mia, Zoe/Arjun, Dev/Xin Yi, Rina/Wei Jie, Aisyah/Rohan, Priya/Wei Ming/Farhan, Hui Min/Imran) and mascots (Tally the Owl, Pip the Parrot, Dash the Cheetah, Bobo the Monkey, Bo the Beaver) do **not** collide with Maya/Leo/Echo the Bat. **The full registry was not supplied**, so this is recorded in §15.3 for confirmation.

---

## 8. Five-Phase Journey Detail

### 8.0 Home Screen (S1) **[FIXED structure; copy slots filled]**

| Slot | Copy |
|---|---|
| Top chip | `✨ Curriculum · Similarity Applications Grade 8` |
| Title | **Similar** (orange `#ff9f43`) **Quest** (white) |
| Subtitle (gold, one line) | `Measure the unmeasurable with similar shapes` |
| Mascot row | Echo the Bat avatar + bubble: "Same shape, different size? Multiply every side by the same **scale factor** — never just add!" (key term highlighted in orange) |
| Journey heading | `YOUR LEARNING JOURNEY · CLICK ANY PHASE TO START` |
| Phase descriptors (≤ 22 chars) | **Wonder** "Shadow stick puzzle" (19) · **Story** "4 survey adventures" (19) · **Simulate** "4 interactive labs" (18) · **Practice** "10 worlds & bosses" (18) · **Reflect** "Review & scorecard" (18) |
| CTA | `🚀 Begin Your Journey!` |
| Info chips | `🎯 100 Questions` · `📐 Scale & Shape` · `✨ Badges & XP` |

**S1:** all five phase names on one line at every width from 320 px up; on phones each item stacks icon above name and the descriptors are hidden. Sizes and positions: TRD §6.

### 8.1 Wonder **[AUTHOR on a FIXED rule]**
- **Hook line:** "A 2 m pole casts a 3 m shadow. The tree next to it casts a 12 m shadow. How tall is the tree — without climbing it?"
- **Interaction (one small thing, no scoring):** the student **drags a sun marker** across the sky. The pole's shadow and the tree's shadow lengthen and shorten *together*, and a faint matching line shows the two shadows and the two heights always sit in the same proportion. The student sees that the shadows change but their relationship does not, which surfaces the puzzle: "what stays the same?" No answer is entered; the CTA moves on.
- The dashed number display shows `2 m : 3 m` and `? : 12 m`.

### 8.2 Story — 4 panels
Every number below is a fixed literal that the TRD unit-tests (TRD §4.2).

| # | Title | Concept delivered | Narrative beat |
|---|---|---|---|
| 1 | **The Tree Nobody Could Climb** | Hook / the common mistake | The crew needs the height of a tree. Maya's 2 m pole casts a 3 m shadow; the tree's shadow is 12 m. **Leo** says "the shadow is 9 m longer, so the tree is 9 m taller: 11 m!" Maya frowns: "That doesn't feel right." Echo drops a pole beside the tree and the shapes don't match. |
| 2 | **Same Shape, Different Size** | Similar = equal angles + every side scaled by the same factor; scale factor | Maya overlays the two triangles of pole-and-shadow and tree-and-shadow. The angles are equal; the sides grow by the **same multiplier**: 12 ÷ 3 = 4. "Adding doesn't keep the shape. Multiplying does." One sentence contrasts congruent (scale factor 1). |
| 3 | **Match, Multiply, Check** | Corresponding sides; scale factor in both directions; sense-check | The pole becomes the tree: 2 m × 4 = **8 m**. Then a photo job: a 6 cm × 4 cm print is enlarged to 15 cm wide: k = 15 ÷ 6 = **2.5**, so the height becomes 4 × 2.5 = **10 cm**; reversing, 15 cm ÷ 2.5 = **6 cm**. Maya's rule: match the sides first, then find k, then check it makes sense (bigger or smaller?). |
| 4 | **The Cliff and the Mirror** | Worked application in the standard order | A cliff is too tall to measure. Maya lays a mirror on the ground **15 m** from the cliff base and steps back until she sees the cliff top; her eye height is **1.6 m** and she stands **2 m** from the mirror. Standard order: sketch and label → match corresponding sides (eye ↔ cliff, 2 m ↔ 15 m) → k = 15 ÷ 2 = 7.5 → 1.6 × 7.5 = **12 m** → sense-check (the cliff should be much taller than Maya ✓). One teaser line: "And what happens to the *area* when everything doubles? A story for another day." |

The zip's Story layout (image left, text right; single column on phones) is unchanged.

### 8.3 Simulate — 4 stations (S4)
Four stations, one per archetype, inside the zip's tabbed Simulate card. Each is animated and interactive, works by touch, mouse and keyboard, honours reduced motion, and contains **no multiple-choice question**. Pitched to the lower-secondary band (Appendix A): multi-variable manipulation, draggable geometry, replay-and-pause error hunts, composite builds, ≈ 4–6 minutes each.

| Station | Archetype | Premise and why it teaches |
|---|---|---|
| **1 · Zoom Lens Lab** | Concept Discovery Lab (**free-play**) | *The student drags a scale-factor slider (0.25–4, with +/−) and a corner handle on a triangle, and sees a ghost copy grow or shrink.* **Moves live:** all three sides, the three corresponding-side ratios and the three angles update in real time; the ratios stay equal and the angles stay fixed. A **"Grow by adding instead"** toggle lets the same copy grow by a fixed amount — its angles visibly warp and the ratios stop agreeing, so the *additive* misconception breaks in front of the student. Flip and rotate buttons show the copy is still similar. A **"Show matching sides"** button slides the copy over the original so corresponding sides light up in pairs. **No questions, score, timer or confirmation question.** Completion is gated on exploration flags: tried k > 1, tried k < 1, tried k = 1, toggled additive growth, used flip/rotate, played the match animation. |
| **2 · Match the Model** | Build-to-Target | *The student resizes and positions a model triangle to fit a target outline on a site plan.* **Moves live:** a match indicator shows `similar ✓/✗` and the three side ratios as the student drags a proportional handle; a lock animation snaps the model when it fits. **Round 1** — enlarge to hit a marked base length (k > 1); **Round 2** — reduce to fit inside a display case outline (0 < k < 1); **Round 3** — the target is **flipped**, so the student must flip and then resize. Motion shows that one handle controls every side at once. Completion: all three rounds matched; free retries. |
| **3 · River Survey** | Multi-Step / Composite Construction | *A four-step chain on one scenario; each step's result feeds the next and later steps stay locked.* **Step 1** — drag two survey stakes and a sun/mirror marker into place; the two triangles form on the field and AA arcs light up when their angles match. **Step 2** — scrub a measuring tape along each baseline; values appear as the tape stretches. **Step 3** — drag the labelled sides into the ratio frame, which only accepts *corresponding* pairs. **Step 4** — turn a scale-factor dial; the small triangle grows across the river until it reaches the far bank, and the width is read off the tape. Two rounds: a shadow job and a river job. Completion: all steps in both rounds. |
| **4 · Replay Review** | Error-Detective | *The student scrubs a replay of a surveyor's flawed working, taps the exact faulty step, then repairs it by manipulation.* **Moves live:** the replay animates the diagram as each step is applied; the flawed step visibly breaks the shape or the match, and a wrong tap shakes with a reason. **Round 1** — `additive`: the model grew by adding; the student drags an "×" card over the "+" card and the shape snaps back to similar. **Round 2** — `mismatch`: sides were paired by position; the student drags the labels onto the correct corresponding sides. **Round 3** — `inverse-k`: k was applied the wrong way; the student drags the scale arrow so the model shrinks rather than grows. Completion: fault located and repaired in every round. |

**Station design test (Appendix B), applied:** with narration removed a student could still learn by manipulating each station; motion shows the concept (the additive toggle in Station 1, the proportional handle in Station 2, the growing triangle in Station 3, the snapping repair in Station 4); every interaction has drag ⇄ tap-to-select-then-tap ⇄ keyboard equivalents; no point is "read and pick an option".

### 8.4 Practice — world map and questions **[FIXED structure; names filled]**
- **Map card title:** `Similarity Game Worlds` · subtitle `10 Themed Worlds · Need 4/10 Correct to Unlock Next World` · star pill `⭐ n / 30`.
- **World cards (5 × 2):** `W1`…`W10`, question range `Q1–10`…`Q91–100`, world icon (🔒 while locked), world name, status (`Play →` on the current world with a mint border, `Locked`, `Ready`, or stars + `n/10`).
- **Buttons under the grid:** `👑 Boss Battle: {current world's boss}` and `📓 Jump to Reflect Phase →`.
- **Rules:** a world unlocks when the previous world is scored **at least 4 of 10**; below that, the student replays the world with **freshly generated questions**; stars are 0–3 per world, 30 in total.
- The question screen, feedback overlay and Boss modal are the zip's, unchanged.

### 8.5 Reflect (S2) **[FIXED structure; recap targets and prompt filled]**
Three steps, never one crowded screen:
1. **Quick check — 3 prompts, one per screen, each a direct interaction on a visual:**
   - *Prompt 1 — `additive`:* a rectangle grew from 6 × 8 to 9 × 11; **tap** the part of the diagram that shows what is wrong (the unequal ratios), or the "×" versus "+" chip on the working.
   - *Prompt 2 — `mismatch`:* two flipped triangles are shown; **tap** the side that corresponds to the highlighted one.
   - *Prompt 3 — `inverse-k`:* a large picture is to be reduced to a small print; **tap** the arrow (× k or ÷ k) that is correct.
2. **Think it over:** *"Before you use a scale factor, what is the first thing you check, and why does adding the same length to every side not keep a shape the same?"* Quick-insert chips: "angles are equal", "sides in the same ratio", "multiply, don't add", "match the corresponding sides".
3. **Scorecard:** three stat tiles (correct / XP / best streak), one line `⭐ n / 30`, a **closed** "Badges unlocked" section, **Play Again** and **Home**.

Rules as in the blueprint: one primary task per screen, sticky bottom Back/Next bar, "Step n of 3", no nested scrolling, reachable in **one tap** (header pill, the map's "Jump to Reflect Phase →", and the Practice-complete card). Limits: TRD §8.

---

## 9. World & Question Bank Table

`{ id, name, emoji, accent, description, conceptFocus, boss: { name, emoji, reward } }`. Worlds 0–8 follow the objectives in order; World 9 is the grand finale. Accents default to the zip's ten (TRD §5.1). **Every sample below was checked by script while drafting this document** (a separate arithmetic check, not the generator).

| id | World | Emoji | `conceptFocus` | Description | Boss | Reward |
|---|---|---|---|---|---|---|
| 0 | Look-Alike Lab | 🔬 | `similar-or-not` | Same shape, or just similar-looking? | The Imposter 🎭 | Twin Spotter Badge |
| 1 | Zoom Workshop | 🔭 | `find-scale-factor` | Find the multiplier between two shapes. | The Zoom Wizard 🧙 | Scale Setter Badge |
| 2 | Missing Side Mill | 🏭 | `missing-side` | Use the scale factor to find the unknown side. | The Gap Giant 🗿 | Side Solver Badge |
| 3 | Mix-Up Junction | 🔀 | `corresponding-sides` | Flipped, turned, tangled — match the right sides. | The Twister 🌀 | Match Maker Badge |
| 4 | Angle Agency | 🕵️ | `aa-criterion` | Two angles are enough. | The Angle Thief 🥷 | Angle Ace Badge |
| 5 | Shadow Fields | 🌳 | `shadow-height` | Measure tall things from their shadows. | The Long Shadow 🌒 | Shadow Measurer Badge |
| 6 | Parallel Pass | ⛰️ | `nested-triangles` | A parallel line hides a smaller twin. | The Cliff Keeper 🗻 | Pass Finder Badge |
| 7 | Map & Model Room | 🗺️ | `scale-drawing-map` | From the page to the real thing, and back. | The Map Maker 🧭 | Scale Navigator Badge |
| 8 | Inspector's Desk | 🧾 | `multistep-error` | Two-step jobs, and spot the mistake. | Inspector Slip 🕶️ | Error Hunter Badge |
| 9 | Grand Survey Finale | 🏆 | `mixed-review` | Every skill, one big survey. | The Chief Surveyor 👑 | Master Surveyor Badge |

### 9.1 Verified sample questions (one per world)

**World 0 — Look-Alike Lab.** *Rectangle A is 4 cm × 6 cm. Rectangle B is 10 cm × 12 cm. Are the two rectangles similar?*
**No — 10 ÷ 4 = 2.5 but 12 ÷ 6 = 2, so the sides are not in the same ratio.** Distractors: *Yes — each side of B is 6 cm longer* (`additive`; 10 − 4 = 12 − 6 = 6 ✓); *Yes — both are rectangles, so all angles are 90°* (`angles-only`); *Cannot tell without the diagonals*.

**World 1 — Zoom Workshop.** *△PQR ∼ △XYZ. PQ = 6 cm corresponds to XY = 15 cm. What is the scale factor from △PQR to △XYZ?*
**2.5.** Distractors: 9 (`additive`, 15 − 6), 0.4 (`inverse-k`, 6 ÷ 15), 90 (`product`, 6 × 15).

**World 2 — Missing Side Mill.** *A triangle has sides 4 cm, 6 cm and 8 cm. A similar triangle has shortest side 10 cm. Find its longest side.*
**20 cm** (k = 10 ÷ 4 = 2.5; 8 × 2.5). Distractors: 14 cm (`additive`, 8 + 6), 3.2 cm (`inverse-k`, 8 × 4 ÷ 10), 80 cm (`product`, 8 × 10).

**World 3 — Mix-Up Junction.** *△1 has sides 4 cm, 6 cm and 8 cm. △2 is similar with sides 6 cm, 9 cm and 12 cm, drawn flipped. Which side of △2 corresponds to the 6 cm side of △1?*
**9 cm** (the middle side matches the middle side; k = 1.5 for all pairs: 6 ÷ 4 = 9 ÷ 6 = 12 ÷ 8). Distractors: 6 cm (`mismatch`, same number), 12 cm (`mismatch`, longest side), "It cannot be told".

**World 4 — Angle Agency.** *Triangle 1 has angles 50° and 60°. Triangle 2 has angles 60° and 70°. Are the triangles similar?*
**Yes — the third angles are 70° and 50°, so both triangles have angles 50°, 60°, 70°.** Distractors: No — only one pair of given angles matches (`angles-only`/incomplete check); No — the triangles have different given angles; Cannot be known without the side lengths.

**World 5 — Shadow Fields.** *A pole 1.5 m tall casts a shadow 2 m long. At the same time a building casts a shadow 24 m long. How tall is the building?*
**18 m** (k = 24 ÷ 2 = 12; 1.5 × 12). Distractors: 23.5 m (`additive`, 24 − 0.5), 32 m (`inverse-k`, 24 × 2 ÷ 1.5), 36 m (`product`, 24 × 1.5).

**World 6 — Parallel Pass.** *In △ABC, D is on AB and E is on AC with DE ∥ BC. AD = 4 cm, DB = 6 cm and DE = 6 cm. Find BC.*
**15 cm** (△ADE ∼ △ABC, k = AB ÷ AD = 10 ÷ 4 = 2.5; 6 × 2.5). Distractors: 9 cm (`whole-for-part`, 6 × 6 ÷ 4), 12 cm (`additive`, 6 + 6), 10 cm (`copy-side`, AB).

**World 7 — Map & Model Room.** *A map has scale 1 : 50 000. Two towns are 3.6 cm apart on the map. What is the real distance in km?*
**1.8 km** (3.6 × 50 000 = 180 000 cm = 1.8 km). Distractors: 18 km, 180 km (`unit-slip`, misplaced conversion), 0.18 km (`unit-slip`).
*(Second direction, also verified: a model of a 4.8 m car at scale 1 : 40 is 12 cm long.)*

**World 8 — Inspector's Desk.** *Maya enlarges a 6 cm × 8 cm rectangle to 9 cm × 11 cm and says "each side grew by 3 cm, so it is similar." Is she right?*
**No — 9 ÷ 6 = 1.5 but 11 ÷ 8 = 1.375, so the sides are not in the same ratio.** Distractors: Yes — each side grew by the same amount (`additive`); Yes — both are rectangles (`angles-only`); Only if the diagonals also grew by 3 cm.
*(Two-step variant, also verified: a triangle with sides 4, 6, 8 is enlarged so its shortest side is 10 cm → perimeter 45 cm; distractors 24 cm (added the difference to the perimeter), 36 cm (added 6 to each side), 20 cm (longest side only).)*

**World 9 — Grand Survey Finale.** *A 1.8 m person casts a 2.4 m shadow. At the same moment a tower casts a 32 m shadow. A model of the tower is built at scale 1 : 200. How tall is the model, in cm?*
**12 cm** (tower = 1.8 × 32 ÷ 2.4 = 24 m = 2400 cm; ÷ 200). Distractors: 2400 cm (forgot the model scale), 16 cm (used the 32 m shadow instead of the tower's height: 3200 ÷ 200), 0.12 cm (`unit-slip`: 24 ÷ 200 = 0.12 is in metres, not cm).

### 9.2 Clean-number convention *(becomes generation logic in the TRD)*
**Generate forward, then mask:** choose the scale factor and one figure's lengths first, compute every other length, then hide the asked-for quantity. Scale factors come from a curated set (1.5, 2, 2.5, 3, 4, 5, 4/3, 5/4, 5/3, 7/2, 7/4; reductions use the reciprocal); the original's sides are chosen so that **every scaled length is a whole number or ends in .5**. No answer is rounded, and every shown length stays within a realistic range for its context.

---

## 10. Gamification — Badge Renames

| Fixed trigger | Badge name |
|---|---|
| First correct answer | **First Match** 🔭 |
| 5-answer streak | **Steady Survey** 📏 |
| 10-answer streak | **Surveyor's Streak** ⚡ |
| All 4 Simulate stations complete | **Crew Certified** 🧭 |
| Any world scores 3 stars | **Triple-Star Surveyor** ⭐ |
| Any Boss Battle won | **Site Champion** 🥇 |
| 20+ questions answered in Practice | **Field Worker** 🏕️ |
| Full 5-phase journey complete | **Master of Scale** 🏆 |

Boss reward badges are listed per world in §9.

---

## 11. Audio & Narration Content Rules

Fixed base: every question text and hint has its own narration (dynamic, cached by text hash for the procedural bank); fixed phrases are pre-generated; the Wonder narration auto-starts after Begin Your Journey.

**Module additions — how each symbol, term and unit is spoken** (plain-language meaning on first use per world):

| Written | Spoken |
|---|---|
| △ABC ∼ △DEF | "triangle A B C is similar to triangle D E F" (letters spoken singly) |
| similar | "similar" — first use per world adds "the same shape, possibly a different size" |
| scale factor k | "scale factor" (never "k" alone) — first use adds "the number every length is multiplied by" |
| 1 : 50 000 | "one to fifty thousand" |
| ∥ | "is parallel to" |
| ° | "degrees" |
| × / ÷ / = / + | "multiplied by" / "divided by" / "equals" / "plus" |
| cm, m, km, mm | "centimetres", "metres", "kilometres", "millimetres" — singular when exactly one |
| 2.5 | "two point five" |
| AA | "angle angle" |
| ≠ | "is not equal to" |

Rules: words always spoken in full; the phrases "scale factor", "corresponding sides" and "similar" are used consistently and never swapped for each other; **every hint opens with the first thing to do** ("First find the scale factor from the pair of sides you know…"); letter names in figures are spoken singly, never as words.

---

## 12. Accessibility and Responsiveness (S3)

**Responsive on mobile and web.** Desktop (≥ 1024 px) matches the zip and the two screenshots; below that, the zip's 768 / 540 / 480 px rules apply plus the additions in TRD §9. Verified 320 px phone to 1920 px display, portrait and landscape: no horizontal scrolling; no clipped or overlapping elements; header labels hidden ≤ 768 px and Home text hidden ≤ 540 px; map grid 5 / 3 / 2 columns; stations collapse to one column at ≤ 768 px (the figure on top, controls below) — **SimilarQuest's geometry stations need width, so they stack up to 1024 px** (`data-stack-below="1024"`). All interactions work by touch, mouse and keyboard; touch targets ≥ 48 × 48 px.

**Accessibility.** Enlarged fonts and targets in Simulate and Practice; no cue is colour-only; **every vertex and side of every figure carries a text label**, and corresponding parts are also marked with **shape markers** (tick, double tick, circle) and not colour alone; animations honour reduce-motion; changes announced to screen readers; visible keyboard focus. **Module items:** minimum rendered label size 12 px even when a figure scales down; reduction figures never shrink below a legible size (they scale the *view*, not the stated lengths); each angle arc carries its value as text; ⚠ the zip's viewport meta disables pinch-zoom — recommended change in §15.10.

---

## 13. Assets Required

**4 story images** at the reference module's placeholder dimensions (**1376 × 768 px** in the `G2-Money-Money-main` build I used for earlier modules; confirm by reading the zip), delivered as blank CSS-framed placeholders (`object-fit: cover`) with an art-brief README, one line per panel:
1. Maya, Leo and Echo on a hillside beside a tall tree; a 2 m pole with its shadow beside the tree's long shadow.
2. Two overlaid translucent triangles (pole-and-shadow inside tree-and-shadow) with matching tick marks.
3. A photo print being enlarged on a workbench with a ruler showing 6 cm and 15 cm.
4. A tall cliff, a small mirror on the ground and Maya looking into it; Leo and Echo hold the tape.

---

## 14. Success Metrics / Acceptance Criteria

**Fixed baseline**
- Question-bank stress test (≥ 300 runs), audio parity, clean production build, full-journey walkthrough with zero console errors.
- **Visual fidelity:** token values, header, Wonder/Story/Simulate/Practice-question/Reflect surfaces match the zip (token-parity test); the **Home screen** and **Practice map** match the screenshot boxes within ±4 px at 1366 × 681 and 1361 × 654 (layout-anchor test).
- **S1:** at every tested width from 320 px up, the five Home-screen phase names render on one line — no wrapping, truncation, or horizontal scroll.
- **S2:** each Reflect step fits 360 × 640 without scrolling (steps 1–2), has ≤ 5 interactive controls, targets ≥ 48 px, no overlapping or competing animation; Reflect reachable in one tap.
- **S3:** the full journey passes the device matrix; every station completable by touch only, mouse only, and keyboard only; no horizontal overflow.
- **S4:** no Simulate station contains a multiple-choice question; each is manipulation-driven with live animated feedback; the Concept Discovery Lab has no questions.
- **Practice map:** the 4/10 unlock rule, replay with regenerated questions, and the 0–30 star total behave as in §8.4.
- Every correct answer verified by an **independent solver**; every distractor traces to a named misconception (§3.4).
- **G1:** the locale audit passes (TRD §12.18); the §3 crosswalk is complete; the terminology house style is applied consistently in narration, visuals and distractors.

**Module-specific**
1. **Whole numbers (or .5) by construction:** every scaled length is a whole number or ends in .5; no answer is rounded; every map and model answer has at most one decimal place.
2. **Figures are drawn to scale** from the same data as the question: an automated check confirms that on-screen side ratios match the stated numbers to within 1 %, so no diagram contradicts its numbers.
3. **No area or volume question** anywhere in the bank (the bridge-only boundary, §3.3), and no question that only asks the student to write or simplify a ratio.
4. **Similar-or-not questions** are 50 % similar / 50 % not, and every *not similar* case includes the `additive` trap (equal differences) in at least half of its draws.
5. **Corresponding-side integrity:** the letter order of every `△ ∼ △` statement maps to the sides shown; flipped and rotated figures are generated from the same data, never redrawn by hand.
6. **No answer leak:** no practice diagram prints the quantity being asked for (checked by the end-to-end test for all 100 questions).
7. **Station 1 free-play:** contains zero questions; **Station 4** repairs are all manipulation (no option lists).
8. **Distractor yield:** no generator retries more than 20 % of its draws.
9. **No locale terms** in `src/`, `public/`, `index.html`, `README.md` or the audio `phrases` array.

---

## 15. Assumptions & Open Questions

1. **Grade placement and curriculum crosswalk.** See the §3 crosswalk and ⚠ scope flag. Similarity sits at Grade 8 level in Singapore (Secondary 2), England (Year 9) and the US (Grade 8) but later in India (Class 10) and at IGCSE; area and volume scale factors are later almost everywhere. Confirm the intended level and target markets. Several cells in the crosswalk rest on **secondary or unretrieved sources** (US 8.G.A.5 and 7.G.A.1, India's Class 8, Cambridge Lower Secondary, IB) and should be verified against official texts before the module is finalised.
2. **Practice item formats.** Practice stays multiple-choice with live visuals under the fixed schema. Geometry is a topic where interactive Practice items (tap the corresponding side, place a stake) would add real value; decide whether to change the schema.
3. **Characters, mascot, theme.** Maya, Leo, Echo the Bat and "The Survey Crew" are proposed defaults, not approved. The collision check covered only the modules I have records of; **the full registry was not supplied**.
4. **Concept Discovery Lab.** Free-play with no confirmation question (default D4).
5. **Excluded adjacent topics — and whether each deserves a companion module:** *area and volume scale factors* (the strongest candidate: "Similarity: Area and Volume", relevant to most markets); *coordinate dilations and similarity by transformations* (US framing); *SAS/SSS similarity criteria and proofs*; *trigonometric ratios from similar triangles*; *congruence*.
6. **Header size.** Screenshot 2's header pill is ≈ 37 px tall; the zip's is ≈ 46 px. The zip's header is used for all phases; if the compact one is wanted platform-wide, change four values (pill padding, circle size, audio button, header height).
7. **Audio-toggle position.** The zip and screenshot 2 place it beside the phase pill; earlier blueprint wording said "right-centre". The zip's position is used; confirm.
8. **Practice unlock rule.** The map's "Need 4/10 Correct to Unlock Next World" is new relative to the zip (which advances regardless of score); confirm the rule and the replay behaviour.
9. **Screenshot-derived values** are approximate (JPEG); replace with exact source values if available. Layout defects visible in the screenshots (unequal map columns, a clipped Home button, a three-line "Simulate" descriptor) are not reproduced.
10. **Viewport meta.** Remove `user-scalable=no` to allow pinch-zoom (accessibility); needs sign-off because it departs from the zip. Pinch-zoom matters more than usual here because students will want to zoom into labelled figures.
11. **Markets and locale variants.** Which markets this module serves, and whether any need a regional variant: notation ("~" versus ∼, "dilation" versus "enlargement"), spelling ("metres" versus "meters"), or curriculum-specific extras treated here as bridge-only (area/volume scale factors, SSS/SAS, coordinate dilations).
12. **Narration of figure letters.** Spoken letter names ("A B C") are assumed to be clear in the Alice voice; check the generated clips by ear, and rename vertices if any are mispronounced.

---

## Appendix C — Pre-Handoff Checklist (PRD → TRD)

- [x] Curriculum crosswalk table and multi-framework grade-placement check done; scope flag and cap recorded (§3).
- [x] Terminology and notation house style stated; variants listed (§3.6).
- [x] Every special instruction has a §6 row and a §14 criterion — *none supplied; defaults D1–D4 listed.*
- [x] Home copy slots filled: chip, title word, subtitle, bubble, five descriptors ≤ 22 chars, topic chip (§8.0).
- [x] Map titled `Similarity Game Worlds`; ten worlds with icons, names, bosses (§8.4, §9).
- [x] Four stations, one per archetype; none MCQ; the Lab is free-play (§8.3).
- [x] Reflect recap targets and prompt written (§8.5).
- [x] Sample questions verified; distractors named (§9.1).
- [~] Theme, characters, mascot checked against siblings — **partially**: only against the modules recorded in my notes (§7, §15.3).
- [x] Characters have common English first names; no country-specific terms, currencies, places or brands in learner-facing text (§3.7, §7).
- [x] Story numbers listed as fixed literals (§8.2).
- [x] No new colours, sizes or positions introduced beyond the module slots.
