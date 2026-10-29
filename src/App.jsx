import React, { useState } from 'react';
import ParticleBackground from './components/ParticleBackground';
import Onboarding from './components/Onboarding';
import CheckIn from './components/CheckIn';
import TerminalLoader from './components/TerminalLoader';
import Dashboard from './components/Dashboard';
import { runSimulation } from './services/MathEngine';

export default function App() {
  // Screens: 'onboarding' | 'checkin' | 'processing' | 'dashboard'
  const [screen, setScreen] = useState('onboarding');
  const [simulationData, setSimulationData] = useState(null);

  const handleStartCheckIn = () => {
    setScreen('checkin');
  };

  const handleCompleteCheckIn = (formData) => {
    // Run mathematical simulation
    const results = runSimulation({
      sleepHours: formData.sleepHours,
      screenHours: formData.screenHours,
      backlogLevel: formData.backlogLevel,
      techniqueId: formData.techniqueId,
      h: 0.5
    });

    setSimulationData(results);
    setScreen('processing');
  };

  const handleProcessingFinished = () => {
    setScreen('dashboard');
  };

  const handleReset = () => {
    setScreen('checkin');
  };

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-white selection:bg-google-blue/30 selection:text-white">
      {/* Interactive Antigravity Particle Canvas */}
      <ParticleBackground />

      {/* Main Content Router */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {screen === 'onboarding' && (
          <Onboarding onStart={handleStartCheckIn} />
        )}

        {screen === 'checkin' && (
          <CheckIn
            onComplete={handleCompleteCheckIn}
            onCancel={() => setScreen('onboarding')}
          />
        )}

        {screen === 'processing' && simulationData && (
          <TerminalLoader
            simulationData={simulationData}
            onComplete={handleProcessingFinished}
          />
        )}

        {screen === 'dashboard' && simulationData && (
          <Dashboard
            simulationData={simulationData}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}
