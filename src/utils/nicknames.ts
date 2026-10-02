const adjectives = [
  '행복한', '따뜻한', '반짝이는', '신나는', '귀여운', '친절한', '용감한', '달콤한',
  '느긋한', '꿈꾸는', '열정적인', '다정한', '호기심많은', '포근한', '상쾌한', '빛나는'
];

const nouns = [
  '다람쥐', '고양이', '강아지', '쿼카', '돌고래', '판다', '토끼', '펭귄',
  '바리스타', '탐험가', '여행자', '디자이너', '개발자', '책벌레', '음악가', '새싹'
];

export function getRandomNickname(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj} ${noun}`;
}

export const AVATAR_EMOJIS = ['😊', '🦊', '🐱', '🐶', '🐼', '🐰', '🐥', '🍀', '☕', '🚀', '🌟', '🌈', '🎨', '🧁'];

export const AVATAR_COLORS = [
  { name: '앰버', bg: 'bg-amber-100 text-amber-800 border-amber-300' },
  { name: '로즈', bg: 'bg-rose-100 text-rose-800 border-rose-300' },
  { name: '스카이', bg: 'bg-sky-100 text-sky-800 border-sky-300' },
  { name: '에메랄드', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { name: '바이올렛', bg: 'bg-purple-100 text-purple-800 border-purple-300' },
  { name: '인디고', bg: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
];
