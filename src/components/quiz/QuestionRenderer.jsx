// src/components/quiz/QuestionRenderer.jsx
// Question renderer with live SimilarVisual rendering, 2x2 options, and hints

import React from 'react';
import './QuestionRenderer.css';
import SimilarVisual from '../shared/SimilarVisual.jsx';

export default function QuestionRenderer({
  question,
  onAnswer,
  hintsShown = 0,
  showHint = 0,
  onHint,
  isLocked = false,
  onPrev,
  onNext,
  canPrev = false,
}) {
  if (!question) return null;

  const { category, questionText, options = [], visual, visualData, hint1, hint2 } = question;

  return (
    <div className="qr-wrap glass-card anim-slide-up">
      {/* Top category badge */}
      <div className="qr-category-badge">
        <span>📐</span> {category || 'SIMILARITY QUEST'}
      </div>

      {/* Question Text */}
      <p className="qr-question">{questionText}</p>

      {/* Geometric Visual Aid */}
      {visual && visualData && (
        <div className="qr-visual-container">
          <SimilarVisual type={visual} data={visualData} compact={false} />
        </div>
      )}

      {/* Options — 2x2 Grid */}
      <div className="options-grid">
        {options.map((opt, i) => (
          <button
            key={i}
            className="option-btn"
            onClick={() => !isLocked && onAnswer(opt)}
            disabled={isLocked}
            aria-label={`Option: ${opt}`}
          >
            <span>{opt}</span>
          </button>
        ))}
      </div>

      {/* Hint 1 */}
      {showHint >= 1 && hint1 && (
        <div className="qr-hint-box anim-slide-up">
          <span>💡</span>
          <span>{hint1}</span>
        </div>
      )}

      {/* Hint 2 */}
      {showHint >= 2 && hint2 && (
        <div className="qr-hint-box anim-slide-up">
          <span>🔑</span>
          <span>{hint2}</span>
        </div>
      )}

      {/* Action Row */}
      <div className="qr-actions-row">
        {hintsShown < 2 && onHint ? (
          <button className="btn btn-outline btn-sm" onClick={onHint} aria-label="Show hint">
            💡 Hint {hintsShown + 1}
          </button>
        ) : (
          <div />
        )}

        <div className="qr-nav-btns">
          {onPrev && (
            <button
              className="btn btn-outline btn-sm"
              onClick={onPrev}
              disabled={!canPrev}
              aria-label="Previous question"
            >
              ← Prev
            </button>
          )}
          {onNext && (
            <button className="btn btn-primary btn-sm" onClick={onNext} aria-label="Next question">
              Next Question →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
