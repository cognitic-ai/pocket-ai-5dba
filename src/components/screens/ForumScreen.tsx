import React, { useState, useEffect } from 'react';

interface Post {
  id: string;
  author: string;
  title: string;
  content: string;
  timestamp: number;
  replies: number;
}

interface ForumScreenProps {
  onGoBack: () => void;
}

const ForumScreen: React.FC<ForumScreenProps> = ({ onGoBack }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    const appData = JSON.parse(localStorage.getItem('appData') || '{}');
    setPosts(appData.forums || []);
  }, []);

  const addPost = () => {
    if (newTitle.trim() && newContent.trim()) {
      const newPost: Post = {
        id: Date.now().toString(),
        author: '我',
        title: newTitle,
        content: newContent,
        timestamp: Date.now(),
        replies: 0,
      };

      const updated = [newPost, ...posts];
      setPosts(updated);
      setNewTitle('');
      setNewContent('');

      const appData = JSON.parse(localStorage.getItem('appData') || '{}');
      appData.forums = updated;
      localStorage.setItem('appData', JSON.stringify(appData));
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN');
  };

  return (
    <div className="forum-screen">
      <div className="screen-header">
        <button onClick={onGoBack} className="back-btn">←</button>
        <h2>论坛</h2>
        <div></div>
      </div>

      <div className="forum-content">
        <div className="post-editor">
          <input
            type="text"
            placeholder="标题"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            maxLength={50}
          />
          <textarea
            placeholder="内容"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            maxLength={300}
          />
          <button onClick={addPost} className="post-btn">发布</button>
        </div>

        <div className="posts-list">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <div className="post-meta">
                <span>作者: {post.author}</span>
                <span>时间: {formatTime(post.timestamp)}</span>
                <span>回复: {post.replies}</span>
              </div>
              <button onClick={() => alert('评论功能开发中')}>💬 评论</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForumScreen;
