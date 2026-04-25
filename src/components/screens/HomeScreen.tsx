import React, { useState } from 'react';
import AppIcon from '../AppIcon';

interface HomeScreenProps {
  onNavigate: (screen: any, contact?: any) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const apps = [
    { id: 'chat', name: '消息', icon: '💬', screen: 'chat' },
    { id: 'friends', name: '好友', icon: '👥', screen: 'friends' },
    { id: 'moments', name: '朋友圈', icon: '📸', screen: 'moments' },
    { id: 'forum', name: '论坛', icon: '💬', screen: 'forum' },
    { id: 'delivery', name: '外卖', icon: '🍔', screen: 'delivery' },
    { id: 'shopping', name: '购物', icon: '🛍️', screen: 'shopping' },
    { id: 'diary', name: '日记', icon: '📔', screen: 'diary' },
    { id: 'period', name: '经期', icon: '🩸', screen: 'period' },
    { id: 'check-phone', name: '查手机', icon: '🔍', screen: 'check-phone' },
    { id: 'settings', name: '设置', icon: '⚙️', screen: 'settings' },
  ];

  const handleAppClick = (app: any) => {
    if (app.screen === 'chat' || app.screen === 'friends') {
      const appData = JSON.parse(localStorage.getItem('appData') || '{}');
      const contact = appData.contacts?.[0];
      onNavigate(app.screen, contact);
    } else {
      onNavigate(app.screen);
    }
  };

  return (
    <div className="home-screen">
      <div className="wallpaper"></div>
      <div className="app-grid">
        {apps.map((app) => (
          <AppIcon
            key={app.id}
            name={app.name}
            icon={app.icon}
            onClick={() => handleAppClick(app)}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;
