// src/hooks/useAudio.js
// Hook providing ElevenLabs narration and synthesized Web Audio sound effects

import { useRef, useCallback, useEffect } from 'react';
import { getAudioUrl } from '../utils/audio.js';

// Web Audio sound synthesizer for instant zero-latency feedback
class SoundFX {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playTone(freq, duration, type = 'sine', gainVal = 0.15) {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {}
  }

  click() {
    this.playTone(600, 0.04, 'triangle', 0.08);
  }

  correct() {
    this.playTone(523.25, 0.12, 'sine', 0.18); // C5
    setTimeout(() => this.playTone(659.25, 0.14, 'sine', 0.18), 100); // E5
    setTimeout(() => this.playTone(783.99, 0.22, 'sine', 0.22), 200); // G5
  }

  wrong() {
    this.playTone(260, 0.18, 'sawtooth', 0.15);
    setTimeout(() => this.playTone(220, 0.25, 'sawtooth', 0.15), 140);
  }

  levelUp() {
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 0.18, 'sine', 0.2), idx * 90);
    });
  }

  badge() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 0.22, 'triangle', 0.2), idx * 110);
    });
  }

  defeat() {
    this.playTone(330, 0.25, 'sawtooth', 0.18);
    setTimeout(() => this.playTone(277.18, 0.35, 'sawtooth', 0.18), 200);
  }
}

const sfx = new SoundFX();

export function useAudio(audioEnabled = true) {
  const currentAudioRef = useRef(null);
  const narrateIdRef = useRef(0);

  useEffect(() => {
    if (!audioEnabled) {
      narrateIdRef.current++;
      stopAll();
    }
  }, [audioEnabled]);

  const stopAll = useCallback(() => {
    narrateIdRef.current++;
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
  }, []);

  const playSegment = useCallback(
    async (text, style, expectedId) => {
      if (!audioEnabled || narrateIdRef.current !== expectedId) return;
      const url = await getAudioUrl(text, style);
      if (!url || narrateIdRef.current !== expectedId) return;

      return new Promise((resolve) => {
        const audio = new Audio(url);
        currentAudioRef.current = audio;
        audio.onended = () => {
          currentAudioRef.current = null;
          resolve();
        };
        audio.onerror = () => {
          currentAudioRef.current = null;
          resolve();
        };
        audio.play().catch(() => resolve());
      });
    },
    [audioEnabled]
  );

  const narrate = useCallback(
    async (segments) => {
      if (!segments || !segments.length || !audioEnabled) return;
      stopAll();
      const currentId = ++narrateIdRef.current;

      for (let i = 0; i < segments.length; i++) {
        if (narrateIdRef.current !== currentId) break;
        const seg = segments[i];

        // Eagerly preload next segment
        if (i + 1 < segments.length) {
          getAudioUrl(segments[i + 1].text, segments[i + 1].style).catch(() => {});
        }

        await playSegment(seg.text, seg.style, currentId);
        if (narrateIdRef.current !== currentId) break;
        await new Promise((r) => setTimeout(r, 180));
      }
    },
    [audioEnabled, stopAll, playSegment]
  );

  return {
    narrate,
    stopAll,
    sounds: {
      click: () => audioEnabled && sfx.click(),
      correct: () => audioEnabled && sfx.correct(),
      wrong: () => audioEnabled && sfx.wrong(),
      levelUp: () => audioEnabled && sfx.levelUp(),
      badge: () => audioEnabled && sfx.badge(),
      defeat: () => audioEnabled && sfx.defeat(),
    },
  };
}
