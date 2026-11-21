// src/components/phases/StoryPhase.jsx
// 4-panel survey story for SimilarQuest with audio narration

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

  return (
    <div className="story-wrap anim-slide-up">
      <div className="story-container">
        {/* Progress Bar */}
        <div className="story-progress-bar-row">
          <div className="story-track">
            <div
              className="story-fill"
              style={{ width: `${((panelIdx + 1) / totalPanels) * 100}%` }}
            />
          </div>
          <span className="story-counter-text">
            Adventure {panelIdx + 1} / {totalPanels}
          </span>
        </div>

        {/* Main Card */}
        <div className="story-main-card">
          {/* Left: Illustration Frame */}
          <div className="story-image-section">
            <div className="story-art-frame" style={{ background: panel.imageBg, overflow: 'hidden', padding: 0 }}>
              <img
                src={`/assets/story/${panelIdx + 1}.svg`}
                alt={panel.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Right: Content */}
          <div className="story-content-section">
            <h2 className="story-title">{panel.title}</h2>
            <p className="story-text">{panel.text}</p>

            {panel.highlight && (
              <div className="story-prompt-pill">
                <span>💡</span>
                <span>{panel.highlight}</span>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="story-footer-nav">
              <button
                className="btn btn-outline btn-sm"
                onClick={handlePrev}
                disabled={panelIdx === 0}
              >
                ← Back
              </button>

              <button className="btn btn-primary" onClick={handleNext}>
                {isLast ? 'Enter the Simulate Labs! 🧪' : 'Next Adventure →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
