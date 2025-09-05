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
          // Move to next phase
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

  const getSegmentDasharray = (segmentDuration: number, totalDuration: number) => {
    const segmentLength = (segmentDuration / totalDuration) * circumference;
    return `${segmentLength} ${circumference - segmentLength}`;
  };

  const getSegmentRotation = (phase: string) => {
    let rotation = 0;
    switch (phase) {
      case 'Breath In':
        rotation = 0;
        break;
      case 'Hold Full':
        rotation = (config.inhale / cycleDuration) * 360;
        break;
      case 'Breath Out':
        rotation = ((config.inhale + config.holdFull) / cycleDuration) * 360;
        break;
      case 'Hold Empty':
        rotation = ((config.inhale + config.holdFull + config.exhale) / cycleDuration) * 360;
        break;
    }
    return rotation;
  };

  const getPhaseDuration = (phase: string) => {
    switch (phase) {
      case 'Breath In': return config.inhale;
      case 'Hold Full': return config.holdFull;
      case 'Breath Out': return config.exhale;
      case 'Hold Empty': return config.holdEmpty;
      default: return 1; // Fallback
    }
  };

  const getElapsedTimeInCycle = () => {
    let elapsed = 0;
    switch (currentPhase) {
      case 'Breath In':
        elapsed = config.inhale - phaseTimeRemaining;
        break;
      case 'Hold Full':
        elapsed = config.inhale + (config.holdFull - phaseTimeRemaining);
        break;
      case 'Breath Out':
        elapsed = config.inhale + config.holdFull + (config.exhale - phaseTimeRemaining);
        break;
      case 'Hold Empty':
        elapsed = config.inhale + config.holdFull + config.exhale + (config.holdEmpty - phaseTimeRemaining);
        break;
    }
    return elapsed;
  };

  const currentPhaseDuration = getPhaseDuration(currentPhase);
  const progressInCurrentPhase = (currentPhaseDuration - phaseTimeRemaining) / currentPhaseDuration;

  const indicatorAngle = getSegmentRotation(currentPhase) + (progressInCurrentPhase * (currentPhaseDuration / cycleDuration) * 360);

  const getLabelPosition = (phase: string) => {
    let startAngle = 0;
    let duration = 0;

    switch (phase) {
      case 'Breath In':
        startAngle = 0;
        duration = config.inhale;
        break;
      case 'Hold Full':
        startAngle = config.inhale;
        duration = config.holdFull;
        break;
      case 'Breath Out':
        startAngle = config.inhale + config.holdFull;
        duration = config.exhale;
        break;
      case 'Hold Empty':
        startAngle = config.inhale + config.holdFull + config.exhale;
        duration = config.holdEmpty;
        break;
    }

    const midAngle = (startAngle + duration / 2) / cycleDuration * 360 - 90; // -90 to start from top
    const labelRadius = radius * 0.85; // Adjust as needed

    const x = 100 + labelRadius * Math.cos(midAngle * Math.PI / 180);
    const y = 100 + labelRadius * Math.sin(midAngle * Math.PI / 180);
    return { x, y };
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

          {/* Segments */}
          <circle
            className="segment inhale-segment"
            cx="100"
            cy="100"
            r={radius}
            strokeDasharray={getSegmentDasharray(config.inhale, cycleDuration)}
            strokeDashoffset={0}
            transform={`rotate(${getSegmentRotation('Breath In')} ${100} ${100})`}
          />
          <circle
            className="segment hold-full-segment"
            cx="100"
            cy="100"
            r={radius}
            strokeDasharray={getSegmentDasharray(config.holdFull, cycleDuration)}
            strokeDashoffset={0}
            transform={`rotate(${getSegmentRotation('Hold Full')} ${100} ${100})`}
          />
          <circle
            className="segment exhale-segment"
            cx="100"
            cy="100"
            r={radius}
            strokeDasharray={getSegmentDasharray(config.exhale, cycleDuration)}
            strokeDashoffset={0}
            transform={`rotate(${getSegmentRotation('Breath Out')} ${100} ${100})`}
          />
          <circle
            className="segment hold-empty-segment"
            cx="100"
            cy="100"
            r={radius}
            strokeDasharray={getSegmentDasharray(config.holdEmpty, cycleDuration)}
            strokeDashoffset={0}
            transform={`rotate(${getSegmentRotation('Hold Empty')} ${100} ${100})`}
          />

          {/* Phase Labels */}
          <text
            x={getLabelPosition('Breath In').x}
            y={getLabelPosition('Breath In').y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="phase-label"
            transform="rotate(90 100 100)"
          >
            Breath In
          </text>
          <text
            x={getLabelPosition('Hold Full').x}
            y={getLabelPosition('Hold Full').y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="phase-label"
            transform="rotate(90 100 100)"
          >
            Hold
          </text>
          <text
            x={getLabelPosition('Breath Out').x}
            y={getLabelPosition('Breath Out').y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="phase-label"
            transform="rotate(90 100 100)"
          >
            Breath Out
          </text>
          <text
            x={getLabelPosition('Hold Empty').x}
            y={getLabelPosition('Hold Empty').y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="phase-label"
            transform="rotate(90 100 100)"
          >
            Empty
          </text>

          {/* Current position indicator */}
          <circle
            className="indicator-dot"
            cx={100 + radius * Math.cos((indicatorAngle - 90) * Math.PI / 180)}
            cy={100 + radius * Math.sin((indicatorAngle - 90) * Math.PI / 180)}
            r="5"
            fill="white"
          />

          {/* Center Current Phase Text */}
          <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" className="timer-text" transform="rotate(90 100 100)">
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