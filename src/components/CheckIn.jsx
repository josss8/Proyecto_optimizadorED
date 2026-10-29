import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Monitor, AlertTriangle, BookOpen, ChevronRight, ChevronLeft, RotateCcw, Check } from 'lucide-react';
import InfoTooltip from './InfoTooltip';
import { STUDY_TECHNIQUES } from '../services/MathEngine';

const STORAGE_KEY = 'optimizador_cognitivo_checkin';

const DEFAULT_STATE = {
  step: 1,
  sleepHours: 7,
  screenHours: 4,
  backlogLevel: 4,
  techniqueId: 'medium'
};

export default function CheckIn({ onComplete, onCancel }) {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_STATE, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
    return DEFAULT_STATE;
  });

  const [direction, setDirection] = useState(1);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }, [data]);

  const nextStep = () => {
    if (data.step < 4) {
      setDirection(1);
      setData(prev => ({ ...prev, step: prev.step + 1 }));
    } else {
      onComplete(data);
    }
  };

  const prevStep = () => {
    if (data.step > 1) {
      setDirection(-1);
      setData(prev => ({ ...prev, step: prev.step - 1 }));
    } else {
      onCancel();
    }
  };

  const resetCheckIn = () => {
    setData(DEFAULT_STATE);
  };

  // Card slide variants
  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.98
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
    },
    exit: (dir) => ({
      x: dir > 0 ? -50 : 50,
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
    })
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 z-10 w-full max-w-2xl mx-auto">
      {/* Top Header & Progress */}
      <div className="w-full mb-8">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-google-blue"></span>
            PASO {data.step} DE 4
          </span>
          <button
            onClick={resetCheckIn}
            className="flex items-center gap-1 hover:text-white transition-colors text-zinc-500 hover:text-zinc-300"
            title="Reiniciar valores predeterminados"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>
        </div>

        {/* Segmented Progress Bar */}
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((stepNum) => (
            <div
              key={stepNum}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                stepNum <= data.step
                  ? stepNum === 1
                    ? 'bg-google-blue'
                    : stepNum === 2
                    ? 'bg-google-purple'
                    : stepNum === 3
                    ? 'bg-google-yellow'
                    : 'bg-google-green'
                  : 'bg-zinc-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Interactive Card with AnimatePresence */}
      <div className="w-full relative min-h-[380px]">
        <AnimatePresence mode="wait" custom={direction}>
          {/* CARD 1: SUEÑO */}
          {data.step === 1 && (
            <motion.div
              key="card-1"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="p-8 rounded-3xl bg-zinc-950/80 border border-zinc-800/90 shadow-2xl backdrop-blur-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-google-blue/10 flex items-center justify-center text-google-blue">
                    <Moon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-wider text-google-blue bg-google-blue/10 px-3 py-1 rounded-full border border-google-blue/20">
                    Métrica Fisiológica
                  </span>
                </div>

                <div className="flex items-center mb-2">
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    ¿Cuántas horas dormiste anoche?
                  </h2>
                  <InfoTooltip text="El déficit de sueño reduce drásticamente la consolidación de la memoria a corto plazo." />
                </div>
                <p className="text-sm text-zinc-400 mb-8">
                  El descanso modula directamente la permeabilidad sináptica y la reserva cognitiva inicial.
                </p>

                {/* Big Value Display */}
                <div className="flex items-baseline justify-center gap-2 mb-6">
                  <span className="text-6xl font-extrabold text-white font-mono tracking-tight">
                    {data.sleepHours}
                  </span>
                  <span className="text-xl text-zinc-400 font-medium">horas</span>
                  <span className={`ml-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    data.sleepHours >= 7 ? 'bg-google-green/15 text-google-green border border-google-green/30' :
                    data.sleepHours >= 5 ? 'bg-google-yellow/15 text-google-yellow border border-google-yellow/30' :
                    'bg-google-red/15 text-google-red border border-google-red/30'
                  }`}>
                    {data.sleepHours >= 7 ? 'Óptimo' : data.sleepHours >= 5 ? 'Alerta Moderada' : 'Déficit Severo'}
                  </span>
                </div>

                {/* Slider */}
                <div className="px-2 mb-4">
                  <input
                    type="range"
                    min="0"
                    max="12"
                    step="0.5"
                    value={data.sleepHours}
                    onChange={(e) => setData(prev => ({ ...prev, sleepHours: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-google-blue"
                  />
                  <div className="flex justify-between text-xs text-zinc-500 font-mono mt-2">
                    <span>0h (Insomnio)</span>
                    <span>6h</span>
                    <span>8h (Recomendado)</span>
                    <span>12h</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* CARD 2: PANTALLA */}
          {data.step === 2 && (
            <motion.div
              key="card-2"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="p-8 rounded-3xl bg-zinc-950/80 border border-zinc-800/90 shadow-2xl backdrop-blur-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-google-purple/10 flex items-center justify-center text-google-purple">
                    <Monitor className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-wider text-google-purple bg-google-purple/10 px-3 py-1 rounded-full border border-google-purple/20">
                    Carga Visual & Dopamina
                  </span>
                </div>

                <div className="flex items-center mb-2">
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Tiempo de pantalla previo
                  </h2>
                  <InfoTooltip text="La exposición prolongada a pantallas antes de estudiar agota los niveles de dopamina y atención basal." />
                </div>
                <p className="text-sm text-zinc-400 mb-8">
                  Indica cuántas horas estuviste frente a pantallas (móvil, PC, tablet) en el día antes de esta sesión.
                </p>

                {/* Interactive Counter +/- */}
                <div className="flex items-center justify-center gap-6 my-6">
                  <button
                    type="button"
                    onClick={() => setData(prev => ({ ...prev, screenHours: Math.max(0, prev.screenHours - 1) }))}
                    disabled={data.screenHours <= 0}
                    className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-700 text-white font-mono text-2xl flex items-center justify-center hover:bg-zinc-800 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all"
                  >
                    -
                  </button>

                  <div className="flex flex-col items-center">
                    <div className="flex items-baseline gap-1">
                      <span className="text-6xl font-extrabold text-white font-mono tracking-tight">
                        {data.screenHours}
                      </span>
                      <span className="text-lg text-zinc-400">h</span>
                    </div>
                    <span className="text-xs text-zinc-500 font-mono mt-1">horas acumuladas</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setData(prev => ({ ...prev, screenHours: Math.min(16, prev.screenHours + 1) }))}
                    disabled={data.screenHours >= 16}
                    className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-700 text-white font-mono text-2xl flex items-center justify-center hover:bg-zinc-800 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* CARD 3: REZAGO */}
          {data.step === 3 && (
            <motion.div
              key="card-3"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="p-8 rounded-3xl bg-zinc-950/80 border border-zinc-800/90 shadow-2xl backdrop-blur-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-google-yellow/10 flex items-center justify-center text-google-yellow">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-wider text-google-yellow bg-google-yellow/10 px-3 py-1 rounded-full border border-google-yellow/20">
                    Ansiedad & Carga Intrínseca
                  </span>
                </div>

                <div className="flex items-center mb-2">
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Nivel de rezago o atraso temático
                  </h2>
                  <InfoTooltip text="Un alto nivel de atraso genera ansiedad matemática, incrementando la carga cognitiva inicial." />
                </div>
                <p className="text-sm text-zinc-400 mb-6">
                  Evalúa del 1 (completamente al día) al 10 (atraso crítico con alta urgencia temporal).
                </p>

                {/* 1-10 Pill Selector Grid */}
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                    const isSelected = data.backlogLevel === num;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setData(prev => ({ ...prev, backlogLevel: num }))}
                        className={`h-12 rounded-2xl font-mono text-base font-bold transition-all duration-200 ${
                          isSelected
                            ? 'bg-google-yellow text-black scale-105 shadow-glow-yellow'
                            : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center text-xs font-mono text-zinc-400 px-1">
                  <span>1: Al día (Tranquilo)</span>
                  <span className="text-google-yellow font-bold">Seleccionado: {data.backlogLevel}/10</span>
                  <span>10: Crítico (Sobrecarga)</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* CARD 4: TÉCNICA DE ESTUDIO */}
          {data.step === 4 && (
            <motion.div
              key="card-4"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="p-8 rounded-3xl bg-zinc-950/80 border border-zinc-800/90 shadow-2xl backdrop-blur-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-google-green/10 flex items-center justify-center text-google-green">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-wider text-google-green bg-google-green/10 px-3 py-1 rounded-full border border-google-green/20">
                    Tasa de Asimilación (μ)
                  </span>
                </div>

                <div className="flex items-center mb-2">
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Técnica de Estudio a Utilizar
                  </h2>
                  <InfoTooltip text="La intensidad pedagógica modula la velocidad de asimilación μ. Técnicas de alto esfuerzo cognitivo aceleran el aprendizaje pero inducen mayor degradación temporal." />
                </div>
                <p className="text-sm text-zinc-400 mb-5">
                  Selecciona la metodología de aprendizaje que implementarás en tu sesión:
                </p>

                {/* 3 Stacked Category Buttons */}
                <div className="space-y-3 mb-6">
                  {Object.values(STUDY_TECHNIQUES).map((technique) => {
                    const isSelected = data.techniqueId === technique.id;
                    return (
                      <button
                        key={technique.id}
                        type="button"
                        onClick={() => setData(prev => ({ ...prev, techniqueId: technique.id }))}
                        className={`w-full p-4 rounded-2xl text-left border transition-all duration-200 flex items-center justify-between ${
                          isSelected
                            ? 'bg-zinc-900 border-google-green shadow-glow-green text-white'
                            : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/40'
                        }`}
                      >
                        <div className="pr-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm text-white">
                              {technique.name}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                              μ = {technique.mu}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 leading-relaxed">
                            {technique.description}
                          </p>
                        </div>

                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                          isSelected
                            ? 'bg-google-green border-google-green text-black'
                            : 'border-zinc-700 text-transparent'
                        }`}>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons (Pill-shaped) */}
      <div className="w-full flex items-center justify-between mt-6">
        <button
          type="button"
          onClick={prevStep}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900 transition-all text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{data.step === 1 ? 'Volver al Inicio' : 'Anterior'}</span>
        </button>

        <button
          type="button"
          onClick={nextStep}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 hover:shadow-glow-blue transition-all duration-300 transform active:scale-95 text-sm"
        >
          <span>{data.step === 4 ? 'Simular EDO & Optimizar' : 'Siguiente'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
