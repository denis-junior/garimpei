import React, { useState, useEffect } from 'react';
import { formatDistance } from 'date-fns';

interface CountdownTimerProps {
  endDate: string;
  onEnd?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ endDate, onEnd }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isEnded, setIsEnded] = useState<boolean>(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const end = new Date(endDate);
      
      // If the auction has ended
      if (end <= now) {
        setTimeLeft('Ended');
        setIsEnded(true);
        if (onEnd) onEnd();
        return;
      }
      
      // Update the countdown text
      setTimeLeft(formatDistance(end, now, { addSuffix: false }));
    };
    
    // Initial update
    updateCountdown();
    
    // Update every second
    const interval = setInterval(updateCountdown, 1000);
    
    // Clean up
    return () => clearInterval(interval);
  }, [endDate, onEnd]);

  return (
    <div className={`font-medium ${isEnded ? 'text-red-500' : 'text-teal-600'}`}>
      {isEnded ? (
        <span>Auction ended</span>
      ) : (
        <span>Ends in {timeLeft}</span>
      )}
    </div>
  );
};

export default CountdownTimer;