import React, { useState } from 'react';
import ConfigPage from './components/ConfigPage';
import TrainingPage from './components/TrainingPage';
import './App.css';

function App() {
  const [trainingStarted, setTrainingStarted] = useState(false);
  const [trainingConfig, setTrainingConfig] = useState<any>(null);

  const handleStartTraining = (config: any) => {
    setTrainingConfig(config);
    setTrainingStarted(true);
  };

  const handleStopTraining = () => {
    setTrainingStarted(false);
    setTrainingConfig(null);
  };

  return (
    <div className="App">
      {trainingStarted ? (
        <TrainingPage config={trainingConfig} onStop={handleStopTraining} />
      ) : (
        <ConfigPage onStart={handleStartTraining} />
      )}
    </div>
  );
}

export default App;
