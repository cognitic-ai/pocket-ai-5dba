import React, { useState, useEffect } from 'react';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import MomentsScreen from './screens/MomentsScreen';
import ForumScreen from './screens/ForumScreen';
import ShoppingScreen from './screens/ShoppingScreen';
import DeliveryScreen from './screens/DeliveryScreen';
import DiaryScreen from './screens/DiaryScreen';
import PeriodScreen from './screens/PeriodScreen';
import CheckPhoneScreen from './screens/CheckPhoneScreen';
import SettingsScreen from './screens/SettingsScreen';

interface Contact {
  id: string;
  name: string;
  avatar: string;
}

const WebsiteLayout: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<string>('home');
  const [chatContact, setChatContact] = useState<Contact | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark' | 'neon'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'neon' || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'neon') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleNavigate = (screen: string, contact?: Contact) => {
    if (screen === 'chat' && contact) {
      setChatContact(contact);
    }
    setCurrentScreen(screen);
  };

  const handleGoBack = () => {
    if (currentScreen === 'chat') {
      setCurrentScreen('chat');
      setChatContact(null);
    } else {
      setCurrentScreen('home');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={handleNavigate} />;
      case 'chat':
        return <ChatScreen contact={chatContact} onNavigate={handleNavigate} onGoBack={handleGoBack} />;
      case 'moments':
        return <MomentsScreen onGoBack={handleGoBack} />;
      case 'forum':
        return <ForumScreen onGoBack={handleGoBack} />;
      case 'shopping':
        return <ShoppingScreen onGoBack={handleGoBack} />;
      case 'delivery':
        return <DeliveryScreen onGoBack={handleGoBack} />;
      case 'diary':
        return <DiaryScreen onGoBack={handleGoBack} />;
      case 'period':
        return <PeriodScreen onGoBack={handleGoBack} />;
      case 'checkphone':
        return <CheckPhoneScreen onGoBack={handleGoBack} />;
      case 'settings':
        return <SettingsScreen onThemeChange={handleThemeChange} currentTheme={theme} onGoBack={handleGoBack} />;
      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="website-container">
      {/* Header Navigation */}
      <header className="website-header">
        <div className="header-content">
          <div className="logo">
            <h1>📱 社交模拟器</h1>
          </div>
          <nav className="header-nav">
            <button 
              className={`nav-btn ${currentScreen === 'home' ? 'active' : ''}`}
              onClick={() => handleNavigate('home')}
            >
              🏠 首页
            </button>
            <button 
              className={`nav-btn ${currentScreen === 'chat' ? 'active' : ''}`}
              onClick={() => handleNavigate('chat')}
            >
              💬 消息
            </button>
            <button 
              className={`nav-btn ${currentScreen === 'moments' ? 'active' : ''}`}
              onClick={() => handleNavigate('moments')}
            >
              ✨ 朋友圈
            </button>
            <button 
              className={`nav-btn ${currentScreen === 'shopping' ? 'active' : ''}`}
              onClick={() => handleNavigate('shopping')}
            >
              🛍️ 购物
            </button>
          </nav>
          <div className="header-right">
            <select 
              value={theme}
              onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark' | 'neon')}
              className="theme-select"
            >
              <option value="light">☀️ 浅色</option>
              <option value="dark">🌙 深色</option>
              <option value="neon">✨ 霓虹</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="website-main">
        <div className="content-wrapper">
          {renderScreen()}
        </div>
      </main>

      {/* Footer */}
      <footer className="website-footer">
        <p>© 2024 社交模拟器 | 用 React + Vite 构建</p>
      </footer>
    </div>
  );
};

export default WebsiteLayout;
