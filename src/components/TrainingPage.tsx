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

  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  const getPhaseProgress = () => {
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
    return (phaseTimeRemaining / currentPhaseDuration);
  };

  const getSegmentDashoffset = (segmentDuration: number, totalDuration: number, progress: number) => {
    const segmentLength = (segmentDuration / totalDuration) * circumference;
    return segmentLength * (1 - progress);
  };

  const getSegmentDasharray = (segmentDuration: number, totalDuration: number) => {
    const segmentLength = (segmentDuration / totalDuration) * circumference;
    return `${segmentLength} ${circumference - segmentLength}`;
  };

  const getRotation = () => {
    let rotation = 0;
    switch (currentPhase) {
      case 'Inhale':
        rotation = 0;
        break;
      case 'Hold Full':
        rotation = (config.inhale / cycleDuration) * 360;
        break;
      case 'Exhale':
        rotation = ((config.inhale + config.holdFull) / cycleDuration) * 360;
        break;
      case 'Hold Empty':
        rotation = ((config.inhale + config.holdFull + config.exhale) / cycleDuration) * 360;
        break;
    }
    return rotation;
  };

  return (
    <div className="training-page">
      <h1>Breathwork Session</h1>
      <div className="timer-container">
        <svg className="timer-svg" viewBox="0 0 200 200">
          <circle
            className="timer-circle-bg"
            cx="100"
            cy="100"
            r={radius}
          />
          <circle
            className="timer-circle-progress"
            cx="100"
            cy="100"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={getSegmentDashoffset(cycleDuration, cycleDuration, getPhaseProgress())}
            transform={`rotate(-90 ${100} ${100})`}
          />
          {/* Segments */}
          <circle
            className="segment inhale-segment"
            cx="100"
            cy="100"
            r={radius}
            strokeDasharray={getSegmentDasharray(config.inhale, cycleDuration)}
            strokeDashoffset={getSegmentDashoffset(config.inhale, cycleDuration, currentPhase === 'Inhale' ? getPhaseProgress() : 0)}
            transform={`rotate(${getRotation()} ${100} ${100})`}
          />
          <circle
            className="segment hold-full-segment"
            cx="100"
            cy="100"
            r={radius}
            strokeDasharray={getSegmentDasharray(config.holdFull, cycleDuration)}
            strokeDashoffset={getSegmentDashoffset(config.holdFull, cycleDuration, currentPhase === 'Hold Full' ? getPhaseProgress() : 0)}
            transform={`rotate(${getRotation() + (config.inhale / cycleDuration) * 360} ${100} ${100})`}
          />
          <circle
            className="segment exhale-segment"
            cx="100"
            cy="100"
            r={radius}
            strokeDasharray={getSegmentDasharray(config.exhale, cycleDuration)}
            strokeDashoffset={getSegmentDashoffset(config.exhale, cycleDuration, currentPhase === 'Exhale' ? getPhaseProgress() : 0)}
            transform={`rotate(${getRotation() + ((config.inhale + config.holdFull) / cycleDuration) * 360} ${100} ${100})`}
          />
          <circle
            className="segment hold-empty-segment"
            cx="100"
            cy="100"
            r={radius}
            strokeDasharray={getSegmentDasharray(config.holdEmpty, cycleDuration)}
            strokeDashoffset={getSegmentDashoffset(config.holdEmpty, cycleDuration, currentPhase === 'Hold Empty' ? getPhaseProgress() : 0)}
            transform={`rotate(${getRotation() + ((config.inhale + config.holdFull + config.exhale) / cycleDuration) * 360} ${100} ${100})`}
          />

          <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" className="timer-text">
            {currentPhase}
          </text>
        </svg>
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
