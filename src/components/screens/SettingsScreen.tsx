import React, { useState, useEffect } from 'react';

interface SettingsScreenProps {
  onThemeChange: (theme: 'light' | 'dark' | 'neon') => void;
  currentTheme: 'light' | 'dark' | 'neon';
  onGoBack: () => void;
}

interface UserCharacter {
  name: string;
  avatar: string;
}

const AVATAR_OPTIONS = [
  '👩', '👨', '🧑', '👩‍🦰', '👨‍🦰', '🧔', '👩‍🦱', '👨‍🦱',
  '👩‍🦳', '👨‍🦳', '👩‍🦲', '👨‍🦲', '🧑‍🦱', '👱', '🧑‍🦳'
];

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onThemeChange, currentTheme, onGoBack }) => {
  const [showMemories, setShowMemories] = useState(false);
  const [memories, setMemories] = useState<any[]>([]);
  const [showCharacterEdit, setShowCharacterEdit] = useState(false);
  const [character, setCharacter] = useState<UserCharacter | null>(null);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('');

  useEffect(() => {
    const savedCharacter = localStorage.getItem('userCharacter');
    if (savedCharacter) {
      const parsed = JSON.parse(savedCharacter);
      setCharacter(parsed);
      setEditName(parsed.name);
      setEditAvatar(parsed.avatar);
    }
  }, []);

  const loadMemories = () => {
    const appData = JSON.parse(localStorage.getItem('appData') || '{}');
    setMemories(appData.memories || []);
    setShowMemories(true);
  };

  const exportData = () => {
    const appData = localStorage.getItem('appData');
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(appData || ''));
    element.setAttribute('download', 'app-backup.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    alert('数据已导出');
  };

  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        try {
          const data = JSON.parse(event.target.result);
          localStorage.setItem('appData', JSON.stringify(data));
          alert('数据已导入，请刷新页面');
          window.location.reload();
        } catch (error) {
          alert('导入失败，文件格式错误');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const saveCharacterEdits = () => {
    if (!editName.trim()) {
      alert('角色名称不能为空');
      return;
    }
    const updated = { name: editName.trim(), avatar: editAvatar };
    localStorage.setItem('userCharacter', JSON.stringify(updated));
    setCharacter(updated);
    setShowCharacterEdit(false);
    alert('角色信息已更新');
  };

  const resetCharacter = () => {
    if (confirm('确定要重新创建角色吗？')) {
      localStorage.removeItem('userCharacter');
      alert('请刷新页面重新创建角色');
      window.location.reload();
    }
  };

  const clearData = () => {
    if (confirm('确定要清空所有数据吗？此操作无法撤销！')) {
      localStorage.removeItem('appData');
      localStorage.removeItem('theme');
      alert('数据已清空，请刷新页面');
      window.location.reload();
    }
  };

  const deleteOldMemories = () => {
    const appData = JSON.parse(localStorage.getItem('appData') || '{}');
    appData.memories = [];
    localStorage.setItem('appData', JSON.stringify(appData));
    setMemories([]);
    alert('过时记忆已清理');
  };

  return (
    <div className="settings-screen">
      <div className="screen-header">
        <button onClick={onGoBack} className="back-btn">←</button>
        <h2>设置</h2>
        <div></div>
      </div>

      <div className="settings-content">
        {/* Character Info Section */}
        <div className="settings-section">
          <h3>👤 我的角色</h3>
          {character && !showCharacterEdit && (
            <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '8px', marginBottom: '10px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>{character.avatar}</div>
                <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{character.name}</p>
                <button
                  onClick={() => setShowCharacterEdit(true)}
                  className="setting-btn"
                  style={{ marginTop: '10px', marginRight: '10px' }}
                >
                  ✏️ 编辑
                </button>
                <button
                  onClick={resetCharacter}
                  className="setting-btn danger"
                  style={{ marginTop: '10px' }}
                >
                  🔄 重新创建
                </button>
              </div>
            </div>
          )}
          {showCharacterEdit && (
            <div style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px', marginBottom: '10px' }}>
              <p style={{ fontSize: '12px', marginBottom: '10px' }}>选择头像：</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '5px', marginBottom: '15px' }}>
                {AVATAR_OPTIONS.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => setEditAvatar(avatar)}
                    style={{
                      fontSize: '32px',
                      padding: '8px',
                      border: editAvatar === avatar ? '2px solid #3b82f6' : '1px solid #ccc',
                      borderRadius: '6px',
                      backgroundColor: editAvatar === avatar ? '#dbeafe' : '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="输入角色名称"
                maxLength={20}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={saveCharacterEdits}
                  className="setting-btn"
                  style={{ flex: 1, backgroundColor: '#3b82f6', color: 'white' }}
                >
                  💾 保存
                </button>
                <button
                  onClick={() => setShowCharacterEdit(false)}
                  className="setting-btn"
                  style={{ flex: 1 }}
                >
                  取消
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="settings-section">
          <h3>🎨 主题</h3>
          <div className="theme-options">
            <button
              onClick={() => onThemeChange('light')}
              className={`theme-btn ${currentTheme === 'light' ? 'active' : ''}`}
            >
              ☀️ 浅色
            </button>
            <button
              onClick={() => onThemeChange('dark')}
              className={`theme-btn ${currentTheme === 'dark' ? 'active' : ''}`}
            >
              🌙 深色
            </button>
            <button
              onClick={() => onThemeChange('neon')}
              className={`theme-btn ${currentTheme === 'neon' ? 'active' : ''}`}
            >
              ✨ 霓虹
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h3>💾 数据管理</h3>
          <div className="settings-buttons">
            <button onClick={exportData} className="setting-btn">
              📤 导出备份
            </button>
            <button onClick={importData} className="setting-btn">
              📥 导入备份
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h3>🧠 记忆管理</h3>
          <div className="settings-buttons">
            <button onClick={loadMemories} className="setting-btn">
              📖 查看记忆
            </button>
            <button onClick={deleteOldMemories} className="setting-btn danger">
              🗑️ 清理记忆
            </button>
          </div>
        </div>

        {showMemories && (
          <div className="memories-list">
            <h4>📚 长期记忆</h4>
            {memories.length === 0 ? (
              <p>暂无记忆</p>
            ) : (
              memories.map((memory: any) => (
                <div key={memory.id} className="memory-card">
                  <strong>{memory.date}</strong>
                  <p>{memory.summary}</p>
                </div>
              ))
            )}
          </div>
        )}

        <div className="settings-section danger-zone">
          <h3>⚠️ 危险操作</h3>
          <button onClick={clearData} className="setting-btn danger">
            🧹 清空所有数据
          </button>
          <small>此操作将删除所有聊天记录、朋友圈、订单等数据，请谨慎操作！</small>
        </div>

        <div className="app-info">
          <h4>📱 关于小手机</h4>
          <p>版本: 1.0.0</p>
          <p>AI 启动器模拟应用</p>
          <p>© 2024 All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;