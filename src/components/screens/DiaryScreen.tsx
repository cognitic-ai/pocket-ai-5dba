import React, { useState, useEffect } from 'react';

interface DiaryEntry {
  id: string;
  date: string;
  content: string;
  timestamp: number;
  mood: string;
}

interface DiaryScreenProps {
  onGoBack: () => void;
}

const DiaryScreen: React.FC<DiaryScreenProps> = ({ onGoBack }) => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('zh-CN'));
  const [editingContent, setEditingContent] = useState('');

  useEffect(() => {
    const appData = JSON.parse(localStorage.getItem('appData') || '{}');
    const diary = appData.diary || {};
    const entriesArray = Object.values(diary) as DiaryEntry[];
    setEntries(entriesArray.sort((a, b) => b.timestamp - a.timestamp));
  }, []);

  const generateAutoEntry = () => {
    const moods = ['开心', '充实', '平静', '疲惫', '期待'];
    const activities = [
      '今天和朋友聊天，很开心',
      '工作进展顺利，感到很充实',
      '放松了一整天，感到很平静',
      '累了一天，早点休息了',
      '期待明天的计划',
    ];

    const content = activities[Math.floor(Math.random() * activities.length)];
    const mood = moods[Math.floor(Math.random() * moods.length)];

    const entry: DiaryEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      content: content,
      timestamp: Date.now(),
      mood: mood,
    };

    return entry;
  };

  const saveDiary = () => {
    if (editingContent.trim()) {
      const entry: DiaryEntry = {
        id: Date.now().toString(),
        date: selectedDate,
        content: editingContent,
        timestamp: Date.now(),
        mood: '平静',
      };

      const updated = [entry, ...entries];
      setEntries(updated);
      setEditingContent('');

      const appData = JSON.parse(localStorage.getItem('appData') || '{}');
      appData.diary = appData.diary || {};
      appData.diary[entry.id] = entry;
      localStorage.setItem('appData', JSON.stringify(appData));

      alert('日记已保存');
    }
  };

  const autoGenerate = () => {
    const entry = generateAutoEntry();
    const updated = [entry, ...entries];
    setEntries(updated);

    const appData = JSON.parse(localStorage.getItem('appData') || '{}');
    appData.diary = appData.diary || {};
    appData.diary[entry.id] = entry;
    localStorage.setItem('appData', JSON.stringify(appData));

    alert('自动生成日记成功');
  };

  return (
    <div className="diary-screen">
      <div className="screen-header">
        <button onClick={onGoBack} className="back-btn">←</button>
        <h2>日记</h2>
        <div></div>
      </div>

      <div className="diary-content">
        <div className="diary-editor">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <textarea
            placeholder="写下你的想法..."
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            maxLength={500}
          />
          <div className="diary-actions">
            <button onClick={saveDiary} className="save-btn">💾 保存</button>
            <button onClick={autoGenerate} className="auto-btn">✨ 自动生成</button>
          </div>
        </div>

        <div className="diary-list">
          {entries.map((entry) => (
            <div key={entry.id} className="diary-card">
              <div className="diary-header">
                <strong>{entry.date}</strong>
                <span className="mood-badge">情绪: {entry.mood}</span>
              </div>
              <p>{entry.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiaryScreen;
