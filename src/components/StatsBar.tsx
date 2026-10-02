import React from 'react';
import { MessageCircle, Heart, Zap, Sparkles } from 'lucide-react';
import { GuestbookMessage } from '../types/guestbook';

interface StatsBarProps {
  messages: GuestbookMessage[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ messages }) => {
  const totalMessages = messages.length;
  const totalLikes = messages.reduce((acc, curr) => acc + (curr.likes || 0), 0);

  // 오늘 작성된 글 계산
  const todayCount = messages.filter((m) => {
    if (!m.createdAt) return false;
    let msgDate: Date;
    if (m.createdAt instanceof Date) {
      msgDate = m.createdAt;
    } else if (typeof m.createdAt === 'object' && 'toDate' in (m.createdAt as any)) {
      msgDate = (m.createdAt as any).toDate();
    } else if (typeof m.createdAt === 'number') {
      msgDate = new Date(m.createdAt);
    } else {
      return false;
    }
    const today = new Date();
    return (
      msgDate.getDate() === today.getDate() &&
      msgDate.getMonth() === today.getMonth() &&
      msgDate.getFullYear() === today.getFullYear()
    );
  }).length;

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 border border-amber-200/70 rounded-2xl p-3.5 sm:p-4 mb-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Left: Quick Highlights */}
        <div className="flex items-center gap-3 divide-x divide-amber-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-700 flex items-center justify-center font-bold">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium">전체 방명록</p>
              <p className="text-sm font-extrabold text-slate-900">{totalMessages}개</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pl-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-400/20 text-emerald-700 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium">오늘 남긴 글</p>
              <p className="text-sm font-extrabold text-slate-900">{todayCount}개</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pl-3">
            <div className="w-8 h-8 rounded-xl bg-rose-400/20 text-rose-700 flex items-center justify-center font-bold">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium">누적 공감</p>
              <p className="text-sm font-extrabold text-slate-900">{totalLikes}회</p>
            </div>
          </div>
        </div>

        {/* Right: Live Sync Tip Banner */}
        <div className="flex items-center gap-1.5 text-xs text-amber-900 bg-amber-100/70 px-3 py-1.5 rounded-xl border border-amber-200">
          <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="font-medium">
            새로고침 없이 <strong>실시간</strong>으로 도착합니다. 다른 탭이나 모바일에서 테스트해보세요!
          </span>
        </div>

      </div>
    </div>
  );
};
