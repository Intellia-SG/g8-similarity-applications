// src/components/simulations/ZoomLensLab.jsx
// Station 1: Concept Discovery Lab (Pure Free-Play, No Questions) — TRD §10

import React, { useState, useEffect } from 'react';
import './Stations.css';

export default function ZoomLensLab({ onComplete }) {
  const [k, setK] = useState(1.5);
  const [isAdditive, setIsAdditive] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);

  // Original base triangle sides
  const origSides = [4, 6, 8]; // a, b, c

  // Exploration checklist flags
  const [flags, setFlags] = useState({
    triedEnlarge: false,
    triedReduce: false,
    triedOne: false,
    toggledAdditive: false,
    usedFlipRotate: false,
    playedMatch: false,
  });

  useEffect(() => {
    if (k > 1) setFlags((f) => ({ ...f, triedEnlarge: true }));
    if (k < 1) setFlags((f) => ({ ...f, triedReduce: true }));
    if (k === 1) setFlags((f) => ({ ...f, triedOne: true }));
  }, [k]);

  useEffect(() => {
    if (isAdditive) setFlags((f) => ({ ...f, toggledAdditive: true }));
  }, [isAdditive]);

  useEffect(() => {
    if (rotation !== 0 || isFlipped) setFlags((f) => ({ ...f, usedFlipRotate: true }));
  }, [rotation, isFlipped]);

  useEffect(() => {
    if (showMatchAnimation) setFlags((f) => ({ ...f, playedMatch: true }));
  }, [showMatchAnimation]);

  const allComplete = Object.values(flags).every(Boolean);

  useEffect(() => {
    if (allComplete && onComplete) {
      onComplete();
    }
  }, [allComplete, onComplete]);

  // Scaled sides calculation
  const scaledSides = isAdditive
    ? origSides.map((s) => s + (k - 1) * 4) // Additive growth: adds +d
    : origSides.map((s) => s * k); // Multiplicative scaling

  // Corresponding side ratios
  const ratios = scaledSides.map((s, idx) => Number((s / origSides[idx]).toFixed(2)));
  const ratiosAgree = ratios.every((r) => Math.abs(r - ratios[0]) < 0.01);

  // SVG dimensions & rendering
  const baseScale = 16;
  const copyScale = isAdditive ? baseScale * (1 + (k - 1) * 0.4) : baseScale * k;

  function stepK(delta) {
    setK((prev) => Math.max(0.25, Math.min(4.0, Number((prev + delta).toFixed(2)))));
  }

  function handleMatchClick() {
    setShowMatchAnimation(true);
    setTimeout(() => setShowMatchAnimation(false), 2400);
  }

  return (
    <div className="station-wrap">
      <div className="station-header">
        <div className="station-title-group">
          <h2>Station 1 · Zoom Lens Lab 🔬</h2>
          <p className="station-guide-text">
            Drag the scale factor slider, toggle additive growth, and observe how shapes transform in real time!
          </p>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left: Interactive Canvas */}
        <div className="station-canvas-card">
          <svg viewBox="0 0 520 280" width="100%" height="280">
            {/* Ground grid backdrop */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" rx="10" />

            {/* Triangle 1 (Original, static outline) */}
            <g transform="translate(60, 50)">
              <polygon
                points="0,140 120,140 40,30"
                fill="rgba(124, 92, 191, 0.25)"
                stroke="#7c5cbf"
                strokeWidth="2.5"
              />
              <text x="60" y="160" fill="#a4b0be" fontSize="12" textAnchor="middle">Original (k = 1)</text>
              <text x="60" y="135" fill="#ffe082" fontSize="12" fontWeight="bold" textAnchor="middle">
                Sides: 4, 6, 8
              </text>
            </g>

            {/* Triangle 2 (Dynamic scaled copy) */}
            <g
              transform={`translate(${showMatchAnimation ? 60 : 250}, ${showMatchAnimation ? 50 : 40}) rotate(${rotation}, 80, 80) ${isFlipped ? 'scale(-1, 1) translate(-160, 0)' : ''}`}
              style={{ transition: 'all 0.4s ease' }}
            >
              <polygon
                points={`0,${140 * (copyScale / baseScale)} ${120 * (copyScale / baseScale)},${140 * (copyScale / baseScale)} ${40 * (copyScale / baseScale)},${30 * (copyScale / baseScale)}`}
                fill={isAdditive ? 'rgba(239, 83, 80, 0.3)' : 'rgba(255, 193, 7, 0.25)'}
                stroke={isAdditive ? '#ef5350' : '#ffc107'}
                strokeWidth={showMatchAnimation ? '4' : '2.5'}
                strokeDasharray={showMatchAnimation ? '6 4' : 'none'}
              />
              <text
                x={(60 * copyScale) / baseScale}
                y={(165 * copyScale) / baseScale}
                fill={isAdditive ? '#ff8a80' : '#ffe082'}
                fontSize="13"
                fontWeight="bold"
                textAnchor="middle"
              >
                {isAdditive ? 'Warped (+d)' : `Scaled (k = ${k})`}
              </text>
            </g>
          </svg>

          {/* Live Ratio Tracker */}
          <div className="ratio-tracker-box">
            {scaledSides.map((s, i) => (
              <div key={i} className={`ratio-chip ${ratiosAgree ? 'match' : 'warped'}`}>
                Side {i + 1}: <strong>{s.toFixed(1)} cm</strong>
                <br />
                Ratio: <strong>{ratios[i]}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Controls & Discovery Guide */}
        <div className="station-controls-card">
          <div className="control-group">
            <span className="control-label">Scale Factor (k = {k})</span>
            <div className="slider-row">
              <button className="stepper-btn" onClick={() => stepK(-0.25)} aria-label="Decrease scale factor">−</button>
              <input
                type="range"
                min="0.25"
                max="4.0"
                step="0.25"
                value={k}
                onChange={(e) => setK(parseFloat(e.target.value))}
                aria-label="Scale factor slider"
              />
              <button className="stepper-btn" onClick={() => stepK(0.25)} aria-label="Increase scale factor">+</button>
            </div>
          </div>

          <button
            className={`toggle-btn ${isAdditive ? 'active' : ''}`}
            onClick={() => setIsAdditive(!isAdditive)}
          >
            {isAdditive ? '⚠️ Mode: Adding Difference (Warping Shape)' : '🔄 Grow by Adding Difference Instead'}
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="toggle-btn"
              style={{ flex: 1 }}
              onClick={() => setRotation((r) => (r + 90) % 360)}
            >
              🔄 Rotate 90°
            </button>
            <button
              className="toggle-btn"
              style={{ flex: 1 }}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              ↔️ Flip
            </button>
          </div>

          <button className="btn btn-outline btn-sm" onClick={handleMatchClick}>
            ✨ Show Matching Sides Animation
          </button>

          {/* Exploration checklist */}
          <div className="exploration-checklist">
            <span className="checklist-title">Discovery Goals:</span>
            <span className={`checklist-item ${flags.triedEnlarge ? 'done' : ''}`}>
              {flags.triedEnlarge ? '✓' : '○'} Enlarge shape (k &gt; 1)
            </span>
            <span className={`checklist-item ${flags.triedReduce ? 'done' : ''}`}>
              {flags.triedReduce ? '✓' : '○'} Reduce shape (k &lt; 1)
            </span>
            <span className={`checklist-item ${flags.triedOne ? 'done' : ''}`}>
              {flags.triedOne ? '✓' : '○'} Set congruent size (k = 1)
            </span>
            <span className={`checklist-item ${flags.toggledAdditive ? 'done' : ''}`}>
              {flags.toggledAdditive ? '✓' : '○'} Test additive growth (+d)
            </span>
            <span className={`checklist-item ${flags.usedFlipRotate ? 'done' : ''}`}>
              {flags.usedFlipRotate ? '✓' : '○'} Rotate or flip orientation
            </span>
            <span className={`checklist-item ${flags.playedMatch ? 'done' : ''}`}>
              {flags.playedMatch ? '✓' : '○'} Play matching sides overlay
            </span>
          </div>

          {allComplete && (
            <div className="station-success-banner">
              <div className="success-text">
                <h4>Lab Complete! 🧭</h4>
                <p>You observed why only multiplication preserves similarity!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
