import { normalizeInputs, calculateStressAndAlpha, solveRK4, exactRetention, runSimulation } from './src/services/MathEngine.js';

console.log("=== INICIANDO VALIDACIÓN MATEMÁTICA DEL MOTOR RK4 ===");

// Caso 1: Estrés Mínimo (Sueño 8h, Pantalla 0h, Rezago 1)
const normMin = normalizeInputs(8, 0, 1);
const resMin = calculateStressAndAlpha(normMin.s, normMin.p, normMin.r);
console.log(`[TEST 1 - Estrés Mínimo]:`);
console.log(`  s=${normMin.s}, p=${normMin.p}, r=${normMin.r} => S = ${resMin.stressIndex}`);
console.log(`  alpha = ${resMin.alpha} (Esperado: 0.0004)`);
console.log(`  t* = ${resMin.optimalTime.toFixed(2)} min (Esperado: 50.00 min)`);
if (Math.abs(resMin.alpha - 0.0004) > 1e-6 || Math.abs(resMin.optimalTime - 50.0) > 0.01) {
  throw new Error("Fallo en Caso 1");
}

// Caso 2: Estrés Máximo (Sueño 0h, Pantalla 10h, Rezago 10)
const normMax = normalizeInputs(0, 10, 10);
const resMax = calculateStressAndAlpha(normMax.s, normMax.p, normMax.r);
console.log(`\n[TEST 2 - Estrés Máximo]:`);
console.log(`  s=${normMax.s}, p=${normMax.p}, r=${normMax.r} => S = ${resMax.stressIndex}`);
console.log(`  alpha = ${resMax.alpha} (Esperado: 0.00444)`);
console.log(`  t* = ${resMax.optimalTime.toFixed(2)} min (Esperado: ~15.00 min)`);
if (Math.abs(resMax.alpha - 0.00444) > 1e-6 || Math.abs(resMax.optimalTime - 15.007) > 0.1) {
  throw new Error("Fallo en Caso 2");
}

// Caso 3: Integración Numérica RK4 vs Solución Analítica Exacta
const sim = runSimulation({
  sleepHours: 7,
  screenHours: 4,
  backlogLevel: 4,
  techniqueId: 'medium',
  h: 0.5
});
console.log(`\n[TEST 3 - Simulación RK4 Completa]:`);
console.log(`  Alpha: ${sim.alpha.toExponential(4)}`);
console.log(`  Tiempo Óptimo t*: ${sim.optimalTimeMin} min`);
console.log(`  Puntos generados: ${sim.points.length}`);
console.log(`  Tiempo CPU: ${sim.telemetry.cpuTimeMs} ms`);
console.log(`  Error Máximo RK4 vs Analítica: ${sim.telemetry.maxError.toExponential(6)}`);
console.log(`  Estado de Convergencia: ${sim.telemetry.status}`);

if (sim.telemetry.maxError > 1e-5) {
  throw new Error(`Error numérico excedido: ${sim.telemetry.maxError}`);
}

console.log("\n>>> TODAS LAS PRUEBAS MATEMÁTICAS PASARON CON ÉXITO <<<");
