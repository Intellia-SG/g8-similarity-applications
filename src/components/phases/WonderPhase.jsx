// src/components/phases/WonderPhase.jsx
// Wonder Phase — Shadow Stick Puzzle (PRD §8.1, TRD §5.4)

import React, { useState, useEffect } from 'react';
import './WonderPhase.css';
import Mascot from '../shared/Mascot.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { wonderNarration } from '../../utils/narration.js';

export default function WonderPhase({ dispatch, state }) {
  const [sunPos, setSunPos] = useState(3.0); // 1.5 (low) to 4.5 (high)
  const { narrate, stopAll } = useAudio(state?.audioEnabled ?? true);

  // Auto-start narration right after entering Wonder Phase
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

  // Visual SVG coordinates
  const groundY = 95;
  const sunX = 70 + sunPos * 80;
  const sunY = 18;

  return (
    <div className="wonder-wrap anim-slide-up">
      <div className="wonder-card glass-card">
        <h1 className="wonder-title">The Shadow Stick Mystery! 📐</h1>

        <p className="wonder-desc">
          A <strong>2 m survey pole</strong> casts a <strong>{poleShadow} m shadow</strong>.
          The tree next to it casts a <strong>{treeShadow} m shadow</strong>.
          How tall is the tree — <em>without climbing it?</em>
        </p>

        {/* Dashed Ratio Display from PRD §8.1 */}
        <div className="wonder-ratio-display">
          <span className="ratio-term">Pole: <strong>{poleHeight} m : {poleShadow} m</strong></span>
          <span style={{ color: '#f59e0b', fontSize: '1.2rem', fontWeight: 'bold' }}>::</span>
          <span className="ratio-term">Tree: <strong>? m : {treeShadow} m</strong></span>
        </div>

        {/* Interactive Sun & Shadow Sky Canvas */}
        <div className="wonder-canvas-box">
          <svg viewBox="0 0 540 115" className="wonder-svg">
            <defs>
              <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e3a1e" />
                <stop offset="100%" stopColor="#0d1b0d" />
              </linearGradient>
            </defs>

            {/* Sun Rays */}
            <line
              x1={sunX}
              y1={sunY}
              x2={140 + poleShadow * 18}
              y2={groundY}
              stroke="rgba(255, 235, 59, 0.35)"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            <line
              x1={sunX}
              y1={sunY}
              x2={310 + treeShadow * 14}
              y2={groundY}
              stroke="rgba(255, 235, 59, 0.35)"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />

            {/* Sun */}
            <g transform={`translate(${sunX}, ${sunY})`}>
              <circle cx="0" cy="0" r="14" fill="#ffc107" filter="drop-shadow(0 0 10px #ffc107)" />
              <text x="0" y="4" fill="#18181b" fontSize="11" fontWeight="bold" textAnchor="middle">☀️</text>
            </g>

            {/* Ground */}
            <rect x="0" y={groundY} width="540" height="20" fill="url(#groundGrad)" />
            <line x1="0" y1={groundY} x2="540" y2={groundY} stroke="#22c55e" strokeWidth="2" />

            {/* Pole (2 m) */}
            <g transform={`translate(140, ${groundY})`}>
              {/* Shadow on ground */}
              <line
                x1="0"
                y1="0"
                x2={poleShadow * 18}
                y2="0"
                stroke="#1f2937"
                strokeWidth="5"
                strokeLinecap="round"
              />
              {/* Vertical pole */}
              <line x1="0" y1="0" x2="0" y2="-40" stroke="#f59e0b" strokeWidth="3.5" />
              <circle cx="0" cy="-40" r="3" fill="#fcd34d" />
              <text x="-8" y="-18" fill="#ffe082" fontSize="11" fontWeight="bold" textAnchor="end">2 m</text>
              <text x={poleShadow * 9} y="13" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">{poleShadow} m</text>
            </g>

            {/* Tree (Height represents ? m) */}
            <g transform={`translate(310, ${groundY})`}>
              {/* Shadow on ground */}
              <line
                x1="0"
                y1="0"
                x2={treeShadow * 14}
                y2="0"
                stroke="#111827"
                strokeWidth="6"
                strokeLinecap="round"
              />
              {/* Trunk */}
              <rect x="-6" y="-75" width="12" height="75" fill="#78350f" rx="2" />
              {/* Foliage */}
              <circle cx="0" cy="-75" r="24" fill="#15803d" />
              <circle cx="-12" cy="-68" r="16" fill="#166534" />
              <circle cx="12" cy="-68" r="16" fill="#16a34a" />
              <text x="-14" y="-38" fill="#4ade80" fontSize="12" fontWeight="bold" textAnchor="end">? m</text>
              <text x={treeShadow * 7} y="13" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">{treeShadow} m shadow</text>
            </g>
          </svg>
        </div>

        {/* Drag Sun Marker */}
        <div className="wonder-sun-slider-group">
          <label className="wonder-sun-label">
            ☀️ Drag the Sun across the sky:
          </label>
          <input
            type="range"
            min="1.5"
            max="4.5"
            step="0.1"
            value={sunPos}
            onChange={(e) => setSunPos(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#ffc107', cursor: 'pointer', height: '6px' }}
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
