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
  const phaseStartTimeRef = useRef<number | null>(null); // Store the time when the current phase started
  const sessionStartTimeRef = useRef<number | null>(null); // Store the time when the session started

  const cycleDuration = config.inhale + config.holdFull + config.exhale + config.holdEmpty;

  const animate = (time: number) => {
    if (phaseStartTimeRef.current === null) {
      phaseStartTimeRef.current = time; // Set start time for the first frame of the phase
    }
    if (sessionStartTimeRef.current === null) {
      sessionStartTimeRef.current = time; // Set start time for the first frame of the session
    }

    const elapsedInPhase = (time - phaseStartTimeRef.current) / 1000; // Elapsed time in current phase

    let currentPhaseDuration = 0;
    switch (currentPhase) {
      case 'Breath In': currentPhaseDuration = config.inhale; break;
      case 'Hold Full': currentPhaseDuration = config.holdFull; break;
      case 'Breath Out': currentPhaseDuration = config.exhale; break;
      case 'Hold Empty': currentPhaseDuration = config.holdEmpty; break;
    }

    const newPhaseTimeRemaining = currentPhaseDuration - elapsedInPhase;

    if (newPhaseTimeRemaining <= 0) {
      // Phase transition logic
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
      setPhaseTimeRemaining(nextPhaseDuration); // Set to the full duration of the next phase
      phaseStartTimeRef.current = time; // Reset phase start time for the new phase
    } else {
      setPhaseTimeRemaining(newPhaseTimeRemaining);
    }

    if (config.totalTime !== Infinity) {
      const elapsedInSession = (time - sessionStartTimeRef.current) / 1000; // Elapsed time in session
      const newTotalTimeRemaining = config.totalTime - elapsedInSession;

      if (newTotalTimeRemaining <= 0) {
        onStop();
        setTimeRemaining(0);
      } else {
        setTimeRemaining(newTotalTimeRemaining);
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Reset phaseStartTimeRef and sessionStartTimeRef when currentPhase changes or component mounts
    phaseStartTimeRef.current = null;
    sessionStartTimeRef.current = null;
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
    const progress = 1 - (phaseTimeRemaining / currentPhaseDuration);
    return progress * getPhaseWidth(currentPhase);
  };

  const getCursorPosition = () => {
    let currentPhaseStartTime = 0; // Percentage of total width where current phase starts
    let currentPhaseDuration = 0;

    switch (currentPhase) {
      case 'Breath In':
        currentPhaseStartTime = 0;
        currentPhaseDuration = config.inhale;
        break;
      case 'Hold Full':
        currentPhaseStartTime = getPhaseWidth('Breath In');
        currentPhaseDuration = config.holdFull;
        break;
      case 'Breath Out':
        currentPhaseStartTime = getPhaseWidth('Breath In') + getPhaseWidth('Hold Full');
        currentPhaseDuration = config.exhale;
        break;
      case 'Hold Empty':
        currentPhaseStartTime = getPhaseWidth('Breath In') + getPhaseWidth('Hold Full') + getPhaseWidth('Breath Out');
        currentPhaseDuration = config.holdEmpty;
        break;
    }

    const progressInCurrentPhase = (currentPhaseDuration - phaseTimeRemaining) / currentPhaseDuration;
    const progressWidthInCurrentPhase = progressInCurrentPhase * getPhaseWidth(currentPhase);

    return currentPhaseStartTime + progressWidthInCurrentPhase;
  };

  const getFillWidth = (phase: string) => {
    // Determine the order of phases
    const phaseOrder = ['Breath In', 'Hold Full', 'Breath Out', 'Hold Empty'];
    const currentPhaseIndex = phaseOrder.indexOf(currentPhase);
    const targetPhaseIndex = phaseOrder.indexOf(phase);

    if (targetPhaseIndex < currentPhaseIndex) {
      // This phase is in the past, it should be 100% filled
      return '100%';
    } else if (targetPhaseIndex === currentPhaseIndex) {
      // This is the current phase, use its progress
      return `${getPhaseProgressWidth()}%`;
    } else {
      // This phase is in the future, it should be 0% filled
      return '0%';
    }
  };

  return (
    <div className="training-page">
      <h1>Breathwork Session</h1>
      <div className="linear-timer-container">
        <div className="progress-bar-segments">
          <div className="segment-bar inhale-segment-bar" style={{ width: `${getPhaseWidth('Breath In')}%` }}>
            <span className="segment-label">Breath In</span>
            <div className="progress-fill" style={{ width: getFillWidth('Breath In') }}></div>
          </div>
          <div className="segment-bar hold-full-segment-bar" style={{ width: `${getPhaseWidth('Hold Full')}%` }}>
            <span className="segment-label">Hold</span>
            <div className="progress-fill" style={{ width: getFillWidth('Hold Full') }}></div>
          </div>
          <div className="segment-bar exhale-segment-bar" style={{ width: `${getPhaseWidth('Breath Out')}%` }}>
            <span className="segment-label">Breath Out</span>
            <div className="progress-fill" style={{ width: getFillWidth('Breath Out') }}></div>
          </div>
          <div className="segment-bar hold-empty-segment-bar" style={{ width: `${getPhaseWidth('Hold Empty')}%` }}>
            <span className="segment-label">Hold</span>
            <div className="progress-fill" style={{ width: getFillWidth('Hold Empty') }}></div>
          </div>
        </div>
        <div className="cursor" style={{ left: `${getCursorPosition()}%` }}></div>
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