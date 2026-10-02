import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  FileCode, 
  FolderTree, 
  Flame, 
  Terminal,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { DEFAULT_FIREBASE_CONFIG } from '../firebase';

interface FirebaseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseGuideModal: React.FC<FirebaseGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedRules, setCopiedRules] = useState(false);
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [activeTab, setActiveTab] = useState<'console' | 'rules' | 'code'>('console');

  if (!isOpen) return null;

  const sampleRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 실시간 방명록 컬렉션에 대한 읽기 및 쓰기 허용 (테스트 모드)
    match /guestbook_messages/{document=**} {
      allow read, write: if true;
    }
  }
}`;

  const configSnippet = `// 📁 src/firebase.ts 파일 상단에 위치합니다
export const DEFAULT_FIREBASE_CONFIG = ${JSON.stringify(DEFAULT_FIREBASE_CONFIG, null, 2)};`;

  const copyToClipboard = (text: string, type: 'rules' | 'config') => {
    navigator.clipboard.writeText(text);
    if (type === 'rules') {
      setCopiedRules(true);
      setTimeout(() => setCopiedRules(false), 2000);
    } else {
      setCopiedConfig(true);
      setTimeout(() => setCopiedConfig(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xl shadow-xs">
              🔥
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-1.5">
                Firebase Firestore 설정 완전 정복 가이드
              </h2>
              <p className="text-xs text-slate-500">
                무료 프로젝트 생성부터 실시간 리스너 연결까지 3단계로 끝내기
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/50 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-4 pt-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('console')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'console'
                ? 'border-amber-500 text-amber-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>1. 콘솔 프로젝트 & Firestore 생성</span>
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'rules'
                ? 'border-amber-500 text-amber-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>2. 테스트 모드 보안 규칙 설정</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'border-amber-500 text-amber-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>3. 코드 위치 및 아키텍처</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-sm text-slate-700 leading-relaxed">
          
          {activeTab === 'console' && (
            <div className="space-y-4">
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <div className="p-2 bg-amber-400 text-slate-900 rounded-xl shrink-0 font-bold text-xs">
                  현재 상태
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-900">
                    전달해주신 프로젝트 ID: <span className="text-amber-700 underline font-mono">visit-20574</span>
                  </p>
                  <p className="text-slate-600 mt-0.5">
                    현재 이 앱의 <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300">src/firebase.ts</code>에 이미 바로 연동되어 동작하고 있습니다!
                  </p>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Firebase 콘솔에서 무료 프로젝트 생성 순서
              </h3>

              <ol className="space-y-3 text-xs sm:text-sm list-decimal list-inside bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <li className="leading-relaxed">
                  <strong className="text-slate-900">Firebase 콘솔 접속:</strong>{' '}
                  <a
                    href="https://console.firebase.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-600 hover:underline inline-flex items-center gap-0.5 font-bold"
                  >
                    console.firebase.google.com <ExternalLink className="w-3 h-3" />
                  </a>에 구글 계정으로 로그인합니다.
                </li>
                <li className="leading-relaxed">
                  <strong className="text-slate-900">프로젝트 추가:</strong> [프로젝트 추가(Add project)] 버튼 클릭 후 프로젝트 이름(예: <code className="bg-white px-1 py-0.5 rounded">my-guestbook</code>)을 입력하고 생성합니다 (Google 애널리틱스는 비활성화해도 무방).
                </li>
                <li className="leading-relaxed">
                  <strong className="text-slate-900">Firestore Database 생성:</strong> 좌측 메뉴 [빌드] &gt; [Firestore Database]를 누르고 <strong>[데이터베이스 만들기]</strong>를 클릭합니다.
                </li>
                <li className="leading-relaxed">
                  <strong className="text-slate-900">위치(Region) 선택:</strong> 아시아 지역인 <code className="bg-white px-1 py-0.5 rounded font-mono text-amber-700">asia-northeast3 (서울)</code>을 추천합니다.
                </li>
                <li className="leading-relaxed">
                  <strong className="text-slate-900">웹 앱 등록 & 키 복사:</strong> 프로젝트 설정 &gt; 일반 탭 하단의 <strong>웹( &lt;/&gt; )</strong> 아이콘을 눌러 앱을 등록하면 나오는 <code className="bg-white px-1 py-0.5 rounded font-mono">firebaseConfig</code> 객체를 복사합니다.
                </li>
              </ol>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900">
                <p className="font-bold mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  테스트 모드(Test Mode)란?
                </p>
                <p className="leading-relaxed text-blue-800">
                  누구나 로그인 없이 방명록을 작성하고 실시간으로 읽을 수 있도록 Firestore 보안 규칙을 일시적으로 개방하는 모드입니다.
                  기본적으로 Firebase는 30일 후 자동 잠금되므로, 아래 규칙을 콘솔 [규칙] 탭에 붙여넣어 활성화해두면 안전하게 지속됩니다.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5 text-slate-500" />
                    Firestore 보안 규칙 (Rules) 복사하기:
                  </span>
                  <button
                    onClick={() => copyToClipboard(sampleRules, 'rules')}
                    className="text-xs bg-slate-900 hover:bg-slate-800 text-white px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                  >
                    {copiedRules ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedRules ? '복사 완료!' : '규칙 복사'}</span>
                  </button>
                </div>
                
                <pre className="bg-slate-900 text-slate-100 p-3.5 rounded-2xl text-xs font-mono overflow-x-auto border border-slate-800 shadow-inner">
                  <code>{sampleRules}</code>
                </pre>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>규칙 적용 방법:</strong> Firebase 콘솔 &gt; Firestore Database &gt; 상단 <strong>[규칙(Rules)]</strong> 탭을 누르고, 기존 내용을 지운 뒤 위 코드를 붙여넣고 <strong>[게시(Publish)]</strong>를 누르면 1초 만에 즉시 적용됩니다.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <FolderTree className="w-4 h-4 text-amber-600" />
                  코드 구조 및 분리된 컴포넌트 목록
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-mono font-bold text-amber-700">src/firebase.ts</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Firebase v9 초기화, <code>onSnapshot</code> 실시간 리스너, <code>addDoc</code>, <code>updateDoc</code>, <code>deleteDoc</code>
                    </p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-mono font-bold text-amber-700">src/components/GuestbookForm.tsx</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      닉네임, 이모지 프로필 선택, 메시지 작성, 폭죽 효과 폼
                    </p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-mono font-bold text-amber-700">src/components/MessageItemKakao.tsx</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      카카오톡 스타일 말풍선 뷰 및 실시간 공감 하트 인터랙션
                    </p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-mono font-bold text-amber-700">src/components/MessageItemCard.tsx</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      감성 엽서/스티커 메모지 카드 뷰
                    </p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-mono font-bold text-amber-700">src/components/Header.tsx & StatsBar.tsx</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      실시간 연결 상태 뱃지, 실시간 알림음(Ding) 토글, 통계 현황
                    </p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-mono font-bold text-amber-700">src/components/DeleteModal.tsx</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      안전한 비밀번호 확인 삭제 팝업 모달
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-800">
                    내 firebaseConfig 설정 위치 (<code className="text-amber-700">src/firebase.ts</code>):
                  </span>
                  <button
                    onClick={() => copyToClipboard(configSnippet, 'config')}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                  >
                    {copiedConfig ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedConfig ? '복사됨' : '복사'}</span>
                  </button>
                </div>
                <pre className="bg-slate-900 text-slate-100 p-3.5 rounded-2xl text-xs font-mono overflow-x-auto border border-slate-800">
                  <code>{configSnippet}</code>
                </pre>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <a
            href="https://firebase.google.com/docs/firestore/quickstart"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-amber-700 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>공식 문서 둘러보기</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>

      </div>
    </div>
  );
};
