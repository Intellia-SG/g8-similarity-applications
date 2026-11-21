// src/components/shared/FloatingNumbers.jsx
// Background floating geometry symbols (∼ △ × ÷ 1 : n k) (TRD §5.1)

import React, { useMemo } from 'react';

const SYMBOLS = ['∼', '△', '×', '÷', '1 : n', 'k', '∠', '180°', 'k²', '📐'];

export default function FloatingNumbers() {
  const floatingItems = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      symbol: SYMBOLS[i % SYMBOLS.length],
      left: `${(i * 7.5 + 4) % 92}%`,
      top: `${(i * 11 + 6) % 88}%`,
      delay: `${(i * 1.5) % 8}s`,
      size: `${2.0 + (i % 3) * 0.4}rem`,
    }));
  }, []);

  return (
    <div className="floating-numbers" aria-hidden="true">
      {floatingItems.map((item) => (
        <span
          key={item.id}
          className="floating-number"
          style={{
            left: item.left,
            top: item.top,
            animationDelay: item.delay,
            fontSize: item.size,
          }}
        >
          {item.symbol}
        </span>
      ))}
    </div>
  );
}
