// src/components/phases/StoryPhase.jsx
// 4-panel survey story for SimilarQuest matching the reference UI design

import React, { useEffect } from 'react';
import './StoryPhase.css';
import { STORY_PANELS } from '../../data/storyContent.js';
import { useAudio } from '../../hooks/useAudio.js';
import { storyNarration } from '../../utils/narration.js';

export default function StoryPhase({ state, dispatch }) {
  const panelIdx = state?.storyPanel || 0;
  const panel = STORY_PANELS[panelIdx] || STORY_PANELS[0];
  const { narrate, stopAll } = useAudio(state?.audioEnabled ?? true);
  const totalPanels = STORY_PANELS.length;
  const isLast = panelIdx >= totalPanels - 1;

  useEffect(() => {
    stopAll();
    const timer = setTimeout(() => {
      narrate(storyNarration(panelIdx));
    }, 350);
    return () => {
      clearTimeout(timer);
      stopAll();
    };
  }, [panelIdx, narrate, stopAll]);

  function handleNext() {
    stopAll();
    if (isLast) {
      dispatch({ type: 'COMPLETE_PHASE', payload: 'story' });
      dispatch({ type: 'SET_PHASE', payload: 'simulate' });
    } else {
      dispatch({ type: 'NEXT_STORY_PANEL' });
    }
  }

  function handlePrev() {
    stopAll();
    dispatch({ type: 'PREV_STORY_PANEL' });
  }

  function handleSelectPanel(idx) {
    stopAll();
    dispatch({ type: 'SET_STORY_PANEL', payload: idx });
  }

  // Character avatar emojis matching the Survey Crew
  const charAvatar = panel.characterEmoji || '🧑‍🔬';

  return (
    <div className="story-phase-wrap anim-slide-up">
      <div className="story-stage">
        {/* Top Story Progress Bar with 1/4 Counter */}
        <div className="story-top-progress-row">
          <div className="story-progress-track">
            <div
              className="story-progress-fill"
              style={{ width: `${((panelIdx + 1) / totalPanels) * 100}%` }}
            />
          </div>
          <span className="story-page-counter">
            {panelIdx + 1}/{totalPanels}
          </span>
        </div>

        {/* Main Floating Story Card */}
        <div className="story-card-frame">
          {/* Left Column: Full-height, edge-to-edge illustration */}
          <div className="story-card-image-col">
            <img
              src={`/assets/story/${panelIdx + 1}.svg`}
              alt={panel.title}
              className="story-cover-image"
            />
          </div>

          {/* Right Column: Narrative Content */}
          <div className="story-card-body-col">
            <div className="story-card-text-group">
              <h1 className="story-card-title">
                {panel.title} <span className="story-title-emoji">{panel.characterEmoji}</span>
              </h1>

              <p className="story-card-desc">
                {panel.text}
              </p>
            </div>

            {/* Insight / Highlight Callout Box */}
            {panel.highlight && (
              <div className="story-callout-box">
                <span className="story-callout-icon">💡</span>
                <span className="story-callout-text">{panel.highlight}</span>
              </div>
            )}

            {/* Character Info Tag at Bottom of Card */}
            <div className="story-char-badge-row">
              <div className="story-char-avatar-circle">
                {charAvatar}
              </div>
              <span className="story-char-name-label">{panel.character}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Dot indicators on left, Next button on right */}
        <div className="story-bottom-action-bar">
          <div className="story-dots-group" role="tablist" aria-label="Story panels">
            {STORY_PANELS.map((_, idx) => (
              <button
                key={idx}
                role="tab"
                aria-selected={idx === panelIdx}
                className={`story-nav-dot ${idx === panelIdx ? 'active' : ''}`}
                onClick={() => handleSelectPanel(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="story-nav-buttons-group">
            {panelIdx > 0 && (
              <button className="story-btn-back" onClick={handlePrev}>
                ← Back
              </button>
            )}

            <button className="story-btn-next" onClick={handleNext}>
              {isLast ? 'Enter Simulate →' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
