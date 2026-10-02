import React, { useState } from 'react';
import { Heart, Trash2, Copy, Check, Clock } from 'lucide-react';
import { GuestbookMessage } from '../types/guestbook';
import { formatTimeAgo } from '../utils/timeAgo';

interface MessageItemCardProps {
  message: GuestbookMessage;
  onLike: (id: string) => void;
  onRequestDelete: (message: GuestbookMessage) => void;
}

export const MessageItemCard: React.FC<MessageItemCardProps> = ({
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
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between p-4 group relative overflow-hidden">
      
      {/* Decorative Top Accent Stripe */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400" />

      {/* Top Header: Avatar & Nickname & Time */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div 
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 shadow-xs border ${
                message.avatarColor || 'bg-amber-100 text-amber-900 border-amber-200'
              }`}
            >
              {message.avatarEmoji || '😊'}
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                {message.nickname}
              </h4>
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <Clock className="w-2.5 h-2.5" />
                <span>{timeAgoText}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions (Copy & Delete) */}
          <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              title="복사"
              className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => onRequestDelete(message)}
              title="삭제"
              className="p-1 text-slate-400 hover:text-red-600 rounded-md cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Message Content */}
        <p className="text-sm text-slate-800 leading-relaxed break-words whitespace-pre-wrap font-normal mb-4">
          {message.content}
        </p>
      </div>

      {/* Bottom Footer: Like Counter */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
        <button
          onClick={handleLike}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
            (message.likes || 0) > 0
              ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-rose-500'
          } ${heartBurst ? 'scale-110 transition-transform' : ''}`}
        >
          <Heart 
            className={`w-3.5 h-3.5 ${
              (message.likes || 0) > 0 ? 'fill-rose-500 text-rose-500' : ''
            }`} 
          />
          <span>{message.likes || 0}</span>
        </button>
      </div>

    </div>
  );
};
