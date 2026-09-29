import { useState } from 'react';

export const MobileParticles = () => {
  // Generamos las posiciones y tiempos de animación solo una vez
  const [particles] = useState(() =>
    Array.from({ length: 12 }, () => ({
      top: Math.random() * 90 + 5,
      left: Math.random() * 90 + 5,
      dur: Math.random() * 2.5 + 2.5,
      delay: Math.random() * 3,
    }))
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
