/**
 * MathEngine.js
 * Pure Client-Side Computational Engine for Cognitive Fatigue & Study Optimization.
 * Implements 4th-order Runge-Kutta (RK4) ODE solver and analytical benchmarks.
 */

export const ALPHA_MIN = 0.0004;    // 4 x 10^-4 (min fatigue: ~50 min sessions)
export const ALPHA_MAX = 0.00444;   // 4.44 x 10^-3 (max fatigue: ~15 min sessions)
export const SIGMA = 0.02;          // Cognitive decay / forgetting constant

export const STUDY_TECHNIQUES = {
  low: {
    id: 'low',
    name: 'Baja Intensidad (Pasiva)',
    description: 'Leer, subrayar, ver videos o escuchar clases.',
    mu: 0.05,
    tag: 'Pasivo'
  },
  medium: {
    id: 'medium',
    name: 'Media Intensidad (Activa)',
    description: 'Mapas mentales, resúmenes propios, flashcards básicas.',
    mu: 0.12,
    tag: 'Activo'
  },
  high: {
    id: 'high',
    name: 'Alta Intensidad (Extrema)',
    description: 'Simulacros de examen, Técnica Feynman, Active Recall exhaustivo.',
    mu: 0.20,
    tag: 'Extremo'
  }
};

/**
 * Normalizes user inputs into [0, 1] interval.
 * - Sleep: Optimal is >= 8h (stress = 0), 0h (stress = 1).
 * - Screen: 0h (stress = 0), >= 10h (stress = 1).
 * - Backlog (Rezago): Scale 1-10 mapped to [0, 1].
 */
export function normalizeInputs(sleepHours, screenHours, backlogLevel) {
  const s = Math.max(0, Math.min(1, (8 - sleepHours) / 8));
  const p = Math.max(0, Math.min(1, screenHours / 10));
  const r = Math.max(0, Math.min(1, (backlogLevel - 1) / 9));

  return { s, p, r };
}

/**
 * Calculates stress index S and fatigue constant alpha.
 * Formula: S = 0.5*s + 0.2*p + 0.3*r
 * alpha = alphaMin * (alphaMax / alphaMin)^S
 */
export function calculateStressAndAlpha(s, p, r) {
  const stressIndex = (0.5 * s) + (0.2 * p) + (0.3 * r);
  const clampedStress = Math.max(0, Math.min(1, stressIndex));
  
  const alpha = ALPHA_MIN * Math.pow(ALPHA_MAX / ALPHA_MIN, clampedStress);
  const optimalTime = 1 / Math.sqrt(alpha);

  return {
    stressIndex: clampedStress,
    alpha,
    optimalTime
  };
}

/**
 * Exact analytical solution for Retention R(t):
 * R(t) = 100 * exp(-alpha * t^2 / 2)
 */
export function exactRetention(t, alpha) {
  return 100 * Math.exp(-(alpha * (t * t)) / 2);
}

/**
 * 4th-Order Runge-Kutta (RK4) integrator for the ODE system:
 * 1) dR/dt = -alpha * t * R
 * 2) dA/dt = mu * R - sigma * A
 * Initial Conditions: R(0) = 100, A(0) = 0
 * Interval: t in [0, tMax], step h
 */
export function solveRK4({
  alpha,
  mu = 0.12,
  sigma = SIGMA,
  tMax = 120,
  h = 0.5
}) {
  const startTime = performance.now();

  const points = [];
  let t = 0;
  let R = 100.0;
  let A = 0.0;
  let maxError = 0.0;

  // ODE derivative functions
  const dR_dt = (time, rVal) => -alpha * time * rVal;
  const dA_dt = (rVal, aVal) => (mu * rVal) - (sigma * aVal);

  while (t <= tMax + 1e-9) {
    const R_exact = exactRetention(t, alpha);
    const error = Math.abs(R - R_exact);
    if (error > maxError) {
      maxError = error;
    }

    // Record sampled point for visualization
    points.push({
      t: Math.round(t * 10) / 10,
      R: Number(R.toFixed(2)),
      A: Number(A.toFixed(2)),
      R_exact: Number(R_exact.toFixed(2)),
      error: error
    });

    // RK4 integration step
    const k1_R = dR_dt(t, R);
    const k1_A = dA_dt(R, A);

    const t_mid = t + 0.5 * h;
    const R_k2 = R + 0.5 * h * k1_R;
    const A_k2 = A + 0.5 * h * k1_A;
    const k2_R = dR_dt(t_mid, R_k2);
    const k2_A = dA_dt(R_k2, A_k2);

    const R_k3 = R + 0.5 * h * k2_R;
    const A_k3 = A + 0.5 * h * k2_A;
    const k3_R = dR_dt(t_mid, R_k3);
    const k3_A = dA_dt(R_k3, A_k3);

    const t_next = t + h;
    const R_k4 = R + h * k3_R;
    const A_k4 = A + h * k3_A;
    const k4_R = dR_dt(t_next, R_k4);
    const k4_A = dA_dt(R_k4, A_k4);

    R += (h / 6) * (k1_R + 2 * k2_R + 2 * k3_R + k4_R);
    A += (h / 6) * (k1_A + 2 * k2_A + 2 * k3_A + k4_A);

    t += h;
  }

  const endTime = performance.now();
  const cpuTimeMs = Number((endTime - startTime).toFixed(3));

  return {
    points,
    telemetry: {
      cpuTimeMs,
      totalNodes: points.length,
      stepSize: h,
      maxError,
      tMax,
      status: maxError < 1e-5 ? 'Convergencia Óptima (Estable)' : 'Aceptable'
    }
  };
}

/**
 * Complete simulation runner combining user inputs with RK4 solver.
 */
export function runSimulation({
  sleepHours = 7,
  screenHours = 4,
  backlogLevel = 3,
  techniqueId = 'medium',
  h = 0.5
}) {
  const norm = normalizeInputs(sleepHours, screenHours, backlogLevel);
  const stressAndAlpha = calculateStressAndAlpha(norm.s, norm.p, norm.r);
  const technique = STUDY_TECHNIQUES[techniqueId] || STUDY_TECHNIQUES.medium;

  const rk4Result = solveRK4({
    alpha: stressAndAlpha.alpha,
    mu: technique.mu,
    sigma: SIGMA,
    tMax: 120,
    h
  });

  return {
    inputs: {
      sleepHours,
      screenHours,
      backlogLevel,
      technique
    },
    normalized: norm,
    stressIndex: stressAndAlpha.stressIndex,
    alpha: stressAndAlpha.alpha,
    optimalTime: stressAndAlpha.optimalTime,
    optimalTimeMin: Math.round(stressAndAlpha.optimalTime),
    points: rk4Result.points,
    telemetry: rk4Result.telemetry
  };
}
