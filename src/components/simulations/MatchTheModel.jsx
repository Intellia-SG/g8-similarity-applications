// src/components/simulations/MatchTheModel.jsx
// Station 2: Build-to-Target (3 Rounds) — TRD §10

import React, { useState, useEffect } from 'react';
import './Stations.css';

const ROUNDS = [
  {
    round: 1,
    title: 'Round 1: Enlarge to Site Marker',
    targetK: 2.0,
    targetBase: 12,
    origBase: 6,
    requireFlip: false,
    instruction: 'Scale the model triangle until its base matches the 12 cm site marker (k = 2.0).',
  },
  {
    round: 2,
    title: 'Round 2: Reduce into Display Case',
    targetK: 0.5,
    targetBase: 5,
    origBase: 10,
    requireFlip: false,
    instruction: 'Reduce the model triangle so it fits inside the compact case outline (k = 0.5).',
  },
  {
    round: 3,
    title: 'Round 3: Flipped Survey Target',
    targetK: 1.5,
    targetBase: 9,
    origBase: 6,
    requireFlip: true,
    instruction: 'The target is flipped! Click "Flip Model", then scale to match the 9 cm base.',
  },
];

export default function MatchTheModel({ onComplete }) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [currentK, setCurrentK] = useState(1.0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [completedRounds, setCompletedRounds] = useState([false, false, false]);

  const currentRound = ROUNDS[roundIdx];

  // Proximity & tolerance check (within 0.08 of target)
  const diff = Math.abs(currentK - currentRound.targetK);
  const flipCorrect = !currentRound.requireFlip || isFlipped;
  const isMatch = diff <= 0.08 && flipCorrect;

  // Proximity percentage (0% to 100%)
  const proximityPct = flipCorrect
    ? Math.max(0, Math.min(100, Math.round((1 - diff / 1.5) * 100)))
    : 20;

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

  // Model triangle points based on current scale
  const baseLen = 60 * currentK;
  const heightLen = 80 * currentK;

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
        {/* Left: Interactive Hologram Blueprint Canvas */}
        <div className="station-canvas-card">
          <div className="station-svg-container">
            <svg viewBox="0 0 520 230" preserveAspectRatio="xMidYMid meet">
              <defs>
                <pattern id="matchGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(56, 189, 248, 0.08)" strokeWidth="1" />
                </pattern>
                <filter id="holoGlow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              <rect width="100%" height="100%" fill="url(#matchGrid)" rx="10" />

              {/* Target Ghost Outline */}
              <g
                transform={`translate(260, 30) ${currentRound.requireFlip ? 'scale(-1, 1) translate(-140, 0)' : ''}`}
              >
                <polygon
                  points={`0,${80 * currentRound.targetK} ${60 * currentRound.targetK},${80 * currentRound.targetK} ${20 * currentRound.targetK},0`}
                  fill={isLocked ? 'rgba(34, 197, 94, 0.25)' : 'rgba(56, 189, 248, 0.08)'}
                  stroke={isLocked ? '#22c55e' : 'rgba(56, 189, 248, 0.5)'}
                  strokeWidth="2.5"
                  strokeDasharray={isLocked ? 'none' : '5 4'}
                  filter={isLocked ? 'url(#holoGlow)' : 'none'}
                />
                <text
                  x={(30 * currentRound.targetK)}
                  y={80 * currentRound.targetK + 18}
                  fill={isLocked ? '#86efac' : '#38bdf8'}
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  Target: {currentRound.targetBase} cm (k = {currentRound.targetK})
                </text>
              </g>

              {/* Player Model Triangle */}
              <g
                transform={`translate(260, 30) ${isFlipped ? 'scale(-1, 1) translate(-140, 0)' : ''}`}
                style={{ transition: 'all 0.15s ease' }}
              >
                <polygon
                  points={`0,${heightLen} ${baseLen},${heightLen} ${20 * currentK},0`}
                  fill={isLocked ? 'rgba(34, 197, 94, 0.35)' : 'rgba(245, 158, 11, 0.3)'}
                  stroke={isLocked ? '#22c55e' : '#f59e0b'}
                  strokeWidth="3"
                />
                {/* Vertex Draggable Handle Indicator */}
                <circle cx={baseLen} cy={heightLen} r="6" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" />
                <text
                  x={baseLen / 2}
                  y={heightLen - 6}
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {(currentRound.origBase * currentK).toFixed(1)} cm
                </text>
              </g>

              {/* Congruence Alignment Status Overlay */}
              <g transform="translate(20, 25)">
                <rect x="0" y="0" width="130" height="26" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                <text x="65" y="17" fill={isLocked ? '#4ade80' : '#fbbf24'} fontSize="11" fontWeight="bold" textAnchor="middle">
                  {isLocked ? '🎯 PERFECT SNAP!' : `Current: k = ${currentK}`}
                </text>
              </g>
            </svg>
          </div>

          {/* Proximity Lock-Meter */}
          <div className="lock-meter-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 800 }}>
              <span style={{ color: '#a4b0be' }}>Holographic Lock-Meter:</span>
              <span style={{ color: isLocked ? '#4ade80' : '#fbbf24' }}>
                {isLocked ? '100% LOCKED' : `${proximityPct}% Alignment`}
              </span>
            </div>
            <div className="lock-meter-track">
              <div
                className={`lock-meter-fill ${isLocked ? 'locked' : ''}`}
                style={{ width: `${isLocked ? 100 : proximityPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Interactive Scale Handle & Action Controls */}
        <div className="station-controls-card">
          <div className="control-group">
            <span className="control-label">
              <span>Model Scale (k)</span>
              <strong style={{ color: '#ffc107' }}>k = {currentK}</strong>
            </span>
            <div className="slider-row">
              <button
                className="stepper-btn"
                onClick={() => setCurrentK((k) => Math.max(0.4, Number((k - 0.1).toFixed(1))))}
                disabled={isLocked}
                aria-label="Decrease model scale"
              >
                −
              </button>
              <input
                type="range"
                min="0.4"
                max="2.5"
                step="0.1"
                value={currentK}
                onChange={(e) => setCurrentK(parseFloat(e.target.value))}
                disabled={isLocked}
                aria-label="Model scale slider"
              />
              <button
                className="stepper-btn"
                onClick={() => setCurrentK((k) => Math.min(2.5, Number((k + 0.1).toFixed(1))))}
                disabled={isLocked}
                aria-label="Increase model scale"
              >
                +
              </button>
            </div>
          </div>

          <button
            className={`toggle-btn ${isFlipped ? 'active' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
            disabled={isLocked}
          >
            {isFlipped ? '↔️ Model Flipped (Active)' : '↔️ Flip Model Orientation'}
          </button>

          {/* Round Information Card */}
          <div style={{ background: 'rgba(10, 10, 35, 0.6)', padding: '8px 10px', borderRadius: '8px', fontSize: '0.76rem', lineHeight: 1.4 }}>
            <div style={{ color: '#fbbf24', fontWeight: 800, marginBottom: '2px' }}>Surveyor Target:</div>
            <div>Base: <strong>{currentRound.origBase} cm → {currentRound.targetBase} cm</strong></div>
            <div>Target Ratio: <strong>k = {currentRound.targetK}</strong></div>
            {currentRound.requireFlip && <div style={{ color: '#f43f5e', fontWeight: 700 }}>⚠️ Target is horizontally inverted!</div>}
          </div>

          {/* Round Completion / Next Button */}
          {isLocked ? (
            <div className="station-success-banner">
              <div className="success-text">
                <h4>Round Complete! 🌟</h4>
                <p>Model locked at k = {currentRound.targetK}</p>
              </div>
              {roundIdx < ROUNDS.length - 1 ? (
                <button className="btn btn-primary btn-sm" onClick={handleNextRound} style={{ padding: '6px 14px' }}>
                  Next Round →
                </button>
              ) : (
                <div style={{ color: '#86efac', fontWeight: 900, fontSize: '0.82rem' }}>All Rounds Matched! ✅</div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', fontSize: '0.74rem', color: '#94a3b8' }}>
              Slide until the hologram locks into the green target outline!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
