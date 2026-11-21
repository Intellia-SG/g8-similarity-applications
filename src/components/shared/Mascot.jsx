// src/components/shared/Mascot.jsx
// Mascot component for Echo the Bat 🦇

import React from 'react';
import { MASCOT } from '../../config/characters.config.js';

export default function Mascot({ _mood = 'curious', message = '', size = 'md' }) {
  const sizeClass = size === 'sm' ? 'mascot-sm' : size === 'lg' ? 'mascot-lg' : 'mascot-md';

  return (
    <div className={`mascot-row ${sizeClass}`}>
      <div className="mascot-circle" title={MASCOT.name}>
        <span className="mascot-emoji">{MASCOT.emoji}</span>
      </div>
      {message && (
        <div className="mascot-speech-bubble anim-fade-in">
          {message}
        </div>
      )}
    </div>
  );
}
