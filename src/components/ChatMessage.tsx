import React from 'react';

interface MessageData {
  id: string;
  sender: string;
  content: string;
  type: 'text' | 'image' | 'voice' | 'file' | 'redpacket' | 'note';
  timestamp: number;
}

interface ChatMessageProps {
  message: MessageData;
  isUser: boolean;
  contactName: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser, contactName }) => {
  const formatTime = (timestamp: number) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - timestamp;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffMins < 1440) return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString('zh-CN');
  };

  const renderContent = () => {
    switch (message.type) {
      case 'voice':
        return <div className="voice-message">🎤 语音 00:05</div>;
      case 'file':
        return <div className="file-message">📄 文件.txt</div>;
      case 'image':
        return <div className="image-message">🖼️ 图片</div>;
      case 'redpacket':
        return (
          <div className="redpacket-message" onClick={() => alert('恭喜你！获得 ¥8.88')}>
            🧧 红包
          </div>
        );
      case 'note':
        return <div className="note-message">📝 小红书笔记</div>;
      default:
        return <div className="text-message">{message.content}</div>;
    }
  };

  return (
    <div className={`message-group ${isUser ? 'user' : 'other'}`}>
      {!isUser && <span className="avatar">{message.sender === 'user' ? '👤' : '👩'}</span>}
      <div className={`message-bubble ${message.type}`}>
        {renderContent()}
      </div>
      <span className="message-time">{formatTime(message.timestamp)}</span>
    </div>
  );
};

export default ChatMessage;
