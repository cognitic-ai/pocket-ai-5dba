import React, { useState, useEffect } from 'react';

interface Gift {
  id: string;
  name: string;
  price: number;
  icon: string;
  status: 'available' | 'sent' | 'received';
  sentTo?: string;
  timestamp?: number;
}

interface ShoppingScreenProps {
  onNavigate: (screen: any, contact?: any) => void;
  onGoBack: () => void;
}

const ShoppingScreen: React.FC<ShoppingScreenProps> = ({ onNavigate, onGoBack }) => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [balance, setBalance] = useState(1000);
  const [showGiftList, setShowGiftList] = useState(false);

  useEffect(() => {
    const appData = JSON.parse(localStorage.getItem('appData') || '{}');
    setBalance(appData.balance || 1000);
    setGifts(appData.shopping || []);
  }, []);

  const availableGifts = [
    { id: '1', name: '玫瑰花束', price: 99, icon: '🌹' },
    { id: '2', name: '巧克力', price: 88, icon: '🍫' },
    { id: '3', name: '项链', price: 199, icon: '💎' },
    { id: '4', name: '手表', price: 299, icon: '⌚' },
    { id: '5', name: '口红', price: 79, icon: '💄' },
    { id: '6', name: '香水', price: 189, icon: '💐' },
  ];

  const buyGift = (gift: any) => {
    if (balance >= gift.price) {
      const newGift: Gift = {
        id: Date.now().toString(),
        name: gift.name,
        price: gift.price,
        icon: gift.icon,
        status: 'available',
      };

      const updated = [...gifts, newGift];
      setGifts(updated);
      setBalance(balance - gift.price);

      const appData = JSON.parse(localStorage.getItem('appData') || '{}');
      appData.shopping = updated;
      appData.balance = balance - gift.price;
      localStorage.setItem('appData', JSON.stringify(appData));

      alert(`购买成功！余额: ¥${balance - gift.price}`);
    } else {
      alert('余额不足');
    }
  };

  const sendGift = (gift: Gift) => {
    const appData = JSON.parse(localStorage.getItem('appData') || '{}');
    const contact = appData.contacts?.[0];

    if (contact) {
      const updated = gifts.map(g =>
        g.id === gift.id ? { ...g, status: 'sent', sentTo: contact.name, timestamp: Date.now() } : g
      );
      setGifts(updated);

      appData.shopping = updated;
      localStorage.setItem('appData', JSON.stringify(appData));

      alert(`已发送给 ${contact.name}`);
    }
  };

  return (
    <div className="shopping-screen">
      <div className="screen-header">
        <button onClick={onGoBack} className="back-btn">←</button>
        <h2>购物</h2>
        <div className="balance">余额: ¥{balance}</div>
      </div>

      <div className="shopping-content">
        <div className="section">
          <h3>🛍️ 礼物城</h3>
          <div className="gift-grid">
            {availableGifts.map((gift) => (
              <div key={gift.id} className="gift-item">
                <div className="gift-icon">{gift.icon}</div>
                <div className="gift-name">{gift.name}</div>
                <div className="gift-price">¥{gift.price}</div>
                <button onClick={() => buyGift(gift)} className="buy-btn">购买</button>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h3>📦 我的礼物 ({gifts.length})</h3>
          <div className="gift-list">
            {gifts.map((gift) => (
              <div key={gift.id} className="gift-card">
                <span className="gift-icon">{gift.icon}</span>
                <div className="gift-info">
                  <strong>{gift.name}</strong>
                  <small>¥{gift.price}</small>
                </div>
                <div className="gift-status">
                  {gift.status === 'available' && (
                    <button onClick={() => sendGift(gift)} className="send-btn">发送</button>
                  )}
                  {gift.status === 'sent' && (
                    <span className="status-badge">已送给 {gift.sentTo}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingScreen;
