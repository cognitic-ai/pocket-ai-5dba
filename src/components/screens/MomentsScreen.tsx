import React, { useState, useEffect } from 'react';

interface Moment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  image?: string;
  timestamp: number;
  likes: number;
  comments: string[];
  liked: boolean;
}

interface MomentsScreenProps {
  onGoBack: () => void;
}

const MomentsScreen: React.FC<MomentsScreenProps> = ({ onGoBack }) => {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    const appData = JSON.parse(localStorage.getItem('appData') || '{}');
    setMoments(appData.moments || []);
  }, []);

  const addMoment = () => {
    if (newContent.trim()) {
      const newMoment: Moment = {
        id: Date.now().toString(),
        author: '我',
        avatar: '👤',
        content: newContent,
        timestamp: Date.now(),
        likes: 0,
        comments: [],
        liked: false,
      };

      const updated = [newMoment, ...moments];
      setMoments(updated);
      setNewContent('');

      const appData = JSON.parse(localStorage.getItem('appData') || '{}');
      appData.moments = updated;
      localStorage.setItem('appData', JSON.stringify(appData));
    }
  };

  const toggleLike = (id: string) => {
    const updated = moments.map(m => {
      if (m.id === id) {
        return {
          ...m,
          liked: !m.liked,
          likes: m.liked ? m.likes - 1 : m.likes + 1
        };
      }
      return m;
    });
    setMoments(updated);

    const appData = JSON.parse(localStorage.getItem('appData') || '{}');
    appData.moments = updated;
    localStorage.setItem('appData', JSON.stringify(appData));
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN');
  };

  return (
    <div className="moments-screen">
      <div className="screen-header">
        <button onClick={onGoBack} className="back-btn">←</button>
        <h2>朋友圈</h2>
        <div></div>
      </div>

      <div className="moments-content">
        <div className="post-editor">
          <textarea
            placeholder="分享你的想法..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            maxLength={200}
          />
          <button onClick={addMoment} className="post-btn">发布</button>
        </div>

        <div className="moments-list">
          {moments.map((moment) => (
            <div key={moment.id} className="moment-card">
              <div className="moment-header">
                <span className="avatar">{moment.avatar}</span>
                <div className="moment-info">
                  <strong>{moment.author}</strong>
                  <small>{formatTime(moment.timestamp)}</small>
                </div>
              </div>
              <div className="moment-content">{moment.content}</div>
              {moment.image && <div className="moment-image">🖼️ {moment.image}</div>}
              <div className="moment-actions">
                <button onClick={() => toggleLike(moment.id)} className={moment.liked ? 'liked' : ''}>
                  👍 {moment.likes > 0 ? moment.likes : ''}
                </button>
                <button onClick={() => alert('评论功能开发中')}>💬 评论</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MomentsScreen;
