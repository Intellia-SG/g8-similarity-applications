// src/components/phases/PlayPhase.jsx
// Practice Phase integrating KingdomMap, QuestionRenderer, FeedbackOverlay, and Boss Battles

import React, { useState, useEffect, useRef } from 'react';
import './PlayPhase.css';
import KingdomMap from '../gamification/KingdomMap.jsx';
import QuestionRenderer from '../quiz/QuestionRenderer.jsx';
import BossBattleModal from '../quiz/BossBattleModal.jsx';
import FeedbackOverlay from '../shared/FeedbackOverlay.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { WORLDS } from '../../config/worlds.config.js';
import { generateQuestionBank } from '../../data/questionBank.js';
import {
  playQuestionNarration,
  playCorrectNarration,
  playWrongNarration,
  playHintNarration,
  districtCompleteNarration,
} from '../../utils/narration.js';

export default function PlayPhase({ state, dispatch }) {
  const { narrate, stopAll, sounds } = useAudio(state?.audioEnabled ?? true);
  const [showMap, setShowMap] = useState(true);
  const [hintsShown, setHintsShown] = useState(0);
  const [showHint, setShowHint] = useState(0);
  const [showBoss, setShowBoss] = useState(false);
  const [activeBoss, setActiveBoss] = useState(null);
  const feedbackTimer = useRef(null);

  const qs = state?.questionSet || [];
  const qIdx = state?.currentQuestion || 0;
  const question = qs[qIdx];
  const distIdx = state?.currentDistrict || 0;
  const currentWorld = WORLDS[distIdx] || WORLDS[0];

  // Auto-narrate question text
  useEffect(() => {
    if (!showMap && !showBoss && question && !state?.showFeedback) {
      const timer = setTimeout(() => {
        narrate(playQuestionNarration(question.questionText));
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [qIdx, showMap, showBoss, question, state?.showFeedback, narrate]);

  // Auto-dismiss feedback overlay after 2.2s
  useEffect(() => {
    if (state?.showFeedback) {
      feedbackTimer.current = setTimeout(() => {
        const feedbackStatus = state.showFeedback;
        dispatch({ type: 'CLEAR_FEEDBACK' });
        if (feedbackStatus === 'correct') {
          advanceQuestion();
        }
      }, 2200);
    }
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    };
  }, [state?.showFeedback]);

  function handleSelectWorld(idx) {
    stopAll();
    dispatch({ type: 'SET_CURRENT_DISTRICT', payload: idx });
    setShowMap(false);
  }

  function handleAnswer(answer) {
    if (!question) return;
    stopAll();
    const isCorrect = String(answer).trim() === String(question.correctAnswer).trim();

    if (isCorrect) {
      sounds.correct();
      dispatch({ type: 'ANSWER_CORRECT' });
      narrate(playCorrectNarration((state?.streak || 0) + 1));
    } else {
      sounds.wrong();
      dispatch({ type: 'ANSWER_INCORRECT', payload: question.explanation });
      narrate(playWrongNarration());
    }
  }

  function advanceQuestion() {
    setHintsShown(0);
    setShowHint(0);
    const nextIdx = qIdx + 1;

    // Checked if completed 10 questions for this world
    if (nextIdx % 10 === 0) {
      sounds.levelUp();
      narrate(districtCompleteNarration());
      dispatch({ type: 'NEXT_QUESTION' });

      // Check unlock rule: score for completed world
      const score = (state?.districtCorrect?.[distIdx] || 0) + 1;
      if (score < 4) {
        // Regenerate questions for replay per TRD §7.4!
        const freshBank = generateQuestionBank();
        dispatch({ type: 'LOAD_QUESTIONS', payload: freshBank });
      }
      setShowMap(true);
    } else {
      dispatch({ type: 'NEXT_QUESTION' });
    }
  }

  function handleShowHint() {
    const nextHint = hintsShown + 1;
    setHintsShown(nextHint);
    setShowHint(nextHint);
    dispatch({ type: 'USE_HINT' });
    if (question) {
      const hintText = nextHint === 1 ? question.hint1 : question.hint2;
      narrate(playHintNarration(hintText));
    }
  }

  function handleOpenBoss(boss) {
    stopAll();
    setActiveBoss(boss);
    setShowBoss(true);
  }

  function handleBossWin() {
    sounds.badge();
    dispatch({ type: 'BOSS_DEFEATED' });
    setShowBoss(false);
  }

  if (showBoss && activeBoss) {
    return (
      <BossBattleModal
        boss={activeBoss}
        questions={qs.slice(distIdx * 10, distIdx * 10 + 5)}
        onWin={handleBossWin}
        onClose={() => setShowBoss(false)}
        audioEnabled={state?.audioEnabled}
      />
    );
  }

  return (
    <div className="play-wrap anim-slide-up">
      {/* Feedback Overlay */}
      {state?.showFeedback && (
        <FeedbackOverlay
          status={state.showFeedback}
          message={state.feedbackMsg}
          onDismiss={() => dispatch({ type: 'CLEAR_FEEDBACK' })}
        />
      )}

      {showMap ? (
        <KingdomMap
          districtScores={state?.districtScores}
          districtCorrect={state?.districtCorrect}
          currentDistrict={distIdx}
          onSelectDistrict={handleSelectWorld}
          onOpenBoss={handleOpenBoss}
          onJumpReflect={() => dispatch({ type: 'SET_PHASE', payload: 'reflect' })}
          totalStars={state?.totalStars || 0}
        />
      ) : (
        <div style={{ width: '100%', maxWidth: '760px' }}>
          {/* Top Info Bar */}
          <div className="play-top-bar">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setShowMap(true)}
              aria-label="Return to World Map"
            >
              🗺️ World Map
            </button>

            <div className="play-world-indicator">
              <span>{currentWorld.emoji}</span>
              <span>{currentWorld.name} (Q {(qIdx % 10) + 1}/10)</span>
            </div>

            <div className="play-stats-chips">
              <span className="stat-pill">⚡ <strong>{state?.streak || 0}</strong></span>
              <span className="stat-pill">✨ <strong>{state?.xp || 0}</strong> XP</span>
            </div>
          </div>

          <QuestionRenderer
            question={question}
            onAnswer={handleAnswer}
            hintsShown={hintsShown}
            showHint={showHint}
            onHint={handleShowHint}
            isLocked={Boolean(state?.showFeedback)}
            onPrev={() => dispatch({ type: 'PREV_QUESTION' })}
            onNext={advanceQuestion}
            canPrev={qIdx % 10 !== 0}
          />
        </div>
      )}
    </div>
  );
}
