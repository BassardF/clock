import React, { useEffect, useState, useRef } from 'react';

interface TrainingPageProps {
  config: {
    totalTime: number;
    inhale: number;
    holdFull: number;
    exhale: number;
    holdEmpty: number;
  };
  onStop: () => void;
}

const TrainingPage: React.FC<TrainingPageProps> = ({ config, onStop }) => {
  const [timeRemaining, setTimeRemaining] = useState(config.totalTime);
  const [currentPhase, setCurrentPhase] = useState('Inhale');
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState(config.inhale);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>();

  const cycleDuration = config.inhale + config.holdFull + config.exhale + config.holdEmpty;

  const animate = (time: number) => {
    if (lastTimeRef.current !== undefined) {
      const deltaTime = time - lastTimeRef.current;

      setPhaseTimeRemaining((prev) => {
        const newTime = prev - deltaTime / 1000;
        if (newTime <= 0) {
          // Move to next phase
          let nextPhase = '';
          let nextPhaseDuration = 0;

          switch (currentPhase) {
            case 'Inhale':
              nextPhase = 'Hold Full';
              nextPhaseDuration = config.holdFull;
              break;
            case 'Hold Full':
              nextPhase = 'Exhale';
              nextPhaseDuration = config.exhale;
              break;
            case 'Exhale':
              nextPhase = 'Hold Empty';
              nextPhaseDuration = config.holdEmpty;
              break;
            case 'Hold Empty':
              nextPhase = 'Inhale';
              nextPhaseDuration = config.inhale;
              break;
          }
          setCurrentPhase(nextPhase);
          return nextPhaseDuration;
        }
        return newTime;
      });

      if (config.totalTime !== Infinity) {
        setTimeRemaining((prev) => {
          const newTotalTime = prev - deltaTime / 1000;
          if (newTotalTime <= 0) {
            onStop(); // Session finished
            return 0;
          }
          return newTotalTime;
        });
      }
    }
    lastTimeRef.current = time;
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [config, currentPhase]); // Re-run effect if config or phase changes

  const getPhasePercentage = () => {
    let currentPhaseDuration = 0;
    switch (currentPhase) {
      case 'Inhale':
        currentPhaseDuration = config.inhale;
        break;
      case 'Hold Full':
        currentPhaseDuration = config.holdFull;
        break;
      case 'Exhale':
        currentPhaseDuration = config.exhale;
        break;
      case 'Hold Empty':
        currentPhaseDuration = config.holdEmpty;
        break;
    }
    return (phaseTimeRemaining / currentPhaseDuration) * 100;
  };

  const getCyclePercentage = () => {
    let timeInCycle = 0;
    switch (currentPhase) {
      case 'Inhale':
        timeInCycle = config.inhale - phaseTimeRemaining;
        break;
      case 'Hold Full':
        timeInCycle = config.inhale + (config.holdFull - phaseTimeRemaining);
        break;
      case 'Exhale':
        timeInCycle = config.inhale + config.holdFull + (config.exhale - phaseTimeRemaining);
        break;
      case 'Hold Empty':
        timeInCycle = config.inhale + config.holdFull + config.exhale + (config.holdEmpty - phaseTimeRemaining);
        break;
    }
    return (timeInCycle / cycleDuration) * 100;
  };

  // Placeholder for circular timer - will be replaced with SVG/Canvas
  const circleStyle = {
    background: `conic-gradient(
      #4CAF50 ${getCyclePercentage()}%, 
      #ddd ${getCyclePercentage()}%
    )`,
    borderRadius: '50%',
    width: '200px',
    height: '200px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '2em',
    fontWeight: 'bold',
  };

  return (
    <div className="training-page">
      <h1>Breathwork Session</h1>
      <div style={circleStyle}>
        {currentPhase}
      </div>
      <p>Time in Phase: {phaseTimeRemaining.toFixed(1)}s</p>
      {config.totalTime !== Infinity && (
        <p>Total Time Remaining: {timeRemaining.toFixed(1)}s</p>
      )}
      <button onClick={onStop}>Stop Training</button>
    </div>
  );
};

export default TrainingPage;
