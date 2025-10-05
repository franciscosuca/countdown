
import React from 'react';

interface TimeUnitProps {
  value: number;
  label: string;
}

const TimeUnit: React.FC<TimeUnitProps> = ({ value, label }) => {
  const paddedValue = String(value).padStart(2, '0');

  return (
    <div className="flex flex-col items-center justify-center bg-gray-800/50 rounded-lg p-4 md:p-6 w-24 h-24 md:w-32 md:h-32 shadow-lg backdrop-blur-sm border border-white/10">
      <span className="text-4xl md:text-6xl font-mono font-bold text-cyan-300 tracking-wider">
        {paddedValue}
      </span>
      <span className="text-sm md:text-base text-gray-400 uppercase tracking-widest mt-1">
        {label}
      </span>
    </div>
  );
};

export default TimeUnit;
