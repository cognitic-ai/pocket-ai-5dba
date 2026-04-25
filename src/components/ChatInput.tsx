import React, { useState, useRef } from 'react';

interface ChatInputProps {
  onSendMessage: (content: string, type: 'text' | 'image' | 'voice' | 'file' | 'redpacket') => void;
  isBlocked: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isBlocked }) => {
  const [message, setMessage] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim() && !isBlocked) {
      onSendMessage(message, 'text');
      setMessage('');
    }
  };

  const handleQuickAction = (type: 'voice' | 'file' | 'redpacket' | 'note') => {
    if (isBlocked) {
      alert('您已拉黑此用户');
      return;
    }
    
    switch (type) {
      case 'voice':
        onSendMessage('语音消息', 'voice');
        break;
      case 'file':
        onSendMessage('document.txt', 'file');
        break;
      case 'redpacket':
        onSendMessage('恭喜发财，¥8.88', 'redpacket');
        break;
      case 'note':
        onSendMessage('这是一个笔记', 'note');
        break;
    }
    setShowOptions(false);
  };

  return (
    <div className="chat-input-area">
      <div className="input-actions">
        <button 
          className="action-btn"
          onClick={() => setShowOptions(!showOptions)}
          title="更多选项"
        >
          ➕
        </button>
        {showOptions && (
          <div className="action-menu">
            <button onClick={() => handleQuickAction('voice')} title="语音">🎤</button>
            <button onClick={() => handleQuickAction('file')} title="文件">📄</button>
            <button onClick={() => handleQuickAction('redpacket')} title="红包">🧧</button>
            <button onClick={() => handleQuickAction('note')} title="笔记">📝</button>
          </div>
        )}
      </div>

      <input
        type="text"
        className="message-input"
        placeholder={isBlocked ? '您已被拉黑...' : '输入消息...'}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        disabled={isBlocked}
      />

      <button
        className="send-btn"
        onClick={handleSend}
        disabled={isBlocked || !message.trim()}
        title="发送"
      >
        ✈️
      </button>
    </div>
  );
};

export default ChatInput;
