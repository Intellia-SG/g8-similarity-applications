// src/components/gamification/KingdomMap.jsx
// 10 Themed Survey Worlds Map matching Screenshot 2 and TRD §7

import React from 'react';
import './KingdomMap.css';
import StarRating from './StarRating.jsx';
import { calcStars } from '../../utils/scoring.js';
import { WORLDS } from '../../config/worlds.config.js';

export default function KingdomMap({
  districtScores = [],
  districtCorrect = [],
  currentDistrict = 0,
  onSelectDistrict,
  onOpenBoss,
  onJumpReflect,
  totalStars = 0,
}) {
  const currentWorld = WORLDS[currentDistrict] || WORLDS[0];

  return (
    <div className="play-map-card">
      {/* Top Header */}
      <div className="map-header-row">
        <div>
          <h2 className="map-title">Similarity Game Worlds</h2>
          <p className="map-subtitle">
            10 Themed Worlds · Need 4/10 Correct to Unlock Next World
          </p>
        </div>
        <div className="star-pill">
          <span>⭐ {totalStars} / 30</span>
        </div>
      </div>

      {/* 5x2 World Grid */}
      <div className="world-grid">
        {WORLDS.map((w, idx) => {
          const isCurrent = idx === currentDistrict;
          const score = districtScores[idx];
          const isCompleted = score !== null && score !== undefined;
          // Unlock rule (TRD §7.4): world 0 is unlocked; world n unlocked if world n-1 >= 4
          const isUnlocked =
            idx === 0 ||
            (districtScores[idx - 1] !== null && districtScores[idx - 1] >= 4) ||
            idx <= currentDistrict;

          const correct = districtCorrect[idx] || 0;
          const stars = isCompleted ? calcStars(score) : 0;
          const qStart = idx * 10 + 1;
          const qEnd = idx * 10 + 10;

          return (
            <div
              key={w.id}
              className={`world-card ${isCurrent ? 'current' : ''} ${!isUnlocked ? 'locked' : ''}`}
              onClick={() => isUnlocked && onSelectDistrict && onSelectDistrict(idx)}
              role="button"
              tabIndex={isUnlocked ? 0 : -1}
              aria-label={`World ${idx + 1}: ${w.name}, ${isUnlocked ? 'Unlocked' : 'Locked'}`}
            >
              <div className="world-card-top">
                <span className="world-badge">W{idx + 1}</span>
                <span className="world-q-range">Q{qStart}–{qEnd}</span>
              </div>

              <div className="world-center-icon">
                {isUnlocked ? w.emoji : '🔒'}
              </div>

              <span className="world-name-label" title={w.name}>
                {w.name}
              </span>

              <div className="world-status-row">
                {isCompleted ? (
                  <div className="status-score">
                    <StarRating stars={stars} size="sm" />
                    <span>{correct}/10</span>
                  </div>
                ) : isCurrent ? (
                  <span className="status-play">Play →</span>
                ) : isUnlocked ? (
                  <span className="status-ready">Ready</span>
                ) : (
                  <span className="status-locked">Locked</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Button Row */}
      <div className="map-actions-row">
        <button
          className="boss-action-btn"
          onClick={() => onOpenBoss && onOpenBoss(currentWorld.boss)}
          aria-label={`Fight Boss: ${currentWorld.boss.name}`}
        >
          <span>👑</span> Boss Battle: {currentWorld.boss.name}
        </button>

        <button
          className="reflect-action-btn"
          onClick={onJumpReflect}
          aria-label="Jump to Reflect Phase"
        >
          <span>📓</span> Jump to Reflect Phase →
        </button>
      </div>
    </div>
  );
}
