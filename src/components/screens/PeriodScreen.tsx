import React, { useState, useEffect } from 'react';

interface PeriodData {
  startDate: string;
  endDate: string;
  cycleLength: number;
  lastDate: number;
}

interface PeriodScreenProps {
  onGoBack: () => void;
}

const PeriodScreen: React.FC<PeriodScreenProps> = ({ onGoBack }) => {
  const [periodData, setPeriodData] = useState<PeriodData | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const appData = JSON.parse(localStorage.getItem('appData') || '{}');
    if (appData.period) {
      setPeriodData(appData.period);
    }
  }, []);

  const recordPeriod = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const cycleLength = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 28;

      const newData: PeriodData = {
        startDate,
        endDate,
        cycleLength: cycleLength || 28,
        lastDate: start.getTime(),
      };

      setPeriodData(newData);
      setStartDate('');
      setEndDate('');

      const appData = JSON.parse(localStorage.getItem('appData') || '{}');
      appData.period = newData;
      localStorage.setItem('appData', JSON.stringify(appData));

      alert('周期已记录！');
    }
  };

  const getPredictedDate = () => {
    if (!periodData) return null;
    const lastDate = new Date(periodData.lastDate);
    const nextDate = new Date(lastDate.getTime() + periodData.cycleLength * 24 * 60 * 60 * 1000);
    return nextDate.toLocaleDateString('zh-CN');
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      let isMarked = false;

      if (periodData) {
        const start = new Date(periodData.startDate);
        const end = new Date(periodData.endDate);
        const current = new Date(dateStr);
        isMarked = current >= start && current <= end;
      }

      days.push(
        <div
          key={day}
          className={`calendar-day ${isMarked ? 'marked' : ''}`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="period-screen">
      <div className="screen-header">
        <button onClick={onGoBack} className="back-btn">←</button>
        <h2>经期记录</h2>
        <div></div>
      </div>

      <div className="period-content">
        <div className="period-input">
          <h3>记录周期</h3>
          <label>
            开始日期:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            结束日期:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
          <button onClick={recordPeriod} className="record-btn">记录</button>
        </div>

        {periodData && (
          <div className="period-info">
            <h3>💫 下次预测</h3>
            <p>下次预测日期: <strong>{getPredictedDate()}</strong></p>
            <p>周期长度: <strong>{periodData.cycleLength}</strong> 天</p>
            <p className="reminder">💝 多喝温水，好好休息</p>
          </div>
        )}

        <div className="calendar-section">
          <div className="calendar-header">
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>←</button>
            <h4>{currentMonth.toLocaleString('zh-CN', { month: 'long', year: 'numeric' })}</h4>
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>→</button>
          </div>
          <div className="calendar-grid">
            {renderCalendar()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeriodScreen;
