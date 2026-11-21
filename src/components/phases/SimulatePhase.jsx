// src/components/phases/SimulatePhase.jsx
// Simulate Phase hosting the 4 interactive survey stations (PRD §8.3, TRD §10)

import React, { useEffect, useRef } from 'react';
import './SimulatePhase.css';
import ZoomLensLab from '../simulations/ZoomLensLab.jsx';
import MatchTheModel from '../simulations/MatchTheModel.jsx';
import RiverSurvey from '../simulations/RiverSurvey.jsx';
import ReplayReview from '../simulations/ReplayReview.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { simStationIntro } from '../../utils/narration.js';

const STATIONS = [
  { id: 0, label: 'A', name: 'Zoom Lens Lab', icon: '🔬' },
  { id: 1, label: 'B', name: 'Match the Model', icon: '📐' },
  { id: 2, label: 'C', name: 'River Survey', icon: '🧭' },
  { id: 3, label: 'D', name: 'Replay Review', icon: '🕵️' },
];

export default function SimulatePhase({ state, dispatch }) {
  const { narrate, stopAll } = useAudio(state?.audioEnabled ?? true);
  const prevStation = useRef(-1);

  const s = state?.currentSimStation || 0;

  useEffect(() => {
    if (prevStation.current !== s) {
      prevStation.current = s;
      stopAll();
      setTimeout(() => narrate(simStationIntro(s)), 400);
    }
  }, [s, narrate, stopAll]);

  useEffect(() => {
    return () => stopAll();
  }, [stopAll]);

  function handleStationComplete(stationIdx) {
    stopAll();
    dispatch({ type: 'COMPLETE_SIM_STATION', payload: stationIdx });
    if (stationIdx < 3) {
      setTimeout(() => dispatch({ type: 'ADVANCE_SIM_STATION' }), 600);
    } else {
      setTimeout(() => dispatch({ type: 'SET_PHASE', payload: 'play' }), 900);
    }
  }

  function goToPrev() {
    stopAll();
    dispatch({ type: 'PREV_SIM_STATION' });
  }

  function goToNext() {
    stopAll();
    if (s < 3) {
      dispatch({ type: 'ADVANCE_SIM_STATION' });
    } else {
      dispatch({ type: 'SET_PHASE', payload: 'play' });
    }
  }

  return (
    <div className="sim-wrap anim-slide-up">
      <div className="sim-card glass-card">
        {/* Tab Bar */}
        <div className="sim-tabs" role="tablist">
          {STATIONS.map((st) => (
            <button
              key={st.id}
              role="tab"
              aria-selected={s === st.id}
              className={`sim-tab ${s === st.id ? 'active' : ''} ${state?.simStationsComplete?.[st.id] ? 'done' : ''}`}
              onClick={() => {
                if (st.id > s && !state?.simStationsComplete?.[s]) return;
                stopAll();
                if (st.id > s) {
                  for (let i = 0; i < st.id - s; i++) dispatch({ type: 'ADVANCE_SIM_STATION' });
                } else if (st.id < s) {
                  for (let i = 0; i < s - st.id; i++) dispatch({ type: 'PREV_SIM_STATION' });
                }
              }}
              aria-label={`Station ${st.label}: ${st.name}`}
              disabled={st.id > s && !state?.simStationsComplete?.[s]}
            >
              <span>{state?.simStationsComplete?.[st.id] ? '✅' : st.icon}</span>
              <span>{st.name}</span>
            </button>
          ))}
        </div>

        {/* Station Content Area */}
        <div className="sim-station-area" role="tabpanel" key={s}>
          {s === 0 && <ZoomLensLab onComplete={() => handleStationComplete(0)} />}
          {s === 1 && <MatchTheModel onComplete={() => handleStationComplete(1)} />}
          {s === 2 && <RiverSurvey onComplete={() => handleStationComplete(2)} />}
          {s === 3 && <ReplayReview onComplete={() => handleStationComplete(3)} />}
        </div>

        {/* Footer Navigation */}
        <div className="sim-footer">
          <button className="btn btn-outline btn-sm" onClick={goToPrev} disabled={s === 0}>
            ← Previous Station
          </button>

          <div className="sim-progress-dots">
            {STATIONS.map((st) => (
              <span
                key={st.id}
                className={`sim-dot ${s === st.id ? 'active' : state?.simStationsComplete?.[st.id] ? 'done' : ''}`}
              />
            ))}
          </div>

          <button className="btn btn-primary btn-sm" onClick={goToNext}>
            {s === 3 ? 'Practice! 🎮' : 'Next Station →'}
          </button>
        </div>
      </div>
    </div>
  );
}
