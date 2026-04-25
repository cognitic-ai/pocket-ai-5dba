import React, { useState, useEffect } from 'react';

interface Contact {
  id: string;
  name: string;
  avatar: string;
}

interface CheckPhoneScreenProps {
  contact: Contact | null;
  onGoBack: () => void;
}

const CheckPhoneScreen: React.FC<CheckPhoneScreenProps> = ({ contact, onGoBack }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [showReverseCheck, setShowReverseCheck] = useState(false);

  if (!contact) {
    return (
      <div className="check-phone-screen">
        <div className="screen-header">
          <button onClick={onGoBack} className="back-btn">←</button>
          <h2>查手机</h2>
          <div></div>
        </div>
        <div className="select-contact">
          <p>请先选择一个联系人</p>
        </div>
      </div>
    );
  }

  const analyzePhone = () => {
    setIsChecking(true);
    setTimeout(() => {
      const analyses = [
        `${contact.name}最近和朋友们聊天特别频繁呢，是不是在计划什么呀？`,
        `${contact.name}的搜索记录里全是美食攻略，看来是个吃货呢😋`,
        `${contact.name}最近在看很多工作相关的内容，看样子工作很积极呢！`,
        `${contact.name}的相册里全是自己的自拍，自恋程度满分⭐`,
        `${contact.name}最近买了好多东西，看来购物欲很强呢🛍️`,
      ];
      const randomAnalysis = analyses[Math.floor(Math.random() * analyses.length)];
      setAnalysis(randomAnalysis);
      setIsChecking(false);
    }, 2000);
  };

  const reverseCheck = () => {
    setShowReverseCheck(true);
    setTimeout(() => {
      const comments = [
        `${contact.name}正在偷看你的手机呢！你们之间没有秘密了😄`,
        `${contact.name}发现你最近跟好多人聊天，有点吃醋了呢`,
        `${contact.name}看到你买了很多东西，感觉你在挥霍呢`,
        `${contact.name}看你的浏览记录，发现了你的小秘密`,
        `${contact.name}看你的搜索记录，哈哈你原来是这样的人啊`,
      ];
      const randomComment = comments[Math.floor(Math.random() * comments.length)];
      alert(`反向查手机：${randomComment}`);
    }, 1500);
  };

  return (
    <div className="check-phone-screen">
      <div className="screen-header">
        <button onClick={onGoBack} className="back-btn">←</button>
        <h2>查手机</h2>
        <div></div>
      </div>

      <div className="check-phone-content">
        <div className="contact-info">
          <span className="avatar">{contact.avatar}</span>
          <h3>{contact.name}</h3>
          <small>正在使用手机...</small>
        </div>

        <div className="phone-preview">
          <div className="fake-screen">
            <div className="status-bar-fake">
              <span>09:30</span>
            </div>
            <div className="home-screen-fake">
              <div className="app-icon-fake">💬</div>
              <div className="app-icon-fake">📸</div>
              <div className="app-icon-fake">🎵</div>
              <div className="app-icon-fake">📱</div>
              <div className="app-icon-fake">🎮</div>
              <div className="app-icon-fake">📚</div>
            </div>
          </div>
        </div>

        <div className="check-actions">
          <button
            onClick={analyzePhone}
            disabled={isChecking}
            className="check-btn"
          >
            {isChecking ? '🔍 分析中...' : '🔍 查看分析'}
          </button>
          <button onClick={reverseCheck} className="reverse-btn">
            🔄 反向查手机
          </button>
        </div>

        {analysis && (
          <div className="analysis-result">
            <h4>📱 分析结果</h4>
            <p>{analysis}</p>
          </div>
        )}

        {showReverseCheck && (
          <div className="warning-message">
            ⚠️ 小心！{contact.name}正在查看你的手机！
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckPhoneScreen;
