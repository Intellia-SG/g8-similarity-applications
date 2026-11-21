// src/components/simulations/ReplayReview.jsx
// Station 4: Error Detective (Scrub Replay, Tap Fault, Repair by Manipulation) — TRD §10

import React, { useState } from 'react';
import './Stations.css';

const REPLAY_ROUNDS = [
  {
    round: 1,
    title: 'Round 1 · The Additive Trap',
    misconception: 'additive',
    steps: [
      { text: 'Original survey pole 4 m, shadow 6 m.', isFault: false },
      { text: 'Target shadow is 9 m (3 m longer). Added 3 m to pole: 4 + 3 = 7 m.', isFault: true, fixedText: 'Target shadow is 9 m (scale k = 9 ÷ 6 = 1.5). Multiplied: 4 × 1.5 = 6 m!' },
      { text: 'Recorded tree height.', isFault: false },
    ],
    faultIdx: 1,
    repairLabel: '✖️ Stamp Multiplier (k = 1.5×)',
    instruction: 'Tap the flawed step in the logbook, then stamp the Multiplier tool to fix the additive error!',
  },
  {
    round: 2,
    title: 'Round 2 · The Mismatch Trap',
    misconception: 'mismatch',
    steps: [
      { text: '△1 sides: 4, 6, 8. △2 sides: 6, 9, 12 (drawn flipped).', isFault: false },
      { text: 'Paired shortest side (4 cm) with longest side (12 cm).', isFault: true, fixedText: 'Paired shortest side (4 cm) with shortest side (6 cm): k = 6 ÷ 4 = 1.5.' },
      { text: 'Calculated scale factor k.', isFault: false },
    ],
    faultIdx: 1,
    repairLabel: '↔️ Swap Corresponding Sides',
    instruction: 'Tap the flawed step, then click the Label Swapper to pair shortest side with shortest side!',
  },
  {
    round: 3,
    title: 'Round 3 · The Inverse-k Trap',
    misconception: 'inverse-k',
    steps: [
      { text: 'Reducing a large 24 m tower blueprint to a small model with k = 4.', isFault: false },
      { text: 'Multiplied: 24 m × 4 = 96 m instead of dividing by 4.', isFault: true, fixedText: 'Divided: 24 m ÷ 4 = 6 m (Reduction makes shapes smaller!).' },
      { text: 'Reported model size.', isFault: false },
    ],
    faultIdx: 1,
    repairLabel: '➗ Flip to Reduction Scale (÷ 4)',
    instruction: 'Tap the flawed step, then click the Scale Inverter so the model reduces rather than grows!',
  },
];

export default function ReplayReview({ onComplete }) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [selectedStep, setSelectedStep] = useState(null);
  const [faultFound, setFaultFound] = useState(false);
  const [isRepaired, setIsRepaired] = useState(false);
  const [completedRounds, setCompletedRounds] = useState([false, false, false]);

  const currentRound = REPLAY_ROUNDS[roundIdx];

  function handleStepClick(idx) {
    setSelectedStep(idx);
    if (idx === currentRound.faultIdx) {
      setFaultFound(true);
    }
  }

  function handlePerformRepair() {
    setIsRepaired(true);
    const updated = [...completedRounds];
    updated[roundIdx] = true;
    setCompletedRounds(updated);

    if (roundIdx === REPLAY_ROUNDS.length - 1 && onComplete) {
      onComplete();
    }
  }

  function handleNextRound() {
    if (roundIdx < REPLAY_ROUNDS.length - 1) {
      setRoundIdx(roundIdx + 1);
      setSelectedStep(null);
      setFaultFound(false);
      setIsRepaired(false);
    }
  }

  return (
    <div className="station-wrap">
      <div className="station-header">
        <div className="station-title-group">
          <h2>Station 4 · Replay Review 🕵️</h2>
          <p className="station-guide-text">{currentRound.title} — {currentRound.instruction}</p>
        </div>
        <div className="round-badge">
          Case {roundIdx + 1} of 3
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left: Surveyor's Logbook & Detective Canvas */}
        <div className="station-canvas-card">
          <div className="station-svg-container">
            <svg viewBox="0 0 520 230" preserveAspectRatio="xMidYMid meet">
              <defs>
                <pattern id="notebookLines" width="20" height="20" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="20" x2="520" y2="20" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                </pattern>
                <filter id="stampGlow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Logbook Page */}
              <rect x="20" y="10" width="480" height="210" rx="10" fill="#181534" stroke="rgba(167, 139, 250, 0.3)" strokeWidth="2" />
              <rect x="20" y="10" width="480" height="210" fill="url(#notebookLines)" rx="10" />

              {/* Spiral Binding Holes */}
              {[30, 60, 90, 120, 150, 180].map((y, i) => (
                <circle key={i} cx="35" cy={y} r="5" fill="#090d16" stroke="#475569" strokeWidth="1.5" />
              ))}

              {/* Header */}
              <text x="60" y="42" fill="#fbbf24" fontSize="13" fontWeight="900">
                📋 FIELD NOTEBOOK · CASE #{roundIdx + 1}
              </text>
              <line x1="60" y1="52" x2="480" y2="52" stroke="rgba(251, 191, 36, 0.4)" strokeWidth="1.5" />

              {/* Logbook Steps Display */}
              {currentRound.steps.map((st, i) => {
                const isSelected = selectedStep === i;
                const isThisFault = i === currentRound.faultIdx;
                const showRepaired = isThisFault && isRepaired;

                let strokeCol = 'transparent';
                let fillCol = 'rgba(255, 255, 255, 0.03)';
                if (showRepaired) {
                  strokeCol = '#22c55e';
                  fillCol = 'rgba(34, 197, 94, 0.15)';
                } else if (isSelected && isThisFault) {
                  strokeCol = '#ef4444';
                  fillCol = 'rgba(239, 68, 68, 0.15)';
                } else if (isSelected) {
                  strokeCol = '#38bdf8';
                }

                return (
                  <g key={i} transform={`translate(60, ${65 + i * 45})`}>
                    <rect x="0" y="0" width="420" height="38" rx="6" fill={fillCol} stroke={strokeCol} strokeWidth="1.5" />
                    <text x="10" y="24" fill={showRepaired ? '#86efac' : isSelected && isThisFault ? '#fca5a5' : '#e2e8f0'} fontSize="11" fontWeight="700">
                      Step {i + 1}: {showRepaired ? st.fixedText : st.text}
                    </text>
                    {showRepaired && (
                      <text x="405" y="24" fill="#22c55e" fontSize="14" fontWeight="900" textAnchor="end">✓</text>
                    )}
                  </g>
                );
              })}

              {/* Official Approved Stamp Overlay */}
              {isRepaired && (
                <g transform="translate(380, 150) rotate(-12)">
                  <rect x="-60" y="-18" width="120" height="36" rx="6" fill="rgba(34, 197, 94, 0.9)" stroke="#ffffff" strokeWidth="2" filter="url(#stampGlow)" />
                  <text x="0" y="6" fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle">
                    APPROVED 📐
                  </text>
                </g>
              )}
            </svg>
          </div>

          <div style={{ width: '100%', textAlign: 'center', fontSize: '0.74rem', color: faultFound ? '#fca5a5' : '#94a3b8' }}>
            {isRepaired
              ? '✨ Error corrected! Similarity rule successfully restored.'
              : faultFound
              ? '⚠️ Flawed step detected! Use the repair tool on the right.'
              : '👆 Click on the flawed step in the logbook above to inspect it.'}
          </div>
        </div>

        {/* Right: Interactive Detective Toolbox */}
        <div className="station-controls-card">
          <div className="replay-steps-list">
            <span className="control-label">Inspect Field Steps:</span>
            {currentRound.steps.map((st, i) => (
              <div
                key={i}
                className={`replay-step-item ${selectedStep === i ? 'selected' : ''} ${faultFound && i === currentRound.faultIdx && !isRepaired ? 'fault-highlight' : ''}`}
                onClick={() => handleStepClick(i)}
                role="button"
                tabIndex={0}
              >
                <span>{selectedStep === i ? '🔍' : '📝'}</span>
                <span>Step {i + 1}</span>
                {faultFound && i === currentRound.faultIdx && (
                  <span style={{ marginLeft: 'auto', color: '#f87171', fontWeight: 800, fontSize: '0.72rem' }}>
                    [FAULT]
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Repair Action */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span className="control-label">Surveyor Repair Tool:</span>
            <button
              className="repair-tool-btn"
              onClick={handlePerformRepair}
              disabled={!faultFound || isRepaired}
              style={{
                opacity: !faultFound || isRepaired ? 0.5 : 1,
                cursor: !faultFound || isRepaired ? 'not-allowed' : 'pointer',
              }}
            >
              {isRepaired ? '✅ Step Repaired!' : currentRound.repairLabel}
            </button>
          </div>

          {/* Round Complete Banner */}
          {isRepaired ? (
            <div className="station-success-banner">
              <div className="success-text">
                <h4>Case Solved! 🕵️</h4>
                <p>Mistake corrected with mathematical precision!</p>
              </div>
              {roundIdx < REPLAY_ROUNDS.length - 1 ? (
                <button className="btn btn-primary btn-sm" onClick={handleNextRound} style={{ padding: '6px 14px' }}>
                  Next Case →
                </button>
              ) : (
                <div style={{ color: '#86efac', fontWeight: 900, fontSize: '0.82rem' }}>All Cases Solved! ✅</div>
              )}
            </div>
          ) : (
            <div style={{ fontSize: '0.74rem', color: '#a4b0be', background: 'rgba(10, 10, 35, 0.6)', padding: '6px 8px', borderRadius: '6px' }}>
              💡 <em>{currentRound.instruction}</em>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
