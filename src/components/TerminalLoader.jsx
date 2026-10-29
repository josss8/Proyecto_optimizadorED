import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, CheckCircle2 } from 'lucide-react';

export default function TerminalLoader({ simulationData, onComplete }) {
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const { inputs, normalized, stressIndex, alpha, optimalTimeMin, telemetry } = simulationData;

    const rawLogs = [
      `[INIT] Leyendo parámetros de check-in... Sueño: ${inputs.sleepHours}h | Pantalla: ${inputs.screenHours}h | Rezago: ${inputs.backlogLevel}/10`,
      `[NORM] Vector normalizado [0,1]: s = ${normalized.s.toFixed(3)}, p = ${normalized.p.toFixed(3)}, r = ${normalized.r.toFixed(3)}`,
      `[STRESS] Calculando índice ponderado: S = 0.5s + 0.2p + 0.3r => S = ${stressIndex.toFixed(4)}`,
      `[FATIGUE] Interpolando constante α: α_min=4e-4, α_max=4.44e-3 => α = ${alpha.toExponential(4)}`,
      `[OPTIM] Criterio segunda derivada d²R/dt² = 0 => t* = 1/√α = ${optimalTimeMin} min`,
      `[ODE-1] Discretizando dR/dt = -α·t·R (R_0 = 100%) con paso h = ${telemetry.stepSize}`,
      `[ODE-2] Resolviendo acoplamiento dA/dt = μ·R - σ·A (μ = ${inputs.technique.mu}, σ = 0.02)`,
      `[RK4-EXEC] Iterando k1, k2, k3, k4 a través de ${telemetry.totalNodes} nodos temporales...`,
      `[TELEMETRY] Cómputo completado en ${telemetry.cpuTimeMs} ms | Error Máx: ${telemetry.maxError.toExponential(3)} | Status: ${telemetry.status}`,
      `[DONE] Matriz de estados lista. Generando dashboard interactivo...`
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < rawLogs.length) {
        const nextLog = rawLogs[currentLogIndex];
        setLogs(prev => [...prev, nextLog]);
        currentLogIndex++;
        setProgress(Math.round((currentLogIndex / rawLogs.length) * 100));
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 150);
      }
    }, 60); // fast progressive display ~600ms total

    return () => clearInterval(interval);
  }, [simulationData, onComplete]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8 z-10 w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full bg-[#0D0D0D] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl shadow-black/80 font-mono"
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-zinc-950 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-google-red inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-google-yellow inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-google-green inline-block"></span>
            <span className="ml-3 text-xs text-zinc-400 font-mono flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-google-blue" />
              rk4-engine@antigravity-worker: ~/solve_edo
            </span>
          </div>
          <span className="text-xs text-zinc-500 font-mono">{progress}%</span>
        </div>

        {/* Terminal Body */}
        <div className="p-6 h-80 overflow-y-auto space-y-2 text-xs leading-relaxed text-zinc-300 font-mono scrollbar-none">
          {logs.map((log, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.1 }}
              className="flex items-start gap-2"
            >
              <span className="text-google-blue shrink-0">&gt;</span>
              <span
                className={
                  log.includes('[OPTIM]') ? 'text-google-yellow font-bold' :
                  log.includes('[TELEMETRY]') ? 'text-google-green font-semibold' :
                  log.includes('[FATIGUE]') ? 'text-google-purple' :
                  log.includes('[DONE]') ? 'text-white font-bold' : 'text-zinc-300'
                }
              >
                {log}
              </span>
            </motion.div>
          ))}
          <div className="flex items-center gap-1.5 text-google-blue pt-1">
            <span className="animate-pulse">_</span>
          </div>
        </div>

        {/* Footer Progress Line */}
        <div className="w-full bg-zinc-900 h-1">
          <div
            className="h-full bg-gradient-to-r from-google-blue via-google-purple to-google-green transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </motion.div>
    </div>
  );
}
