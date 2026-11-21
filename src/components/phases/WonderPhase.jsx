// src/components/phases/WonderPhase.jsx
// Wonder Phase — Shadow Stick Puzzle (PRD §8.1, TRD §5.4)

import React, { useState, useEffect } from 'react';
import './WonderPhase.css';
import Mascot from '../shared/Mascot.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { wonderNarration } from '../../utils/narration.js';

export default function WonderPhase({ dispatch, state }) {
  const [sunPos, setSunPos] = useState(3.0); // 1.0 (low) to 5.0 (high)
  const { narrate, stopAll } = useAudio(state?.audioEnabled ?? true);

  // Auto-start Alice narration right after entering Wonder Phase
  useEffect(() => {
    const timer = setTimeout(() => {
      narrate(wonderNarration());
    }, 400);
    return () => {
      clearTimeout(timer);
      stopAll();
    };
  }, [narrate, stopAll]);

  function handleStartSurvey() {
    stopAll();
    dispatch({ type: 'COMPLETE_PHASE', payload: 'wonder' });
    dispatch({ type: 'SET_PHASE', payload: 'story' });
  }

  // Sun angle drives shadows in fixed proportion (mult = 4)
  const poleHeight = 2;
  const poleShadow = Number((sunPos * 1.0).toFixed(1));
  const treeShadow = Number((poleShadow * 4).toFixed(1));

  return (
    <div className="wonder-wrap anim-slide-up">
      <div className="wonder-card glass-card">
        <h1 className="wonder-title">The Shadow Stick Mystery! 📐</h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.5 }}>
          A <strong>2 m survey pole</strong> casts a <strong>{poleShadow} m shadow</strong>.
          The tree next to it casts a <strong>{treeShadow} m shadow</strong>.
          How tall is the tree — <em>without climbing it?</em>
        </p>

        {/* Dashed Ratio Display from PRD §8.1 */}
        <div className="wonder-ratio-display">
          <span className="ratio-term">Pole: <strong>{poleHeight} m : {poleShadow} m</strong></span>
          <span style={{ color: '#f59e0b', fontSize: '1.4rem' }}>::</span>
          <span className="ratio-term">Tree: <strong>? m : {treeShadow} m</strong></span>
        </div>

        {/* Interactive Sun & Shadow Sky Canvas */}
        <div className="wonder-canvas-box">
          <svg viewBox="0 0 540 200" width="100%" height="200">
            {/* Draggable Sun */}
            <g transform={`translate(${80 + sunPos * 75}, 35)`}>
              <circle cx="0" cy="0" r="18" fill="#ffc107" filter="drop-shadow(0 0 12px #ffc107)" />
              <text x="0" y="5" fill="#18181b" fontSize="13" fontWeight="bold" textAnchor="middle">☀️</text>
            </g>

            {/* Ground */}
            <line x1="20" y1="170" x2="520" y2="170" stroke="#4caf50" strokeWidth="3" />

            {/* Pole (2 m) */}
            <g transform="translate(140, 110)">
              <line x1="0" y1="0" x2="0" y2="60" stroke="#f59e0b" strokeWidth="4" />
              {/* Shadow */}
              <line x1="0" y1="60" x2={poleShadow * 16} y2="60" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
              <text x="-10" y="35" fill="#ffe082" fontSize="13" fontWeight="bold" textAnchor="end">2 m</text>
              <text x={poleShadow * 8} y="75" fill="#a4b0be" fontSize="12" textAnchor="middle">{poleShadow} m</text>
              {/* Sun ray line */}
              <line x1="0" y1="0" x2={poleShadow * 16} y2="60" stroke="rgba(255, 235, 59, 0.4)" strokeWidth="1.5" strokeDasharray="4 3" />
            </g>

            {/* Tree (8 m) */}
            <g transform="translate(300, 30)">
              {/* Trunk */}
              <rect x="0" y="0" width="18" height="140" fill="#78350f" rx="3" />
              {/* Foliage */}
              <circle cx="9" cy="-10" r="32" fill="#15803d" />
              {/* Shadow */}
              <line x1="18" y1="140" x2={18 + treeShadow * 14} y2="140" stroke="#1f2937" strokeWidth="5" strokeLinecap="round" />
              <text x="-12" y="70" fill="#4ade80" fontSize="14" fontWeight="bold" textAnchor="end">? m</text>
              <text x={18 + treeShadow * 7} y="158" fill="#a4b0be" fontSize="13" fontWeight="bold" textAnchor="middle">{treeShadow} m shadow</text>
              {/* Sun ray */}
              <line x1="9" y1="-10" x2={18 + treeShadow * 14} y2="140" stroke="rgba(255, 235, 59, 0.4)" strokeWidth="1.5" strokeDasharray="4 3" />
            </g>
          </svg>
        </div>

        {/* Drag Sun Marker */}
        <div className="wonder-sun-slider-group">
          <label style={{ color: 'var(--gold)', fontSize: '0.9rem', fontWeight: 'bold' }}>
            ☀️ Drag the Sun across the sky:
          </label>
          <input
            type="range"
            min="1.5"
            max="4.5"
            step="0.1"
            value={sunPos}
            onChange={(e) => setSunPos(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#ffc107', cursor: 'pointer' }}
            aria-label="Sun position slider"
          />
        </div>

        {/* Mascot */}
        <Mascot
          mood="curious"
          message="Notice how both shadows stretch and shrink together in exact proportion!"
          size="sm"
        />

        {/* CTA */}
        <button className="btn btn-primary wonder-cta" onClick={handleStartSurvey}>
          Start Surveying 📐
        </button>
      </div>
    </div>
  );
}
