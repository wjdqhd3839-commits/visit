import React, { useState } from 'react';
import { Heart, Trash2, Copy, Check, MessageCircle } from 'lucide-react';
import { GuestbookMessage } from '../types/guestbook';
import { formatTimeAgo } from '../utils/timeAgo';

interface MessageItemKakaoProps {
  message: GuestbookMessage;
  onLike: (id: string) => void;
  onRequestDelete: (message: GuestbookMessage) => void;
}

export const MessageItemKakao: React.FC<MessageItemKakaoProps> = ({
  message,
  onLike,
  onRequestDelete,
}) => {
  const [copied, setCopied] = useState(false);
  const [heartBurst, setHeartBurst] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${message.nickname}: ${message.content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    setHeartBurst(true);
    onLike(message.id);
    setTimeout(() => setHeartBurst(false), 700);
  };

  const timeAgoText = formatTimeAgo(message.createdAt);

  return (
    <div className="flex items-start gap-2.5 sm:gap-3 group animate-fadeIn">
      
      {/* Avatar Emoji */}
      <div 
        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-lg sm:text-xl shrink-0 shadow-xs border ${
          message.avatarColor || 'bg-amber-100 text-amber-900 border-amber-200'
        }`}
      >
        {message.avatarEmoji || '😊'}
      </div>

      {/* Bubble Content */}
      <div className="flex-1 max-w-[85%] sm:max-w-[78%]">
        
        {/* Nickname & Meta */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
            {message.nickname}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            {timeAgoText}
          </span>
        </div>

        {/* Kakao Style Bubble */}
        <div className="relative inline-block bg-[#FEE500] text-slate-900 px-4 py-2.5 rounded-2xl rounded-tl-xs shadow-xs text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap font-medium">
          {message.content}
        </div>

        {/* Reactions & Actions Row */}
        <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
          
          {/* Like Heart Button */}
          <button
            onClick={handleLike}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
              (message.likes || 0) > 0
                ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-rose-500'
            } ${heartBurst ? 'scale-125 transition-transform' : ''}`}
            title="공감하기 (실시간 반영)"
          >
            <Heart 
              className={`w-3.5 h-3.5 ${
                (message.likes || 0) > 0 ? 'fill-rose-500 text-rose-500' : ''
              }`} 
            />
            <span>{message.likes || 0}</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            title="텍스트 복사"
            className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors opacity-80 group-hover:opacity-100 cursor-pointer"
          >
            {copied ? (
              <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                <Check className="w-3 h-3" /> 복사됨
              </span>
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onRequestDelete(message)}
            title="메시지 삭제"
            className="p-1 text-slate-400 hover:text-red-600 rounded-md transition-colors opacity-60 group-hover:opacity-100 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

        </div>
      </div>

    </div>
  );
};
