import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from '../ChatMessage';
import ChatInput from '../ChatInput';

interface Contact {
  id: string;
  name: string;
  avatar: string;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  type: 'text' | 'image' | 'voice' | 'file' | 'redpacket' | 'note';
  timestamp: number;
  isTyping?: boolean;
}

interface ChatScreenProps {
  contact: Contact | null;
  onNavigate: (screen: any, contact?: any) => void;
  onGoBack: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ contact, onNavigate, onGoBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineMode, setOnlineMode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [deliveryTimer, setDeliveryTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!contact) return;
    const appData = JSON.parse(localStorage.getItem('appData') || '{}');
    setIsBlocked(appData.blockedContacts?.includes(contact.id) || false);
    const chatKey = `chat_${contact.id}`;
    const storedMessages = JSON.parse(localStorage.getItem(chatKey) || '[]');
    setMessages(storedMessages);
  }, [contact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!contact) {
    return (
      <div className="chat-screen">
        <div className="screen-header">
          <button onClick={onGoBack} className="back-btn">←</button>
          <h2>消息</h2>
          <div></div>
        </div>
        <div className="contacts-list">
          {JSON.parse(localStorage.getItem('appData') || '{}')?.contacts?.map((c: Contact) => (
            <div
              key={c.id}
              className="contact-item"
              onClick={() => onNavigate('chat', c)}
            >
              <span className="contact-avatar">{c.avatar}</span>
              <span className="contact-name">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const generateAIResponse = (userMessage: string) => {
    const responses = [
      '😂 你说得好对哦',
      '嗯嗯，同意你的看法',
      '稍等，我看一下',
      '你在干什么呢？',
      '今天天气真好',
      '我也是这么想的',
      '哈哈哈，笑死我了',
      '说得好，一起加油！',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = (content: string, type: 'text' | 'image' | 'voice' | 'file' | 'redpacket' = 'text') => {
    if (isBlocked) {
      alert('您已拉黑此用户，无法发送消息');
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content,
      type,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    // Save to localStorage
    const chatKey = `chat_${contact.id}`;
    localStorage.setItem(chatKey, JSON.stringify(updatedMessages));

    // Simulate AI response with typing
    if (contact.name === 'char' && onlineMode) {
      setIsTyping(true);
      const aiResponse = generateAIResponse(content);
      // Simulate typing delay based on message length
      const typingDelay = aiResponse.length * (Math.random() * 40 + 40);
      setTimeout(() => {
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: contact.id,
          content: aiResponse,
          type: 'text',
          timestamp: Date.now(),
        };
        const finalMessages = [...updatedMessages, responseMessage];
        setMessages(finalMessages);
        localStorage.setItem(chatKey, JSON.stringify(finalMessages));
        setIsTyping(false);

        // Auto-save memory
        updateMemory(content, aiResponse);
      }, typingDelay);
    }
  };

  const updateMemory = (userMsg: string, aiMsg: string) => {
    const appData = JSON.parse(localStorage.getItem('appData') || '{}');
    const memories = appData.memories || [];
    const messageCount = messages.length;
    if (messageCount > 0 && messageCount % 20 === 0) {
      const memory = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        summary: `与${contact.name}的对话记录（共${messageCount}条）`,
        type: 'chat'
      };
      memories.push(memory);
      appData.memories = memories;
      localStorage.setItem('appData', JSON.stringify(appData));
    }
  };

  const toggleBlock = () => {
    const appData = JSON.parse(localStorage.getItem('appData') || '{}');
    const blocked = !isBlocked;
    if (blocked) {
      appData.blockedContacts = [...(appData.blockedContacts || []), contact.id];
    } else {
      appData.blockedContacts = (appData.blockedContacts || []).filter((id: string) => id !== contact.id);
    }
    localStorage.setItem('appData', JSON.stringify(appData));
    setIsBlocked(blocked);
  };

  return (
    <div className="chat-screen">
      <div className="chat-header">
        <button onClick={onGoBack} className="back-btn">←</button>
        <div className="chat-info">
          <h2>{contact.name}</h2>
          <small>{isOnline && onlineMode ? '在线' : '离线'}</small>
        </div>
        <button onClick={toggleBlock} className="more-btn" title="拉黑">
          {isBlocked ? '已拉黑' : '⋯'}
        </button>
      </div>

      <div className="online-toggle">
        <label>
          线上模式:
          <input
            type="checkbox"
            checked={onlineMode}
            onChange={(e) => setOnlineMode(e.target.checked)}
          />
        </label>
      </div>

      <div className="messages-container">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} isUser={msg.sender === 'user'} contactName={contact.name} />
        ))}
        {isTyping && (
          <div className="message-group other">
            <div className="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSendMessage={handleSendMessage} isBlocked={isBlocked} />
    </div>
  );
};

export default ChatScreen;