import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Zap, Bell, Check } from 'lucide-react';

// Web Audio API beep synthesizer
function playCompletionChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    const playTone = (freq, start, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    // Harmonious alert chord (Google-esque pleasant chime)
    playTone(523.25, 0, 0.3);      // C5
    playTone(659.25, 0.15, 0.3);   // E5
    playTone(783.99, 0.30, 0.5);   // G5
    playTone(1046.50, 0.45, 0.7);  // C6
  } catch (e) {
    console.warn('AudioContext not permitted or supported yet', e);
  }
}

export default function PomodoroTimer({ optimalTimeMin, alpha, stressIndex }) {
  // Modes: 'focus' (t* minutes) or 'break' (5 minutes)
  const [mode, setMode] = useState('focus');
  const [durationSec, setDurationSec] = useState(optimalTimeMin * 60);
  const [timeLeft, setTimeLeft] = useState(optimalTimeMin * 60);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Update duration if optimalTimeMin changes
  useEffect(() => {
    if (mode === 'focus') {
      const sec = optimalTimeMin * 60;
      setDurationSec(sec);
      setTimeLeft(sec);
      setIsActive(false);
      setIsCompleted(false);
    }
  }, [optimalTimeMin, mode]);

  // Timer interval ticker
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsCompleted(true);
      playCompletionChime();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    if (isCompleted) {
      resetTimer();
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsCompleted(false);
    const sec = mode === 'focus' ? optimalTimeMin * 60 : 5 * 60;
    setTimeLeft(sec);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setIsCompleted(false);
    const sec = newMode === 'focus' ? optimalTimeMin * 60 : 5 * 60;
    setDurationSec(sec);
    setTimeLeft(sec);
  };

  // Format MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Circular SVG calculations
  const progressPercent = durationSec > 0 ? (timeLeft / durationSec) : 0;
  const strokeRadius = 110;
  const circumference = 2 * Math.PI * strokeRadius;
  const strokeDashoffset = circumference - progressPercent * circumference;

  return (
    <div className="flex flex-col items-center justify-between h-full w-full">
      {/* Mode Switcher Pills */}
      <div className="flex items-center gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-full mb-6">
        <button
          type="button"
          onClick={() => switchMode('focus')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all ${
            mode === 'focus'
              ? 'bg-google-blue text-white shadow-glow-blue'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Sesión Óptima ({optimalTimeMin}m)</span>
        </button>
        <button
          type="button"
          onClick={() => switchMode('break')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all ${
            mode === 'break'
              ? 'bg-google-green text-white shadow-glow-green'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          <span>Descanso (5m)</span>
        </button>
      </div>

      {/* Circular Progress Ring */}
      <div className="relative flex items-center justify-center my-2">
        <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 260 260">
          {/* Background Track */}
          <circle
            cx="130"
            cy="130"
            r={strokeRadius}
            stroke="#1F1F23"
            strokeWidth="10"
            fill="transparent"
          />
          {/* Progress Indicator */}
          <circle
            cx="130"
            cy="130"
            r={strokeRadius}
            stroke={mode === 'focus' ? '#4285F4' : '#34A853'}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-500 ease-linear"
          />
        </svg>

        {/* Time Text Inside Circle */}
        <div className="absolute flex flex-col items-center text-center">
          <span className="text-5xl font-mono font-extrabold text-white tracking-tighter">
            {formattedTime}
          </span>
          <span className="text-xs uppercase tracking-widest text-zinc-400 font-mono mt-2">
            {isCompleted ? (
              <span className="text-google-green font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> ¡Completado!
              </span>
            ) : isActive ? (
              'En Enfoque'
            ) : (
              'En Pausa'
            )}
          </span>
        </div>
      </div>

      {/* Control Buttons (Pill shaped) */}
      <div className="flex items-center gap-4 mt-6">
        <button
          type="button"
          onClick={toggleTimer}
          className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 transform active:scale-95 ${
            isActive
              ? 'bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700'
              : 'bg-white text-black hover:bg-zinc-200 hover:shadow-glow-blue'
          }`}
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pausar</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>{isCompleted ? 'Reiniciar' : 'Comenzar'}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={resetTimer}
          className="p-3.5 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all active:scale-95"
          title="Reiniciar temporizador"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Physiological KPI Badges */}
      <div className="grid grid-cols-3 gap-2 w-full mt-8 pt-6 border-t border-zinc-800/80 text-center font-mono">
        <div className="p-2 rounded-xl bg-zinc-900/40 border border-zinc-800/50">
          <span className="block text-[10px] text-zinc-500 uppercase">Tiempo t*</span>
          <span className="text-sm font-bold text-google-yellow">{optimalTimeMin}m</span>
        </div>
        <div className="p-2 rounded-xl bg-zinc-900/40 border border-zinc-800/50">
          <span className="block text-[10px] text-zinc-500 uppercase">Tasa Fatiga α</span>
          <span className="text-sm font-bold text-google-blue">{alpha.toExponential(2)}</span>
        </div>
        <div className="p-2 rounded-xl bg-zinc-900/40 border border-zinc-800/50">
          <span className="block text-[10px] text-zinc-500 uppercase">Estrés S</span>
          <span className="text-sm font-bold text-google-purple">{stressIndex.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
