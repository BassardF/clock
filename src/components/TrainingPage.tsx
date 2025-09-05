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
  const [currentPhase, setCurrentPhase] = useState('Breath In');
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState(config.inhale);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const cycleDuration = config.inhale + config.holdFull + config.exhale + config.holdEmpty;

  const animate = (time: number) => {
    if (lastTimeRef.current !== null) {
      const deltaTime = time - lastTimeRef.current;

      setPhaseTimeRemaining((prev) => {
        const newTime = prev - deltaTime / 1000;
        if (newTime <= 0) {
          let nextPhase = '';
          let nextPhaseDuration = 0;

          switch (currentPhase) {
            case 'Breath In':
              nextPhase = 'Hold Full';
              nextPhaseDuration = config.holdFull;
              break;
            case 'Hold Full':
              nextPhase = 'Breath Out';
              nextPhaseDuration = config.exhale;
              break;
            case 'Breath Out':
              nextPhase = 'Hold Empty';
              nextPhaseDuration = config.holdEmpty;
              break;
            case 'Hold Empty':
              nextPhase = 'Breath In';
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
            onStop();
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
  }, [config, currentPhase]);

  const getPhaseWidth = (phase: string) => {
    let duration = 0;
    switch (phase) {
      case 'Breath In': duration = config.inhale; break;
      case 'Hold Full': duration = config.holdFull; break;
      case 'Breath Out': duration = config.exhale; break;
      case 'Hold Empty': duration = config.holdEmpty; break;
    }
    return (duration / cycleDuration) * 100; // Percentage of total width
  };

  const getPhaseProgressWidth = () => {
    let currentPhaseDuration = 0;
    switch (currentPhase) {
      case 'Breath In': currentPhaseDuration = config.inhale; break;
      case 'Hold Full': currentPhaseDuration = config.holdFull; break;
      case 'Breath Out': currentPhaseDuration = config.exhale; break;
      case 'Hold Empty': currentPhaseDuration = config.holdEmpty; break;
    }
    const progress = (currentPhaseDuration - phaseTimeRemaining) / currentPhaseDuration;
    return progress * getPhaseWidth(currentPhase);
  };

  return (
    <div className="training-page">
      <h1>Breathwork Session</h1>
      <div className="linear-timer-container">
        <div className="progress-bar-segments">
          <div className="segment-bar inhale-segment-bar" style={{ width: `${getPhaseWidth('Breath In')}%` }}>
            <span className="segment-label">Breath In</span>
            {currentPhase === 'Breath In' && (
              <div className="progress-fill" style={{ width: `${getPhaseProgressWidth()}%` }}></div>
            )}
          </div>
          <div className="segment-bar hold-full-segment-bar" style={{ width: `${getPhaseWidth('Hold Full')}%` }}>
            <span className="segment-label">Hold</span>
            {currentPhase === 'Hold Full' && (
              <div className="progress-fill" style={{ width: `${getPhaseProgressWidth()}%` }}></div>
            )}
          </div>
          <div className="segment-bar exhale-segment-bar" style={{ width: `${getPhaseWidth('Breath Out')}%` }}>
            <span className="segment-label">Breath Out</span>
            {currentPhase === 'Breath Out' && (
              <div className="progress-fill" style={{ width: `${getPhaseProgressWidth()}%` }}></div>
            )}
          </div>
          <div className="segment-bar hold-empty-segment-bar" style={{ width: `${getPhaseWidth('Hold Empty')}%` }}>
            <span className="segment-label">Hold</span>
            {currentPhase === 'Hold Empty' && (
              <div className="progress-fill" style={{ width: `${getPhaseProgressWidth()}%` }}></div>
            )}
          </div>
        </div>
        <div className="current-phase-display">
          <h2>{currentPhase}</h2>
          <p>Time in Phase: {phaseTimeRemaining.toFixed(1)}s</p>
        </div>
      </div>
      {config.totalTime !== Infinity && (
        <p>Total Time Remaining: {timeRemaining.toFixed(1)}s</p>
      )}
      <button onClick={onStop}>Stop Training</button>
    </div>
  );
};

export default TrainingPage;
