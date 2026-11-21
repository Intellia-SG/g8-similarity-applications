// src/components/ProgressMap.jsx
// Header navigation bar and adjacent audio toggle

import React from 'react';
import './ProgressMap.css';

const PHASES = [
  { key: 'wonder',   num: '01', icon: '🔍', label: 'Wonder'   },
  { key: 'story',    num: '02', icon: '📖', label: 'Story'    },
  { key: 'simulate', num: '03', icon: '🧪', label: 'Simulate' },
  { key: 'play',     num: '04', icon: '🎮', label: 'Practice' },
  { key: 'reflect',  num: '05', icon: '📓', label: 'Reflect'  },
];

export default function ProgressMap({
  currentPhase,
  phaseComplete = {},
  audioEnabled = true,
  onToggleAudio,
  onSelectPhase,
}) {
  return (
    <nav className="progress-bar-nav" role="navigation" aria-label="Learning journey phases">
      <div className="progress-bar-pill">
        {PHASES.map((p, i) => {
          const isActive = p.key === currentPhase;
          const isDone = phaseComplete[p.key];

          return (
            <React.Fragment key={p.key}>
              <div
                className={`step-item ${isActive ? 'active' : ''}`}
                onClick={() => onSelectPhase && onSelectPhase(p.key)}
                role="button"
                tabIndex={0}
                aria-label={`Go to ${p.label} phase`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (onSelectPhase) onSelectPhase(p.key);
                  }
                }}
              >
                <span className={`step-circle ${isDone ? 'circle-done' : isActive ? 'circle-active' : 'circle-idle'}`}>
                  {isDone ? '✓' : p.num}
                </span>
                <span className="step-label">
                  {p.icon} {p.label}
                </span>
              </div>
              {i < PHASES.length - 1 && <span className="step-divider">—</span>}
            </React.Fragment>
          );
        })}
      </div>

      {/* Audio Button placed immediately to the right of the pill */}
      {onToggleAudio && (
        <button
          className="audio-btn"
          onClick={onToggleAudio}
          aria-label={audioEnabled ? 'Mute audio' : 'Unmute audio'}
          title={audioEnabled ? 'Mute audio' : 'Unmute audio'}
        >
          {audioEnabled ? '🔊' : '🔇'}
        </button>
      )}
    </nav>
  );
}
