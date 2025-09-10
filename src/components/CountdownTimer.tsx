import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  endDate?: Date | string; // Data final do leilão
  timeRemaining?: number; // em milissegundos
  onEnd?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  endDate,
  timeRemaining,
  onEnd,
}) => {
  const getInitialTime = () => {
    if (typeof timeRemaining === "number") {
      return timeRemaining;
    }
    if (endDate) {
      const end = new Date(endDate).getTime();
      const now = Date.now();
      return Math.max(end - now, 0);
    }
    return 0;
  };

  const [msLeft, setMsLeft] = useState(getInitialTime());
  const [isEnded, setIsEnded] = useState(msLeft <= 0);

  useEffect(() => {
    setMsLeft(getInitialTime());
    setIsEnded(getInitialTime() <= 0);
  }, [endDate, timeRemaining]);

  useEffect(() => {
    if (msLeft <= 0) {
      setIsEnded(true);
      if (onEnd) onEnd();
      return;
    }
    const interval = setInterval(() => {
      setMsLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          setIsEnded(true);
          if (onEnd) onEnd();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [msLeft]);

  if (isEnded) {
    return <div className="font-medium text-red-500">Leilão Finalizado</div>;
  }

  const totalSeconds = Math.floor(msLeft / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let timeString = "";
  if (days > 0) timeString += `${days}d `;
  if (days > 0 || hours > 0) timeString += `${hours}h `;
  if (days > 0 || hours > 0 || minutes > 0) timeString += `${minutes}m `;
  timeString += `${seconds}s`;

  return (
    <div className="font-medium text-teal-600">
      Termina em {timeString.trim()}
    </div>
  );
};

export default CountdownTimer;
