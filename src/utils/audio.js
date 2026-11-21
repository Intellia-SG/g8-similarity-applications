// src/utils/audio.js
// Core audio engine — ElevenLabs only, no browser TTS fallback (per audio_generation_pipeline (5).md)

import { audioMap } from './audioMap.js';
import { VOICE_ID, VOICE_MODEL, VOICE_SETTINGS } from '../config/audio.config.js';

let _currentAudio = null;
let _muted = false;
const _elevenLabsCache = new Map();

export function setMuted(val) {
  _muted = val;
  if (_muted) stopAudio();
}

export function isMuted() {
  return _muted;
}

/**
 * Stop any currently playing audio immediately.
 */
export function stopAudio() {
  if (_currentAudio) {
    _currentAudio.pause();
    _currentAudio.currentTime = 0;
    _currentAudio = null;
  }
}

/**
 * getAudioUrl(text, style)
 * Priority: audioMap (static .mp3) → ElevenLabs dynamic API → null
 */
export async function getAudioUrl(text, style = 'statement') {
  if (!text) return null;

  // 1. Check static audioMap first
  if (audioMap && audioMap[text]) {
    return audioMap[text];
  }

  // 2. Check memory cache
  const cacheKey = `${text}::${style}`;
  if (_elevenLabsCache.has(cacheKey)) {
    return _elevenLabsCache.get(cacheKey);
  }

  // 3. Dynamic ElevenLabs generation (requires API key)
  const apiKey = typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.VITE_ELEVENLABS_API_KEY
    : null;
  if (!apiKey) return null;

  try {
    const settings = VOICE_SETTINGS[style] || VOICE_SETTINGS.statement;
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
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
      }
    );

    if (!response.ok) return null;

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    _elevenLabsCache.set(cacheKey, url);
    return url;
  } catch {
    return null;
  }
}

/**
 * speak(text, style)
 * Play a single narration line.
 */
export async function speak(text, style = 'statement') {
  if (_muted || !text) return;

  const url = await getAudioUrl(text, style);
  if (!url) return;

  stopAudio();
  _currentAudio = new Audio(url);
  _currentAudio.play().catch(() => {});
}

/**
 * narrate(segments)
 * Play an array of { text, style } segments sequentially with eager preloading.
 */
export async function narrate(segments) {
  if (_muted || !segments || segments.length === 0) return;

  stopAudio();

  for (let i = 0; i < segments.length; i++) {
    if (_muted) break;
    const { text, style } = segments[i];
    const url = await getAudioUrl(text, style);

    // Preload next segment eager download
    if (i + 1 < segments.length) {
      const next = segments[i + 1];
      getAudioUrl(next.text, next.style).catch(() => {});
    }

    if (!url) continue;

    await new Promise((resolve) => {
      const audio = new Audio(url);
      _currentAudio = audio;
      audio.onended = () => {
        _currentAudio = null;
        resolve();
      };
      audio.onerror = () => {
        _currentAudio = null;
        resolve();
      };
      audio.play().catch(() => resolve());
    });

    if (_muted) break;
    // Brief natural pause between sentences
    await new Promise((r) => setTimeout(r, 180));
  }
}
