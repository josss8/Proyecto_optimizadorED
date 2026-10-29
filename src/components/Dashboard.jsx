import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Brain, Activity, Clock, Zap, ShieldCheck } from 'lucide-react';
import PomodoroTimer from './PomodoroTimer';
import CognitiveGraph from './CognitiveGraph';
import MathAccordion from './MathAccordion';

export default function Dashboard({ simulationData, onReset }) {
  const {
    inputs,
    stressIndex,
    alpha,
    optimalTimeMin,
    points
  } = simulationData;

  return (
    <div className="relative min-h-screen flex flex-col z-10 px-4 py-6 max-w-7xl mx-auto w-full">
      {/* Top Navbar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-xl mb-6 shadow-xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-google-blue to-google-purple flex items-center justify-center text-white shadow-glow-blue">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Optimizador Cognitivo ED
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-google-blue/15 text-google-blue border border-google-blue/30 uppercase tracking-widest hidden sm:inline-block">
                RK4 Engine
              </span>
            </h1>
            <p className="text-xs text-zinc-400">
              Técnica: <span className="text-white font-medium">{inputs.technique.name}</span> (μ = {inputs.technique.mu})
            </p>
          </div>
        </div>

        {/* Quick Badges & Reset Button */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 font-mono text-xs">
            <div className="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
              Estrés <span className="text-google-yellow font-bold">{stressIndex.toFixed(2)}</span>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
              t* <span className="text-google-green font-bold">{optimalTimeMin} min</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-semibold transition-all duration-200 active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Recalibrar</span>
          </button>
        </div>
      </motion.header>

      {/* Main 50/50 Split Section on Desktop, Stack/Bottom Sheet on Mobile */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
      >
        {/* Left Column: Pomodoro Timer */}
        <section className="p-6 sm:p-8 rounded-3xl bg-zinc-950/80 border border-zinc-800/90 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-google-yellow" />
              <h2 className="text-base font-bold text-white tracking-tight">
                Temporizador Adaptativo de Estudio
              </h2>
            </div>
            <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
              t* = {optimalTimeMin}m
            </span>
          </div>

          <PomodoroTimer
            optimalTimeMin={optimalTimeMin}
            alpha={alpha}
            stressIndex={stressIndex}
          />
        </section>

        {/* Right Column: Recharts Cognitive Graph */}
        <section className="p-6 sm:p-8 rounded-3xl bg-zinc-950/80 border border-zinc-800/90 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
          <CognitiveGraph
            data={points}
            optimalTimeMin={optimalTimeMin}
          />
        </section>
      </motion.main>

      {/* Mathematical Analytics Dynamic Accordion */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full mb-12"
      >
        <MathAccordion simulationData={simulationData} />
      </motion.section>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-zinc-900 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-google-green" />
          <span>Optimizador Cognitivo ED • Client-Side Numerical Simulation</span>
        </div>
        <span>Runge-Kutta 4to Orden (RK4) • React 18 + KaTeX</span>
      </footer>
    </div>
  );
}
