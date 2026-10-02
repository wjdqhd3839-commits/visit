import { Timestamp } from 'firebase/firestore';

/**
 * 날짜를 사람이 읽기 쉬운 한국어 상대 시간 표현으로 변환합니다.
 * (예: 방금 전, 5분 전, 2시간 전, 어제, 2026.10.01)
 */
export function formatTimeAgo(dateInput: Timestamp | Date | number | null | undefined): string {
  if (!dateInput) return '방금 전';

  let date: Date;

  if (dateInput instanceof Timestamp) {
    date = dateInput.toDate();
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else if (typeof dateInput === 'number') {
    date = new Date(dateInput);
  } else if (typeof dateInput === 'object' && 'seconds' in (dateInput as any)) {
    // Firestore Timestamp-like plain object
    date = new Date((dateInput as any).seconds * 1000);
  } else {
    return '방금 전';
  }

  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();

  // 미래 시간이거나 5초 이내인 경우
  if (diffInMs < 5000) {
    return '방금 전';
  }

  const seconds = Math.floor(diffInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds}초 전`;
  }
  if (minutes < 60) {
    return `${minutes}분 전`;
  }
  if (hours < 24) {
    return `${hours}시간 전`;
  }
  if (days === 1) {
    return `어제 ${formatSimpleTime(date)}`;
  }
  if (days < 7) {
    return `${days}일 전`;
  }

  // 7일 이상 경과한 경우 날짜 표시
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day} ${formatSimpleTime(date)}`;
}

export function formatSimpleTime(date: Date): string {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours < 12 ? '오전' : '오후';
  const displayHours = hours % 12 || 12;
  return `${ampm} ${displayHours}:${minutes}`;
}
