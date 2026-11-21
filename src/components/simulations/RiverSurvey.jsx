// src/components/simulations/RiverSurvey.jsx
// Station 3: Multi-Step Composite Construction (4 Chained Steps, 2 Rounds) — TRD §10

import React, { useState } from 'react';
import './Stations.css';

const SCENARIOS = [
  {
    id: 1,
    title: 'Round 1 · The Wild River Survey 🌊',
    baseline1: 4,
    baseline2: 10,
    targetWidth: 15,
    nearWidth: 6,
    k: 2.5,
  },
  {
    id: 2,
    title: 'Round 2 · The Shadow Cliff Gorge 🏔️',
    baseline1: 3,
    baseline2: 12,
    targetWidth: 20,
    nearWidth: 5,
    k: 4.0,
  },
];

export default function RiverSurvey({ onComplete }) {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [stakePlaced, setStakePlaced] = useState(false);
  const [tapeScrubbed, setTapeScrubbed] = useState(false);
  const [theodoliteLocked, setTheodoliteLocked] = useState(false);
  const [dialK, setDialK] = useState(1.0);
  const [completedRounds, setCompletedRounds] = useState([false, false]);

  const sc = SCENARIOS[scenarioIdx];

  function handlePlaceStakes() {
    setStakePlaced(true);
    setCurrentStep(2);
  }

  function handleScrubTape() {
    setTapeScrubbed(true);
    setCurrentStep(3);
  }

  function handleTheodoliteLock() {
    setTheodoliteLocked(true);
    setCurrentStep(4);
  }

  function handleDialChange(val) {
    setDialK(val);
    if (Math.abs(val - sc.k) <= 0.1) {
      const updated = [...completedRounds];
      updated[scenarioIdx] = true;
      setCompletedRounds(updated);

      if (scenarioIdx === SCENARIOS.length - 1 && onComplete) {
        onComplete();
      }
    }
  }

  function handleNextScenario() {
    if (scenarioIdx < SCENARIOS.length - 1) {
      setScenarioIdx(scenarioIdx + 1);
      setCurrentStep(1);
      setStakePlaced(false);
      setTapeScrubbed(false);
      setTheodoliteLocked(false);
      setDialK(1.0);
    }
  }

  const isRiverCrossed = Math.abs(dialK - sc.k) <= 0.1;

  return (
    <div className="station-wrap">
      <div className="station-header">
        <div className="station-title-group">
          <h2>Station 3 · River Survey 🧭</h2>
          <p className="station-guide-text">{sc.title} — Step {currentStep} of 4</p>
        </div>
        <div className="round-badge">
          Round {scenarioIdx + 1} of 2
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left: River Field Canvas */}
        <div className="station-canvas-card">
          <div className="station-svg-container">
            <svg viewBox="0 0 520 230" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="riverFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="50%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#0369a1" />
                </linearGradient>
                <filter id="laserBeam">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Far River Bank */}
              <rect x="0" y="0" width="520" height="60" fill="#064e3b" />
              <line x1="0" y1="60" x2="520" y2="60" stroke="#10b981" strokeWidth="2" />

              {/* Point D (Target across the river) */}
              <g transform="translate(380, 25)">
                <circle cx="0" cy="0" r="10" fill="#ef4444" filter="url(#laserBeam)" />
                <rect x="14" y="-12" width="60" height="22" rx="4" fill="rgba(15,23,42,0.85)" stroke="#ef4444" strokeWidth="1" />
                <text x="44" y="3" fill="#fca5a5" fontSize="10" fontWeight="bold" textAnchor="middle">Target D</text>
              </g>

              {/* Rushing River Waters */}
              <rect x="0" y="60" width="520" height="70" fill="url(#riverFlow)" opacity="0.85" />
              <path d="M 0 75 Q 130 85 260 75 T 520 75" fill="none" stroke="#bae6fd" strokeWidth="2" opacity="0.6" />
              <path d="M 0 100 Q 130 110 260 100 T 520 100" fill="none" stroke="#e0f2fe" strokeWidth="2.5" opacity="0.8" />
              <path d="M 0 120 Q 130 130 260 120 T 520 120" fill="none" stroke="#bae6fd" strokeWidth="2" opacity="0.6" />
              <text x="35" y="100" fill="#e0f2fe" fontSize="12" fontWeight="800" opacity="0.8">🌊 RIVER</text>

              {/* Near Bank */}
              <rect x="0" y="130" width="520" height="100" fill="#0f172a" />
              <line x1="0" y1="130" x2="520" y2="130" stroke="#38bdf8" strokeWidth="2" />

              {/* Triangulation Sightlines */}
              {stakePlaced && (
                <>
                  {/* Sightline D - E - B */}
                  <line x1="380" y1="25" x2="160" y2="195" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="5 3" filter="url(#laserBeam)" />
                  {/* Direct distance D - C */}
                  <line x1="380" y1="25" x2="380" y2="130" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="5 3" filter="url(#laserBeam)" />
                  {/* Baseline C - E - A */}
                  <line x1="380" y1="130" x2="160" y2="130" stroke="#f59e0b" strokeWidth="3" />
                  {/* Perpendicular offset A - B */}
                  <line x1="160" y1="130" x2="160" y2="195" stroke="#a855f7" strokeWidth="2.5" />
                </>
              )}

              {/* Survey Stakes on Near Bank */}
              {stakePlaced && (
                <>
                  {/* Stake C */}
                  <circle cx="380" cy="130" r="6" fill="#38bdf8" />
                  <text x="380" y="148" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">Stake C</text>

                  {/* Pivot Stake E */}
                  <circle cx="270" cy="130" r="7" fill="#f59e0b" filter="url(#laserBeam)" />
                  <text x="270" y="148" fill="#fef08a" fontSize="10" fontWeight="bold" textAnchor="middle">Pivot E</text>

                  {/* Stake A */}
                  <circle cx="160" cy="130" r="6" fill="#38bdf8" />
                  <text x="160" y="122" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">Stake A</text>

                  {/* Offset Stake B */}
                  <circle cx="160" cy="195" r="7" fill="#a855f7" filter="url(#laserBeam)" />
                  <text x="160" y="212" fill="#d8b4fe" fontSize="10" fontWeight="bold" textAnchor="middle">Stake B ({sc.nearWidth} m)</text>
                </>
              )}

              {/* Laser Tape Measure Readouts */}
              {tapeScrubbed && (
                <>
                  <rect x="290" y="112" width="75" height="18" rx="4" fill="rgba(15,23,42,0.9)" stroke="#f59e0b" strokeWidth="1" />
                  <text x="327" y="125" fill="#fbbf24" fontSize="9" fontWeight="bold" textAnchor="middle">CE = {sc.baseline2} m</text>
                  <rect x="180" y="112" width="70" height="18" rx="4" fill="rgba(15,23,42,0.9)" stroke="#f59e0b" strokeWidth="1" />
                  <text x="215" y="125" fill="#fbbf24" fontSize="9" fontWeight="bold" textAnchor="middle">EA = {sc.baseline1} m</text>
                </>
              )}

              {/* Theodolite Arc at Pivot E */}
              {theodoliteLocked && (
                <path d="M 285 130 A 15 15 0 0 0 260 118" fill="none" stroke="#22c55e" strokeWidth="2.5" />
              )}

              {/* Live River Width Readout */}
              <g transform="translate(390, 80)">
                <rect x="0" y="0" width="120" height="30" rx="6" fill="rgba(15, 23, 42, 0.9)" stroke={isRiverCrossed ? '#22c55e' : '#f59e0b'} strokeWidth="1.5" />
                <text x="60" y="19" fill={isRiverCrossed ? '#4ade80' : '#fbbf24'} fontSize="11" fontWeight="bold" textAnchor="middle">
                  Width: {(sc.nearWidth * dialK).toFixed(1)} m
                </text>
              </g>
            </svg>
          </div>

          {/* Triangulation Ratio Chip */}
          <div style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.74rem', display: 'flex', justifyContent: 'space-around' }}>
            <span>Baseline Ratio: <strong>{sc.baseline2} m ÷ {sc.baseline1} m = {sc.k}×</strong></span>
            <span>Near Offset: <strong>{sc.nearWidth} m</strong></span>
            <span style={{ color: isRiverCrossed ? '#4ade80' : '#f59e0b' }}>
              Target Width: <strong>{sc.targetWidth} m</strong>
            </span>
          </div>
        </div>

        {/* Right: 4-Step Interactive Activity Guide */}
        <div className="station-controls-card">
          <div className="river-steps-box">
            {/* Step 1 */}
            <div className={`river-step-card ${currentStep === 1 ? 'active' : ''} ${stakePlaced ? 'done' : ''}`}>
              <div>
                <strong>Step 1: Sight Target & Place Stakes</strong>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Align stakes A, E, C along riverbank.</div>
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={handlePlaceStakes}
                disabled={stakePlaced}
                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
              >
                {stakePlaced ? '✓ Done' : 'Plant Stakes'}
              </button>
            </div>

            {/* Step 2 */}
            <div className={`river-step-card ${currentStep === 2 ? 'active' : ''} ${tapeScrubbed ? 'done' : ''}`}>
              <div>
                <strong>Step 2: Measure Baselines</strong>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Measure CE ({sc.baseline2} m) & EA ({sc.baseline1} m).</div>
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={handleScrubTape}
                disabled={!stakePlaced || tapeScrubbed}
                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
              >
                {tapeScrubbed ? '✓ Done' : 'Laser Tape'}
              </button>
            </div>

            {/* Step 3 */}
            <div className={`river-step-card ${currentStep === 3 ? 'active' : ''} ${theodoliteLocked ? 'done' : ''}`}>
              <div>
                <strong>Step 3: Theodolite Lock</strong>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Verify vertical angles at pivot E.</div>
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={handleTheodoliteLock}
                disabled={!tapeScrubbed || theodoliteLocked}
                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
              >
                {theodoliteLocked ? '✓ Done' : 'Lock Angle'}
              </button>
            </div>

            {/* Step 4: Multiplier Slider */}
            <div className={`river-step-card ${currentStep === 4 ? 'active' : ''} ${isRiverCrossed ? 'done' : ''}`}>
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <strong>Step 4: Scale Dial (k = {dialK})</strong>
                  <span style={{ color: isRiverCrossed ? '#4ade80' : '#f59e0b', fontWeight: 800 }}>
                    {isRiverCrossed ? 'MATCHED!' : `Target: ${sc.k}×`}
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="5.0"
                  step="0.1"
                  value={dialK}
                  onChange={(e) => handleDialChange(parseFloat(e.target.value))}
                  disabled={!theodoliteLocked || isRiverCrossed}
                  style={{ width: '100%', accentColor: '#ffc107', height: '6px' }}
                />
              </div>
            </div>
          </div>

          {isRiverCrossed ? (
            <div className="station-success-banner">
              <div className="success-text">
                <h4>River Width Calculated! 🌊</h4>
                <p>Width = {sc.nearWidth} m × {sc.k} = {sc.targetWidth} m</p>
              </div>
              {scenarioIdx < SCENARIOS.length - 1 ? (
                <button className="btn btn-primary btn-sm" onClick={handleNextScenario} style={{ padding: '6px 14px' }}>
                  Next Round →
                </button>
              ) : (
                <div style={{ color: '#86efac', fontWeight: 900, fontSize: '0.82rem' }}>Survey Completed! ✅</div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', fontSize: '0.74rem', color: '#94a3b8' }}>
              Complete the 4 steps to triangulate the river width from dry land!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
