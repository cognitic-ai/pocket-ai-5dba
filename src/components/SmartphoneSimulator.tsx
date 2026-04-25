import React, { useState, useEffect } from 'react';
import StatusBar from './StatusBar';
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
import CharacterCreationScreen from './screens/CharacterCreationScreen';
import Dock from './Dock';
import '../styles/smartphone.css';

type ScreenType = 'home' | 'chat' | 'moments' | 'forum' | 'shopping' | 'delivery' | 'diary' | 'period' | 'check-phone' | 'settings' | 'friends';

interface Contact {
  id: string;
  name: string;
  avatar: string;
}

interface UserCharacter {
  name: string;
  avatar: string;
}

const SmartphoneSimulator: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [screenHistory, setScreenHistory] = useState<ScreenType[]>(['home']);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark' | 'neon'>('light');
  const [character, setCharacter] = useState<UserCharacter | null>(null);
  const [isFirstTime, setIsFirstTime] = useState(true);

  // Initialize localStorage data
  useEffect(() => {
    // Check if user has created a character
    const savedCharacter = localStorage.getItem('userCharacter');
    if (savedCharacter) {
      setCharacter(JSON.parse(savedCharacter));
      setIsFirstTime(false);
    }

    if (!localStorage.getItem('appData')) {
      const initialData = {
        contacts: [
          { id: '1', name: '小红', avatar: '👩' },
          { id: '2', name: '小美', avatar: '🧑‍🦰' },
          { id: '3', name: '小龙', avatar: '🧔' },
        ],
        chatHistory: {},
        moments: [],
        forums: [],
        shopping: [],
        balance: 1000,
        diary: {},
        period: null,
        memories: [],
        blockedContacts: [],
      };
      localStorage.setItem('appData', JSON.stringify(initialData));
    }

    // Apply saved theme
    const savedTheme = localStorage.getItem('theme') as any || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const navigateTo = (screen: ScreenType, contact?: Contact) => {
    setCurrentScreen(screen);
    setScreenHistory([...screenHistory, screen]);
    if (contact) setSelectedContact(contact);
  };

  const goBack = () => {
    if (screenHistory.length > 1) {
      const newHistory = [...screenHistory];
      newHistory.pop();
      setScreenHistory(newHistory);
      setCurrentScreen(newHistory[newHistory.length - 1]);
    }
  };

  const goHome = () => {
    setCurrentScreen('home');
    setScreenHistory(['home']);
  };

  const changeTheme = (newTheme: 'light' | 'dark' | 'neon') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleCharacterCreation = (newCharacter: UserCharacter) => {
    setCharacter(newCharacter);
    setIsFirstTime(false);
    localStorage.setItem('userCharacter', JSON.stringify(newCharacter));
  };

  // Show character creation screen on first time
  if (isFirstTime && !character) {
    return (
      <div className="smartphone-simulator">
        <div className="phone-body">
          <div className="phone-screen">
            <CharacterCreationScreen onComplete={handleCharacterCreation} />
          </div>
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={navigateTo} />;
      case 'chat':
        return <ChatScreen contact={selectedContact} onNavigate={navigateTo} onGoBack={goBack} />;
      case 'moments':
        return <MomentsScreen onGoBack={goBack} />;
      case 'forum':
        return <ForumScreen onGoBack={goBack} />;
      case 'shopping':
        return <ShoppingScreen onNavigate={navigateTo} onGoBack={goBack} />;
      case 'delivery':
        return <DeliveryScreen onNavigate={navigateTo} onGoBack={goBack} />;
      case 'diary':
        return <DiaryScreen onGoBack={goBack} />;
      case 'period':
        return <PeriodScreen onGoBack={goBack} />;
      case 'check-phone':
        return <CheckPhoneScreen contact={selectedContact} onGoBack={goBack} />;
      case 'settings':
        return <SettingsScreen onThemeChange={changeTheme} currentTheme={theme} onGoBack={goBack} />;
      case 'friends':
        return <ChatScreen contact={selectedContact} onNavigate={navigateTo} onGoBack={goBack} />;
      default:
        return <HomeScreen onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="smartphone-simulator">
      <div className="phone-body">
        <div className="phone-screen">
          <StatusBar />
          <div className="screen-content">
            {renderScreen()}
          </div>
          <Dock onHomeClick={goHome} onBackClick={goBack} onSettingsClick={() => navigateTo('settings')} />
        </div>
      </div>
    </div>
  );
};

export default SmartphoneSimulator;