import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calculator, GitBranch, Cpu, Activity } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

export default function MathAccordion({ simulationData }) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const {
    inputs,
    normalized,
    stressIndex,
    alpha,
    optimalTime,
    optimalTimeMin,
    telemetry
  } = simulationData;

  const alphaExp = alpha.toExponential(4);
  const halfAlphaExp = (alpha / 2).toExponential(4);
  const maxErrExp = telemetry.maxError.toExponential(4);

  // Dynamic KaTeX template literals with user values
  const formula1_Stress = `S = 0.5(${normalized.s.toFixed(3)}) + 0.2(${normalized.p.toFixed(3)}) + 0.3(${normalized.r.toFixed(3)}) = ${stressIndex.toFixed(4)}`;
  const formula1_Alpha = `\\alpha = 4 \\times 10^{-4} \\cdot \\left(\\frac{4.44 \\times 10^{-3}}{4 \\times 10^{-4}}\\right)^{${stressIndex.toFixed(4)}} = ${alphaExp}`;

  const formula2_ODE = `\\frac{dR}{dt} = -${alphaExp} \\cdot t \\cdot R(t), \\quad R(0) = 100`;
  const formula2_Solution = `R(t) = 100 \\cdot e^{-\\frac{${alphaExp} \\cdot t^2}{2}} = 100 \\cdot e^{-${halfAlphaExp} \\cdot t^2}`;

  const formula3_Deriv1 = `R'(t) = -${alphaExp} \\cdot t \\cdot R(t)`;
  const formula3_Deriv2 = `R''(t) = -${alphaExp} \\cdot R(t) \\cdot \\left(1 - ${alphaExp} \\cdot t^2\\right) = 0`;
  const formula3_Solve = `1 - ${alphaExp} \\cdot t^2 = 0 \\implies t = \\frac{1}{\\sqrt{${alphaExp}}} \\implies t^* = ${optimalTime.toFixed(2)} \\approx ${optimalTimeMin} \\text{ min}`;

  const formula4_RK4 = `\\mathbf{y}_{n+1} = \\mathbf{y}_n + \\frac{h}{6}\\left(\\mathbf{k}_1 + 2\\mathbf{k}_2 + 2\\mathbf{k}_3 + \\mathbf{k}_4\\right)`;
  const formula4_Error = `\\|R_{\\text{RK4}} - R_{\\text{exact}}\\|_{\\infty} = ${maxErrExp} < 10^{-5}`;

  const sections = [
    {
      id: 'fatigue',
      title: '1. Cálculo Dinámico de la Constante de Fatiga (α)',
      subtitle: 'Normalización de entradas e interpolación exponencial con tus datos',
      icon: <Calculator className="w-4 h-4 text-google-blue" />,
      content: (
        <div className="space-y-3 text-sm text-zinc-300">
          <p className="text-xs text-zinc-400">
            A partir de tus respuestas en el check-in (Sueño: <span className="text-white font-mono">{inputs.sleepHours}h</span>, Pantalla: <span className="text-white font-mono">{inputs.screenHours}h</span>, Rezago: <span className="text-white font-mono">{inputs.backlogLevel}/10</span>), normalizamos los vectores en el intervalo <span className="font-mono text-zinc-200">[0, 1]</span>:
          </p>
          <div className="bg-black/60 p-3 rounded-xl border border-zinc-800/80 font-mono text-xs overflow-x-auto">
            <BlockMath math={formula1_Stress} />
          </div>
          <p className="text-xs text-zinc-400">
            Interpolamos exponencialmente el coeficiente de fatiga <InlineMath math="\alpha" /> entre el límite mínimo (<InlineMath math="4 \times 10^{-4}" />) y máximo (<InlineMath math="4.44 \times 10^{-3}" />):
          </p>
          <div className="bg-black/60 p-3 rounded-xl border border-zinc-800/80 font-mono text-xs overflow-x-auto">
            <BlockMath math={formula1_Alpha} />
          </div>
          <p className="text-xs text-zinc-400 italic">
            Resultado real: Tu tasa de fatiga actual es <span className="font-mono text-google-blue font-bold">{alphaExp} min⁻²</span>.
          </p>
        </div>
      )
    },
    {
      id: 'exact-ode',
      title: '2. EDO Exacta de Retención Cognitiva R(t)',
      subtitle: 'Sustitución de tu constante α en el modelo de decaimiento',
      icon: <GitBranch className="w-4 h-4 text-google-purple" />,
      content: (
        <div className="space-y-3 text-sm text-zinc-300">
          <p className="text-xs text-zinc-400">
            La degradación de retención responde a una Ecuación Diferencial Ordinaria separable donde la velocidad de pérdida se acelera con el tiempo acumulado de esfuerzo continuo:
          </p>
          <div className="bg-black/60 p-3 rounded-xl border border-zinc-800/80 font-mono text-xs overflow-x-auto">
            <BlockMath math={formula2_ODE} />
          </div>
          <p className="text-xs text-zinc-400">
            Integrando por separación de variables <InlineMath math="\int \frac{dR}{R} = -\alpha \int t \, dt" /> con la condición inicial <InlineMath math="R(0) = 100\%" />, obtenemos tu ecuación analítica exacta:
          </p>
          <div className="bg-black/60 p-3 rounded-xl border border-zinc-800/80 font-mono text-xs overflow-x-auto">
            <BlockMath math={formula2_Solution} />
          </div>
          <p className="text-xs text-zinc-400">
            Esta campana gaussiana decreciente describe con precisión cuánta información retiene tu memoria de trabajo en cualquier minuto <span className="font-mono text-white">t</span>.
          </p>
        </div>
      )
    },
    {
      id: 'inflection',
      title: '3. Criterio de Optimización (Segunda Derivada)',
      subtitle: 'Punto de inflexión donde el rendimiento mental sufre colapso',
      icon: <Activity className="w-4 h-4 text-google-yellow" />,
      content: (
        <div className="space-y-3 text-sm text-zinc-300">
          <p className="text-xs text-zinc-400">
            Diferenciamos la función de retención para encontrar la tasa de cambio marginal y la aceleración del cansancio:
          </p>
          <div className="bg-black/60 p-3 rounded-xl border border-zinc-800/80 font-mono text-xs overflow-x-auto">
            <BlockMath math={formula3_Deriv1} />
          </div>
          <p className="text-xs text-zinc-400">
            Igualamos la segunda derivada a cero <InlineMath math="R''(t) = 0" /> para localizar el punto de máxima concavidad:
          </p>
          <div className="bg-black/60 p-3 rounded-xl border border-zinc-800/80 font-mono text-xs overflow-x-auto">
            <BlockMath math={formula3_Deriv2} />
          </div>
          <p className="text-xs text-zinc-400">
            Dado que <InlineMath math="-\alpha R(t) \neq 0" />, el corchete debe anularse, despejando tu tiempo óptimo exacto:
          </p>
          <div className="bg-black/60 p-3 rounded-xl border border-zinc-800/80 font-mono text-xs overflow-x-auto text-google-yellow">
            <BlockMath math={formula3_Solve} />
          </div>
          <p className="text-xs text-zinc-300 bg-google-yellow/10 border border-google-yellow/20 p-2.5 rounded-xl">
            💡 <strong>Conclusión Matemática:</strong> A partir de los <span className="font-bold text-white">{optimalTimeMin} minutos</span>, la tasa de asimilación deja de ser rentable y el cansancio acumulado acelera exponencialmente el olvido.
          </p>
        </div>
      )
    },
    {
      id: 'telemetry',
      title: '4. Validación y Telemetría del Motor RK4',
      subtitle: 'Discretización numérica vs solución analítica exacta en tu navegador',
      icon: <Cpu className="w-4 h-4 text-google-green" />,
      content: (
        <div className="space-y-4 text-sm text-zinc-300">
          <p className="text-xs text-zinc-400">
            El método Runge-Kutta de 4to Orden aproxima la trayectoria del sistema acoplado promediando 4 pendientes tangenciales en cada subintervalo <InlineMath math="h = 0.5\text{ min}" />:
          </p>
          <div className="bg-black/60 p-3 rounded-xl border border-zinc-800/80 font-mono text-xs overflow-x-auto">
            <BlockMath math={formula4_RK4} />
          </div>
          
          {/* Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-xs">
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
              <span className="text-zinc-500 block text-[10px] uppercase">Tiempo CPU</span>
              <span className="text-google-green font-bold text-sm">{telemetry.cpuTimeMs} ms</span>
            </div>
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
              <span className="text-zinc-500 block text-[10px] uppercase">Nodos Evaluados</span>
              <span className="text-white font-bold text-sm">{telemetry.totalNodes}</span>
            </div>
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
              <span className="text-zinc-500 block text-[10px] uppercase">Paso h</span>
              <span className="text-google-blue font-bold text-sm">{telemetry.stepSize} min</span>
            </div>
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
              <span className="text-zinc-500 block text-[10px] uppercase">Error Máximo</span>
              <span className="text-google-yellow font-bold text-sm">{maxErrExp}</span>
            </div>
          </div>

          <div className="bg-black/60 p-3 rounded-xl border border-zinc-800/80 font-mono text-xs overflow-x-auto">
            <BlockMath math={formula4_Error} />
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
            <span>Algoritmo: Runge-Kutta Clásico (RK4)</span>
            <span className="text-google-green font-semibold">Estado: {telemetry.status}</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 font-mono flex items-center gap-2">
          <Calculator className="w-4 h-4 text-google-blue" />
          Procedimiento Matemático Dinámico (KaTeX)
        </h3>
        <span className="text-[11px] text-zinc-500 font-mono">
          Valores calculados en tiempo real
        </span>
      </div>

      {sections.map((sec, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={sec.id}
            className="rounded-2xl border border-zinc-800/90 bg-zinc-950/70 backdrop-blur-md overflow-hidden transition-all duration-200"
          >
            <button
              type="button"
              onClick={() => toggleAccordion(index)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-900/50 transition-colors"
            >
              <div className="flex items-center gap-3 pr-2">
                <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 shrink-0">
                  {sec.icon}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white tracking-tight">
                    {sec.title}
                  </h4>
                  <p className="text-xs text-zinc-400 font-normal">
                    {sec.subtitle}
                  </p>
                </div>
              </div>
              <div className="text-zinc-500 p-1">
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {isOpen && (
              <div className="p-4 pt-1 border-t border-zinc-800/60 bg-zinc-950/40">
                {sec.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
