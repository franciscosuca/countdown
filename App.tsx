
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { TimeRemaining } from './types';
import TimeUnit from './components/TimeUnit';

// Helper to get a default future date (tomorrow)
const getDefaultTargetDate = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0); // Set to 9:00 AM
  // Format to 'YYYY-MM-DDTHH:mm' which is required by datetime-local input
  const year = tomorrow.getFullYear();
  const month = (tomorrow.getMonth() + 1).toString().padStart(2, '0');
  const day = tomorrow.getDate().toString().padStart(2, '0');
  const hours = tomorrow.getHours().toString().padStart(2, '0');
  const minutes = tomorrow.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};


const App: React.FC = () => {
  const [targetDate, setTargetDate] = useState<string>(getDefaultTargetDate());
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const calculateTimeRemaining = useCallback((target: string): TimeRemaining | null => {
    const targetTime = new Date(target).getTime();
    if (isNaN(targetTime)) return null;

    const now = new Date().getTime();
    const difference = targetTime - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }, []);

  useEffect(() => {
    if (!targetDate) return;

    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, calculateTimeRemaining]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetDate(event.target.value);
  };

  const isCountdownFinished = useMemo(() => {
    if (!timeRemaining) return false;
    return Object.values(timeRemaining).every(val => val === 0);
  }, [timeRemaining]);
  
  if (!isClient) {
    return null; // Don't render on the server to avoid hydration mismatch with the input's default value.
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center">
        
        <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                Time Delta Calculator
            </h1>
            <p className="mt-2 text-lg text-gray-400">Select a future date and time to start the countdown.</p>
        </header>

        <div className="mb-10 w-full max-w-sm">
          <label htmlFor="datetime-picker" className="sr-only">Select target date and time</label>
          <input
            id="datetime-picker"
            type="datetime-local"
            value={targetDate}
            onChange={handleDateChange}
            className="w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all"
          />
        </div>

        {timeRemaining && !isCountdownFinished && (
          <main className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8">
            <TimeUnit value={timeRemaining.days} label="Days" />
            <TimeUnit value={timeRemaining.hours} label="Hours" />
            <TimeUnit value={timeRemaining.minutes} label="Minutes" />
            <TimeUnit value={timeRemaining.seconds} label="Seconds" />
          </main>
        )}

        {isCountdownFinished && (
            <div className="p-8 bg-green-900/50 border border-green-400 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold text-green-300">Countdown Finished!</h2>
                <p className="mt-2 text-green-200">The selected time has been reached.</p>
            </div>
        )}
        
        {!targetDate && (
             <div className="p-8 bg-yellow-900/50 border border-yellow-400 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold text-yellow-300">Please select a date</h2>
                <p className="mt-2 text-yellow-200">Choose a target date and time to begin.</p>
            </div>
        )}

      </div>
       <footer className="absolute bottom-4 text-gray-500 text-sm">
        Built with Gemini by F.A.S.C.
      </footer>
    </div>
  );
};

export default App;
