// src/components/shared/FeedbackOverlay.jsx
// Animated feedback popup for correct/incorrect answers with auto-dismiss

import React from 'react';

export default function FeedbackOverlay({ status, message, onDismiss }) {
  if (!status) return null;

  const isCorrect = status === 'correct';

  return (
    <div className="feedback-overlay-backdrop" onClick={onDismiss}>
      <div
        className={`feedback-card glass-card anim-bounce-in ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}
        role="alert"
        aria-live="assertive"
      >
        <div className="feedback-icon-circle">
          <span className="feedback-emoji">{isCorrect ? '🎯' : '💡'}</span>
        </div>
        <h3 className="feedback-title">
          {isCorrect ? 'Brilliant Match!' : 'Not Quite!'}
        </h3>
        <p className="feedback-desc">
          {isCorrect
            ? 'Your scale calculation is spot on!'
            : message || 'Check the corresponding sides and try again!'}
        </p>
      </div>
    </div>
  );
}
