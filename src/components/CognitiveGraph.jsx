import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend
} from 'recharts';
import { Activity, Zap } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const rVal = payload.find(p => p.dataKey === 'R')?.value;
    const aVal = payload.find(p => p.dataKey === 'A')?.value;

    return (
      <div className="bg-zinc-950/95 border border-zinc-700 p-3 rounded-2xl shadow-2xl backdrop-blur-md text-xs font-mono space-y-1.5">
        <div className="text-zinc-400 font-semibold border-b border-zinc-800 pb-1 mb-1">
          Tiempo: <span className="text-white">{label} min</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-google-blue">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-google-blue"></span>
            Retención R(t):
          </span>
          <span className="font-bold text-white">{rVal}%</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-google-green">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-google-green"></span>
            Asimilación A(t):
          </span>
          <span className="font-bold text-white">{aVal} pts</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function CognitiveGraph({ data, optimalTimeMin }) {
  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-google-blue/10 flex items-center justify-center text-google-blue">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">
              Dinámica Temporal del Estado Cognitivo
            </h3>
            <p className="text-xs text-zinc-400">
              Solución numérica RK4 para t ∈ [0, 120] minutos
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
          <Zap className="w-3.5 h-3.5 text-google-yellow" />
          <span>t* = {optimalTimeMin} min</span>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="w-full h-72 sm:h-80 md:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 15, left: -15, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#27272A" opacity={0.6} />
            <XAxis
              dataKey="t"
              stroke="#71717A"
              tick={{ fill: '#A1A1AA', fontSize: 11 }}
              tickLine={{ stroke: '#3F3F46' }}
              label={{
                value: 'Tiempo t (minutos)',
                position: 'insideBottomRight',
                offset: -5,
                fill: '#71717A',
                fontSize: 10
              }}
            />
            <YAxis
              stroke="#71717A"
              tick={{ fill: '#A1A1AA', fontSize: 11 }}
              tickLine={{ stroke: '#3F3F46' }}
              domain={[0, 105]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }}
            />

            {/* Reference Line at t* */}
            <ReferenceLine
              x={optimalTimeMin}
              stroke="#FBBC05"
              strokeDasharray="4 4"
              strokeWidth={2}
              label={{
                value: `t* óptimo (${optimalTimeMin}m)`,
                position: 'top',
                fill: '#FBBC05',
                fontSize: 11,
                fontWeight: 600
              }}
            />

            {/* R(t) Curve */}
            <Line
              type="monotone"
              dataKey="R"
              name="Retención R(t) %"
              stroke="#4285F4"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#4285F4', stroke: '#FFFFFF', strokeWidth: 2 }}
            />

            {/* A(t) Curve */}
            <Line
              type="monotone"
              dataKey="A"
              name="Asimilación A(t)"
              stroke="#34A853"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#34A853', stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Insight */}
      <div className="mt-3 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between text-xs text-zinc-400 font-mono px-2">
        <span>R(0) = 100% | R(t*) ≈ {data.find(d => Math.round(d.t) === optimalTimeMin)?.R || '--'}%</span>
        <span className="text-zinc-500">Decaimiento: dR/dt = -α·t·R</span>
      </div>
    </div>
  );
}
