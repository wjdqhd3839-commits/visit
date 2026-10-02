/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  subscribeToMessages, 
  addGuestbookMessage, 
  likeGuestbookMessage, 
  deleteGuestbookMessage,
  COLLECTION_NAME
} from './firebase';
import { GuestbookMessage, ViewMode, FirebaseConnectionStatus } from './types/guestbook';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { GuestbookForm } from './components/GuestbookForm';
import { MessageList } from './components/MessageList';
import { DeleteModal } from './components/DeleteModal';
import { FirebaseGuideModal } from './components/FirebaseGuideModal';
import { chime } from './utils/audioChime';
import { AlertCircle, HelpCircle, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('kakao');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [deletingMessage, setDeletingMessage] = useState<GuestbookMessage | null>(null);
  
  const [connectionStatus, setConnectionStatus] = useState<FirebaseConnectionStatus>({
    state: 'connecting',
    messageCount: 0,
  });

  const isFirstLoad = useRef(true);
  const previousCount = useRef(0);

  // 실시간 Firestore onSnapshot 리스너 등록
  useEffect(() => {
    setConnectionStatus({ state: 'connecting', messageCount: 0 });

    const unsubscribe = subscribeToMessages(
      (newMessages) => {
        setMessages(newMessages);
        setConnectionStatus({
          state: 'connected',
          lastSyncTime: new Date(),
          messageCount: newMessages.length,
        });

        // 첫 로드가 아니고, 새 메시지가 도착했을 때 경쾌한 '띵동' 소리 재생
        if (!isFirstLoad.current && newMessages.length > previousCount.current && soundEnabled) {
          chime.playDing();
        }

        isFirstLoad.current = false;
        previousCount.current = newMessages.length;
      },
      (error: any) => {
        console.warn("Firestore 실시간 리스너 오류:", error);
        const errMsg = error?.message || '';
        if (errMsg.includes('permission-denied') || errMsg.includes('Missing or insufficient permissions')) {
          setConnectionStatus({
            state: 'permission_denied',
            errorMessage: 'Firestore 보안 규칙에서 읽기/쓰기가 차단되었습니다.',
            messageCount: 0,
          });
        } else {
          setConnectionStatus({
            state: 'error',
            errorMessage: errMsg || 'Firestore 연결을 확인하는 중입니다.',
            messageCount: 0,
          });
        }
      }
    );

    // 컴포넌트 언마운트 시 실시간 리스너 해제 (메모리 누수 방지)
    return () => {
      unsubscribe();
    };
  }, [soundEnabled]);

  // 알림음 온/오프 토글
  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    chime.enabled = nextState;
    if (nextState) {
      chime.playDing(); // 소리 켰을 때 피드백 재생
    }
  };

  // 새 방명록 작성 제출
  const handleAddMessage = async (data: {
    nickname: string;
    content: string;
    avatarEmoji: string;
    avatarColor: string;
    password?: string;
  }) => {
    await addGuestbookMessage(data);
  };

  // 공감(좋아요) 클릭
  const handleLike = async (id: string) => {
    try {
      await likeGuestbookMessage(id);
    } catch (err) {
      console.error("좋아요 업데이트 실패:", err);
    }
  };

  // 삭제 확정 처리
  const handleConfirmDelete = async (messageId: string) => {
    await deleteGuestbookMessage(messageId);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Pretendard',sans-serif]">
      
      {/* Top Navigation Header */}
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenGuide={() => setIsGuideOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        status={connectionStatus}
        activeCount={messages.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 sm:py-8">
        
        {/* Permission Denied / Setup Alert Banner (if needed) */}
        {connectionStatus.state === 'permission_denied' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-red-900 text-sm">
                  Firestore 보안 규칙(Security Rules) 설정이 필요합니다
                </h4>
                <p className="text-xs text-red-700 mt-0.5">
                  Firebase 콘솔의 Firestore [규칙] 탭에서 테스트 모드 허용 코드를 복사하여 붙여넣으세요.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsGuideOpen(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 cursor-pointer"
            >
              해결 방법 보기
            </button>
          </div>
        )}

        {/* Real-time Hero Greeting */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>F5 새로고침 없이 0.1초 만에 실시간 반영</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            따뜻한 말 한마디 남겨주세요 ✨
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Firebase Firestore의 <code className="bg-slate-200/80 px-1.5 py-0.5 rounded text-slate-800 font-mono text-xs">onSnapshot</code> 기술로 작성하는 즉시 모두에게 공유됩니다.
          </p>
        </div>

        {/* Real-time Summary Stats Bar */}
        <StatsBar messages={messages} />

        {/* Message Creation Form */}
        <GuestbookForm 
          onSubmit={handleAddMessage} 
          disabled={connectionStatus.state === 'permission_denied'} 
        />

        {/* Guestbook Messages Feed Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-extrabold text-slate-800 text-base sm:text-lg flex items-center gap-2">
            <span>방명록 피드</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
              {messages.length}
            </span>
          </h3>
          <span className="text-xs text-slate-400">
            {viewMode === 'kakao' ? '📱 카카오톡 말풍선 스타일' : '💌 감성 엽서 카드 스타일'}
          </span>
        </div>

        {/* Real-time Message List */}
        <MessageList
          messages={messages}
          viewMode={viewMode}
          onLike={handleLike}
          onRequestDelete={(msg) => setDeletingMessage(msg)}
        />

      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-400">
        <div className="max-w-3xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Powered by <strong>Firebase Firestore v9</strong> (Collection: <code className="font-mono text-slate-600">{COLLECTION_NAME}</code>)
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-amber-600 hover:text-amber-700 font-semibold cursor-pointer underline"
            >
              파이어베이스 설정 가이드
            </button>
            <span>•</span>
            <span>프로젝트 ID: visit-20574</span>
          </div>
        </div>
      </footer>

      {/* Message Deletion Modal */}
      <DeleteModal
        isOpen={Boolean(deletingMessage)}
        message={deletingMessage}
        onClose={() => setDeletingMessage(null)}
        onConfirmDelete={handleConfirmDelete}
      />

      {/* Firebase Setup Guide Modal */}
      <FirebaseGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

    </div>
  );
}
