import React, { useState } from 'react';

interface ConfigPageProps {
  onStart: (config: any) => void;
}

const ConfigPage: React.FC<ConfigPageProps> = ({ onStart }) => {
  const [totalTime, setTotalTime] = useState<string>('');
  const [isInfinite, setIsInfinite] = useState<boolean>(true);
  const [inhaleTime, setInhaleTime] = useState<string>('5');
  const [holdFullTime, setHoldFullTime] = useState<string>('2');
  const [exhaleTime, setExhaleTime] = useState<string>('7');
  const [holdEmptyTime, setHoldEmptyTime] = useState<string>('1');

  const handleStart = () => {
    // Basic validation for now
    if (inhaleTime && holdFullTime && exhaleTime && holdEmptyTime) {
      onStart({
        totalTime: isInfinite ? Infinity : parseInt(totalTime),
        inhale: parseInt(inhaleTime),
        holdFull: parseInt(holdFullTime),
        exhale: parseInt(exhaleTime),
        holdEmpty: parseInt(holdEmptyTime),
      });
    } else {
      alert('Please fill in all breath part timings.');
    }
  };

  return (
    <div className="config-page">
      <h1>Breathwork Configuration</h1>
      <div>
        <label>
          <input
            type="checkbox"
            checked={isInfinite}
            onChange={(e) => setIsInfinite(e.target.checked)}
          />
          Infinite Training Time
        </label>
      </div>
      {!isInfinite && (
        <div>
          <label>Total Training Time (seconds):</label>
          <input
            type="number"
            value={totalTime}
            onChange={(e) => setTotalTime(e.target.value)}
          />
        </div>
      )}
      <div>
        <label>Inhale Time (seconds):</label>
        <input
          type="number"
          value={inhaleTime}
          onChange={(e) => setInhaleTime(e.target.value)}
        />
      </div>
      <div>
        <label>Hold Full Time (seconds):</label>
        <input
          type="number"
          value={holdFullTime}
          onChange={(e) => setHoldFullTime(e.target.value)}
        />
      </div>
      <div>
        <label>Exhale Time (seconds):</label>
        <input
          type="number"
          value={exhaleTime}
          onChange={(e) => setExhaleTime(e.target.value)}
        />
      </div>
      <div>
        <label>Hold Empty Time (seconds):</label>
        <input
          type="number"
          value={holdEmptyTime}
          onChange={(e) => setHoldEmptyTime(e.target.value)}
        />
      </div>
      <button onClick={handleStart}>Start Training</button>
    </div>
  );
};

export default ConfigPage;
