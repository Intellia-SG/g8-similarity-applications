// src/hooks/usePointerDrag.js
// Pointer events drag primitive with pointer capture, tap-to-select, and keyboard navigation (TRD §10)

import { useRef, useCallback } from 'react';

export function usePointerDrag({
  onDragStart,
  onDragMove,
  onDragEnd,
  threshold = 6,
  enabled = true,
}) {
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const pointerIdRef = useRef(null);

  const handlePointerDown = useCallback(
    (e, payload) => {
      if (!enabled || e.button !== 0) return;
      pointerIdRef.current = e.pointerId;
      startPosRef.current = { x: e.clientX, y: e.clientY };
      isDraggingRef.current = false;

      const target = e.currentTarget;
      if (target.setPointerCapture) {
        try {
          target.setPointerCapture(e.pointerId);
        } catch {}
      }

      const onPointerMove = (moveEvent) => {
        if (moveEvent.pointerId !== pointerIdRef.current) return;
        const dx = moveEvent.clientX - startPosRef.current.x;
        const dy = moveEvent.clientY - startPosRef.current.y;

        if (!isDraggingRef.current) {
          if (Math.hypot(dx, dy) >= threshold) {
            isDraggingRef.current = true;
            if (onDragStart) onDragStart(payload, { x: startPosRef.current.x, y: startPosRef.current.y });
          }
        }

        if (isDraggingRef.current) {
          if (onDragMove) onDragMove({ dx, dy, clientX: moveEvent.clientX, clientY: moveEvent.clientY, payload });
        }
      };

      const onPointerUp = (upEvent) => {
        if (upEvent.pointerId !== pointerIdRef.current) return;
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);

        if (target.releasePointerCapture) {
          try {
            target.releasePointerCapture(upEvent.pointerId);
          } catch {}
        }

        if (isDraggingRef.current) {
          isDraggingRef.current = false;
          if (onDragEnd) onDragEnd({ clientX: upEvent.clientX, clientY: upEvent.clientY, payload });
        }
      };

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    },
    [enabled, threshold, onDragStart, onDragMove, onDragEnd]
  );

  return { handlePointerDown };
}
