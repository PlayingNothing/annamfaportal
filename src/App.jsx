import React, { useEffect, useState, useRef } from 'react';

const inlineGlobalStyles = `
@keyframes scanLine {
  0% { top: 0%; }
  50% { top: calc(100% - 2px); }
  100% { top: 0%; }
}
@keyframes stampImpact {
  0% { transform: scale(2); opacity: 0; }
  12% { transform: scale(0.98); opacity: 1; }
  18% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes stampShake {
  0%, 12% { transform: translateX(0); }
  13% { transform: translateX(-2px); }
  16% { transform: translateX(2px); }
  20%, 100% { transform: translateX(0); }
}
.reticle-spin-inline {
  animation: reticleSpin 18s linear infinite;
}
.reticle-drift-inline {
  animation: reticleDrift 8s ease-in-out infinite;
}
@keyframes reticleSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes reticleDrift {
  0% { transform: translate(-50%, -50%) translateX(-18px); }
  50% { transform: translate(-50%, -50%) translateX(18px); }
  100% { transform: translate(-50%, -50%) translateX(-18px); }
}
.breathing-glow {
  animation: breathingGlow 3s ease-in-out infinite;
}
@keyframes breathingGlow {
  0% { box-shadow: 0 0 18px rgba(239,68,68,0.6); border-color: rgba(239,68,68,0.6); }
  50% { box-shadow: 0 0 18px rgba(239,68,68,1); border-color: rgba(239,68,68,1); }
  100% { box-shadow: 0 0 18px rgba(239,68,68,0.6); border-color: rgba(239,68,68,0.6); }
}
.rec-blink {
  animation: recBlink 1s steps(2, end) infinite;
}
@keyframes recBlink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
.slider-handle-pulse {
  animation: sliderHandlePulse 0.9s ease-in-out 3;
}
@keyframes sliderHandlePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0,255,255,0.25); transform: scale(1); }
  50% { box-shadow: 0 0 0 10px rgba(0,255,255,0); transform: scale(1.06); }
}
.declassify-hint {
  animation: declassifyHintPulse 3s ease-in-out infinite;
}
@keyframes declassifyHintPulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
.slider-crt-overlay {
  background-image: repeating-linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.15) 0px,
    rgba(0, 0, 0, 0.15) 1px,
    transparent 1px,
    transparent 4px
  );
  animation: sliderScanDrift 14s linear infinite, sliderScreenFlicker 4s ease-in-out infinite;
}
@keyframes sliderScanDrift {
  0% { background-position: 0 0; }
  100% { background-position: 0 24px; }
}
@keyframes sliderScreenFlicker {
  0%, 100% { opacity: 0.35; }
  50% { opacity: 0.45; }
}
@keyframes lockoutFlash {
  0% { opacity: 0; }
  50% { opacity: 0.35; }
  100% { opacity: 0; }
}
.lockout-flash {
  animation: lockoutFlash 220ms ease-out;
}
.crt-scanlines {
  background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 100% 4px;
}
.glitch-frame {
  position: relative;
  overflow: hidden;
}
.glitch-frame::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' seed='2'/></filter><rect width='120' height='120' filter='url(%23n)' opacity='0.2'/></svg>");
  opacity: 0;
  mix-blend-mode: screen;
  pointer-events: none;
}
.glitch-frame:hover::after {
  animation: glitchFlicker 0.35s steps(3, end);
}
@keyframes glitchFlicker {
  0% { opacity: 0; }
  30% { opacity: 0.35; }
  60% { opacity: 0.1; }
  100% { opacity: 0; }
}
.glitch-img {
  display: block;
  transition: transform 0.2s ease, filter 0.2s ease;
}
.glitch-frame:hover .glitch-img {
  filter:
    drop-shadow(1px 0 0 rgba(255,0,0,0.55))
    drop-shadow(-1px 0 0 rgba(0,255,128,0.55))
    drop-shadow(0 0 6px rgba(6,182,212,0.35));
}
.stamp-impact {
  animation: stampImpact 4s ease-out infinite;
  display: inline-block;
}
.stamp-shake {
  animation: stampShake 4s ease-out infinite;
}
.typography-body,
body {
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
  font-weight: 400;
  line-height: 1.6;
  color: #e0e0e0;
}
h1, h2, h3, nav, nav a {
  font-family: 'JetBrains Mono', 'Roboto Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}
.cursor-crosshair {
  cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'><circle cx='14' cy='14' r='6.5' fill='none' stroke='%2306b6d4' stroke-width='1.6'/><line x1='14' y1='2' x2='14' y2='8' stroke='%2306b6d4' stroke-width='1.6'/><line x1='14' y1='20' x2='14' y2='26' stroke='%2306b6d4' stroke-width='1.6'/><line x1='2' y1='14' x2='8' y2='14' stroke='%2306b6d4' stroke-width='1.6'/><line x1='20' y1='14' x2='26' y2='14' stroke='%2306b6d4' stroke-width='1.6'/></svg>") 14 14, crosshair;
}
.cursor-crosshair-red {
  cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='34' height='34' viewBox='0 0 34 34'><circle cx='17' cy='17' r='8.5' fill='none' stroke='%23ff3b3b' stroke-width='1.8'/><line x1='17' y1='2' x2='17' y2='9' stroke='%23ff3b3b' stroke-width='1.8'/><line x1='17' y1='25' x2='17' y2='32' stroke='%23ff3b3b' stroke-width='1.8'/><line x1='2' y1='17' x2='9' y2='17' stroke='%23ff3b3b' stroke-width='1.8'/><line x1='25' y1='17' x2='32' y2='17' stroke='%23ff3b3b' stroke-width='1.8'/></svg>") 17 17, crosshair;
}
body { cursor: inherit; }
html, body, #root { cursor: inherit; }
body, #root { cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'><circle cx='14' cy='14' r='6.5' fill='none' stroke='%2306b6d4' stroke-width='1.6'/><line x1='14' y1='2' x2='14' y2='8' stroke='%2306b6d4' stroke-width='1.6'/><line x1='14' y1='20' x2='14' y2='26' stroke='%2306b6d4' stroke-width='1.6'/><line x1='2' y1='14' x2='8' y2='14' stroke='%2306b6d4' stroke-width='1.6'/><line x1='20' y1='14' x2='26' y2='14' stroke='%2306b6d4' stroke-width='1.6'/></svg>") 14 14, crosshair; }
a, button, [role='button'], input, select, textarea, label, iframe, video, .cursor-red { cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='34' height='34' viewBox='0 0 34 34'><circle cx='17' cy='17' r='8.5' fill='none' stroke='%23ff3b3b' stroke-width='1.8'/><line x1='17' y1='2' x2='17' y2='9' stroke='%23ff3b3b' stroke-width='1.8'/><line x1='17' y1='25' x2='17' y2='32' stroke='%23ff3b3b' stroke-width='1.8'/><line x1='2' y1='17' x2='9' y2='17' stroke='%23ff3b3b' stroke-width='1.8'/><line x1='25' y1='17' x2='32' y2='17' stroke='%23ff3b3b' stroke-width='1.8'/></svg>") 17 17, crosshair; }
.reveal-on-scroll {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal-on-scroll.revealed {
  opacity: 1;
  transform: translateY(0);
}
`;
import {
  Shield,
  Globe,
  Lock,
  Map,
  Crosshair,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  Volume2,
  Wifi,
  FileText,
} from 'lucide-react';

const useTypewriter = (text, speed = 50) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
        index += 1;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return displayedText;
};

const useDecryptOnView = (text, duration = 1500) => {
  const [displayed, setDisplayed] = useState(text);
  const ref = useRef(null);

  useEffect(() => {
    const chars = '#$@!%*+=?0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let intervalId;
    let startTime;
    let hasRun = false;

    const run = () => {
      if (hasRun) return;
      hasRun = true;
      startTime = Date.now();
      intervalId = setInterval(() => {
        const elapsed = Date.now() - startTime;
        if (elapsed >= duration) {
          setDisplayed(text);
          clearInterval(intervalId);
          return;
        }
        const progress = elapsed / duration;
        const revealCount = Math.floor(text.length * progress);
        const scrambled = text
          .split('')
          .map((char, idx) => {
            if (idx < revealCount || char === ' ') return char;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
        setDisplayed(scrambled);
      }, 40);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (intervalId) clearInterval(intervalId);
      observer.disconnect();
    };
  }, [text, duration]);

  return { ref, displayed };
};

const DecryptText = ({ text, className }) => {
  const { ref, displayed } = useDecryptOnView(text);
  return (
    <div ref={ref} className={className}>
      {displayed}
    </div>
  );
};

const TargetProfilingSlider = ({ targetProfiling }) => {
  const [split, setSplit] = useState(50);
  const [showHandlePulse, setShowHandlePulse] = useState(true);
  const isThreatState = split > 50;

  useEffect(() => {
    const timer = window.setTimeout(() => setShowHandlePulse(false), 2800);
    return () => window.clearTimeout(timer);
  }, []);

  const readoutHeader = isThreatState
    ? 'OFFICIAL NARRATIVE: THE MONSTER'
    : 'ASSET PERSPECTIVE: THE HUMAN';
  const readoutStatus = isThreatState ? 'EXISTENTIAL THREAT.' : 'DESECURITIZED.';
  const readoutText = isThreatState ? targetProfiling.left.intelText : targetProfiling.right.intelText;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-px flex-1 bg-cyan-400/30" />
        <span className="text-cyan-400 font-mono text-sm font-bold px-3">{targetProfiling.title}</span>
        <div className="h-px flex-1 bg-cyan-400/30" />
      </div>

      <div className="rounded-lg border border-cyan-400/60 bg-slate-950/80 p-4 shadow-[0_0_18px_rgba(6,182,212,0.25),0_0_14px_rgba(239,68,68,0.22)]">
        <div className="mb-3 text-center text-cyan-300 font-mono text-xs md:text-sm font-bold tracking-wide declassify-hint">
          [ DRAG SLIDER TO DECLASSIFY ]
        </div>
        <div className="relative h-72 md:h-80 overflow-hidden rounded-md border border-red-500/40">
          <img
            src={targetProfiling.right.image}
            alt="Puppy Kim"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-y-0 right-0 z-20 overflow-hidden pointer-events-none"
            style={{ width: `${100 - split}%` }}
          >
            <div className="absolute right-3 top-3 bg-emerald-500/90 text-slate-950 font-mono text-[11px] md:text-xs font-bold px-2 py-1 rounded whitespace-nowrap">
              [ ASSET DESECURITIZED ]
            </div>
          </div>

          <div
            className="absolute inset-y-0 left-0 overflow-hidden"
            style={{ width: `${split}%` }}
          >
            <img
              src={targetProfiling.left.image}
              alt="Angry Kim"
              className="h-full w-full object-cover"
            />
            <div className="absolute left-3 top-3 z-20 bg-red-500/90 text-white font-mono text-[11px] md:text-xs font-bold px-2 py-1 rounded">
              [ THREAT DETECTED ]
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 z-10 slider-crt-overlay" />

          <div
            className="pointer-events-none absolute inset-y-0 z-20"
            style={{ left: `${split}%`, transform: 'translateX(-50%)' }}
          >
            <div className="h-full w-[2px] bg-[#00FFFF] shadow-[0_0_10px_rgba(0,255,255,0.9)]" />
            <div
              className={`absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#00FFFF] bg-slate-950/90 text-[#00FFFF] flex items-center justify-center shadow-[0_0_12px_rgba(0,255,255,0.75)] ${showHandlePulse ? 'slider-handle-pulse' : ''}`}
            >
              <Crosshair className="h-5 w-5" />
            </div>
            <span className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-[240%] text-[#00FFFF] font-mono text-xl font-bold">
              {'<'}
            </span>
            <span className="absolute left-1/2 top-1/2 -translate-y-1/2 translate-x-[140%] text-[#00FFFF] font-mono text-xl font-bold">
              {'>'}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={split}
            aria-label="Target profiling comparison slider"
            onChange={(event) => setSplit(Number(event.target.value))}
            className="absolute inset-0 z-30 h-full w-full cursor-ew-resize opacity-0"
          />
        </div>

          <div className="mt-4 rounded-md border border-cyan-400/40 bg-slate-950/70 p-4 font-mono">
            <div className="text-sky-300 text-xs md:text-sm font-bold mb-2">INTEL READOUT</div>
          <div className={`text-sm md:text-base font-bold mb-1 ${isThreatState ? 'text-red-400' : 'text-emerald-300'}`}>
            {readoutHeader}
          </div>
          <div className={`text-xs md:text-sm font-bold mb-2 ${isThreatState ? 'text-red-300' : 'text-cyan-300'}`}>
            STATUS: {readoutStatus}
          </div>
          <DecryptText
            text={readoutText}
            className={`text-xs md:text-sm leading-relaxed ${isThreatState ? 'text-cyan-200' : 'text-emerald-100'}`}
          />
        </div>
      </div>
    </div>
  );
};

const LockedDossierOverlay = () => {
  const [isFlashing, setIsFlashing] = useState(false);

  const triggerFlash = () => {
    setIsFlashing(true);
    window.setTimeout(() => setIsFlashing(false), 230);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={triggerFlash}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          triggerFlash();
        }
      }}
      className="absolute inset-0 z-40 cursor-red bg-slate-950 backdrop-blur-[40px] border-t border-cyan-400/30 flex items-center justify-center text-center px-6"
    >
      <div className="w-full max-w-2xl">
        <div className="mx-auto mb-5 h-20 w-20 rounded-full border-2 border-red-500/80 text-red-500 flex items-center justify-center shadow-[0_0_24px_rgba(239,68,68,0.45)]">
          <Lock className="h-10 w-10" />
        </div>
        <div className="text-red-400 font-mono text-lg md:text-2xl font-bold tracking-wide mb-3">
          ACCESS DENIED: CLEARANCE LEVEL INSUFFICIENT
        </div>
        <div className="text-cyan-200/90 font-mono text-xs md:text-sm leading-relaxed">
          This intelligence dossier is currently encrypted. Mission authorization pending Week 7 protocols.
        </div>
      </div>
      <div className={`pointer-events-none absolute inset-0 bg-red-500 ${isFlashing ? 'lockout-flash' : 'opacity-0'}`} />
    </div>
  );
};

const ParticleNetwork = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const frameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = {
      width: canvas.offsetWidth,
      height: canvas.offsetHeight,
      nodes: [],
      density: 95,
    };

    const resize = () => {
      state.width = canvas.offsetWidth;
      state.height = canvas.offsetHeight;
      canvas.width = state.width;
      canvas.height = state.height;
      const count = Math.max(45, Math.floor((state.width * state.height) / 28000));
      state.nodes = Array.from({ length: count }).map(() => ({
        x: Math.random() * state.width,
        y: Math.random() * state.height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        glowPhase: Math.random() * Math.PI * 2,
        glowSpeed: 0.0015 + Math.random() * 0.0025,
        glowBoost: 0.35 + Math.random() * 0.35,
      }));
    };

    resize();
    const handleResize = () => resize();
    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, state.width, state.height);

      const { x: mx, y: my, active } = mouseRef.current;

      for (const node of state.nodes) {
        if (active) {
          const dx = mx - node.x;
          const dy = my - node.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 140) {
            node.vx += (dx / dist) * 0.003;
            node.vy += (dy / dist) * 0.003;
          }
        }

        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > state.width) node.vx *= -1;
        if (node.y < 0 || node.y > state.height) node.vy *= -1;
      }

      for (let i = 0; i < state.nodes.length; i += 1) {
        const a = state.nodes[i];
        for (let j = i + 1; j < state.nodes.length; j += 1) {
          const b = state.nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < state.density) {
            const alpha = 0.65 * (1 - dist / state.density);
            ctx.strokeStyle = `rgba(34,211,238,${alpha})`;
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            ctx.strokeStyle = `rgba(34,211,238,${alpha * 0.4})`;
            ctx.lineWidth = 3;
            ctx.stroke();
          }
        }
      }

      for (const node of state.nodes) {
        node.glowPhase += node.glowSpeed;
        const pulse = (Math.sin(node.glowPhase) + 1) / 2;
        const intensity = 0.45 + pulse * node.glowBoost * 0.35;
        const core = 1.8 + intensity * 0.9;
        const glow = 3.6 + intensity * 3.2;
        ctx.fillStyle = `rgba(34,211,238,${0.45 + intensity * 0.25})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, core, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(34,211,238,${0.08 + intensity * 0.12})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, glow, 0, Math.PI * 2);
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      active: true,
    };
  };

  const handleLeave = () => {
    mouseRef.current.active = false;
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-10"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    />
  );
};


const HeroSection = () => {
  const headline = useTypewriter('MFA INTELLIGENCE PORTAL: GLOBAL ANALYSIS BRIEFING', 50);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <style>{inlineGlobalStyles}</style>
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/media/data-map.png)",
        }}
      >
        <div className="absolute inset-0 bg-slate-950/60" />
        <ParticleNetwork />
      </div>

      <div className="relative z-10 text-center px-4 md:px-6 max-w-5xl">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 text-cyan-400 tracking-wider font-mono">
          {headline}
          <span className="animate-pulse">|</span>
        </h1>

        <div className="mt-8 inline-block bg-slate-900/60 backdrop-blur-sm border border-cyan-400 px-6 md:px-8 py-4 rounded-lg">
          <p className="text-base md:text-xl text-cyan-300 font-mono">
            Analyst: <span className="text-white font-bold">Anna Goh (POSC103)</span>
          </p>
          <p className="text-base md:text-xl text-cyan-300 font-mono mt-2">
            Clearance Level: <span className="text-red-500 font-bold animate-pulse">TOP SECRET</span>
          </p>
          <p className="text-xs md:text-sm text-cyan-400 font-mono mt-2 opacity-70">
            Login: {new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC
          </p>
        </div>

      </div>
    </section>
  );
};

const PersonnelFile = () => (
  <section data-reveal className="py-16 px-4 md:px-6 max-w-6xl mx-auto reveal-on-scroll">
    <div className="bg-slate-900/40 backdrop-blur-md border border-cyan-400 rounded-lg p-6 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5" />

      <div className="relative z-10">
        <h2 className="text-xl md:text-2xl font-bold text-cyan-400 mb-6 font-mono flex items-center gap-3">
          <Shield className="w-6 h-6 md:w-8 md:h-8" />
          PERSONNEL FILE: ANALYST PROFILE
        </h2>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
          <div className="flex-shrink-0">
            <div className="group w-40 h-40 md:w-48 md:h-48 border-4 border-cyan-400 hover:border-green-400 transition-colors rounded-lg bg-slate-800 flex items-center justify-center relative overflow-hidden">
              <img
                src="/media/anna-goh-photo-id.jpg"
                alt="Analyst Anna Goh ID"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10" />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(6,182,212,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.2) 1px, transparent 1px)',
                  backgroundSize: '26px 26px',
                }}
              />
              <div
                className="absolute left-0 right-0 top-0 h-0.5 bg-cyan-300/80 shadow-[0_0_12px_rgba(34,211,238,0.8)]"
                style={{ animation: 'scanLine 4s ease-in-out infinite' }}
              />
            </div>

            <div className="mt-4 bg-green-900/80 border-2 border-green-500 rounded-lg px-4 py-2 text-center stamp-shake" >
              <p className="text-green-400 font-bold text-sm font-mono stamp-impact" >
                ✓ CLEARANCE GRANTED
              </p>
              <p className="text-green-300 text-xs font-mono mt-1">LEVEL: TOP SECRET</p>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="bg-slate-950 border border-cyan-400 rounded-lg p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-2 border-b border-cyan-400 gap-2">
                <h3 className="text-cyan-400 font-mono text-lg font-bold">ANALYST BIO</h3>
                <span className="text-xs text-cyan-400 font-mono">CLASSIFICATION: UNCLASSIFIED</span>
              </div>

              <div className="font-mono text-sm leading-relaxed space-y-3 text-cyan-50">
                <p>
                  <span className="text-cyan-400 font-bold">NAME:</span> Anna Goh
                  <br />
                  <span className="text-cyan-400 font-bold">DESIGNATION:</span> MFA Foreign Service Officer
                  <br />
                  <span className="text-cyan-400 font-bold">UNIT:</span> POSC103 - International Relations Division
                  <br />
                  <span className="text-cyan-400 font-bold">SPECIALIZATION:</span> Visual Politics, Critical Security Studies,
                  Pop Culture & IR
                </p>

                  <p className="text-cyan-100">
                    Deployed to the POSC103 Division to analyze the nexus of Pop Culture and Global Relations. This dossier
                    logs active field intelligence on Sovereignty, Security, Borders, and Empire/Decolonization.
                  </p>
                  <div className="mt-6 border border-cyan-400/40 bg-slate-950/70 rounded-lg p-4 md:p-5">
                    <div className="text-xs md:text-sm font-mono text-cyan-300/80 font-bold mb-3">
                      SYSTEM NOTE: THEMATIC PROTOCOL
                    </div>
                    <div className="text-xs md:text-sm font-mono text-cyan-200/70">
                      <div className="mb-3">
                        <div className="font-bold text-cyan-300">FRAMEWORK // MFA SIMULATION:</div>
                        <div>
                          Adopts the operational lens of a Foreign Service Officer. This thematic choice directly reflects the
                          Analyst&apos;s aspiration to join the diplomatic corps.
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="font-bold text-white">OBJECTIVE // ACTIONABLE INTEL:</div>
                        <div>
                          Processes POSC103 coursework as active intelligence rather than passive theory. This portfolio
                          serves as both an academic inquiry and a professional manifesto.
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-cyan-300">THESIS // VISUAL POLITICS:</div>
                        <div>
                          Demonstrates that global power is constructed through images and cultural narratives, not just
                          formal treaties.
                        </div>
                      </div>
                    </div>
                  </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="mt-12">
      </div>
  </section>
);

const NavigationCards = () => {
  const cards = [
    { id: 'sovereignty', number: '01', title: 'SOVEREIGNTY', icon: Globe, tone: 'yellow' },
    { id: 'security', number: '02', title: 'SECURITY', icon: Shield, tone: 'yellow' },
    { id: 'empire', number: '03', title: 'EMPIRE', icon: Lock, tone: 'yellow' },
    { id: 'borders', number: '04', title: 'BORDERS', icon: Map, tone: 'yellow' },
      {
        id: 'audio-transmission',
        number: '05',
        title: 'INTERCEPTED AUDIO',
        icon: Volume2,
        tone: 'red',
        gridClass: 'sm:col-start-1 sm:col-end-3 lg:col-start-2 lg:col-end-4',
      },
  ];

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="mission-files" data-reveal className="py-16 px-4 md:px-6 max-w-7xl mx-auto reveal-on-scroll">
      <h2 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-12 text-center font-mono tracking-wider">
        [ MISSION FILES: SELECT BRIEFING ]
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const IconComponent = card.icon;
          const isRed = card.tone === 'red';
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => scrollToSection(card.id)}
              className={`group relative rounded-xl cursor-pointer text-left transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 cursor-red ${
                isRed ? 'hover:shadow-[0_0_30px_rgba(239,68,68,0.55)]' : ''
              } ${card.gridClass || ''}`}
            >
              <div className="relative">
                <div
                  className={`absolute -top-3 left-6 h-6 w-24 rounded-t-lg border-2 border-b-0 shadow-[0_6px_12px_rgba(0,0,0,0.25)] ${
                    isRed
                      ? 'border-red-600 bg-gradient-to-b from-red-500 to-red-600'
                      : 'border-yellow-600 bg-gradient-to-b from-yellow-500 to-yellow-600'
                  }`}
                />
                <div
                  className={`absolute -top-3 left-28 h-6 w-10 rounded-t-lg border-2 border-b-0 opacity-70 ${
                    isRed
                      ? 'border-red-600 bg-gradient-to-b from-red-500 to-red-600'
                      : 'border-yellow-600 bg-gradient-to-b from-yellow-500 to-yellow-600'
                  }`}
                />
              </div>

              <div
                className={`relative rounded-xl border-2 px-6 md:px-8 py-7 md:py-8 shadow-[0_12px_24px_rgba(0,0,0,0.35)] group-hover:border-cyan-400 ${
                  isRed
                    ? 'bg-gradient-to-br from-red-700 to-red-900 border-red-600'
                    : 'bg-gradient-to-br from-yellow-600 to-yellow-800 border-yellow-600'
                }`}
              >
                <div className="absolute top-4 right-4">
                  <Lock
                    className={`w-5 h-5 group-hover:text-cyan-400 transition-colors ${
                      isRed ? 'text-red-900/80' : 'text-yellow-900/80'
                    }`}
                  />
                </div>

                <div
                  className={`font-mono text-sm mb-2 font-bold tracking-wider ${
                    isRed ? 'text-red-100' : 'text-yellow-100'
                  }`}
                >
                  FILE {card.number}
                </div>

                <div className="mb-4 flex justify-center">
                  <IconComponent
                    className={`w-12 h-12 md:w-16 md:h-16 group-hover:text-cyan-400 transition-colors ${
                      isRed ? 'text-red-100' : 'text-yellow-100'
                    }`}
                  />
                </div>

                <h3
                  className={`text-xl md:text-2xl font-bold font-mono tracking-wide group-hover:text-cyan-400 transition-colors text-center ${
                    isRed ? 'text-red-50' : 'text-yellow-50'
                  }`}
                >
                  {card.title}
                </h3>

                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-cyan-400 text-sm font-mono animate-pulse">&gt; ACCESSING FILE...</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

const InterceptedFootage = ({
  videoUrl,
  label = 'INTERCEPTED FOOTAGE',
  footerLabel = '[ TRAINING MODULE: The Sovereign State ]',
}) => (
    <div className="my-8">
      <div className="bg-slate-900 border-2 border-red-500 rounded-lg p-2 relative breathing-glow cursor-red">
      <div className="absolute -top-3 left-4 bg-red-600 px-3 py-1 rounded flex items-center gap-2 z-10">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        <span className="text-white text-xs font-mono font-bold">{label}</span>
      </div>
      <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500 rec-blink" />
        <span className="text-red-400 text-[10px] font-mono font-bold">REC</span>
      </div>
      <div className="aspect-video mt-2 cursor-red">
        {videoUrl ? (
          <iframe
            src={videoUrl}
            className="w-full h-full rounded"
            title={label}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="relative w-full h-full bg-slate-800 rounded flex items-center justify-center border border-red-500/50 overflow-hidden">
            <div className="text-center">
              <div className="text-red-500 font-mono text-lg mb-2">[ VIDEO PLACEHOLDER ]</div>
              <div className="text-cyan-400 font-mono text-xs">Insert YouTube embed URL</div>
            </div>
            <div className="absolute inset-0 pointer-events-none crt-scanlines opacity-40" />
          </div>
        )}
      </div>
    </div>
    <div className="mt-2 text-xs font-mono text-red-400 text-center">{footerLabel}</div>
  </div>
);

const EvidenceImage = ({ imageUrl, label = 'SECURITY WARNING', footerLabel }) => (
  <div className="my-8">
    <div className="bg-slate-900 border-2 border-red-500 rounded-lg p-2 shadow-[0_0_20px_rgba(239,68,68,0.3)] relative cursor-red">
      <div className="absolute -top-3 left-4 bg-red-600 px-3 py-1 rounded flex items-center gap-2 z-10">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        <span className="text-white text-xs font-mono font-bold">{label}</span>
      </div>
      <div className="mt-2">
        {imageUrl ? (
          <img src={imageUrl} alt={label} className="w-full h-auto rounded" />
        ) : (
          <div className="w-full aspect-video bg-slate-800 rounded flex items-center justify-center border border-red-500/50">
            <div className="text-center">
              <div className="text-red-500 font-mono text-lg mb-2">[ IMAGE PLACEHOLDER ]</div>
              <div className="text-cyan-400 font-mono text-xs">Insert evidence image URL</div>
            </div>
          </div>
        )}
      </div>
    </div>
    {footerLabel && <div className="mt-2 text-xs font-mono text-red-400 text-center">{footerLabel}</div>}
  </div>
);

const SatelliteImage = ({
  imageUrl,
  label = 'SATELLITE SURVEILLANCE',
  footerLabel = '[ IMAGERY INTELLIGENCE // RESTRICTED ]',
  imageClassName,
  coordinatesText = 'LAT: 38.8977° N | LONG: 77.0365° W',
}) => {
  const [displayedCoords, setDisplayedCoords] = useState(coordinatesText);

  useEffect(() => {
    let active = true;
    const digits = '0123456789';
    const scramble = () =>
      coordinatesText
        .split('')
        .map((char) => (/\d/.test(char) ? digits[Math.floor(Math.random() * digits.length)] : char))
        .join('');

    const interval = setInterval(() => {
      if (active) setDisplayedCoords(scramble());
    }, 70);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [coordinatesText]);

  return (
    <div className="my-8">
      <div className="bg-slate-900 border-2 border-cyan-400 rounded-lg p-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] relative">
        <div className="absolute -top-3 left-4 bg-cyan-600 px-3 py-1 rounded flex items-center gap-2 z-10">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-white text-xs font-mono font-bold">{label}</span>
        </div>
        <div className="relative mt-2">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={label}
              className={imageClassName || 'w-full h-auto rounded'}
            />
          ) : (
            <div className="w-full aspect-video bg-slate-800 rounded flex items-center justify-center border border-cyan-500/50">
              <div className="text-center">
                <div className="text-cyan-400 font-mono text-lg mb-2">[ IMAGE PLACEHOLDER ]</div>
                <div className="text-cyan-400 font-mono text-xs">Insert surveillance image URL</div>
              </div>
            </div>
          )}
          <div
            className="absolute inset-0 pointer-events-none rounded"
            style={{
              backgroundImage:
                'linear-gradient(rgba(6,182,212,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.15) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
          <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-cyan-400" />
          <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-cyan-400" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-cyan-400" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-cyan-400" />
          <div
            className="absolute left-1/2 top-1/2 w-20 h-20 pointer-events-none"
            style={{ animation: 'reticleDrift 8s ease-in-out infinite' }}
          >
            <div
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-12 border border-cyan-300/70 rounded-full"
              style={{ animation: 'reticleSpin 18s linear infinite' }}
            />
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-cyan-300/80 rounded-full" />
          </div>
          <div className="absolute bottom-4 left-4 bg-slate-950/80 px-2 py-1 rounded">
            <span className="text-cyan-400 font-mono text-xs">{displayedCoords}</span>
          </div>
        </div>
      </div>
      <div className="mt-2 text-xs font-mono text-cyan-400 text-center">{footerLabel}</div>
    </div>
  );
};

const BriefingSection = ({
  id,
  title,
  subjectLine,
  statusLine,
  introText,
  analysisText,
  theoryText,
  video1Url,
  video2Url,
  video1FooterLabel,
  video2FooterLabel,
  satelliteImageUrl,
  satelliteLabel,
  satelliteFooterLabel,
  satelliteImageClassName,
  section3Label,
  nextDossier,
  targetProfiling,
  targetProfilingFirst,
  introLabel = '[SECTION 1: INTELLIGENCE BRIEFING]',
  analysisLabel = '[SECTION 2: THEORETICAL FRAMEWORK]',
  swapVideo2Satellite,
  satelliteBeforeAnalysis,
  evidenceImage,
  hideSection3,
  systemAlert,
  tacticalContext,
  lockedContent,
}) => (
  <section id={id} data-reveal className="py-16 px-4 md:px-6 scroll-mt-20 reveal-on-scroll">
    <div className="max-w-3xl mx-auto">
      <div className="bg-slate-900/80 backdrop-blur-sm border border-cyan-400 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.2)]">
        <div className="bg-slate-950 border-b-2 border-cyan-400 px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-cyan-400 font-mono text-sm">DOSSIER_{id.toUpperCase()}.classified</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-red-500 font-mono text-xs font-bold border border-red-500 px-2 py-1">TOP SECRET</span>
              <span className="text-yellow-400 font-mono text-xs">REF: MFA-2026-{id.toUpperCase()}</span>
            </div>
          </div>
        </div>

          <div className="p-6 md:p-8 relative">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-cyan-400 mb-3 font-mono tracking-wider text-center border-b border-cyan-400/30 pb-4">
            {title}
          </h2>
          {(subjectLine || statusLine) && (
            <div className="mb-6 text-center font-mono text-sm text-cyan-200 space-y-1">
              {subjectLine && <div>{subjectLine}</div>}
              {statusLine && <div className="text-yellow-400">{statusLine}</div>}
            </div>
          )}
          {tacticalContext && (
            <div className="mb-8 bg-slate-950/60 border border-red-500/70 backdrop-blur-md rounded-lg p-4 md:p-5 shadow-[0_0_18px_rgba(239,68,68,0.25)] animate-fade-in">
              <div className="text-red-400 font-mono text-xs md:text-sm font-bold mb-3">
                // TACTICAL CONTEXT: WAKANDA VS. DPRK
              </div>
              <div className="text-cyan-200/90 font-mono text-xs md:text-sm leading-relaxed whitespace-pre-line">
                COMPARATIVE INTEL LOADED: Unlike Wakanda, which used Visual Politics to hide its power (Invisibility),
                North Korea uses Securitization to project power (Hyper-Visibility).

                Wakanda: Sovereignty protects the Resource (Vibranium).
                North Korea: Security protects the Narrative (Kim Jong-un).

                THEORY LINK: In Wakanda, the King serves the State; in North Korea, the State serves the King.
              </div>
            </div>
          )}

          {targetProfilingFirst && targetProfiling && <TargetProfilingSlider targetProfiling={targetProfiling} />}

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-cyan-400/30" />
              <span className="text-cyan-400 font-mono text-sm font-bold px-3">{introLabel}</span>
              <div className="h-px flex-1 bg-cyan-400/30" />
            </div>
            <div
              className="font-mono text-sm leading-relaxed text-cyan-50 [&_strong]:text-cyan-400 [&_strong]:font-bold [&_em]:italic [&_em]:text-cyan-200 [&_a]:text-cyan-400 [&_a]:underline [&_a:hover]:text-cyan-300"
              dangerouslySetInnerHTML={{ __html: introText }}
            />
          </div>

          {evidenceImage && (
            <EvidenceImage
              imageUrl={evidenceImage.image}
              label={evidenceImage.label}
              footerLabel={evidenceImage.footer}
            />
          )}

          <InterceptedFootage
            videoUrl={video1Url}
            label="INTERCEPTED FOOTAGE"
            footerLabel={video1FooterLabel}
          />

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-cyan-400/30" />
              <span className="text-cyan-400 font-mono text-sm font-bold px-3">{analysisLabel}</span>
              <div className="h-px flex-1 bg-cyan-400/30" />
            </div>
            {satelliteBeforeAnalysis && (
              <div className="mb-6">
                <SatelliteImage
                  imageUrl={satelliteImageUrl}
                  label={satelliteLabel || 'SATELLITE SURVEILLANCE'}
                  footerLabel={satelliteFooterLabel}
                  imageClassName={satelliteImageClassName}
                />
              </div>
            )}
            <div
              className="font-mono text-sm leading-relaxed text-cyan-50 [&_strong]:text-cyan-400 [&_strong]:font-bold [&_em]:italic [&_em]:text-cyan-200 [&_a]:text-cyan-400 [&_a]:underline [&_a:hover]:text-cyan-300"
              dangerouslySetInnerHTML={{ __html: analysisText }}
            />
          </div>

          {!targetProfilingFirst && targetProfiling && <TargetProfilingSlider targetProfiling={targetProfiling} />}

          {!hideSection3 &&
            !satelliteBeforeAnalysis &&
            (swapVideo2Satellite ? (
              <SatelliteImage
                imageUrl={satelliteImageUrl}
                label={satelliteLabel || 'SATELLITE SURVEILLANCE'}
                footerLabel={satelliteFooterLabel}
                imageClassName={satelliteImageClassName}
              />
            ) : (
              <InterceptedFootage
                videoUrl={video2Url}
                label="ACADEMIC SOURCE MATERIAL"
                footerLabel={video2FooterLabel}
              />
            ))}

          {!hideSection3 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-cyan-400/30" />
                <span className="text-cyan-400 font-mono text-sm font-bold px-3">
                  {section3Label || '§3 THEORETICAL FRAMEWORK'}
                </span>
                <div className="h-px flex-1 bg-cyan-400/30" />
              </div>
              <div
                className="font-mono text-sm leading-relaxed text-cyan-50 [&_strong]:text-cyan-400 [&_strong]:font-bold [&_em]:italic [&_em]:text-cyan-200 [&_a]:text-cyan-400 [&_a]:underline [&_a:hover]:text-cyan-300"
                dangerouslySetInnerHTML={{ __html: theoryText }}
              />
            </div>
          )}

          {!hideSection3 &&
            (swapVideo2Satellite ? (
              <InterceptedFootage
                videoUrl={video2Url}
                label="ACADEMIC SOURCE MATERIAL"
                footerLabel={video2FooterLabel}
              />
            ) : (
              <SatelliteImage
                imageUrl={satelliteImageUrl}
                label={satelliteLabel || 'SATELLITE SURVEILLANCE'}
                footerLabel={satelliteFooterLabel}
                imageClassName={satelliteImageClassName}
              />
            ))}

          {systemAlert && (
            <div className="mt-8">
              <div className="bg-slate-950/80 border-2 border-cyan-400/80 rounded-lg p-4 md:p-5 shadow-[0_0_18px_rgba(6,182,212,0.35)] animate-pulse">
                <div className="text-yellow-400 font-mono text-xs md:text-sm font-bold mb-3">
                  // SYSTEM ALERT: INTELLIGENCE CROSS-REFERENCE FOUND
                </div>
                <div className="text-cyan-200/90 font-mono text-xs md:text-sm leading-relaxed">
                  ANALYSIS COMPLETE. DETECTED PATTERN: Wakanda’s "Invisibility" strategy (Sovereignty) stands in
                  direct contrast to the "Hyper-Visibility" of the North Korean regime (Security) and proves
                  Sovereignty is ultimately a Security strategy.
                  <br /><br />
                  NEXT DIRECTIVE: Proceed to Dossier #2 to analyze how the projection of threat differs from the
                  concealment of power.
                </div>
              </div>
            </div>
          )}

            <div className="mt-8 pt-4 border-t border-cyan-400/30">
              <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-xs font-mono">
                <span className="text-cyan-400">[ END OF DOSSIER: {id.toUpperCase()} ]</span>
              <span className="text-yellow-400">AUTHORIZED PERSONNEL ONLY</span>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#mission-files"
                className="inline-flex items-center gap-3 rounded-md border border-cyan-400/40 bg-slate-950/80 px-5 py-3 text-sm font-mono text-cyan-300 transition hover:border-cyan-300 hover:text-cyan-100 hover:shadow-[0_0_18px_rgba(6,182,212,0.35)]"
              >
                <span className="text-cyan-400">MAIN FOLDERS</span>
                <ChevronUp className="w-4 h-4 text-cyan-400" />
              </a>
              {nextDossier && (
                <a
                  href={`#${nextDossier.id}`}
                  className="inline-flex items-center gap-3 rounded-md border border-cyan-400/60 bg-slate-950/80 px-5 py-3 text-sm font-mono text-cyan-300 transition hover:border-cyan-300 hover:text-cyan-100 hover:shadow-[0_0_18px_rgba(6,182,212,0.35)]"
                >
                  <span className="text-cyan-400">NEXT DOSSIER:</span>
                  <span className="text-yellow-300">{nextDossier.label}</span>
                  <ChevronDown className="w-4 h-4 text-cyan-400" />
                </a>
              )}
              </div>
            </div>
            {lockedContent && <LockedDossierOverlay />}
          </div>
        </div>
      </div>
    <div className="mt-12">    </div>
  </section>
);

const AudioIntercept = ({ lockedContent }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <section id="audio-transmission" data-reveal className="py-16 px-4 md:px-6 max-w-4xl mx-auto reveal-on-scroll">
        <div className="bg-slate-900/60 backdrop-blur-md border-2 border-red-500 rounded-lg p-6 md:p-8 relative overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.3)]">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-500 via-red-500 to-yellow-500" />

        <div className="flex items-center gap-3 mb-6">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <h2 className="text-lg md:text-2xl font-bold text-red-500 font-mono tracking-wider">
            INTERCEPTED AUDIO TRANSMISSION
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="flex-1 w-full bg-slate-950 border border-cyan-400 rounded-lg p-4 md:p-6">
            <div className="flex items-end justify-center gap-0.5 md:gap-1 h-20 md:h-24">
              {[...Array(30)].map((_, i) => (
                <div
                  key={`wave-${i.toString()}`}
                  className="w-1 md:w-1.5 bg-cyan-400 rounded-full transition-all duration-150"
                  style={{
                    height: isPlaying ? `${20 + Math.random() * 80}%` : '20%',
                    animation: isPlaying ? `waveform 0.8s ease-in-out infinite ${i * 0.05}s` : 'none',
                  }}
                />
              ))}
            </div>
            <div className="mt-4 text-center">
              <p className="text-cyan-400 font-mono text-xs">AUDIO_FILE: podcast_transmission.mp3</p>
              <p className="text-cyan-400 font-mono text-xs mt-1">STATUS: {isPlaying ? 'DECODING...' : 'STANDBY'}</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={togglePlay}
              className="w-16 h-16 md:w-20 md:h-20 bg-red-600 hover:bg-red-700 border-4 border-red-400 rounded-full flex items-center justify-center transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.6)] active:scale-95"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 md:w-10 md:h-10 text-white" />
              ) : (
                <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" />
              )}
            </button>

            <div className="flex items-center gap-2 text-cyan-400">
              <Volume2 className="w-5 h-5" />
              <div className="w-20 md:w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-cyan-400 rounded-full" />
              </div>
            </div>

            <p className="text-red-400 font-mono text-xs font-bold">⚠ CLASSIFIED</p>
          </div>
        </div>

        <audio
          ref={audioRef}
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          onEnded={() => setIsPlaying(false)}
        />

          <div className="mt-6 bg-slate-950 border border-cyan-400 rounded p-4">
            <p className="text-cyan-400 font-mono text-xs md:text-sm">
              <span className="text-red-400 font-bold">&gt; NOTE:</span> Replace audio source URL with your actual podcast
              file.
            </p>
          </div>
          {lockedContent && <LockedDossierOverlay />}
        </div>

      <style>{`
        @keyframes waveform {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }
      `}</style>
    </section>
  );
};

const SourceList = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sources = [
    { id: 'REF-001', citation: 'Brent J. Steele, “State,” in <em>Visual Global Politics</em>, Roland Bleiker, ed. (Routledge, 2018): 285-287.' },
    { id: 'REF-002', citation: 'Manjeet S. Pardesi, “Decentering Hegemony and ‘Open’ Orders: Fifteenth Century Melaka in a World of Orders,” <em>Global Studies Quarterly</em> (2022) 2, 1–13.' },
    { id: 'REF-003', citation: 'Lene Hansen, “Security,” in <em>Visual Global Politics</em>, Roland Bleiker, ed. (Routledge, 2018): 272-278.' },
    { id: 'REF-004', citation: 'Jonna Nyman, “Towards a global security studies: what can looking at China tell us about the concept of security?,” <em>European Journal of International Relations</em> 2023, 29(3) 673–697.' },
  ];

  return (
    <section id="source-archives" data-reveal className="py-16 px-4 md:px-6 max-w-6xl mx-auto reveal-on-scroll">
      <div className="bg-slate-900/40 backdrop-blur-md border border-cyan-400 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 md:px-6 py-4 flex items-center justify-between hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
            <h2 className="text-lg md:text-2xl font-bold text-cyan-400 font-mono tracking-wider">[ CLASSIFIED SOURCE LIST ]</h2>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <span className="text-yellow-400 font-mono text-xs md:text-sm hidden sm:block">
              {isExpanded ? 'HIDE' : 'VIEW'} SOURCES
            </span>
            {isExpanded ? (
              <ChevronUp className="w-6 h-6 text-cyan-400" />
            ) : (
              <ChevronDown className="w-6 h-6 text-cyan-400 animate-bounce" />
            )}
          </div>
        </button>

        {isExpanded && (
          <div className="border-t border-cyan-400 p-4 md:p-6 bg-slate-950">
            <div className="space-y-3">
              {sources.map((source) => (
                <div
                  key={source.id}
                  className="bg-slate-900/60 border border-cyan-400 rounded-lg p-4 hover:border-cyan-300 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-3">
                    <span className="inline-block bg-cyan-900 text-cyan-400 px-3 py-1 rounded font-mono text-xs font-bold w-fit">
                      {source.id}
                    </span>
                    <p
                      className="text-cyan-50 font-mono text-sm leading-relaxed [&_em]:italic"
                      dangerouslySetInnerHTML={{ __html: source.citation }}
                    />
                  </div>
                </div>
              ))}
            </div>
              <p className="text-cyan-400 font-mono text-xs text-center mt-6 pt-4 border-t border-cyan-400">
                [ TOTAL SOURCES: 4 ] [ STATUS: DECLASSIFIED ]
              </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default function Home() {
  const [activeSection, setActiveSection] = useState('mission-brief');
  const [zuluNow, setZuluNow] = useState(() => new Date());
  const [showZuluColon, setShowZuluColon] = useState(true);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setZuluNow(new Date());
      setShowZuluColon((prev) => !prev);
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const zuluHours = zuluNow.getUTCHours().toString().padStart(2, '0');
  const zuluMinutes = zuluNow.getUTCMinutes().toString().padStart(2, '0');
  const zuluSeconds = zuluNow.getUTCSeconds().toString().padStart(2, '0');

  const briefings = [
    {
      id: 'sovereignty',
      title: 'MISSION DOSSIER: THE WAKANDA PARADOX',
      subjectLine: 'Subject: Analyzing Sovereignty through Black Panther (2018)',
      statusLine: 'Status: DECLASSIFIED',
      section3Label: '[SECTION 3: STRATEGIC DEEP DIVE - THE MELAKA CONNECTION]',
      satelliteFooterLabel: '[ SATELLITE SURVEILLANCE: The "Hard Shell" of Westphalian Sovereignty ]',
      nextDossier: { id: 'security', label: 'SECURITY' },
      systemAlert: true,
      introText: `<strong>OPERATIONAL ANALYSIS:</strong> At the start of the dossier, Wakanda represents the ultimate <em class="text-sky-300">Realist</em> state. It operates under a "self-help" doctrine, utilizing a hyper-Westphalian model of sovereignty where the borders are absolute, and the monopoly on violence is total. The state functions as a "container", hermetically sealed to protect its core resource (Vibranium) from the anarchy of the outside world.
<br /><br />
However, the footage below marks a critical paradigm shift. King T'Challa’s decision to reveal Wakanda’s true nature signifies a move toward <em class="text-sky-300">Liberal Institutionalism</em>. By engaging with the UN, he acknowledges that modern threats (like Killmonger’s ideology or global inequality) ignore borders. Sovereignty is no longer just about protecting the state from the outside, but about <em class="text-sky-300">participating</em> in a shared international community.`,
      video1Url: 'https://www.youtube.com/embed/nuoYFin1J0o',
      analysisText: `<strong>ANALYST NOTE:</strong> This training module defines sovereignty as supreme authority within a territory. However, Black Panther challenges the Eurocentric "Jigsaw Puzzle" view of the world. Wakanda’s sovereignty is not just legal; it is aesthetic.
<br /><br />
As noted in <a href="https://www-taylorfrancis-com.libproxy.smu.edu.sg/chapters/edit/10.4324/9781315856506-44/state-brent-steele?context=ubx&refId=4ef3a4c2-906d-4bf4-9a95-916ac6d1de54">Steele’s Visual Politics</a>, states use "cosmetic practices" to craft an image. Wakanda effectively utilized <em class="text-sky-300">Visual Politics</em> to camouflage itself as a "nation of farmers." This proves that sovereignty is not just a line on a map, but a performance. The state controlled its "visibility" to maintain autonomy, proving that what is seen is just as important as what is ruled.`,
      satelliteImageUrl: '/media/wakanda city.png',
      theoryText: `<strong>CRITICAL REFLECTION:</strong> While many analysts view Wakanda through a Western lens, a more accurate comparison is found in <a href="https://academic.oup.com/isagsq/article-pdf/doi/10.1093/isagsq/ksac072/48275405/ksac072.pdf">Pardesi’s</a> analysis of <em class="text-sky-300">15th-Century Melaka</em>.
<br /><br />
Much like Melaka, which navigated Chinese hegemony without being swallowed by it, Wakanda decenters the US-led world order. It practices <em class="text-sky-300">"Decentering via Attraction"</em>. Wakanda does not submit to the hegemon (the US/CIA), nor does it fully isolate (like North Korea). Instead, it retains control over its own institutions and resources while participating in the world order on its own terms.
<br /><br />
This mirrors Pardesi’s concept of "Open Orders". Wakanda demonstrates that a state can be sovereign without being a carbon copy of Western powers. It suggests that the future of sovereignty isn't a choice between Isolation (Realism) or Submission (Liberalism), but a <em class="text-sky-300">relational strategy</em> where small states manipulate the hierarchy to maintain their agency.`,
        video2Url: 'https://www.youtube.com/embed/0EggqmMixig',
    },
    {
      id: 'security',
      title: 'TARGET DOSSIER: THE SUPREME LEADER',
      tacticalContext: true,
      targetProfiling: {
        title: '[SECTION 1: TARGET PROFILING - THE DUALITY OF THREAT]',
        left: {
          header: 'OFFICIAL NARRATIVE: "THE MONSTER"',
          image: '/media/kju angry.png',
          intelText:
            'To the CIA, the subject is constructed purely as a nuclear madman. This framing removes him from normal politics and justifies extraordinary measures (assassination).',
        },
        right: {
          header: 'ASSET PERSPECTIVE: "THE HUMAN"',
          image: '/media/kju happy.png',
          intelText:
            'To Dave Skylark, the subject is "Desecuritized." By sharing margaritas, the "Enemy" becomes a "Friend." This proves security is Relational, it changes based on social interaction.',
        },
      },
      targetProfilingFirst: true,
      introLabel: '[SECTION 2: META-ANALYSIS - WHEN FICTION BECOMES WAR]',
      analysisLabel: '[SECTION 3: CRITICAL REFLECTION - THE EUROCENTRIC BLINDSPOT]',
      swapVideo2Satellite: true,
      video1FooterLabel: '[ FIELD REPORT: The 2014 Cyber-Attack on Sony Pictures ]',
      satelliteImageClassName: 'w-full h-56 object-cover object-center rounded',
      satelliteFooterLabel: '[ PROPAGANDA: The Potemkin Village scene ]',
      satelliteBeforeAnalysis: true,
      hideSection3: true,
      evidenceImage: {
        image: '/media/sony hack.png',
        label: 'SECURITY WARNING',
        footer:
          '[ CYBER-WARFARE ARTIFACT: The #GOP Hacking Notice on Sony employee terminals (2014) ]',
      },
      nextDossier: { id: 'empire', label: 'EMPIRE & DECOLONIZATION' },
      introText: `<strong>OPERATIONAL ANALYSIS:</strong> This film provides the ultimate proof of <a href="https://www-taylorfrancis-com.libproxy.smu.edu.sg/chapters/edit/10.4324/9781315856506-42/security-lene-hansen?context=ubx&refId=7e597a7a-cfe7-44a2-b9f7-65ee1b849450">Lene Hansen's Securitization theory</a>: images speak security. North Korea did not view this film as "just a comedy." They securitized it as an "Act of War." Why? Because in the North Korean security model, the safety of the <em class="text-sky-300">Leader’s Image</em> is synonymous with the safety of the <em class="text-sky-300">State</em>.
<br /><br />
By ridiculing Kim Jong-un (making him bleed and cry), the film attacked the ontological security of the regime. The subsequent real-world cyberwar proves that in the 21st century, pop culture is a battlefield. A fictional movie triggered a real national security crisis, blurring the line between "Hollywood" and "Geopolitics."`,
        video1Url: 'https://www.youtube.com/embed/JzmrBBqGXYc',
      analysisText: `<strong>ANALYST PERSONAL NOTE:</strong> While the film succeeds in deconstructing the "Monster" myth, it falls into the trap of <em class="text-sky-300">Eurocentrism</em> (<a href="https://journals.sagepub.com/doi/full/10.1177/13540661231176990">Nyman</a>). The film focuses entirely on the insecurities of the Dictator (Kim) and the heroism of the Westerners (Dave/Aaron). But where are the North Korean people?
<br /><br />
They are reduced to props or punchlines. Even when the film tries to "liberate" them, it assumes they want American pop culture and Western democracy. This made me uncomfortable. It suggests that our definition of "Security" is selfish: we humanize the oppressor because he is funny, but we remain indifferent to the structural violence faced by the population. The film satirizes the CIA, yet it ultimately reinforces the idea that American intervention is the only solution to global problems.`,
      satelliteImageUrl: '/media/grocery.gif',
      satelliteLabel: 'CCTV SURVEILLANCE',
      theoryText: `<strong>THEORETICAL FRAMEWORK:</strong> The Copenhagen School provides the dominant analytical framework for understanding securitization.

<em>Buzan, Wæver, and de Wilde</em> (1998) define securitization as a speech act: when a securitizing actor (typically a state official) successfully frames an issue as an existential threat to a referent object, this enables "emergency measures" beyond normal political rules.

The framework identifies five security sectors: <strong>military, political, economic, societal, and environmental</strong>. Each sector has distinct referent objects and characteristic threats.

<em>Critical security studies</em> challenges this framework by asking: whose security? Security for the state may differ from security for individuals or marginalized communities. The "human security" paradigm shifts focus from state survival to individual wellbeing.

<a href="#">Reference: Buzan, B., Wæver, O., & de Wilde, J. (1998). Security: A New Framework for Analysis. Lynne Rienner.</a>

<strong>Analytical Conclusion:</strong> Security is not an objective condition but a political construction with real consequences for policy and governance.`,
      video2Url: '',
    },
      {
        id: 'empire',
        title: 'DOSSIER: EMPIRE & DECOLONIZATION',
        lockedContent: true,
        nextDossier: { id: 'borders', label: 'BORDERS & MIGRATION' },
      introText: `<strong>MISSION OBJECTIVE:</strong> Assess the enduring legacies of colonialism and imperialism in contemporary international relations.

The formal decolonization process (1945-1975) transformed the international system, creating dozens of new sovereign states and reshaping global governance institutions. However, colonial legacies persist through economic dependencies, institutional structures, and cultural hierarchies.

<em>Primary Intelligence Concern:</em> Failure to address colonial legacies perpetuates global inequalities and generates ongoing conflicts over resources, borders, and historical justice.`,
      video1Url: '',
      analysisText: `<strong>THREAT ASSESSMENT:</strong> Colonial legacies manifest across multiple dimensions.

<em>Dimension 1 - Territorial:</em> Artificial borders drawn by colonial powers continue generating conflict. The straight-line boundaries of Africa and the Middle East divided ethnic communities and created states without coherent national identities. Current conflicts in Sudan, Mali, and elsewhere trace directly to colonial boundary-making.

<em>Dimension 2 - Economic:</em> Neocolonial economic relationships persist through unequal trade terms, debt dependencies, and extractive industries controlled by former colonial powers. The CFA franc system in francophone Africa exemplifies ongoing monetary dependence.

<em>Dimension 3 - Institutional:</em> Post-colonial states inherited administrative structures designed for extraction rather than development. Weak state capacity in many former colonies reflects this institutional inheritance.

<em>Dimension 4 - Epistemic:</em> Colonial knowledge hierarchies persist in academia, media, and international institutions. Whose knowledge counts and whose voices are heard remains shaped by colonial history.

<strong>Risk Level:</strong> <span class="text-yellow-400">ELEVATED</span> - Unaddressed colonial legacies fuel instability and grievance.`,
      satelliteImageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
      theoryText: `<strong>THEORETICAL FRAMEWORK:</strong> Postcolonial theory provides critical tools for analyzing imperial legacies.

<em>Edward Said's</em> "Orientalism" (1978) demonstrated how Western knowledge about the "Orient" served imperial power by constructing the East as exotic, backward, and requiring Western tutelage. This discursive analysis revealed knowledge itself as a form of power.

<em>Frantz Fanon</em> analyzed the psychological dimensions of colonialism, showing how colonial subjects internalized inferiority. His work on violence and decolonization remains influential in understanding anti-colonial movements.

<em>Mahmood Mamdani's</em> "Citizen and Subject" (1996) examined how colonial governance in Africa created bifurcated states with different rules for urban citizens and rural subjects—a legacy that persists in contemporary African politics.

<a href="#">Reference: Said, E.W. (1978). Orientalism. Pantheon Books.</a>

<strong>Analytical Conclusion:</strong> Decolonization remains incomplete; genuine post-colonial order requires addressing material and epistemic dimensions of colonial legacy.`,
      video2Url: '',
    },
      {
        id: 'borders',
        title: 'DOSSIER: BORDERS & MIGRATION',
        lockedContent: true,
        introText: `<strong>MISSION OBJECTIVE:</strong> Analyze the politics of borders, mobility, and migration governance in the contemporary international system.

Borders represent the material manifestation of sovereignty—the line where state authority begins and ends. Yet borders are never simply lines on maps; they are complex social, political, and technological assemblages that sort populations and regulate mobility.

<em>Primary Intelligence Concern:</em> Climate change, conflict, and economic inequality will generate unprecedented migration pressures, testing existing governance frameworks and potentially destabilizing border regions.`,
      video1Url: '',
      analysisText: `<strong>THREAT ASSESSMENT:</strong> Multiple factors stress border governance systems.

<em>Factor 1 - Climate Displacement:</em> Projections indicate 200+ million climate migrants by 2050. Current international frameworks provide no legal protection for climate refugees. Coastal flooding, desertification, and extreme weather will force mass movements.

<em>Factor 2 - Conflict Displacement:</em> Protracted conflicts in Syria, Afghanistan, Myanmar, and elsewhere have created the largest refugee populations since WWII. Host countries bear disproportionate burdens while resettlement programs remain inadequate.

<em>Factor 3 - Border Technology:</em> Biometric identification, AI-powered surveillance, and predictive analytics are transforming border control. These technologies raise profound questions about privacy, discrimination, and the automation of exclusion.

<em>Factor 4 - Externalization:</em> Wealthy states increasingly externalize border control to transit countries, creating buffer zones where migrants face detention, abuse, and death. The EU-Turkey deal and US-Mexico cooperation exemplify this trend.

<strong>Risk Level:</strong> <span class="text-red-400">CRITICAL</span> - Existing frameworks inadequate for emerging challenges.`,
      satelliteImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
      theoryText: `<strong>THEORETICAL FRAMEWORK:</strong> Critical border studies challenges conventional understandings of borders as natural or necessary.

<em>Étienne Balibar</em> argues that borders are not simply at the edge of territories but are everywhere—in airports, workplaces, and digital spaces. Borders follow people, subjecting them to ongoing verification and sorting.

<em>Wendy Brown's</em> "Walled States, Waning Sovereignty" (2010) examines the proliferation of border walls as symptoms of sovereignty's erosion rather than its assertion. Walls represent theatrical performances of control that cannot actually achieve their stated objectives.

<em>Reece Jones</em> documents how border violence has intensified even as overall migration has remained relatively stable. The "border industrial complex" creates interests in perpetuating enforcement regardless of effectiveness.

<a href="#">Reference: Brown, W. (2010). Walled States, Waning Sovereignty. Zone Books.</a>

<strong>Analytical Conclusion:</strong> Borders are political constructions that could be configured differently; current arrangements serve particular interests while generating significant human costs.`,
      video2Url: '',
    },
  ];

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const ids = [
      'mission-files',
      'sovereignty',
      'security',
      'empire',
      'borders',
      'audio-transmission',
      'source-archives',
    ];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) return undefined;

    const handleScroll = () => {
      const marker = window.innerHeight * 0.3;
      let current = sections[0]?.id;
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= marker && rect.bottom >= marker) {
          current = section.id;
          break;
        }
      }
      if (current) setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
        <div id="mission-brief" className="min-h-screen bg-slate-950 text-cyan-50 overflow-x-hidden">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.05),transparent_50%)]" />
        </div>

        <div className="relative z-10">
          <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/70 backdrop-blur-md border-b border-cyan-400/60">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex flex-wrap items-center gap-4 text-xs md:text-sm font-mono">
                {[
                  { id: 'mission-brief', label: 'HOME' },
                  { id: 'mission-files', label: 'MISSION BRIEF' },
                { id: 'sovereignty', label: 'SOVEREIGNTY' },
                { id: 'security', label: 'SECURITY' },
                { id: 'empire', label: 'EMPIRE' },
                { id: 'borders', label: 'BORDERS' },
                { id: 'audio-transmission', label: 'AUDIO' },
                { id: 'source-archives', label: 'SOURCE ARCHIVES' },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`px-3 py-2 rounded border transition-all ${
                    activeSection === item.id
                      ? 'border-red-500 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.6)]'
                      : 'border-cyan-400/40 text-cyan-200 hover:text-cyan-50 hover:border-cyan-300'
                  }`}
                  >
                    {activeSection === item.id ? `ACTIVE MISSION: ${item.label}` : item.label}
                  </a>
                ))}
                <div className="ml-auto whitespace-nowrap text-cyan-300 font-mono text-xs md:text-sm tracking-wider [text-shadow:0_0_10px_rgba(34,211,238,0.7)]">
                  <span>{zuluHours}</span>
                  <span className={showZuluColon ? 'opacity-100' : 'opacity-0'}>:</span>
                  <span>{zuluMinutes}</span>
                  <span className={showZuluColon ? 'opacity-100' : 'opacity-0'}>:</span>
                  <span>{zuluSeconds}</span>
                  <span className="ml-2">UTC</span>
                </div>
              </div>
            </nav>
          <div className="pt-16">
            <HeroSection />
          <PersonnelFile />
          <NavigationCards />

        {briefings.map((briefing) => (
          <BriefingSection key={briefing.id} {...briefing} />
        ))}

          <AudioIntercept lockedContent />        <SourceList />          </div>
        </div>
      </div>
  );
}












