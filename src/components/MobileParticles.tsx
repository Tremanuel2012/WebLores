import { useState } from 'react';

export const MobileParticles = () => {
  // Generamos las posiciones y tiempos de animación solo una vez
  const [particles] = useState(() =>
    Array.from({ length: 25 }, (_, i) => {
      const col = i % 5;
      const row = Math.floor(i / 5);
      return {
        top: row * 20 + 10 + (Math.random() * 12 - 6),
        left: col * 20 + 10 + (Math.random() * 12 - 6),
      dur: Math.random() * 2.5 + 2.5,
      delay: Math.random() * 3,
};
    })
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map((p, i) => (
        <span
          key={i}
          className="particle"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            ['--duration' as any]: `${p.dur}s`,
            ['--delay' as any]: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

