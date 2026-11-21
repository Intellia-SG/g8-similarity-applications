// src/components/phases/WonderPhase.jsx
// Wonder Phase — Shadow Stick Mystery (PRD §8.1, TRD §5.4, matching G2 sizing & structure)

import React, { useState, useEffect } from 'react';
import './WonderPhase.css';
import Mascot from '../shared/Mascot.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { wonderNarration } from '../../utils/narration.js';

const PARTICLES = ['📐', '🌳', '☀️', '🔍', '📏', '⭐', '💡', '✨', '🧭', '🎯'];

export default function WonderPhase({ dispatch, state }) {
  const [sunPos, setSunPos] = useState(3.0); // 1.5 to 4.5
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
  const groundY = 92;
  const sunX = 70 + sunPos * 80;
  const sunY = 18;

  return (
    <div className="wonder-wrap">
      {/* Floating background particles */}
      <div className="wonder-particles" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="wonder-particle"
            style={{
              left: `${5 + (i * 9.5) % 90}%`,
              top: `${5 + (i * 7.5) % 80}%`,
              animationDelay: `${i * 0.6}s`,
              fontSize: `${1.1 + (i % 3) * 0.4}rem`,
            }}
          >
            {p}
          </span>
        ))}
      </div>

      <div className="wonder-content anim-slide-up">
        {/* Main Hook Card */}
        <div className="wonder-card glass-card">
          <div className="wonder-stadium-icon" aria-hidden="true">📐</div>
          <h1 className="wonder-title headline">The Shadow Stick Mystery!</h1>

          <div className="wonder-number-display">
            <span className="wonder-num">
              Pole: {poleHeight} m : {poleShadow} m :: Tree: ? m : {treeShadow} m
            </span>
          </div>

          <div className="wonder-question-card">
            <p className="wonder-q">
              A <strong className="wonder-em">2 m survey pole</strong> casts a <strong className="wonder-em">{poleShadow} m shadow</strong>.
            </p>
            <p className="wonder-q">
              The tree next to it casts a <strong className="wonder-em">{treeShadow} m shadow</strong>.
              How tall is the tree — <span className="wonder-highlight">without climbing it?</span>
            </p>
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
              <rect x="0" y={groundY} width="540" height="23" fill="url(#groundGrad)" />
              <line x1="0" y1={groundY} x2="540" y2={groundY} stroke="#22c55e" strokeWidth="2" />

              {/* Pole (2 m) */}
              <g transform={`translate(140, ${groundY})`}>
                <line
                  x1="0"
                  y1="0"
                  x2={poleShadow * 18}
                  y2="0"
                  stroke="#1f2937"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <line x1="0" y1="0" x2="0" y2="-40" stroke="#f59e0b" strokeWidth="3.5" />
                <circle cx="0" cy="-40" r="3" fill="#fcd34d" />
                <text x="-8" y="-18" fill="#ffe082" fontSize="11" fontWeight="bold" textAnchor="end">2 m</text>
                <text x={poleShadow * 9} y="13" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">{poleShadow} m</text>
              </g>

              {/* Tree (? m) */}
              <g transform={`translate(310, ${groundY})`}>
                <line
                  x1="0"
                  y1="0"
                  x2={treeShadow * 14}
                  y2="0"
                  stroke="#111827"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <rect x="-6" y="-72" width="12" height="72" fill="#78350f" rx="2" />
                <circle cx="0" cy="-72" r="23" fill="#15803d" />
                <circle cx="-11" cy="-66" r="15" fill="#166534" />
                <circle cx="11" cy="-66" r="15" fill="#16a34a" />
                <text x="-14" y="-36" fill="#4ade80" fontSize="12" fontWeight="bold" textAnchor="end">? m</text>
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
          <div className="wonder-mascot-row">
            <Mascot
              mood="curious"
              message="Notice how both shadows stretch and shrink together in exact proportion!"
              size="sm"
            />
          </div>

          {/* CTA */}
          <button className="btn btn-primary btn-lg wonder-cta" onClick={handleStartSurvey}>
            Start Investigation 🔍
          </button>
        </div>
      </div>
    </div>
  );
}
