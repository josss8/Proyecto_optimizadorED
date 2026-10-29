import React from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, Brain, Cpu, Activity, ArrowRight } from 'lucide-react';

export default function Onboarding({ onStart }) {
  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-12 text-center z-10">
      {/* Top Tag */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-950/60 backdrop-blur-md mb-8"
      >
        <span className="flex h-2 w-2 rounded-full bg-google-blue animate-pulse" />
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
          EDO • Runge-Kutta 4to Orden (RK4) • Client-Side
        </span>
      </motion.div>

      {/* Main Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Optimizador{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-google-blue via-google-purple to-google-red">
            Cognitivo ED
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed mb-10">
          Simulador matemático predictivo que modela el decaimiento de retención y la acumulación de fatiga mental en tiempo real para encontrar tu ventana óptima de estudio <span className="font-mono text-zinc-200">t*</span>.
        </p>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col sm:flex-row items-center gap-4 mb-16"
      >
        <button
          onClick={onStart}
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-medium text-base hover:bg-zinc-200 hover:shadow-glow-blue transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>Iniciar Check-in</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>

      {/* 3 Pillar Feature Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl w-full text-left"
      >
        {/* Card 1 */}
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm hover:border-zinc-700 transition-all">
          <div className="w-10 h-10 rounded-full bg-google-blue/10 flex items-center justify-center text-google-blue mb-4">
            <Brain className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-white mb-1.5">Modelado Fisiológico</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Normaliza horas de sueño, exposición a luz azul y rezago académico en una tasa de fatiga adaptativa <span className="font-mono text-zinc-300">α</span>.
          </p>
        </div>

        {/* Card 2 */}
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm hover:border-zinc-700 transition-all">
          <div className="w-10 h-10 rounded-full bg-google-purple/10 flex items-center justify-center text-google-purple mb-4">
            <Cpu className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-white mb-1.5">Integración RK4</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Resuelve el sistema de EDOs acopladas para la retención <span className="font-mono text-zinc-300">R(t)</span> y asimilación <span className="font-mono text-zinc-300">A(t)</span> con máxima precisión numérica.
          </p>
        </div>

        {/* Card 3 */}
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm hover:border-zinc-700 transition-all">
          <div className="w-10 h-10 rounded-full bg-google-yellow/10 flex items-center justify-center text-google-yellow mb-4">
            <Activity className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-white mb-1.5">Pomodoro Adaptativo</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Sincroniza el temporizador de estudio con el punto de inflexión exacto de la segunda derivada <span className="font-mono text-zinc-300">d²R/dt² = 0</span>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
