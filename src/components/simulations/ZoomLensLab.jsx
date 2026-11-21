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
    ? origSides.map((s) => s + (k - 1) * 3) // Additive growth: adds +d
    : origSides.map((s) => s * k); // Multiplicative scaling

  // Corresponding side ratios
  const ratios = scaledSides.map((s, idx) => Number((s / origSides[idx]).toFixed(2)));
  const ratiosAgree = ratios.every((r) => Math.abs(r - ratios[0]) < 0.01);

  // Scaled triangle vertices
  const scaleMult = isAdditive ? 1 + (k - 1) * 0.45 : k;
  const p1 = [0, 90 * scaleMult];
  const p2 = [80 * scaleMult, 90 * scaleMult];
  const p3 = [25 * scaleMult, 15 * scaleMult];

  function stepK(delta) {
    setK((prev) => Math.max(0.5, Math.min(3.0, Number((prev + delta).toFixed(2)))));
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
            Adjust the scale factor, toggle additive growth, and observe how angles and ratios respond!
          </p>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left: Viewfinder Simulator Canvas */}
        <div className="station-canvas-card">
          <div className="station-svg-container">
            <svg viewBox="0 0 520 230" preserveAspectRatio="xMidYMid meet">
              <defs>
                <pattern id="lensGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                </pattern>
                {/* Viewfinder Vignette */}
                <radialGradient id="vignette" cx="50%" cy="50%" r="50%">
                  <stop offset="60%" stopColor="#100e2e" stopOpacity="0" />
                  <stop offset="100%" stopColor="#080718" stopOpacity="0.8" />
                </radialGradient>
              </defs>

              <rect width="100%" height="100%" fill="url(#lensGrid)" rx="10" />
              <rect width="100%" height="100%" fill="url(#vignette)" rx="10" />

              {/* Viewfinder Crosshair & Reticle */}
              <circle cx="260" cy="115" r="95" fill="none" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1.5" strokeDasharray="4 6" />
              <line x1="260" y1="10" x2="260" y2="25" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="2" />
              <line x1="260" y1="205" x2="260" y2="220" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="2" />
              <line x1="155" y1="115" x2="170" y2="115" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="2" />
              <line x1="350" y1="115" x2="365" y2="115" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="2" />

              {/* Center Focal Origin (for projection rays) */}
              <circle cx="30" cy="190" r="3" fill="#f59e0b" />
              <text x="30" y="206" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">Center O</text>

              {/* Projection Rays through vertices */}
              <line x1="30" y1="190" x2={showMatchAnimation ? 100 : 260 + p2[0]} y2={showMatchAnimation ? 160 : 35 + p2[1]} stroke="rgba(245, 158, 11, 0.2)" strokeWidth="1" strokeDasharray="4 3" />
              <line x1="30" y1="190" x2={showMatchAnimation ? 45 : 260 + p3[0]} y2={showMatchAnimation ? 85 : 35 + p3[1]} stroke="rgba(245, 158, 11, 0.2)" strokeWidth="1" strokeDasharray="4 3" />

              {/* Triangle 1 (Original, static reference) */}
              <g transform="translate(60, 70)">
                <polygon
                  points="0,90 80,90 25,15"
                  fill="rgba(124, 92, 191, 0.25)"
                  stroke="#7c5cbf"
                  strokeWidth="2.5"
                />
                {/* Angle Arc A */}
                <path d="M 0 74 A 16 16 0 0 1 12 76" fill="none" stroke="#a78bfa" strokeWidth="2" />
                <text x="40" y="106" fill="#a4b0be" fontSize="11" textAnchor="middle">Original (k = 1)</text>
                <text x="40" y="85" fill="#ffe082" fontSize="11" fontWeight="bold" textAnchor="middle">
                  4, 6, 8
                </text>
              </g>

              {/* Triangle 2 (Dynamic scaled copy) */}
              <g
                transform={`translate(${showMatchAnimation ? 60 : 260}, ${showMatchAnimation ? 70 : 35}) rotate(${rotation}, 50, 50) ${isFlipped ? 'scale(-1, 1) translate(-100, 0)' : ''}`}
                style={{ transition: 'all 0.35s ease' }}
              >
                <polygon
                  points={`${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}`}
                  fill={isAdditive ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.22)'}
                  stroke={isAdditive ? '#ef4444' : '#f59e0b'}
                  strokeWidth={showMatchAnimation ? '3.5' : '2.5'}
                  strokeDasharray={showMatchAnimation ? '5 3' : 'none'}
                />
                {/* Dynamic Angle Arc */}
                <path
                  d={`M ${p1[0]} ${p1[1] - 16} A 16 16 0 0 1 ${p1[0] + 12} ${p1[1] - 14}`}
                  fill="none"
                  stroke={isAdditive ? '#ef4444' : '#22c55e'}
                  strokeWidth="2"
                />
                <text
                  x={p2[0] / 2}
                  y={p1[1] + 16}
                  fill={isAdditive ? '#fca5a5' : '#fde68a'}
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {isAdditive ? 'Warped (+d)' : `Scaled (k = ${k})`}
                </text>
              </g>
            </svg>
          </div>

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
            <span className="control-label">
              <span>Scale Factor (k)</span>
              <strong style={{ color: '#ffc107' }}>k = {k}</strong>
            </span>
            <div className="slider-row">
              <button className="stepper-btn" onClick={() => stepK(-0.25)} aria-label="Decrease scale factor">−</button>
              <input
                type="range"
                min="0.5"
                max="3.0"
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
            {isAdditive ? '⚠️ Mode: Adding Difference (Warping Shape)' : '🔄 Test Additive Growth (+d)'}
          </button>

          <div style={{ display: 'flex', gap: '6px' }}>
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

          <button className="btn btn-outline btn-sm" onClick={handleMatchClick} style={{ padding: '6px 10px', fontSize: '0.8rem' }}>
            ✨ Overlay Match Animation
          </button>

          {/* Exploration checklist */}
          <div className="exploration-checklist">
            <span className="checklist-title">Discovery Checklist:</span>
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
              {flags.playedMatch ? '✓' : '○'} Play overlay alignment
            </span>
          </div>

          {allComplete && (
            <div className="station-success-banner">
              <div className="success-text">
                <h4>Lab Complete! 🧭</h4>
                <p>Only multiplication preserves similarity!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
