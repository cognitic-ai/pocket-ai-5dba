import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface CharacterCreationScreenProps {
  onComplete: (character: { name: string; avatar: string; bio: string; isCustomImage: boolean }) => void;
}

const AVATAR_OPTIONS = [
  '👩', '👨', '🧑', '👩‍🦰', '👨‍🦰', '🧔', '👩‍🦱', '👨‍🦱',
  '👩‍🦳', '👨‍🦳', '👩‍🦲', '👨‍🦲', '🧑‍🦱', '👱', '🧑‍🦳'
];

const CharacterCreationScreen: React.FC<CharacterCreationScreenProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [useCustomImage, setUseCustomImage] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('图片大小不能超过 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomImage(event.target?.result as string);
        setUseCustomImage(true);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = () => {
    if (!name.trim()) {
      setError('请输入角色名称');
      return;
    }
    if (name.trim().length > 20) {
      setError('角色名称不能超过20个字符');
      return;
    }

    const avatar = useCustomImage ? customImage! : selectedAvatar;
    onComplete({ 
      name: name.trim(), 
      avatar,
      bio: bio.trim(),
      isCustomImage: useCustomImage
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">创建你的角色</h1>
        <p className="text-slate-600 dark:text-slate-400">让我们开始你的手机模拟器之旅</p>
      </div>

      <Card className="w-full max-w-sm p-6 bg-white dark:bg-slate-800 overflow-y-auto max-h-[90vh]">
        {/* Avatar Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3 text-slate-900 dark:text-white">选择头像</label>

          {/* Emoji Avatars */}
          <div className="mb-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">表情符号头像</p>
            <div className="grid grid-cols-5 gap-2">
              {AVATAR_OPTIONS.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => {
                    setSelectedAvatar(avatar);
                    setUseCustomImage(false);
                  }}
                  className={`text-4xl p-2 rounded-lg transition-all ${
                    selectedAvatar === avatar && !useCustomImage
                      ? 'bg-blue-500 scale-110'
                      : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Image Upload */}
          <div className="border-t pt-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">或上传自定义头像</p>
            <label className="flex items-center justify-center w-full p-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition">
              <span className="text-center">
                <span className="text-2xl block mb-1">📸</span>
                <span className="text-sm text-slate-600 dark:text-slate-400">点击上传图片</span>
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            {customImage && (
              <div className="mt-3 text-center">
                <img
                  src={customImage}
                  alt="custom avatar"
                  className={`mx-auto rounded-lg border-2 ${
                    useCustomImage ? 'border-blue-500' : 'border-slate-300'
                  } w-24 h-24 object-cover`}
                />
                <button
                  onClick={() => setUseCustomImage(!useCustomImage)}
                  className="text-xs mt-2 text-blue-500"
                >
                  {useCustomImage ? '✓ 使用此头像' : '使用此头像'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Name Input */}
        <div className="mb-4">
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
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{name.length}/20</p>
        </div>

        {/* Bio Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">角色简介</label>
          <textarea
            placeholder="添加你的角色简介（可选）"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={10000}
            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm resize-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            rows={6}
          />
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{bio.length}/10000</p>
        </div>

        {/* Preview */}
        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg text-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">预览</p>
          <div className="text-5xl mb-2 h-16 flex items-center justify-center">
            {useCustomImage && customImage ? (
              <img src={customImage} alt="avatar" className="w-16 h-16 rounded-lg object-cover" />
            ) : (
              selectedAvatar
            )}
          </div>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">{name || '输入名称'}</p>
          {bio && <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{bio}</p>}
        </div>

        {/* Create Button */}
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
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