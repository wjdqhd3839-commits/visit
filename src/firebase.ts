/**
 * ============================================================================
 * [파이어베이스(Firebase) 설정 가이드]
 * ============================================================================
 * 
 * 📌 [중요] 내 파이어베이스 정보를 바꾸고 싶을 때:
 * 아래의 `DEFAULT_FIREBASE_CONFIG` 객체의 값들을 본인의 Firebase 프로젝트 값으로
 * 교체하시면 됩니다.
 * 
 * Firebase 콘솔(https://console.firebase.google.com) 접속:
 * 1. 프로젝트 설정(톱니바퀴 아이콘) -> '일반' 탭
 * 2. 하단 '내 앱' 섹션의 웹 앱(</>)에서 발급된 firebaseConfig 코드를 복사하여 넣으세요.
 * ============================================================================
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  doc, 
  updateDoc, 
  increment, 
  deleteDoc, 
  Firestore,
  Unsubscribe
} from 'firebase/firestore';
import { GuestbookMessage } from './types/guestbook';

/**
 * 🔑 사용자의 Firebase 프로젝트 설정 정보입니다.
 * (요청해주신 visit-20574 프로젝트 정보가 바로 적용되어 있습니다.)
 */
export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyAaFRa_OCe84yWkGeR4C0VCPlHwR2Z8rro",
  authDomain: "visit-20574.firebaseapp.com",
  projectId: "visit-20574",
  storageBucket: "visit-20574.firebasestorage.app",
  messagingSenderId: "787584980040",
  appId: "1:787584980040:web:bd3e4e5cab016afec3747d"
};

// 방명록 데이터가 저장되는 Firestore 컬렉션(Collection) 이름
export const COLLECTION_NAME = 'guestbook_messages';

// Firebase 앱 및 Firestore 인스턴스 싱글톤 관리
let app: FirebaseApp;
let db: Firestore;

try {
  // 이미 초기화된 앱이 있으면 재사용, 없으면 새로 초기화
  app = getApps().length > 0 ? getApp() : initializeApp(DEFAULT_FIREBASE_CONFIG);
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase 초기화 에러:", error);
}

export { app, db };

/**
 * 📡 1. 실시간 메시지 구독 (onSnapshot 실시간 리스너)
 * -------------------------------------------------------------
 * 새로고침(F5) 없이도 다른 사용자가 글을 쓰면 즉시 화면에 나타납니다.
 * Firestore의 `onSnapshot` 함수가 데이터 변경을 실시간 감지하여 콜백을 호출합니다.
 *
 * @param onMessagesUpdate 새로운 메시지 목록을 전달받을 콜백 함수
 * @param onError 에러 발생 시 처리할 콜백 함수 (권한 오류 등)
 * @returns 리스너 해제 함수 (컴포넌트 언마운트 시 호출하여 메모리 누수 방지)
 */
export function subscribeToMessages(
  onMessagesUpdate: (messages: GuestbookMessage[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  try {
    const messagesCollection = collection(db, COLLECTION_NAME);
    // 최신 글이 가장 위(또는 실시간 순)로 오도록 createdAt 기준 내림차순(desc) 정렬
    const messagesQuery = query(messagesCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const messages: GuestbookMessage[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          messages.push({
            id: docSnap.id,
            nickname: data.nickname || '익명',
            content: data.content || '',
            avatarEmoji: data.avatarEmoji || '😊',
            avatarColor: data.avatarColor || 'bg-amber-100 text-amber-700',
            createdAt: data.createdAt || null,
            likes: typeof data.likes === 'number' ? data.likes : 0,
            password: data.password || '',
            isPinned: !!data.isPinned,
          });
        });
        onMessagesUpdate(messages);
      },
      (error) => {
        console.error("Firestore onSnapshot 실시간 수신 에러:", error);
        if (onError) {
          onError(error);
        }
      }
    );

    return unsubscribe;
  } catch (err: any) {
    console.error("실시간 구독 설정 중 예외 발생:", err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * ✍️ 2. 새 방명록 메시지 추가 (addDoc)
 * -------------------------------------------------------------
 * 서버 타임스탬프(serverTimestamp)를 사용하여 사용자의 기기 시각과 무관하게
 * 정확한 서버 기준 작성 시각을 기록합니다.
 */
export async function addGuestbookMessage(messageData: {
  nickname: string;
  content: string;
  avatarEmoji: string;
  avatarColor: string;
  password?: string;
}): Promise<string> {
  const messagesCollection = collection(db, COLLECTION_NAME);
  
  const docRef = await addDoc(messagesCollection, {
    nickname: messageData.nickname.trim(),
    content: messageData.content.trim(),
    avatarEmoji: messageData.avatarEmoji,
    avatarColor: messageData.avatarColor,
    password: messageData.password ? messageData.password.trim() : '',
    likes: 0,
    createdAt: serverTimestamp(), // 서버 기준 현재 시각
  });

  return docRef.id;
}

/**
 * ❤️ 3. 공감/좋아요 증가 (updateDoc + increment)
 * -------------------------------------------------------------
 * Firestore의 atomic increment(원자적 증가) 기능을 사용하여
 * 동시 다발적인 좋아요 클릭도 유실 없이 1씩 안전하게 증가시킵니다.
 */
export async function likeGuestbookMessage(messageId: string): Promise<void> {
  const messageDocRef = doc(db, COLLECTION_NAME, messageId);
  await updateDoc(messageDocRef, {
    likes: increment(1)
  });
}

/**
 * 🗑️ 4. 방명록 메시지 삭제 (deleteDoc)
 * -------------------------------------------------------------
 * 작성 시 설정한 비밀번호가 일치하면 Firestore에서 문서를 삭제합니다.
 */
export async function deleteGuestbookMessage(messageId: string): Promise<void> {
  const messageDocRef = doc(db, COLLECTION_NAME, messageId);
  await deleteDoc(messageDocRef);
}
