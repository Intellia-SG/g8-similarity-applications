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
      { text: 'Target shadow is 9 m (3 m longer). Added 3 m to pole: 4 + 3 = 7 m.', isFault: true },
      { text: 'Recorded tree height as 7 m.', isFault: false },
    ],
    faultIdx: 1,
    repairType: 'multiply_card',
    instruction: 'Tap the flawed step in the surveyor\'s notes, then drag the "× Multiplier" card over the "+ Addition" mistake to fix it!',
  },
  {
    round: 2,
    title: 'Round 2 · The Mismatch Trap',
    misconception: 'mismatch',
    steps: [
      { text: '△1 sides: 4, 6, 8. △2 sides: 6, 9, 12 (drawn flipped).', isFault: false },
      { text: 'Paired shortest side (4 cm) with longest side (12 cm).', isFault: true },
      { text: 'Calculated scale factor k = 12 ÷ 4 = 3.', isFault: false },
    ],
    faultIdx: 1,
    repairType: 'swap_labels',
    instruction: 'Tap the flawed step, then drag the label to pair the shortest side (4 cm) with the shortest side (6 cm)!',
  },
  {
    round: 3,
    title: 'Round 3 · The Inverse-k Trap',
    misconception: 'inverse-k',
    steps: [
      { text: 'Reducing a large 24 m tower blueprint to a small model with k = 4.', isFault: false },
      { text: 'Multiplied: 24 m × 4 = 96 m instead of dividing by 4.', isFault: true },
      { text: 'Reported model size as 96 m (larger than the real tower!).', isFault: false },
    ],
    faultIdx: 1,
    repairType: 'flip_arrow',
    instruction: 'Tap the flawed step, then drag the scale direction arrow so the model reduces rather than enlarges!',
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

  const allDone = completedRounds.every(Boolean);

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
        {/* Left: Surveyor's Logbook Steps */}
        <div className="station-canvas-card">
          <div style={{ width: '100%' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--gold)', marginBottom: '12px' }}>
              📋 Field Surveyor's Recorded Steps:
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentRound.steps.map((st, i) => {
                const isSelected = selectedStep === i;
                const isCorrectFault = faultFound && i === currentRound.faultIdx;

                return (
                  <div
                    key={i}
                    onClick={() => handleStepClick(i)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '10px',
                      background: isCorrectFault
                        ? 'rgba(239, 83, 80, 0.25)'
                        : isSelected
                        ? 'rgba(124, 92, 191, 0.3)'
                        : 'rgba(20, 20, 50, 0.6)',
                      border: isCorrectFault
                        ? '2px solid #ef5350'
                        : isSelected
                        ? '1.5px solid var(--purple-light)'
                        : '1px solid rgba(255, 255, 255, 0.12)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 'bold', color: 'var(--gold)', marginRight: '8px' }}>
                        Step {i + 1}:
                      </span>
                      <span style={{ color: '#ffffff', fontSize: '0.95rem' }}>{st.text}</span>
                    </div>
                    {isCorrectFault && (
                      <span style={{ color: '#ef5350', fontWeight: 'bold', fontSize: '0.88rem' }}>
                        ⚠️ Fault Detected!
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Visual preview of repaired shape */}
            {isRepaired && (
              <div
                style={{
                  marginTop: '18px',
                  padding: '14px',
                  background: 'rgba(6, 78, 59, 0.4)',
                  border: '1.5px solid #22c55e',
                  borderRadius: '10px',
                  textAlign: 'center',
                  animation: 'slideUp 0.3s ease',
                }}
              >
                <span style={{ color: '#86efac', fontWeight: 'bold', fontSize: '1rem' }}>
                  ✨ Calculation Repaired! Geometric similarity restored!
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Manipulation Repair Tool */}
        <div className="station-controls-card">
          <span className="control-label">Repair Workbench</span>

          {!faultFound ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Inspect the surveyor's log on the left. Tap the specific step that contains the mathematical fallacy!
            </p>
          ) : !isRepaired ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ color: '#fef08a', fontSize: '0.92rem' }}>
                Fault spotted! Now drag or tap the repair tool below to fix the flawed calculation:
              </p>

              {currentRound.repairType === 'multiply_card' && (
                <button
                  className="draggable-card"
                  onClick={handlePerformRepair}
                  style={{ alignSelf: 'flex-start', background: '#22c55e', borderColor: '#86efac' }}
                >
                  ✖️ Apply Multiplier (k = 9 ÷ 6 = 1.5; 4 × 1.5 = 6 m)
                </button>
              )}

              {currentRound.repairType === 'swap_labels' && (
                <button
                  className="draggable-card"
                  onClick={handlePerformRepair}
                  style={{ alignSelf: 'flex-start', background: '#3b82f6', borderColor: '#93c5fd' }}
                >
                  ↔️ Match Shortest (4 cm) with Shortest (6 cm) (k = 1.5)
                </button>
              )}

              {currentRound.repairType === 'flip_arrow' && (
                <button
                  className="draggable-card"
                  onClick={handlePerformRepair}
                  style={{ alignSelf: 'flex-start', background: '#f59e0b', borderColor: '#fde047' }}
                >
                  🔄 Invert Arrow: Divide by k (24 m ÷ 4 = 6 m)
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ color: '#86efac', fontWeight: 'bold' }}>
                Case {roundIdx + 1} successfully solved and repaired!
              </p>
              {roundIdx < REPLAY_ROUNDS.length - 1 && (
                <button className="btn btn-primary" onClick={handleNextRound}>
                  Next Case File →
                </button>
              )}
            </div>
          )}

          {allDone && (
            <div className="station-success-banner">
              <div className="success-text">
                <h4>Inspector Certification Complete! 🧾</h4>
                <p>You caught all three common survey misconceptions!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
