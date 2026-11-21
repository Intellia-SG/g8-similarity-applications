// src/components/simulations/MatchTheModel.jsx
// Station 2: Build-to-Target (3 Rounds) — TRD §10

import React, { useState, useEffect } from 'react';
import './Stations.css';

const ROUNDS = [
  {
    round: 1,
    title: 'Round 1: Enlarge to Marked Base Length',
    targetK: 2.0,
    targetBase: 12,
    origBase: 6,
    requireFlip: false,
    instruction: 'Drag the handle to enlarge the model until its base matches the 12 cm site marker (k = 2.0).',
  },
  {
    round: 2,
    title: 'Round 2: Reduce to Fit Display Case Outline',
    targetK: 0.5,
    targetBase: 5,
    origBase: 10,
    requireFlip: false,
    instruction: 'Drag the handle to reduce the model triangle so it fits inside the compact case outline (k = 0.5).',
  },
  {
    round: 3,
    title: 'Round 3: Flipped Survey Target',
    targetK: 1.5,
    targetBase: 9,
    origBase: 6,
    requireFlip: true,
    instruction: 'The survey target is flipped! First click "Flip Model", then scale to match the 9 cm base.',
  },
];

export default function MatchTheModel({ onComplete }) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [currentK, setCurrentK] = useState(1.0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [completedRounds, setCompletedRounds] = useState([false, false, false]);

  const currentRound = ROUNDS[roundIdx];

  // Tolerance check (within 5% of target k)
  const isMatch =
    Math.abs(currentK - currentRound.targetK) <= 0.08 &&
    (!currentRound.requireFlip || isFlipped);

  useEffect(() => {
    if (isMatch && !isLocked) {
      setIsLocked(true);
      const updated = [...completedRounds];
      updated[roundIdx] = true;
      setCompletedRounds(updated);

      if (roundIdx === ROUNDS.length - 1 && onComplete) {
        onComplete();
      }
    }
  }, [isMatch, isLocked, roundIdx, completedRounds, onComplete]);

  function handleNextRound() {
    if (roundIdx < ROUNDS.length - 1) {
      setRoundIdx(roundIdx + 1);
      setCurrentK(1.0);
      setIsFlipped(false);
      setIsLocked(false);
    }
  }

  const allDone = completedRounds.every(Boolean);

  return (
    <div className="station-wrap">
      <div className="station-header">
        <div className="station-title-group">
          <h2>Station 2 · Match the Model 📐</h2>
          <p className="station-guide-text">{currentRound.instruction}</p>
        </div>
        <div className="round-badge">
          Round {roundIdx + 1} of 3
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left: Visual Canvas */}
        <div className="station-canvas-card">
          <svg viewBox="0 0 520 280" width="100%" height="280">
            {/* Target Outline (Ghost) */}
            <g
              transform={`translate(160, 40) ${currentRound.requireFlip ? 'scale(-1, 1) translate(-200, 0)' : ''}`}
            >
              <polygon
                points={`0,${160 * currentRound.targetK} ${100 * currentRound.targetK},${160 * currentRound.targetK} ${40 * currentRound.targetK},${30 * currentRound.targetK}`}
                fill="none"
                stroke="rgba(0, 230, 118, 0.4)"
                strokeWidth="2.5"
                strokeDasharray="6 4"
              />
              <text
                x={(50 * currentRound.targetK)}
                y={(185 * currentRound.targetK)}
                fill="#00e676"
                fontSize="13"
                fontWeight="bold"
                textAnchor="middle"
              >
                Target Base: {currentRound.targetBase} cm
              </text>
            </g>

            {/* Student's Controllable Model Triangle */}
            <g
              transform={`translate(160, 40) ${isFlipped ? 'scale(-1, 1) translate(-200, 0)' : ''}`}
              style={{ transition: isLocked ? 'all 0.3s ease' : 'none' }}
            >
              <polygon
                points={`0,${160 * currentK} ${100 * currentK},${160 * currentK} ${40 * currentK},${30 * currentK}`}
                fill={isLocked ? 'rgba(0, 230, 118, 0.3)' : 'rgba(255, 193, 7, 0.25)'}
                stroke={isLocked ? '#00e676' : '#ffc107'}
                strokeWidth={isLocked ? '3.5' : '2.5'}
              />
              {/* Corner drag handle */}
              <circle
                cx={100 * currentK}
                cy={160 * currentK}
                r="7"
                fill="#ffc107"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>

            {isLocked && (
              <g transform="translate(260, 140)">
                <circle cx="0" cy="0" r="28" fill="#1b5e20" stroke="#00e676" strokeWidth="2" />
                <text x="0" y="8" fill="#ffffff" fontSize="24" textAnchor="middle">🔒</text>
              </g>
            )}
          </svg>

          {/* Real-time Status */}
          <div className="ratio-tracker-box">
            <div className={`ratio-chip ${isMatch ? 'match' : 'warped'}`}>
              Current k: <strong>{currentK.toFixed(2)}</strong> (Target: {currentRound.targetK})
            </div>
            <div className={`ratio-chip ${isMatch ? 'match' : 'warped'}`}>
              Model Base: <strong>{(currentRound.origBase * currentK).toFixed(1)} cm</strong>
            </div>
            <div className={`ratio-chip ${isMatch ? 'match' : 'warped'}`}>
              Status: <strong>{isLocked ? 'Matched & Locked! 🔒' : 'Adjusting…'}</strong>
            </div>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="station-controls-card">
          <div className="control-group">
            <span className="control-label">Scale Factor Dial (k)</span>
            <div className="slider-row">
              <input
                type="range"
                min="0.4"
                max="2.5"
                step="0.05"
                value={currentK}
                disabled={isLocked}
                onChange={(e) => setCurrentK(parseFloat(e.target.value))}
                aria-label="Model scale slider"
              />
              <span style={{ minWidth: '40px', fontWeight: 'bold' }}>{currentK.toFixed(2)}</span>
            </div>
          </div>

          {currentRound.requireFlip && (
            <button
              className={`toggle-btn ${isFlipped ? 'active' : ''}`}
              onClick={() => setIsFlipped(!isFlipped)}
              disabled={isLocked}
            >
              ↔️ {isFlipped ? 'Model Flipped ✓' : 'Flip Model to Match Target Orientation'}
            </button>
          )}

          {isLocked && roundIdx < ROUNDS.length - 1 && (
            <button className="btn btn-primary" onClick={handleNextRound}>
              Next Target Outline →
            </button>
          )}

          {allDone && (
            <div className="station-success-banner">
              <div className="success-text">
                <h4>All 3 Targets Matched! 🎯</h4>
                <p>You proved mastery of proportional enlargement and reduction!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
