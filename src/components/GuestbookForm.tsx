import React, { useState } from 'react';
import { 
  Send, 
  Smile, 
  Dices, 
  Lock, 
  Check, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getRandomNickname, AVATAR_EMOJIS, AVATAR_COLORS } from '../utils/nicknames';

interface GuestbookFormProps {
  onSubmit: (data: {
    nickname: string;
    content: string;
    avatarEmoji: string;
    avatarColor: string;
    password?: string;
  }) => Promise<void>;
  disabled?: boolean;
}

const QUICK_TAGS = [
  '왔다 갑니다! 👣',
  '응원해요 화이팅! 🚀',
  '오늘도 좋은 하루 보내세요 🍀',
  '실시간 신기해요! ✨',
  '방명록 대박나세요! 🎉',
  '따뜻한 커피 한잔 ☕'
];

export const GuestbookForm: React.FC<GuestbookFormProps> = ({ onSubmit, disabled }) => {
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [avatarEmoji, setAvatarEmoji] = useState('😊');
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0].bg);
  const [password, setPassword] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 랜덤 닉네임 생성
  const handleRandomNickname = () => {
    const randomNick = getRandomNickname();
    setNickname(randomNick);
    const randomEmoji = AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)];
    setAvatarEmoji(randomEmoji);
    const randomCol = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)].bg;
    setAvatarColor(randomCol);
  };

  const handleQuickTagClick = (tag: string) => {
    setContent((prev) => (prev ? `${prev} ${tag}` : tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedNickname = nickname.trim();
    const trimmedContent = content.trim();

    if (!trimmedNickname) {
      setErrorMessage('닉네임을 입력해 주세요.');
      return;
    }
    if (!trimmedContent) {
      setErrorMessage('남기실 메시지를 작성해 주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        nickname: trimmedNickname,
        content: trimmedContent,
        avatarEmoji,
        avatarColor,
        password: password.trim() || undefined,
      });

      // 축하 폭죽 효과!
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899']
      });

      // 입력란 초기화 (닉네임과 아바타는 유지하여 연속 작성 편의 제공)
      setContent('');
      setPassword('');
      setShowPasswordInput(false);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || '메시지 전송 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-5 mb-8 transition-all">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Top: Nickname & Avatar Selection */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5 flex-1 min-w-[260px]">
            {/* Avatar Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                title="프로필 아이콘 변경"
                className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-xs border transition-transform active:scale-95 cursor-pointer ${avatarColor}`}
              >
                {avatarEmoji}
              </button>

              {/* Emoji Picker Dropdown */}
              {showEmojiPicker && (
                <div className="absolute top-13 left-0 z-50 bg-white p-3 rounded-2xl shadow-xl border border-slate-200 w-64">
                  <div className="text-[11px] font-bold text-slate-500 mb-2">이모지 & 컬러 선택</div>
                  <div className="grid grid-cols-7 gap-1.5 mb-3">
                    {AVATAR_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setAvatarEmoji(emoji);
                        }}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-base hover:bg-slate-100 transition-colors cursor-pointer ${
                          avatarEmoji === emoji ? 'bg-amber-100 ring-2 ring-amber-400' : ''
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 justify-between pt-2 border-t border-slate-100">
                    {AVATAR_COLORS.map((col, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatarColor(col.bg)}
                        className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${col.bg.split(' ')[0]} ${
                          avatarColor === col.bg ? 'scale-110 ring-2 ring-slate-800' : 'border-white'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Nickname Input & Random Nick Generator */}
            <div className="flex items-center gap-1.5 flex-1">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="작성자 닉네임 (예: 행복한 다람쥐)"
                maxLength={20}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={handleRandomNickname}
                title="랜덤 닉네임 생성"
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer shrink-0"
              >
                <Dices className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Optional Password Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPasswordInput(!showPasswordInput)}
              className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                showPasswordInput || password
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Lock className="w-3 h-3" />
              <span>{password ? '비밀번호 설정됨' : '삭제 비밀번호 (선택)'}</span>
            </button>
          </div>
        </div>

        {/* Password input row if enabled */}
        {showPasswordInput && (
          <div className="flex items-center gap-2 p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900">
            <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="나중에 직접 글을 삭제할 때 사용할 4자리 비밀번호 (예: 1234)"
              maxLength={8}
              className="flex-1 bg-white border border-amber-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        )}

        {/* Message Input Textarea */}
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="따뜻한 응원이나 인사를 남겨보세요. 새로고침 없이 모든 사람에게 실시간으로 전달됩니다!"
            rows={3}
            maxLength={300}
            required
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white resize-none transition-all leading-relaxed"
          />
          <div className="absolute right-3 bottom-3 text-[11px] text-slate-400 font-medium">
            {content.length}/300
          </div>
        </div>

        {/* Quick Tags Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[11px] text-slate-400 shrink-0 font-medium mr-1">간편 문구:</span>
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleQuickTagClick(tag)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 rounded-full shrink-0 border border-slate-200 hover:border-amber-300 transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-1">
          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            작성 즉시 Firestore 실시간 리스너로 전송됩니다
          </p>

          <button
            type="submit"
            disabled={isSubmitting || disabled || !content.trim() || !nickname.trim()}
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                <span>등록 중...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>메시지 남기기</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
