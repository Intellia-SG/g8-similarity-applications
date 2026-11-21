// src/data/storyContent.js
// 4-panel survey story for SimilarQuest with exact verified arithmetic literals (TRD §4.2)

export const STORY_PANELS = [
  {
    panel: 0,
    title: "The Tree Nobody Could Climb",
    character: "Leo & Maya",
    characterEmoji: "🌳",
    imageEmoji: "🌳",
    imageBg: "linear-gradient(135deg, #1e1b4b, #312e81)",
    text: "The Survey Crew needs the height of a towering tree that nobody can climb. Maya sets up a 2 m survey pole, which casts a 3 m shadow on the grass. At the same moment, the tree's shadow stretches to 12 m. Leo eagerly calculates: \"The shadow is 9 m longer, so the tree is 9 m taller: 11 m!\" Maya frowns. When Echo drops a pole beside the tree, the shapes clearly do not match.",
    highlight: "Leo added 9 m (12 − 3 = 9; 2 + 9 = 11 m). But does adding preserve shape?",
  },
  {
    panel: 1,
    title: "Same Shape, Different Size",
    character: "Maya",
    characterEmoji: "📐",
    imageEmoji: "📐",
    imageBg: "linear-gradient(135deg, #064e3b, #047857)",
    text: "Maya overlays the pole-and-shadow triangle with the tree-and-shadow triangle. Both have right angles, and the sun's rays strike at the exact same angle. The sides grow by the same multiplier: 12 ÷ 3 = 4. Adding doesn't keep the shape, but multiplying every side by the same scale factor does! When figures have scale factor 1, they are congruent.",
    highlight: "Scale factor k = 12 ÷ 3 = 4. Every side is multiplied by 4!",
  },
  {
    panel: 2,
    title: "Match, Multiply, Check",
    character: "Maya & Leo",
    characterEmoji: "🔍",
    imageEmoji: "🔍",
    imageBg: "linear-gradient(135deg, #701a75, #a21caf)",
    text: "Using k = 4, Maya calculates the tree's height: 2 m × 4 = 8 m! Next, they tackle an aerial survey photo: a 6 cm × 4 cm print enlarged to 15 cm wide. The scale factor is 15 ÷ 6 = 2.5, so the height becomes 4 × 2.5 = 10 cm. Reversing the calculation, 15 cm ÷ 2.5 = 6 cm. Maya's rule: match corresponding sides first, find k, and check that the size change makes sense.",
    highlight: "Tree = 2 × 4 = 8 m. Photo k = 15 ÷ 6 = 2.5, height = 4 × 2.5 = 10 cm.",
  },
  {
    panel: 3,
    title: "The Cliff and the Mirror",
    character: "The Survey Crew",
    characterEmoji: "🪞",
    imageEmoji: "🪞",
    imageBg: "linear-gradient(135deg, #1c1917, #44403c)",
    text: "For their final survey, a vertical cliff is too dangerous to scale. Maya places a mirror flat on the ground 15 m from the cliff base and steps back 2 m until she sees the cliff's highest crest in the reflection. Her eye level is 1.6 m. Light reflection guarantees equal angles: k = 15 ÷ 2 = 7.5. The cliff height is 1.6 × 7.5 = 12 m! And what happens to the area when lengths double? That is a story for another day.",
    highlight: "Mirror method: k = 15 ÷ 2 = 7.5. Cliff height = 1.6 × 7.5 = 12 m.",
  },
];

export default STORY_PANELS;
