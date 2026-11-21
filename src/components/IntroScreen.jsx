// src/components/IntroScreen.jsx
// Home screen matching Screenshot 1 and TRD §6 specs

import React from 'react';
import './IntroScreen.css';
import { generateSessionQuestions } from '../utils/shuffle.js';
import questionBank from '../data/questionBank.js';

const JOURNEY_PHASES = [
  { key: 'wonder',   icon: '🔍', label: 'Wonder',   desc: 'Shadow stick puzzle' },
  { key: 'story',    icon: '📖', label: 'Story',    desc: '4 survey adventures' },
  { key: 'simulate', icon: '🧪', label: 'Simulate', desc: '4 interactive labs' },
  { key: 'play',     icon: '🎮', label: 'Practice', desc: '10 worlds & bosses' },
  { key: 'reflect',  icon: '📓', label: 'Reflect',  desc: 'Review & scorecard' },
];

export default function IntroScreen({ dispatch }) {
  function handleBegin() {
    dispatch({ type: 'LOAD_QUESTIONS', payload: generateSessionQuestions(questionBank) });
    dispatch({ type: 'SET_PHASE', payload: 'wonder' });
  }

  function handlePhaseClick(phaseKey) {
    dispatch({ type: 'SET_PHASE', payload: phaseKey });
  }

  return (
    <div className="intro-wrap anim-slide-up">
      {/* Top Chip */}
      <div className="intro-top-chip">
        ✨ Curriculum · Similarity Applications Grade 8
      </div>

      {/* Main Title */}
      <h1 className="intro-title">
        <span className="text-orange">Similar</span> <span className="text-white">Quest</span>
      </h1>
      <h2 className="intro-subtitle">
        Measure the unmeasurable with similar shapes
      </h2>

      {/* Mascot Row */}
      <div className="intro-mascot-row">
        <div className="intro-mascot-avatar" title="Echo the Bat">🦇</div>
        <div className="intro-speech-bubble">
          Same shape, different size? Multiply every side by the same <strong>scale factor</strong> — never just add!
        </div>
      </div>

      {/* Journey Card (Single Line of 5 Phases) */}
      <div className="journey-card">
        <div className="journey-card-heading">
          YOUR LEARNING JOURNEY · CLICK ANY PHASE TO START
        </div>

        <div className="journey-steps-row">
          {JOURNEY_PHASES.map((p, idx) => (
            <React.Fragment key={p.key}>
              <div
                className="journey-step-item"
                onClick={() => handlePhaseClick(p.key)}
                role="button"
                tabIndex={0}
                title={`Open ${p.label} phase`}
              >
                <span className="journey-icon-circle">{p.icon}</span>
                <div className="journey-text-col">
                  <span className="journey-item-title">{p.label}</span>
                  <span className="journey-item-desc">{p.desc}</span>
                </div>
              </div>
              {idx < JOURNEY_PHASES.length - 1 && (
                <span className="journey-arrow">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <button className="intro-cta-main" onClick={handleBegin}>
        🚀 Begin Your Journey!
      </button>

      {/* Info Chips */}
      <div className="intro-chips-row">
        <span className="info-chip">🎯 100 Questions</span>
        <span className="info-chip">📐 Scale &amp; Shape</span>
        <span className="info-chip">✨ Badges &amp; XP</span>
      </div>
    </div>
  );
}
