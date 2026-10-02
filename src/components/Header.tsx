import React from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  MessageSquare, 
  LayoutGrid, 
  Volume2, 
  VolumeX, 
  Activity,
  Flame
} from 'lucide-react';
import { ViewMode, FirebaseConnectionStatus } from '../types/guestbook';

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenGuide: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  status: FirebaseConnectionStatus;
  activeCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onViewModeChange,
  onOpenGuide,
  soundEnabled,
  onToggleSound,
  status,
  activeCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-amber-300 flex items-center justify-center shadow-md shadow-amber-500/20 text-white font-extrabold text-xl transform hover:scale-105 transition-transform cursor-pointer">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight flex items-center gap-1.5">
                실시간 방명록
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-0.5">
                  <Flame className="w-3 h-3 text-amber-600 fill-amber-500" />
                  Live
                </span>
              </h1>
            </div>
            
            {/* Live Connection Status */}
            <div className="flex items-center gap-2 text-xs">
              {status.state === 'connected' && (
                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  실시간 리스너 작동 중 (onSnapshot)
                </span>
              )}
              {status.state === 'connecting' && (
                <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                  <Activity className="w-3 h-3 animate-spin text-amber-500" />
                  Firebase 연결 중...
                </span>
              )}
              {status.state === 'permission_denied' && (
                <button 
                  onClick={onOpenGuide}
                  className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-semibold underline decoration-dotted cursor-pointer"
                >
                  <span className="h-2 w-2 rounded-full bg-red-500"></span>
                  Firestore 규칙 확인 필요 (가이드 보기)
                </button>
              )}
              {status.state === 'error' && (
                <span className="inline-flex items-center gap-1 text-red-500 font-medium">
                  <span className="h-2 w-2 rounded-full bg-red-500"></span>
                  연결 확인 중
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Sound Notification Chime */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? "새 메시지 알림음 켜짐 (클릭시 끔)" : "알림음 꺼짐 (클릭시 켬)"}
            className={`p-2 rounded-xl text-xs font-medium border transition-colors flex items-center justify-center cursor-pointer ${
              soundEnabled
                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100 hover:text-slate-600'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* View Mode Toggle (KakaoTalk vs Card) */}
          <div className="bg-slate-100 p-0.5 rounded-xl border border-slate-200/80 flex items-center">
            <button
              onClick={() => onViewModeChange('kakao')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'kakao'
                  ? 'bg-amber-400 text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="카카오톡 말풍선 뷰"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">톡 피드</span>
            </button>
            <button
              onClick={() => onViewModeChange('card')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'card'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="감성 엽서 카드 뷰"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">카드 피드</span>
            </button>
          </div>

          {/* Firebase Guide Button */}
          <button
            onClick={onOpenGuide}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">파이어베이스 설정 안내</span>
            <span className="sm:hidden">안내</span>
          </button>
        </div>

      </div>
    </header>
  );
};
