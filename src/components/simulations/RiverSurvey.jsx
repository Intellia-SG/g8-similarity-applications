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
    title: 'Round 2 · The Shadow Cliff Job 🏔️',
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
  const [ratioMatched, setRatioMatched] = useState(false);
  const [dialK, setDialK] = useState(1.0);
  const [completedRounds, setCompletedRounds] = useState([false, false]);

  const sc = SCENARIOS[scenarioIdx];

  function handlePlaceStakes() {
    setStakePlaced(true);
    setTimeout(() => setCurrentStep(2), 600);
  }

  function handleScrubTape() {
    setTapeScrubbed(true);
    setTimeout(() => setCurrentStep(3), 600);
  }

  function handleMatchRatio() {
    setRatioMatched(true);
    setTimeout(() => setCurrentStep(4), 600);
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
      setRatioMatched(false);
      setDialK(1.0);
    }
  }

  const isRiverCrossed = Math.abs(dialK - sc.k) <= 0.1;
  const allDone = completedRounds.every(Boolean);

  return (
    <div className="station-wrap">
      <div className="station-header">
        <div className="station-title-group">
          <h2>Station 3 · River Survey 🧭</h2>
          <p className="station-guide-text">{sc.title} — Step {currentStep} of 4</p>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left: River Survey Field Visual */}
        <div className="station-canvas-card">
          <svg viewBox="0 0 520 280" width="100%" height="280">
            {/* River water band in middle */}
            <rect x="0" y="70" width="520" height="90" fill="rgba(14, 116, 144, 0.4)" />
            <path d="M 0 85 Q 130 95 260 85 T 520 85" fill="none" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="2" />
            <path d="M 0 135 Q 130 145 260 135 T 520 135" fill="none" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="2" />

            <text x="30" y="115" fill="rgba(56, 189, 248, 0.7)" fontSize="14" fontWeight="800">🌊 River</text>

            {/* Far bank target tree */}
            <g transform="translate(340, 25)">
              <circle cx="0" cy="0" r="14" fill="#22c55e" />
              <rect x="-3" y="10" width="6" height="15" fill="#78350f" />
              <text x="0" y="-18" fill="#a7f3d0" fontSize="12" fontWeight="bold" textAnchor="middle">Far Bank Marker</text>
            </g>

            {/* Near bank survey triangle */}
            <g transform="translate(100, 180)">
              {/* Baseline 1 */}
              <line x1="0" y1="50" x2="120" y2="50" stroke="#f59e0b" strokeWidth="3" />
              {stakePlaced && (
                <>
                  <circle cx="0" cy="50" r="5" fill="#ef4343" />
                  <circle cx="120" cy="50" r="5" fill="#ef4343" />
                  {/* AA angle arc */}
                  <path d="M 15 50 A 15 15 0 0 0 10 38" fill="none" stroke="#00e676" strokeWidth="2.5" />
                  <text x="22" y="44" fill="#00e676" fontSize="11" fontWeight="bold">AA</text>
                </>
              )}
              {tapeScrubbed && (
                <text x="60" y="70" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">
                  Baseline = {sc.baseline1} m
                </text>
              )}
            </g>

            {/* Triangle expanding across river */}
            {currentStep >= 4 && (
              <g transform="translate(100, 180)">
                <line
                  x1="0"
                  y1="50"
                  x2="240"
                  y2={50 - 140 * (dialK / sc.k)}
                  stroke="#ffc107"
                  strokeWidth="3"
                  strokeDasharray={isRiverCrossed ? 'none' : '6 4'}
                />
                <circle cx="240" cy={50 - 140 * (dialK / sc.k)} r="6" fill="#ffc107" />
              </g>
            )}

            {isRiverCrossed && (
              <g transform="translate(260, 130)">
                <rect x="-80" y="-20" width="160" height="40" fill="rgba(6, 78, 59, 0.9)" stroke="#00e676" strokeWidth="2" rx="8" />
                <text x="0" y="5" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">
                  River Width = {sc.targetWidth} m! 🎯
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Right: Step-by-Step Actions */}
        <div className="station-controls-card">
          {/* Step 1 */}
          <div className={`control-group ${currentStep === 1 ? '' : 'opacity-60'}`}>
            <span className="control-label">Step 1: Place Survey Stakes</span>
            <button
              className="btn btn-outline btn-sm"
              onClick={handlePlaceStakes}
              disabled={stakePlaced}
            >
              {stakePlaced ? 'Stakes Placed & AA Angles Matched ✓' : '📍 Place Two Survey Stakes'}
            </button>
          </div>

          {/* Step 2 */}
          <div className={`control-group ${currentStep === 2 ? '' : 'opacity-60'}`}>
            <span className="control-label">Step 2: Stretch Measuring Tape</span>
            <button
              className="btn btn-outline btn-sm"
              onClick={handleScrubTape}
              disabled={!stakePlaced || tapeScrubbed}
            >
              {tapeScrubbed ? `Tape Stretched: ${sc.baseline1} m and ${sc.baseline2} m ✓` : '📏 Scrub Measuring Tape'}
            </button>
          </div>

          {/* Step 3 */}
          <div className={`control-group ${currentStep === 3 ? '' : 'opacity-60'}`}>
            <span className="control-label">Step 3: Pair Corresponding Sides</span>
            <button
              className="btn btn-outline btn-sm"
              onClick={handleMatchRatio}
              disabled={!tapeScrubbed || ratioMatched}
            >
              {ratioMatched ? `Ratio Formed: ${sc.baseline2} ÷ ${sc.baseline1} = ${sc.k} ✓` : '📐 Snap Matching Sides into Frame'}
            </button>
          </div>

          {/* Step 4 */}
          <div className={`control-group ${currentStep === 4 ? '' : 'opacity-60'}`}>
            <span className="control-label">Step 4: Scale Across River (k = {dialK.toFixed(1)})</span>
            <div className="slider-row">
              <input
                type="range"
                min="1.0"
                max={sc.k + 0.5}
                step="0.1"
                value={dialK}
                disabled={!ratioMatched}
                onChange={(e) => handleDialChange(parseFloat(e.target.value))}
                aria-label="Scale across river dial"
              />
            </div>
            {isRiverCrossed && scenarioIdx < SCENARIOS.length - 1 && (
              <button className="btn btn-primary" onClick={handleNextScenario}>
                Next Survey Scenario →
              </button>
            )}
          </div>

          {allDone && (
            <div className="station-success-banner">
              <div className="success-text">
                <h4>River Survey Certified! 🌊</h4>
                <p>Both scenarios surveyed with indirect measurement!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
