// src/components/phases/ReflectPhase.jsx
// Stepped 3-screen Reflect Phase (Quick check, Think it over, Scorecard) — PRD §8.5, TRD §8

import React, { useState, useEffect } from 'react';
import './ReflectPhase.css';
import { BADGES } from '../../utils/badgeEngine.js';
import { useAudio } from '../../hooks/useAudio.js';
import { reflectNarration, reflectCompleteNarration } from '../../utils/narration.js';
import { generateQuestionBank } from '../../data/questionBank.js';

export default function ReflectPhase({ state, dispatch }) {
  const [step, setStep] = useState(1); // 1 = Quick Check, 2 = Think It Over, 3 = Scorecard
  const [subPrompt, setSubPrompt] = useState(1); // 1, 2, 3 for Step 1
  const [answers, setAnswers] = useState({ p1: null, p2: null, p3: null });
  const [journalText, setJournalText] = useState('');
  const [showBadges, setShowBadges] = useState(false);

  const { narrate, stopAll, sounds } = useAudio(state?.audioEnabled ?? true);

  useEffect(() => {
    narrate(reflectNarration());
    dispatch({ type: 'COMPLETE_PHASE', payload: 'reflect' });
    return () => stopAll();
  }, [dispatch, narrate, stopAll]);

  const totalCorrect = state?.districtCorrect?.reduce((s, c) => s + (c || 0), 0) || 0;
  const totalStars = state?.totalStars || 0;
  const earnedBadges = BADGES.filter((b) => state?.badges?.includes(b.id));

  const quickChips = [
    'angles are equal',
    'sides in the same ratio',
    'multiply, don\'t add',
    'match the corresponding sides',
  ];

  function handleInsertChip(chip) {
    sounds.click();
    setJournalText((prev) => (prev ? `${prev}, ${chip}` : chip));
  }

  function handleSubPromptAnswer(key, val) {
    sounds.click();
    setAnswers((prev) => ({ ...prev, [key]: val }));
    if (subPrompt < 3) {
      setTimeout(() => setSubPrompt(subPrompt + 1), 400);
    } else {
      setTimeout(() => setStep(2), 500);
    }
  }

  function handleFinishReflect() {
    stopAll();
    sounds.badge();
    narrate(reflectCompleteNarration());
    setStep(3);
  }

  function handlePlayAgain() {
    dispatch({ type: 'RESET_SESSION' });
    dispatch({ type: 'LOAD_QUESTIONS', payload: generateQuestionBank() });
    dispatch({ type: 'SET_PHASE', payload: 'intro' });
  }

  function handleGoHome() {
    dispatch({ type: 'SET_PHASE', payload: 'intro' });
  }

  return (
    <div className="reflect-wrap anim-slide-up">
      <div className="reflect-card glass-card">
        {/* Step Indicator */}
        <div className="reflect-step-indicator">
          <span style={{ fontWeight: 'bold', color: 'var(--gold)', fontSize: '0.95rem' }}>
            📓 Step {step} of 3
          </span>
          <div className="reflect-dots">
            <span className={`reflect-dot ${step === 1 ? 'active' : ''}`} />
            <span className={`reflect-dot ${step === 2 ? 'active' : ''}`} />
            <span className={`reflect-dot ${step === 3 ? 'active' : ''}`} />
          </div>
        </div>

        {/* ── STEP 1: Quick Check (3 Direct Prompts) ── */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h2 className="reflect-title">Quick Check ({subPrompt}/3)</h2>

            {subPrompt === 1 && (
              <div className="reflect-prompt-box">
                <p style={{ fontWeight: 'bold', color: '#ffffff', fontSize: '1.05rem' }}>
                  1. A rectangle grew from 6 cm × 8 cm to 9 cm × 11 cm (+3 cm to both sides).
                  Which reason shows why it is NOT similar?
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                  <button
                    className={`btn ${answers.p1 === 'correct' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleSubPromptAnswer('p1', 'correct')}
                  >
                    ✖️ Ratios are not equal: 9 ÷ 6 = 1.5, but 11 ÷ 8 = 1.375
                  </button>
                  <button
                    className={`btn ${answers.p1 === 'wrong' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleSubPromptAnswer('p1', 'wrong')}
                  >
                    ➕ Each side grew by the same amount (+3 cm)
                  </button>
                </div>
              </div>
            )}

            {subPrompt === 2 && (
              <div className="reflect-prompt-box">
                <p style={{ fontWeight: 'bold', color: '#ffffff', fontSize: '1.05rem' }}>
                  2. △1 has sides 4 cm, 6 cm, 8 cm. △2 is similar with sides 6 cm, 9 cm, 12 cm (drawn flipped).
                  Which side of △2 corresponds to the 6 cm (middle) side of △1?
                </p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  {['6 cm', '9 cm', '12 cm'].map((sideOpt) => (
                    <button
                      key={sideOpt}
                      className={`btn ${answers.p2 === sideOpt ? 'btn-primary' : 'btn-outline'}`}
                      style={{ flex: 1 }}
                      onClick={() => handleSubPromptAnswer('p2', sideOpt)}
                    >
                      {sideOpt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {subPrompt === 3 && (
              <div className="reflect-prompt-box">
                <p style={{ fontWeight: 'bold', color: '#ffffff', fontSize: '1.05rem' }}>
                  3. A large 24 m building is reduced to a scale model with scale factor k = 4.
                  Which operation calculates the model height?
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                  <button
                    className={`btn ${answers.p3 === 'correct' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleSubPromptAnswer('p3', 'correct')}
                  >
                    ÷ k (Reduction: 24 m ÷ 4 = 6 m)
                  </button>
                  <button
                    className={`btn ${answers.p3 === 'wrong' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleSubPromptAnswer('p3', 'wrong')}
                  >
                    × k (Enlargement: 24 m × 4 = 96 m)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: Think It Over ── */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h2 className="reflect-title">Think It Over 💭</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.5 }}>
              "Before you use a scale factor, what is the first thing you check, and why does adding the same length to every side not keep a shape the same?"
            </p>

            <div className="chips-tray">
              {quickChips.map((chip, i) => (
                <button
                  key={i}
                  className="quick-chip-btn"
                  onClick={() => handleInsertChip(chip)}
                  type="button"
                >
                  + {chip}
                </button>
              ))}
            </div>

            <textarea
              className="reflect-textarea"
              placeholder="Write your survey reflection here or tap the chips above..."
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              aria-label="Reflection response"
            />

            <div className="reflect-bottom-bar">
              <button className="btn btn-outline btn-sm" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button className="btn btn-primary" onClick={handleFinishReflect}>
                View Survey Scorecard →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Scorecard ── */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'center' }}>
            <span style={{ fontSize: '3rem' }}>🏆</span>
            <h2 className="reflect-title" style={{ color: '#86efac' }}>
              Survey Expedition Complete!
            </h2>
            <p style={{ color: '#d1fae5', fontSize: '1.05rem' }}>
              Master of Scale &amp; Similarity Applications Certified ✅
            </p>

            {/* Stat Tiles */}
            <div className="trophy-stats-grid">
              <div className="trophy-stat-tile">
                <span className="stat-tile-val">{totalCorrect}</span>
                <span className="stat-tile-label">/ 100 Correct</span>
              </div>
              <div className="trophy-stat-tile">
                <span className="stat-tile-val">{state?.xp || 0}</span>
                <span className="stat-tile-label">Total XP</span>
              </div>
              <div className="trophy-stat-tile">
                <span className="stat-tile-val">{state?.maxStreak || 0}</span>
                <span className="stat-tile-label">Best Streak ⚡</span>
              </div>
            </div>

            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#feca57' }}>
              ⭐ {totalStars} / 30 Stars Earned
            </div>

            {/* Badges Disclosure */}
            <div className="badges-disclosure">
              <button
                className="btn btn-outline btn-sm"
                style={{ width: '100%' }}
                onClick={() => setShowBadges(!showBadges)}
              >
                🏅 Badges Unlocked ({earnedBadges.length} / {BADGES.length}) {showBadges ? '▲' : '▼'}
              </button>

              {showBadges && (
                <div className="badges-grid anim-slide-up">
                  {BADGES.map((b) => {
                    const isEarned = state?.badges?.includes(b.id);
                    return (
                      <div
                        key={b.id}
                        className="badge-item"
                        style={{ opacity: isEarned ? 1 : 0.4 }}
                      >
                        <span className="badge-item-icon">{isEarned ? b.icon : '🔒'}</span>
                        <span className="badge-item-name">{b.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '12px' }}>
              <button className="btn btn-primary" onClick={handlePlayAgain}>
                Play Again 🔄
              </button>
              <button className="btn btn-outline" onClick={handleGoHome}>
                Home 🏠
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
