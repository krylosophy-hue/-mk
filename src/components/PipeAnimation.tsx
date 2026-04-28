import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// ===== WATER FLOW - Wavy like real water =====
function WaterFlow() {
  return (
    <div className="absolute top-0 bottom-0" style={{ left: '12%', width: '80px' }}>
      <div className="relative w-full h-full">
        {/* Main water pipe - very transparent */}
        <motion.div
          className="absolute top-0 bottom-0 w-6 rounded-full overflow-hidden"
          style={{ 
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(180deg, rgba(0, 120, 200, 0.06) 0%, rgba(0, 160, 255, 0.1) 50%, rgba(0, 120, 200, 0.06) 100%)',
            boxShadow: '0 0 30px rgba(0, 150, 255, 0.08)',
          }}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 1.5, delay: 0 }}
        />

        {/* Wavy water animation SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waterGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(100, 200, 255, 0)" />
              <stop offset="30%" stopColor="rgba(120, 210, 255, 0.4)" />
              <stop offset="50%" stopColor="rgba(150, 220, 255, 0.6)" />
              <stop offset="70%" stopColor="rgba(120, 210, 255, 0.4)" />
              <stop offset="100%" stopColor="rgba(100, 200, 255, 0)" />
            </linearGradient>
            <linearGradient id="waterGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(80, 180, 240, 0)" />
              <stop offset="40%" stopColor="rgba(100, 200, 255, 0.3)" />
              <stop offset="60%" stopColor="rgba(130, 210, 255, 0.5)" />
              <stop offset="100%" stopColor="rgba(80, 180, 240, 0)" />
            </linearGradient>
          </defs>
          
          {/* Main wavy water stream */}
          {[0, 1, 2].map((i) => (
            <motion.path
              key={`wave-${i}`}
              fill="none"
              stroke={i === 1 ? "url(#waterGrad1)" : "url(#waterGrad2)"}
              strokeWidth={i === 1 ? 4 : 2}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                d: Array.from({ length: 20 }, (_, frame) => {
                  const points = [];
                  const segments = 50;
                  for (let j = 0; j <= segments; j++) {
                    const y = (j / segments) * 100;
                    const wave1 = Math.sin((j * 0.5) + (frame * 0.5) + (i * 2)) * (8 - i * 2);
                    const wave2 = Math.sin((j * 0.3) + (frame * 0.3) + (i * 1.5)) * (4 - i);
                    const x = 40 + wave1 + wave2;
                    points.push(`${j === 0 ? 'M' : 'L'} ${x} ${y}%`);
                  }
                  return points.join(' ');
                }),
                opacity: i === 1 ? [0.3, 0.7, 0.3] : [0.2, 0.4, 0.2],
              }}
              transition={{ 
                d: { duration: 4, repeat: Infinity, ease: "linear" },
                opacity: { duration: 3, repeat: Infinity },
              }}
            />
          ))}

          {/* Flowing water particles */}
          {[...Array(8)].map((_, i) => (
            <motion.circle
              key={`drop-${i}`}
              r={2 + Math.random() * 2}
              fill="rgba(180, 230, 255, 0.7)"
              initial={{ cy: '-5%', cx: 40, opacity: 0 }}
              animate={{
                cy: ['-5%', '105%'],
                cx: [40, 40 + Math.sin(i * 1.2) * 12, 40 + Math.sin(i * 1.2 + Math.PI) * 12, 40],
                opacity: [0, 0.8, 0.8, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: 'linear',
              }}
            />
          ))}
        </svg>

        {/* Label */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 px-2 py-1 rounded-full text-[10px] font-medium whitespace-nowrap"
          style={{ 
            background: 'rgba(0, 120, 200, 0.1)',
            border: '1px solid rgba(100, 200, 255, 0.2)',
            color: 'rgba(125, 211, 252, 0.8)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          💧 Вода
        </motion.div>
      </div>
    </div>
  );
}

// ===== ELECTRICITY FLOW - ECG style double-sided =====
function ElectricityFlow() {
  const [sparks, setSparks] = useState<{id: number, y: number}[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newSpark = { id: Date.now(), y: Math.random() * 100 };
      setSparks(prev => [...prev.slice(-5), newSpark]);
    }, 250);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-0 bottom-0" style={{ left: '37%', width: '100px' }}>
      <div className="relative w-full h-full">
        {/* Electric conduit - very transparent */}
        <motion.div
          className="absolute top-0 bottom-0 w-5 rounded-full"
          style={{ 
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(180deg, rgba(255, 200, 0, 0.04) 0%, rgba(255, 220, 50, 0.08) 50%, rgba(255, 200, 0, 0.04) 100%)',
            boxShadow: '0 0 25px rgba(255, 220, 0, 0.06)',
          }}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        />

        {/* ECG-style double-sided lightning */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" preserveAspectRatio="none">
          <defs>
            <filter id="electricGlow2">
              <feGaussianBlur stdDeviation="1.5" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Left side ECG */}
          <motion.path
            fill="none"
            stroke="rgba(255, 240, 100, 0.5)"
            strokeWidth="1.5"
            filter="url(#electricGlow2)"
            initial={{ pathLength: 0 }}
            animate={{ 
              d: Array.from({ length: 15 }, (_, frame) => {
                const points = [];
                const segments = 60;
                for (let j = 0; j <= segments; j++) {
                  const y = (j / segments) * 100;
                  // ECG pattern: flat, small pulse, big spike, flat
                  const ecgPhase = (j + frame * 2) % 20;
                  let offset = 0;
                  if (ecgPhase >= 8 && ecgPhase < 10) offset = -5;
                  else if (ecgPhase >= 10 && ecgPhase < 11) offset = 15;
                  else if (ecgPhase >= 11 && ecgPhase < 12) offset = -25;
                  else if (ecgPhase >= 12 && ecgPhase < 14) offset = -5;
                  
                  const x = 30 + offset + Math.sin(j * 0.3 + frame * 0.2) * 3;
                  points.push(`${j === 0 ? 'M' : 'L'} ${x} ${y}%`);
                }
                return points.join(' ');
              }),
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />

          {/* Right side ECG (mirrored) */}
          <motion.path
            fill="none"
            stroke="rgba(255, 240, 100, 0.5)"
            strokeWidth="1.5"
            filter="url(#electricGlow2)"
            initial={{ pathLength: 0 }}
            animate={{ 
              d: Array.from({ length: 15 }, (_, frame) => {
                const points = [];
                const segments = 60;
                for (let j = 0; j <= segments; j++) {
                  const y = (j / segments) * 100;
                  const ecgPhase = (j + frame * 2 + 10) % 20;
                  let offset = 0;
                  if (ecgPhase >= 8 && ecgPhase < 10) offset = 5;
                  else if (ecgPhase >= 10 && ecgPhase < 11) offset = -15;
                  else if (ecgPhase >= 11 && ecgPhase < 12) offset = 25;
                  else if (ecgPhase >= 12 && ecgPhase < 14) offset = 5;
                  
                  const x = 70 + offset + Math.sin(j * 0.3 + frame * 0.2 + 1) * 3;
                  points.push(`${j === 0 ? 'M' : 'L'} ${x} ${y}%`);
                }
                return points.join(' ');
              }),
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />

          {/* Center pulse line */}
          <motion.line
            x1="50"
            y1="0"
            x2="50"
            y2="100"
            stroke="rgba(255, 255, 200, 0.15)"
            strokeWidth="1"
            strokeDasharray="5,10"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2 }}
          />

          {/* Electric pulses flowing down */}
          {[...Array(6)].map((_, i) => (
            <motion.circle
              key={`pulse-${i}`}
              r="2"
              fill="#fffae0"
              initial={{ cy: '-3%', cx: 50, opacity: 0 }}
              animate={{
                cy: ['-3%', '103%'],
                opacity: [0, 0.9, 0.6, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'linear',
              }}
            />
          ))}
        </svg>

        {/* Sparks */}
        {sparks.map((spark) => (
          <motion.div
            key={spark.id}
            className="absolute"
            style={{
              top: `${spark.y}%`,
              left: '50%',
            }}
            initial={{ opacity: 1, scale: 0 }}
            animate={{ 
              opacity: 0, 
              scale: [0, 1.2, 0],
              x: [(Math.random() - 0.5) * 40],
              y: [(Math.random() - 0.5) * 40],
            }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className="w-1 h-1 rounded-full"
              style={{
                background: '#fff',
                boxShadow: '0 0 8px #ffeb3b, 0 0 16px #ff9800',
              }}
            />
          </motion.div>
        ))}

        {/* Label */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 px-2 py-1 rounded-full text-[10px] font-medium whitespace-nowrap"
          style={{ 
            background: 'rgba(255, 200, 0, 0.08)',
            border: '1px solid rgba(255, 220, 100, 0.15)',
            color: 'rgba(253, 224, 71, 0.7)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          ⚡ Электричество
        </motion.div>
      </div>
    </div>
  );
}

// ===== HEAT FLOW - Warm flowing =====
function HeatFlow() {
  return (
    <div className="absolute top-0 bottom-0" style={{ left: '63%', width: '80px' }}>
      <div className="relative w-full h-full">
        {/* Heat pipe - very transparent */}
        <motion.div
          className="absolute top-0 bottom-0 w-5 rounded-full overflow-hidden"
          style={{ 
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(180deg, rgba(200, 60, 40, 0.05) 0%, rgba(255, 100, 60, 0.08) 50%, rgba(200, 60, 40, 0.05) 100%)',
            boxShadow: '0 0 25px rgba(255, 100, 60, 0.06)',
          }}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
        />

        {/* Heat shimmer */}
        <motion.div
          className="absolute top-0 bottom-0 w-1 rounded-full"
          style={{ 
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(180deg, transparent, rgba(255, 150, 100, 0.2), rgba(255, 180, 120, 0.3), rgba(255, 150, 100, 0.2), transparent)',
          }}
        />

        {/* Heat particles */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          {[...Array(10)].map((_, i) => (
            <motion.circle
              key={`heat-${i}`}
              r={2 + (i % 3) * 1.5}
              fill={`rgba(${255}, ${140 + i * 10}, ${100 + i * 5}, ${0.4 + (i % 3) * 0.15})`}
              initial={{ cy: '-5%', cx: 40 + Math.sin(i) * 10, opacity: 0 }}
              animate={{
                cy: ['-5%', '105%'],
                cx: [40 + Math.sin(i) * 10, 40 + Math.sin(i + 2) * 12, 40 + Math.sin(i) * 10],
                opacity: [0, 0.6, 0.5, 0],
              }}
              transition={{
                duration: 5 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: 'linear',
              }}
            />
          ))}
        </svg>

        {/* Label */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 px-2 py-1 rounded-full text-[10px] font-medium whitespace-nowrap"
          style={{ 
            background: 'rgba(200, 60, 40, 0.08)',
            border: '1px solid rgba(255, 140, 100, 0.15)',
            color: 'rgba(253, 186, 116, 0.7)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.8 }}
        >
          🔥 Тепло
        </motion.div>
      </div>
    </div>
  );
}

// ===== COMMUNICATION FLOW - ECG style like electricity =====
function CommunicationFlow() {
  const [impulses, setImpulses] = useState<{id: number, y: number}[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newImpulse = { id: Date.now(), y: Math.random() * 100 };
      setImpulses(prev => [...prev.slice(-6), newImpulse]);
    }, 180);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-0 bottom-0" style={{ left: '88%', width: '100px' }}>
      <div className="relative w-full h-full">
        {/* Communication cable - very transparent */}
        <motion.div
          className="absolute top-0 bottom-0 w-4 rounded-full"
          style={{ 
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(180deg, rgba(0, 180, 80, 0.04) 0%, rgba(0, 220, 100, 0.08) 50%, rgba(0, 180, 80, 0.04) 100%)',
            boxShadow: '0 0 25px rgba(0, 220, 100, 0.06)',
          }}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 1.5, delay: 0.9 }}
        />

        {/* ECG-style digital signals */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" preserveAspectRatio="none">
          {/* Left side digital ECG */}
          <motion.path
            fill="none"
            stroke="rgba(100, 255, 150, 0.45)"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ 
              d: Array.from({ length: 18 }, (_, frame) => {
                const points = [];
                const segments = 60;
                for (let j = 0; j <= segments; j++) {
                  const y = (j / segments) * 100;
                  // Digital ECG - sharper pulses
                  const ecgPhase = (j + frame * 3) % 15;
                  let offset = 0;
                  if (ecgPhase >= 5 && ecgPhase < 6) offset = -3;
                  else if (ecgPhase >= 6 && ecgPhase < 6.5) offset = 12;
                  else if (ecgPhase >= 6.5 && ecgPhase < 7) offset = -20;
                  else if (ecgPhase >= 7 && ecgPhase < 8) offset = 8;
                  else if (ecgPhase >= 8 && ecgPhase < 9) offset = -3;
                  
                  const x = 30 + offset + Math.sin(j * 0.4 + frame * 0.15) * 2;
                  points.push(`${j === 0 ? 'M' : 'L'} ${x} ${y}%`);
                }
                return points.join(' ');
              }),
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />

          {/* Right side digital ECG */}
          <motion.path
            fill="none"
            stroke="rgba(100, 255, 150, 0.45)"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ 
              d: Array.from({ length: 18 }, (_, frame) => {
                const points = [];
                const segments = 60;
                for (let j = 0; j <= segments; j++) {
                  const y = (j / segments) * 100;
                  const ecgPhase = (j + frame * 3 + 7) % 15;
                  let offset = 0;
                  if (ecgPhase >= 5 && ecgPhase < 6) offset = 3;
                  else if (ecgPhase >= 6 && ecgPhase < 6.5) offset = -12;
                  else if (ecgPhase >= 6.5 && ecgPhase < 7) offset = 20;
                  else if (ecgPhase >= 7 && ecgPhase < 8) offset = -8;
                  else if (ecgPhase >= 8 && ecgPhase < 9) offset = 3;
                  
                  const x = 70 + offset + Math.sin(j * 0.4 + frame * 0.15 + 2) * 2;
                  points.push(`${j === 0 ? 'M' : 'L'} ${x} ${y}%`);
                }
                return points.join(' ');
              }),
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />

          {/* Center data stream */}
          <motion.line
            x1="50"
            y1="0"
            x2="50"
            y2="100"
            stroke="rgba(100, 255, 150, 0.1)"
            strokeWidth="1"
            strokeDasharray="3,8"
          />

          {/* Data packets */}
          {[...Array(8)].map((_, i) => (
            <motion.rect
              key={`packet-${i}`}
              width="6"
              height="2"
              rx="1"
              fill="rgba(100, 255, 150, 0.6)"
              initial={{ y: '-3%', x: 47, opacity: 0 }}
              animate={{
                y: ['-3%', '103%'],
                opacity: [0, 0.8, 0.6, 0],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: i * 0.22,
                ease: 'linear',
              }}
            />
          ))}
        </svg>

        {/* Digital impulses */}
        {impulses.map((impulse) => (
          <motion.div
            key={impulse.id}
            className="absolute"
            style={{
              top: `${impulse.y}%`,
              left: '50%',
            }}
            initial={{ opacity: 1, scale: 0 }}
            animate={{ 
              opacity: 0, 
              scale: [0, 1, 0],
              x: [(Math.random() - 0.5) * 25],
              y: [(Math.random() - 0.5) * 25],
            }}
            transition={{ duration: 0.2 }}
          >
            <div 
              className="w-1 h-1 rounded-full"
              style={{
                background: '#fff',
                boxShadow: '0 0 6px #64ff96, 0 0 12px #00aa44',
              }}
            />
          </motion.div>
        ))}

        {/* Binary code */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`binary-${i}`}
            className="absolute text-[6px] font-mono"
            style={{
              color: 'rgba(100, 255, 150, 0.35)',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
            initial={{ top: '0%', opacity: 0 }}
            animate={{
              top: ['0%', '100%'],
              opacity: [0.15, 0.4, 0.15],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.35,
              ease: 'linear',
            }}
          >
            {Math.random() > 0.5 ? '1' : '0'}
          </motion.div>
        ))}

        {/* Label */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 px-2 py-1 rounded-full text-[10px] font-medium whitespace-nowrap"
          style={{ 
            background: 'rgba(0, 180, 80, 0.08)',
            border: '1px solid rgba(100, 255, 150, 0.15)',
            color: 'rgba(134, 239, 172, 0.7)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.1 }}
        >
          📡 Связь
        </motion.div>
      </div>
    </div>
  );
}

// ===== MAIN COMPONENT =====
export default function PipeAnimation() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Very subtle background pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.015]">
        <defs>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Vertical utility flows - behind all content */}
      <WaterFlow />
      <ElectricityFlow />
      <HeatFlow />
      <CommunicationFlow />
    </div>
  );
}
