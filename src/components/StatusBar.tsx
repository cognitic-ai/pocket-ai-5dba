import React, { useState, useEffect } from 'react';

const StatusBar: React.FC = () => {
  const [time, setTime] = useState<string>('');
  const [battery] = useState(85);
  const [signal] = useState(4);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="status-bar">
      <div className="status-left">
        <span className="signal">{'📶'.repeat(signal)}</span>
        <span className="carrier">中国移动</span>
      </div>
      <div className="status-center">
        <span className="time">{time}</span>
      </div>
      <div className="status-right">
        <span className="battery">{battery}% 🔋</span>
      </div>
    </div>
  );
};

export default StatusBar;
