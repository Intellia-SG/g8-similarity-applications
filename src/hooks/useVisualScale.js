// src/hooks/useVisualScale.js
// Responsive scale calculation for SVG visual figures (TRD §9)
// Scales visual to container width while ensuring minimum 12px label legibility

import { useState, useEffect, useRef } from 'react';

export function useVisualScale(baseWidth = 500) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function updateScale() {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const availableWidth = rect.width;
      if (availableWidth > 0) {
        const computedScale = Math.min(1.2, Math.max(0.65, availableWidth / baseWidth));
        setScale(computedScale);
      }
    }

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [baseWidth]);

  return { containerRef, scale, minLabelSize: 12 };
}
