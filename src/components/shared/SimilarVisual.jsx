// src/components/shared/SimilarVisual.jsx
// Scale-accurate SVG visual renderer for SimilarQuest (TRD §4.5)

import React from 'react';

export default function SimilarVisual({ type, data = {}, compact = false, reveal = false }) {
  const width = compact ? 380 : 540;
  const height = compact ? 190 : 250;

  switch (type) {
    case 'twoFigures':
      return renderTwoFigures(data, width, height, reveal);

    case 'overlay':
      return renderOverlay(data, width, height, reveal);

    case 'anglePair':
      return renderAnglePair(data, width, height, reveal);

    case 'shadowScene':
      return renderShadowScene(data, width, height, reveal);

    case 'mirrorScene':
      return renderMirrorScene(data, width, height, reveal);

    case 'nested':
      return renderNested(data, width, height, reveal);

    case 'mapRuler':
      return renderMapRuler(data, width, height, reveal);

    case 'workingCard':
      return renderWorkingCard(data);

    default:
      return null;
  }
}

// ─── 1. Two Figures (Side by Side Triangles or Rectangles) ──────────────
function renderTwoFigures(data, width, height) {
  const isRect = data.figure?.kind === 'rectangle' || data.origLabel?.includes('Rectangle');

  if (isRect) {
    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="similar-visual-svg" width="100%" height="100%">
        {/* Rectangle 1 (Original) */}
        <g transform="translate(40, 50)">
          <rect x="0" y="0" width="90" height="130" fill="rgba(124,92,191,0.2)" stroke="#7c5cbf" strokeWidth="2.5" rx="6" />
          <text x="45" y="-12" fill="#ffe082" fontSize="13" fontWeight="bold" textAnchor="middle">Original</text>
          {/* Labels */}
          <text x="45" y="70" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">{data.origSides ? `${data.origSides[0]} cm` : 'Width'}</text>
          <text x="-12" y="70" fill="#a4b0be" fontSize="12" textAnchor="middle" transform="rotate(-90, -12, 70)">Side A</text>
          <line x1="45" y1="0" x2="45" y2="8" stroke="#00e676" strokeWidth="2" /> {/* Single tick */}
        </g>

        {/* Arrow with scale multiplier */}
        <g transform="translate(175, 115)">
          <path d="M 0 0 L 40 0 M 32 -6 L 40 0 L 32 6" stroke="#ffc107" strokeWidth="3" fill="none" />
          <text x="20" y="-10" fill="#ffc107" fontSize="13" fontWeight="800" textAnchor="middle">× k</text>
        </g>

        {/* Rectangle 2 (Enlarged) */}
        <g transform="translate(250, 25)">
          <rect x="0" y="0" width="140" height="180" fill="rgba(255,193,7,0.18)" stroke="#ffc107" strokeWidth="2.5" rx="8" />
          <text x="70" y="-12" fill="#ffe082" fontSize="13" fontWeight="bold" textAnchor="middle">Scaled Copy</text>
          {/* Labels */}
          <text x="70" y="95" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">
            {data.scaledSides ? `${data.scaledSides[0]} cm` : 'Scaled'}
          </text>
          <line x1="68" y1="0" x2="68" y2="8" stroke="#00e676" strokeWidth="2" />
          <line x1="72" y1="0" x2="72" y2="8" stroke="#00e676" strokeWidth="2" /> {/* Double tick */}
        </g>
      </svg>
    );
  }

  // Triangles side by side
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="similar-visual-svg" width="100%" height="100%">
      {/* Triangle 1 (Original) */}
      <g transform="translate(35, 30)">
        <polygon points="10,140 110,140 40,40" fill="rgba(124,92,191,0.22)" stroke="#7c5cbf" strokeWidth="2.5" />
        <text x="5" y="156" fill="#ffe082" fontSize="13" fontWeight="800">A</text>
        <text x="115" y="156" fill="#ffe082" fontSize="13" fontWeight="800">B</text>
        <text x="35" y="30" fill="#ffe082" fontSize="13" fontWeight="800">C</text>
        <text x="60" y="160" fill="#ffffff" fontSize="13" fontWeight="700" textAnchor="middle">
          {data.origSides ? `${data.origSides[0]} cm` : data.a ? `${data.a} cm` : 'base'}
        </text>
        {/* Tick marker */}
        <line x1="58" y1="136" x2="62" y2="144" stroke="#4caf50" strokeWidth="2.5" />
      </g>

      {/* Scale factor transition */}
      <g transform="translate(180, 110)">
        <path d="M 0 0 L 45 0 M 35 -6 L 45 0 L 35 6" stroke="#ffc107" strokeWidth="3" fill="none" />
        <text x="22" y="-12" fill="#ffc107" fontSize="14" fontWeight="800" textAnchor="middle">
          {data.k ? `× ${data.k}` : '∼'}
        </text>
      </g>

      {/* Triangle 2 (Scaled Copy) */}
      <g transform="translate(265, 10)">
        <polygon points="15,180 185,180 65,15" fill="rgba(255,193,7,0.2)" stroke="#ffc107" strokeWidth="2.5" />
        <text x="5" y="200" fill="#ffe082" fontSize="14" fontWeight="800">D</text>
        <text x="190" y="200" fill="#ffe082" fontSize="14" fontWeight="800">E</text>
        <text x="60" y="10" fill="#ffe082" fontSize="14" fontWeight="800">F</text>
        <text x="100" y="202" fill="#ffffff" fontSize="14" fontWeight="700" textAnchor="middle">
          {data.scaledSides ? `${data.scaledSides[0]} cm` : data.b ? `${data.b} cm` : '?'}
        </text>
        {/* Double tick marker */}
        <line x1="97" y1="176" x2="101" y2="184" stroke="#4caf50" strokeWidth="2.5" />
        <line x1="102" y1="176" x2="106" y2="184" stroke="#4caf50" strokeWidth="2.5" />
      </g>
    </svg>
  );
}

// ─── 2. Overlay / Rotated / Flipped Triangles ────────────────────────────
function renderOverlay(data, width, height) {
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="similar-visual-svg" width="100%" height="100%">
      {/* Triangle 1 Normal */}
      <g transform="translate(50, 40)">
        <polygon points="0,140 120,140 30,30" fill="rgba(124,92,191,0.25)" stroke="#7c5cbf" strokeWidth="2.5" />
        <text x="60" y="160" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">
          {data.origSides ? `${data.origSides[0]} cm` : 'Base 1'}
        </text>
        <text x="10" y="80" fill="#ffe082" fontSize="13" fontWeight="bold">
          {data.origSides ? `${data.origSides[1]} cm` : 'Side 1'}
        </text>
        <text x="85" y="80" fill="#a4b0be" fontSize="13">
          {data.origSides ? `${data.origSides[2]} cm` : 'Hyp 1'}
        </text>
        <circle cx="60" cy="140" r="4" fill="#00e676" />
      </g>

      <text x={width / 2} y="115" fill="#feca57" fontSize="24" textAnchor="middle">🔀</text>

      {/* Triangle 2 Flipped horizontally */}
      <g transform={`translate(${width - 60}, 20) scale(-1, 1)`}>
        <polygon points="0,170 170,170 45,20" fill="rgba(255,159,67,0.22)" stroke="#ff9f43" strokeWidth="2.5" />
        <circle cx="85" cy="170" r="5" fill="#00e676" />
      </g>

      <g transform="translate(320, 195)">
        <text x="0" y="15" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">
          {data.scaledSides ? `${data.scaledSides[0]} cm (Flipped)` : '△2'}
        </text>
      </g>
    </svg>
  );
}

// ─── 3. Angle Pair with Arcs ─────────────────────────────────────────────
function renderAnglePair(data, width, height) {
  const [a1, a2] = data.t1Angles || [50, 60];
  const [b1, b2] = data.t2Angles || [60, 70];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="similar-visual-svg" width="100%" height="100%">
      {/* Triangle 1 */}
      <g transform="translate(40, 30)">
        <polygon points="10,140 140,140 50,20" fill="rgba(41,182,246,0.2)" stroke="#29b6f6" strokeWidth="2.5" />
        <text x="25" y="132" fill="#ffe082" fontSize="13" fontWeight="bold">{a1}°</text>
        <text x="110" y="132" fill="#81d4fa" fontSize="13" fontWeight="bold">{a2}°</text>
        <text x="75" y="165" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">Triangle 1</text>
      </g>

      {/* Triangle 2 */}
      <g transform="translate(280, 15)">
        <polygon points="15,160 190,160 70,10" fill="rgba(255,193,7,0.2)" stroke="#ffc107" strokeWidth="2.5" />
        <text x="35" y="152" fill="#ffe082" fontSize="14" fontWeight="bold">{b1}°</text>
        <text x="155" y="152" fill="#ffe082" fontSize="14" fontWeight="bold">{b2}°</text>
        <text x="100" y="185" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">Triangle 2</text>
      </g>
    </svg>
  );
}

// ─── 4. Shadow Scene (Pole + Tree / Building with Sun Ray) ───────────────
function renderShadowScene(data, width, height) {
  const { h = 2, s = 3, S = 12, H = 8 } = data;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="similar-visual-svg" width="100%" height="100%">
      {/* Sun in top sky */}
      <g transform="translate(60, 35)">
        <circle cx="0" cy="0" r="18" fill="#ffc107" filter="drop-shadow(0 0 10px #ffc107)" />
        <path d="M -25 0 L 25 0 M 0 -25 L 0 25 M -18 -18 L 18 18 M -18 18 L 18 -18" stroke="#ffeb3b" strokeWidth="2" />
      </g>

      {/* Ground line */}
      <line x1="20" y1="200" x2={width - 20} y2="200" stroke="#4caf50" strokeWidth="3" />

      {/* Surveyor Pole */}
      <g transform="translate(140, 140)">
        <line x1="0" y1="0" x2="0" y2="60" stroke="#f59e0b" strokeWidth="4" />
        <line x1="0" y1="60" x2="50" y2="60" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
        <text x="-12" y="35" fill="#ffe082" fontSize="13" fontWeight="bold" textAnchor="end">{h} m</text>
        <text x="25" y="78" fill="#a4b0be" fontSize="12" textAnchor="middle">{s} m</text>
        {/* Sun ray hypotenuse */}
        <line x1="0" y1="0" x2="50" y2="60" stroke="rgba(255,235,59,0.5)" strokeWidth="1.5" strokeDasharray="4 3" />
      </g>

      {/* Tall Tree or Building */}
      <g transform="translate(280, 50)">
        <rect x="0" y="0" width="30" height="150" fill="rgba(59,130,246,0.3)" stroke="#3b82f6" strokeWidth="2.5" />
        {/* Shadow */}
        <line x1="30" y1="150" x2="160" y2="150" stroke="#1f2937" strokeWidth="5" strokeLinecap="round" />
        <text x="-12" y="75" fill="#4ade80" fontSize="14" fontWeight="bold" textAnchor="end">{H ? `${H} m` : '?'}</text>
        <text x="95" y="170" fill="#a4b0be" fontSize="13" fontWeight="bold" textAnchor="middle">{S} m shadow</text>
        {/* Sun ray */}
        <line x1="0" y1="0" x2="160" y2="150" stroke="rgba(255,235,59,0.6)" strokeWidth="2" strokeDasharray="5 4" />
      </g>
    </svg>
  );
}

// ─── 5. Mirror Scene ─────────────────────────────────────────────────────
function renderMirrorScene(data, width, height) {
  const { eye = 1.6, d1 = 2, d2 = 15, H = 12 } = data;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="similar-visual-svg" width="100%" height="100%">
      {/* Ground */}
      <line x1="20" y1="190" x2={width - 20} y2="190" stroke="#6b7280" strokeWidth="3" />

      {/* Person at left */}
      <g transform="translate(70, 130)">
        <circle cx="0" cy="0" r="8" fill="#ffe082" />
        <line x1="0" y1="8" x2="0" y2="60" stroke="#f59e0b" strokeWidth="3" />
        <text x="-12" y="35" fill="#ffe082" fontSize="13" fontWeight="bold" textAnchor="end">{eye} m</text>
      </g>

      {/* Mirror on ground */}
      <g transform="translate(180, 188)">
        <rect x="-16" y="0" width="32" height="4" fill="#00e676" rx="2" />
        <text x="0" y="16" fill="#00e676" fontSize="12" fontWeight="bold" textAnchor="middle">🪞 Mirror</text>
      </g>

      {/* Cliff at right */}
      <g transform="translate(420, 40)">
        <path d="M 0 0 L 30 10 L 15 150 L 0 150 Z" fill="rgba(107,114,128,0.4)" stroke="#9ca3af" strokeWidth="2.5" />
        <text x="-10" y="75" fill="#4ade80" fontSize="14" fontWeight="bold" textAnchor="end">{H ? `${H} m` : '?'}</text>
      </g>

      {/* Distances along ground */}
      <text x="125" y="180" fill="#a4b0be" fontSize="12" textAnchor="middle">{d1} m</text>
      <text x="300" y="180" fill="#a4b0be" fontSize="12" textAnchor="middle">{d2} m</text>

      {/* Sight lines bouncing off mirror */}
      <line x1="70" y1="130" x2="180" y2="188" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 3" />
      <line x1="180" y1="188" x2="420" y2="40" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 3" />
    </svg>
  );
}

// ─── 6. Nested Triangles (DE ∥ BC) ──────────────────────────────────────
function renderNested(data, width, height) {
  const { ad = 4, db = 6, de = 6, bc = 15 } = data;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="similar-visual-svg" width="100%" height="100%">
      {/* Big Triangle ABC */}
      <g transform="translate(120, 20)">
        <polygon points="120,0 0,180 240,180" fill="rgba(255,152,0,0.12)" stroke="#ff9800" strokeWidth="3" />
        {/* Parallel line DE */}
        <line x1="48" y1="108" x2="192" y2="108" stroke="#00e676" strokeWidth="3" />

        {/* Parallel arrows */}
        <path d="M 115 104 L 122 108 L 115 112" stroke="#00e676" strokeWidth="2" fill="none" />
        <path d="M 115 176 L 122 180 L 115 184" stroke="#ff9800" strokeWidth="2" fill="none" />

        {/* Vertices */}
        <text x="120" y="-8" fill="#ffe082" fontSize="14" fontWeight="bold" textAnchor="middle">A</text>
        <text x="-12" y="195" fill="#ffe082" fontSize="14" fontWeight="bold">B</text>
        <text x="250" y="195" fill="#ffe082" fontSize="14" fontWeight="bold">C</text>
        <text x="32" y="105" fill="#00e676" fontSize="14" fontWeight="bold">D</text>
        <text x="200" y="105" fill="#00e676" fontSize="14" fontWeight="bold">E</text>

        {/* Segment lengths */}
        <text x="65" y="55" fill="#a4b0be" fontSize="12">{ad} cm</text>
        <text x="10" y="150" fill="#a4b0be" fontSize="12">{db} cm</text>
        <text x="120" y="100" fill="#00e676" fontSize="13" fontWeight="bold" textAnchor="middle">DE = {de} cm</text>
        <text x="120" y="202" fill="#ff9800" fontSize="14" fontWeight="bold" textAnchor="middle">BC = {bc ? `${bc} cm` : '?'}</text>
      </g>
    </svg>
  );
}

// ─── 7. Map & Model Scale Ruler ──────────────────────────────────────────
function renderMapRuler(data, width, height) {
  const { scale = 50000, mapDistCm = 3.6, val = 1.8, unit = 'km' } = data;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="similar-visual-svg" width="100%" height="100%">
      {/* Map Card Outline */}
      <rect x="50" y="30" width={width - 100} height="130" fill="rgba(38,166,154,0.15)" stroke="#26a69a" strokeWidth="2" rx="10" />

      {/* Scale Badge */}
      <rect x="70" y="45" width="130" height="28" fill="#132f38" rx="6" />
      <text x="135" y="64" fill="#26a69a" fontSize="13" fontWeight="bold" textAnchor="middle">
        Scale 1 : {scale.toLocaleString()}
      </text>

      {/* Ruler representation */}
      <g transform="translate(100, 105)">
        <rect x="0" y="0" width="280" height="24" fill="#1e293b" stroke="#64748b" rx="4" />
        {/* Ticks */}
        {[0, 40, 80, 120, 160, 200, 240, 280].map((x, i) => (
          <line key={i} x1={x} y1="0" x2={x} y2={i % 2 === 0 ? 12 : 7} stroke="#94a3b8" strokeWidth="1.5" />
        ))}
        {/* Distance marker on ruler */}
        <line x1="20" y1="28" x2="180" y2="28" stroke="#ffc107" strokeWidth="3" markerEnd="url(#arrow)" />
        <text x="100" y="44" fill="#ffc107" fontSize="13" fontWeight="bold" textAnchor="middle">
          {mapDistCm} cm on map
        </text>
      </g>

      <text x={width / 2} y="195" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">
        Actual distance: {val ? `${val} ${unit}` : '?'}
      </text>
    </svg>
  );
}

// ─── 8. Worked-Solution Card ─────────────────────────────────────────────
function renderWorkingCard(data) {
  const { lines = [], faultIndex } = data;

  return (
    <div className="similar-working-card glass-card">
      <div className="working-card-header">
        <span className="working-badge">📐 Surveyor Working Check</span>
      </div>
      <div className="working-steps">
        {lines.map((line, idx) => (
          <div
            key={idx}
            className={`working-step-line ${idx === faultIndex ? 'fault-line' : ''}`}
          >
            <span className="step-num">{idx + 1}.</span>
            <span className="step-text">{line}</span>
            {idx === faultIndex && <span className="fault-tag">⚠️ Flawed Step</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
