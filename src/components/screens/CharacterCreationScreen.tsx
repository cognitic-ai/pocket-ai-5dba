import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface CharacterCreationScreenProps {
  onComplete: (character: { name: string; avatar: string }) => void;
}

const AVATAR_OPTIONS = [
  '👩', '👨', '🧑', '👩‍🦰', '👨‍🦰', '🧔', '👩‍🦱', '👨‍🦱',
  '👩‍🦳', '👨‍🦳', '👩‍🦲', '👨‍🦲', '🧑‍🦱', '👱', '🧑‍🦳'
];

const CharacterCreationScreen: React.FC<CharacterCreationScreenProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [error, setError] = useState('');

  const handleCreate = () => {
    if (!name.trim()) {
      setError('请输入角色名称');
      return;
    }
    if (name.trim().length > 20) {
      setError('角色名称不能超过20个字符');
      return;
    }
    onComplete({ name: name.trim(), avatar: selectedAvatar });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">创建你的角色</h1>
        <p className="text-slate-600 dark:text-slate-400">让我们开始你的手机模拟器之旅</p>
      </div>

      <Card className="w-full max-w-sm p-6 bg-white dark:bg-slate-800">
        {/* Avatar Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3 text-slate-900 dark:text-white">选择头像</label>
          <div className="grid grid-cols-5 gap-2">
            {AVATAR_OPTIONS.map((avatar) => (
              <button
                key={avatar}
                onClick={() => setSelectedAvatar(avatar)}
                className={`text-4xl p-2 rounded-lg transition-all ${
                  selectedAvatar === avatar
                    ? 'bg-blue-500 scale-110'
                    : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {avatar}
              </button>
            ))}
          </div>
        </div>

        {/* Name Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">角色名称</label>
          <Input
            type="text"
            placeholder="输入你的角色名称"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            maxLength={20}
            className="text-center"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{name.length}/20</p>
        </div>

        {/* Preview */}
        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg text-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">预览</p>
          <div className="text-5xl mb-2">{selectedAvatar}</div>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">{name || '输入名称'}</p>
        </div>

        {/* Create Button */}
        <Button
          onClick={handleCreate}
          disabled={!name.trim()}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg"
        >
          开始使用
        </Button>
      </Card>

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-6 text-center">
        你可以在设置中修改角色信息
      </p>
    </div>
  );
};

export default CharacterCreationScreen;
