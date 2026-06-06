import React, { CSSProperties, useEffect, useState } from 'react';

interface Particle {
  id: number;
  size: number;
  left: number;
  top: number;
  opacity: number;
  delay: number;
  duration: number;
}

export default function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const list: Particle[] = [];
    for (let i = 0; i < 30; i++) {
      list.push({
        id: i,
        size: Math.random() * 3 + 1,
        left: Math.random() * 100,
        top: Math.random() * 100,
        opacity: Math.random() * 0.15 + 0.04,
        delay: Math.random() * 15,
        duration: Math.random() * 20 + 20, // 20s - 40s
      });
    }
    setParticles(list);
  }, []);

  return (
    <div id="particles-container" className="digital-grid opacity-40">
      {particles.map((p) => (
        <div
          key={p.id}
          className="floating-particle animate-pulse"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration / 3}s`,
            '--opacity': p.opacity,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}
