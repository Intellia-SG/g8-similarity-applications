// src/components/quiz/BossBattleModal.jsx
// Boss Battle Modal: 5 Questions, 3 Lives, Site Boss Rewards

import React, { useState } from 'react';
import './BossBattleModal.css';
import QuestionRenderer from './QuestionRenderer.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { bossStartNarration, bossWinNarration } from '../../utils/narration.js';

export default function BossBattleModal({ boss, questions = [], onWin, onClose, audioEnabled = true }) {
  const { narrate, sounds } = useAudio(audioEnabled);
  const [started, setStarted] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);

  const battleQuestions = questions.slice(0, 5);
  const currentQ = battleQuestions[qIndex];

  function startBattle() {
    setStarted(true);
    narrate(bossStartNarration(boss.name));
  }

  function handleAnswer(ans) {
    if (!currentQ) return;
    const isCorrect = String(ans).trim() === String(currentQ.correctAnswer).trim();

    if (isCorrect) {
      sounds.correct();
      if (qIndex + 1 >= battleQuestions.length) {
        setWon(true);
        sounds.badge();
        narrate(bossWinNarration(boss.reward));
      } else {
        setQIndex(qIndex + 1);
      }
    } else {
      sounds.wrong();
      const nextLives = lives - 1;
      setLives(nextLives);
      if (nextLives <= 0) {
        setLost(true);
        sounds.defeat();
      }
    }
  }

  if (!started) {
    return (
      <div className="boss-modal-backdrop">
        <div className="boss-modal-card glass-card anim-bounce-in">
          <div className="boss-avatar-pulse">
            <span className="boss-emoji">{boss.emoji}</span>
          </div>
          <h2 className="boss-title">{boss.name}</h2>
          <p className="boss-desc">
            Answer {battleQuestions.length} similarity survey challenges correctly to conquer the site boss!
          </p>
          <div className="boss-lives-preview">
            Lives: {'❤️'.repeat(3)}
          </div>
          <div className="boss-reward-preview">
            Reward: <strong>{boss.reward}</strong> (+50 XP)
          </div>
          <div className="boss-actions">
            <button className="btn btn-primary" onClick={startBattle}>
              ⚔️ Begin Boss Battle!
            </button>
            <button className="btn btn-outline" onClick={onClose}>
              Back to World
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (won) {
    return (
      <div className="boss-modal-backdrop">
        <div className="boss-modal-card glass-card anim-celebrate">
          <div className="boss-avatar-pulse" style={{ background: 'rgba(76, 175, 80, 0.4)' }}>
            <span className="boss-emoji">🏆</span>
          </div>
          <h2 className="boss-title" style={{ color: 'var(--green-light)' }}>Boss Defeated!</h2>
          <p className="boss-desc">
            You conquered {boss.name} and claimed the <strong>{boss.reward}</strong>!
          </p>
          <button className="btn btn-primary" onClick={onWin}>
            Claim Reward &amp; Continue ✨
          </button>
        </div>
      </div>
    );
  }

  if (lost) {
    return (
      <div className="boss-modal-backdrop">
        <div className="boss-modal-card glass-card anim-shake">
          <div className="boss-avatar-pulse" style={{ background: 'rgba(239, 83, 80, 0.4)' }}>
            <span className="boss-emoji">💔</span>
          </div>
          <h2 className="boss-title" style={{ color: 'var(--red)' }}>Defeated!</h2>
          <p className="boss-desc">
            You ran out of lives against {boss.name}. Regroup and challenge the boss again!
          </p>
          <button className="btn btn-outline" onClick={onClose}>
            Back to Map
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="boss-modal-backdrop">
      <div style={{ width: '100%', maxWidth: '780px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px 8px' }}>
          <span style={{ fontWeight: 'bold', color: 'var(--gold)' }}>
            ⚔️ Boss: {boss.name} (Q {qIndex + 1}/{battleQuestions.length})
          </span>
          <span style={{ letterSpacing: '2px' }}>
            {'❤️'.repeat(lives)}
          </span>
        </div>
        <QuestionRenderer
          question={currentQ}
          onAnswer={handleAnswer}
          isLocked={false}
        />
      </div>
    </div>
  );
}
