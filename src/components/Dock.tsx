import React from 'react';

interface DockProps {
  onHomeClick: () => void;
  onBackClick: () => void;
  onSettingsClick: () => void;
}

const Dock: React.FC<DockProps> = ({ onHomeClick, onBackClick, onSettingsClick }) => {
  return (
    <div className="dock">
      <button className="dock-btn" onClick={onHomeClick} title="主页">
        🏠
      </button>
      <button className="dock-btn" onClick={onBackClick} title="返回">
        ◀️
      </button>
      <button className="dock-btn" onClick={() => alert('多任务未实现')} title="多任务">
        📋
      </button>
      <button className="dock-btn" onClick={onSettingsClick} title="设置">
        ⚙️
      </button>
    </div>
  );
};

export default Dock;
