// scripts/generate_audio.js
// Offline ElevenLabs narration generation script for SimilarQuest
// Adheres strictly to audio_generation_pipeline (5).md

import fs from 'fs';
import path from 'path';
import { VOICE_ID, VOICE_MODEL, VOICE_SETTINGS } from '../src/config/audio.config.js';
import { normalizeNarration } from '../src/utils/narration.js';

// Load .env.local if present
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...rest] = trimmed.split('=');
          const val = rest.join('=').replace(/^["']|["']$/g, '').trim();
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const apiKey = process.env.VITE_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY;

// Comprehensive list of all static narration dialogues across the 5 phases
export const phrases = [
  // ─── 0. Intro Screen ───
  { text: "Welcome to SimilarQuest! Let's measure the unmeasurable with similar shapes!", style: 'celebration' },

  // ─── 1. Wonder Phase ───
  { text: "A 2 metre pole casts a 3 metre shadow. The tree next to it casts a 12 metre shadow. How tall is the tree without climbing it?", style: 'question' },
  { text: "Drag the sun across the sky to observe how both shadows change together in proportion!", style: 'thinking' },

  // ─── 2. Story Phase (Panel 0: The Tree Nobody Could Climb) ───
  { text: "The Survey Crew needs the height of a towering tree that nobody can climb.", style: 'statement' },
  { text: "Maya places a 2 metre survey pole into the ground, and it casts a 3 metre shadow. At the same moment, the tree casts a 12 metre shadow.", style: 'statement' },
  { text: "Leo says: The shadow is 9 metres longer, so the tree must be 9 metres taller: 11 metres!", style: 'thinking' },
  { text: "Maya frowns: That does not look right. When Echo drops a pole beside the tree, the shapes do not match!", style: 'statement' },

  // ─── 2. Story Phase (Panel 1: Same Shape, Different Size) ───
  { text: "Maya overlays the two triangles: pole and shadow, and tree and shadow.", style: 'statement' },
  { text: "The corresponding angles are equal, and the sides grow by the exact same multiplier: 12 divided by 3 equals 4.", style: 'emphasis' },
  { text: "Adding does not keep the shape. Multiplying by a scale factor does!", style: 'statement' },
  { text: "When figures have the same shape and size, the scale factor is 1, which means they are congruent.", style: 'statement' },

  // ─── 2. Story Phase (Panel 2: Match, Multiply, Check) ───
  { text: "Now Maya uses the scale factor to find the tree's true height: 2 metres multiplied by 4 equals 8 metres!", style: 'statement' },
  { text: "Next, they enlarge a survey photo from 6 centimetres by 4 centimetres to 15 centimetres wide.", style: 'statement' },
  { text: "The scale factor is 15 divided by 6, which equals 2 point 5.", style: 'statement' },
  { text: "So the new height is 4 multiplied by 2 point 5, which equals 10 centimetres. Maya's rule is: match sides first, find the scale factor, and check if the answer makes sense.", style: 'statement' },

  // ─── 2. Story Phase (Panel 3: The Cliff and the Mirror) ───
  { text: "For their final survey, a sheer cliff is too steep to climb.", style: 'statement' },
  { text: "Maya places a mirror flat on the ground 15 metres from the cliff base, then steps back 2 metres until she sees the cliff peak reflected in the centre.", style: 'statement' },
  { text: "Her eye height is 1 point 6 metres. Since the triangles are similar, the scale factor is 15 divided by 2, which equals 7 point 5.", style: 'statement' },
  { text: "The cliff height is 1 point 6 multiplied by 7 point 5, which equals 12 metres!", style: 'statement' },
  { text: "And what happens to the area when lengths double? That is a story for another day!", style: 'celebration' },

  // ─── 3. Simulate Stations ───
  { text: "Welcome to Station 1: Zoom Lens Lab! Drag the scale factor slider and corner handles to explore enlargement and reduction. Toggle additive growth to see why adding warps the shape!", style: 'instruction' },
  { text: "Welcome to Station 2: Match the Model! Drag the corner handle to resize the model triangle until it snaps into the target outline.", style: 'instruction' },
  { text: "Welcome to Station 3: River Survey! Place your stakes, measure the baselines with the tape, match corresponding sides, and turn the dial to measure across the river!", style: 'instruction' },
  { text: "Welcome to Station 4: Replay Review! Scrub the surveyor's calculation steps, spot the error, and drag the repair cards to correct the flaw!", style: 'instruction' },

  // ─── 4. Play Phase Feedback & Gamification ───
  { text: "Spot on! That is exactly right! 🎯", style: 'celebration' },
  { text: "Brilliant! Three in a row!", style: 'celebration' },
  { text: "Outstanding streak! You are surveying like a master!", style: 'celebration' },
  { text: "Not quite — check the corresponding sides, use the hint, and try again! 💡", style: 'thinking' },
  { text: "Survey Site Complete! Spectacular work mapping this region!", style: 'celebration' },
  { text: "Survey Expedition Complete! You have mastered similarity applications and scale factors!", style: 'celebration' },

  // ─── 5. Boss Battles (10 Boss Arrivals & Victories) ───
  { text: "The Site Boss The Colossus of Rhodes has arrived! Answer all similarity challenges to win the badge!", style: 'emphasis' },
  { text: "Victory! You conquered the Site Boss and claimed the Sun God Sextant!", style: 'celebration' },

  { text: "The Site Boss The Pyramid Architect has arrived! Answer all similarity challenges to win the badge!", style: 'emphasis' },
  { text: "Victory! You conquered the Site Boss and claimed the Golden Plumb Line!", style: 'celebration' },

  { text: "The Site Boss The Lighthouse Keeper has arrived! Answer all similarity challenges to win the badge!", style: 'emphasis' },
  { text: "Victory! You conquered the Site Boss and claimed the Beacon Lens!", style: 'celebration' },

  { text: "The Site Boss The Canyon Pioneer has arrived! Answer all similarity challenges to win the badge!", style: 'emphasis' },
  { text: "Victory! You conquered the Site Boss and claimed the Surveyor's Clinometer!", style: 'celebration' },

  { text: "The Site Boss The Cartographer King has arrived! Answer all similarity challenges to win the badge!", style: 'emphasis' },
  { text: "Victory! You conquered the Site Boss and claimed the Grand Map Compass!", style: 'celebration' },

  { text: "The Site Boss The Shadow Sentry has arrived! Answer all similarity challenges to win the badge!", style: 'emphasis' },
  { text: "Victory! You conquered the Site Boss and claimed the Shadow Gauge!", style: 'celebration' },

  { text: "The Site Boss The Scale Sorcerer has arrived! Answer all similarity challenges to win the badge!", style: 'emphasis' },
  { text: "Victory! You conquered the Site Boss and claimed the Proportion Staff!", style: 'celebration' },

  { text: "The Site Boss The Gorge Guardian has arrived! Answer all similarity challenges to win the badge!", style: 'emphasis' },
  { text: "Victory! You conquered the Site Boss and claimed the Laser Rangefinder!", style: 'celebration' },

  { text: "The Site Boss The Citadel Builder has arrived! Answer all similarity challenges to win the badge!", style: 'emphasis' },
  { text: "Victory! You conquered the Site Boss and claimed the Master Architect Blueprint!", style: 'celebration' },

  { text: "The Site Boss The Grand Surveyor has arrived! Answer all similarity challenges to win the badge!", style: 'emphasis' },
  { text: "Victory! You conquered the Site Boss and claimed the Crown of Similarity!", style: 'celebration' },

  // ─── 6. Reflect Phase ───
  { text: "Welcome to the Reflect Phase. Let's review what we learned about scale factors, corresponding sides, and indirect measurement.", style: 'statement' },
];

async function generate() {
  if (!apiKey) {
    console.log("ℹ️ Note: VITE_ELEVENLABS_API_KEY is not defined. Skipping offline audio generation.");
    console.log("   The application will run with silent fallback or dynamic generation when an API key is provided.");
    return;
  }

  const outDir = path.resolve('public/assets/audio');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log(`🎙️ Generating ${phrases.length} audio files using ElevenLabs Alice (${VOICE_ID})...`);
  const audioMap = {};

  for (let i = 0; i < phrases.length; i++) {
    const rawText = phrases[i].text;
    const style = phrases[i].style;
    const text = normalizeNarration(rawText);

    // Create a safe, deterministic filename based on snippet and index
    const cleanSnippet = text
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .slice(0, 24);
    const fileName = `audio_${cleanSnippet}_${i}.mp3`;
    const filePath = path.join(outDir, fileName);

    const settings = VOICE_SETTINGS[style] || VOICE_SETTINGS.statement;

    try {
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: VOICE_MODEL,
          voice_settings: settings,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      audioMap[text] = `/assets/audio/${fileName}`;
      console.log(`  ✓ [${i + 1}/${phrases.length}] ${fileName}`);
    } catch (err) {
      console.warn(`  ⚠️ Failed to generate "${text.slice(0, 30)}...":`, err.message);
    }
  }

  const mapContent = `// Auto-generated audio mapping\nexport const audioMap = ${JSON.stringify(audioMap, null, 2)};\nexport default audioMap;\n`;
  fs.writeFileSync(path.resolve('src/utils/audioMap.js'), mapContent);
  console.log('✅ Generated src/utils/audioMap.js');
}

generate();
