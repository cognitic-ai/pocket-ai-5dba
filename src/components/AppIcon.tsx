import React from 'react';

interface AppIconProps {
  icon: string;
  name: string;
  onClick: () => void;
}

const AppIcon: React.FC<AppIconProps> = ({ icon, name, onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top = (e.clientY - rect.top) + 'px';
    (e.currentTarget as HTMLElement).appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
    onClick();
  };

  return (
    <div className="app-icon" onClick={handleClick}>
      <div className="app-icon-bg">
        <span className="app-icon-emoji">{icon}</span>
      </div>
      <span className="app-icon-label">{name}</span>
    </div>
  );
};

export default AppIcon;
