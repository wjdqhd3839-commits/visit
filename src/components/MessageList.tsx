import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  MessageSquareOff, 
  Sparkles,
  Flame,
  Clock
} from 'lucide-react';
import { GuestbookMessage, ViewMode } from '../types/guestbook';
import { MessageItemKakao } from './MessageItemKakao';
import { MessageItemCard } from './MessageItemCard';

interface MessageListProps {
  messages: GuestbookMessage[];
  viewMode: ViewMode;
  onLike: (id: string) => void;
  onRequestDelete: (message: GuestbookMessage) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  viewMode,
  onLike,
  onRequestDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'likes'>('latest');

  // 검색 및 정렬 필터링
  const filteredMessages = useMemo(() => {
    let result = [...messages];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.nickname.toLowerCase().includes(q) ||
          m.content.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'likes') {
      result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }
    // 'latest'의 경우 Firebase query에서 이미 createdAt desc로 정렬되어 수신됨

    return result;
  }, [messages, searchQuery, sortBy]);

  return (
    <div className="space-y-4">
      {/* Controls Bar: Search & Sort Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="닉네임 또는 메시지 내용 검색..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              지우기
            </button>
          )}
        </div>

        {/* Sort Switcher */}
        <div className="flex items-center gap-1 self-end sm:self-auto bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setSortBy('latest')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              sortBy === 'latest'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>최신순</span>
          </button>
          <button
            onClick={() => setSortBy('likes')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              sortBy === 'likes'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>인기순</span>
          </button>
        </div>

      </div>

      {/* Messages Feed */}
      {filteredMessages.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-amber-50 text-amber-500 flex items-center justify-center text-3xl">
            {searchQuery ? <MessageSquareOff className="w-8 h-8 text-slate-400" /> : '💌'}
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            {searchQuery ? '일치하는 메시지가 없습니다' : '아직 작성된 방명록이 없습니다'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            {searchQuery
              ? '다른 검색어로 다시 시도해보세요.'
              : '첫 번째로 따뜻한 방명록을 남겨보세요! 다른 사람에게 실시간으로 전달됩니다.'}
          </p>
        </div>
      ) : viewMode === 'kakao' ? (
        /* KakaoTalk Chat Room Bubble Feed */
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-4 sm:p-6 space-y-5">
          {filteredMessages.map((message) => (
            <MessageItemKakao
              key={message.id}
              message={message}
              onLike={onLike}
              onRequestDelete={onRequestDelete}
            />
          ))}
        </div>
      ) : (
        /* Emotional Postcard Grid Feed */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredMessages.map((message) => (
            <MessageItemCard
              key={message.id}
              message={message}
              onLike={onLike}
              onRequestDelete={onRequestDelete}
            />
          ))}
        </div>
      )}

    </div>
  );
};
