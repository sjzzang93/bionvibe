export const speak = (text: string) => {
  if (typeof window === 'undefined') return;
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ko-KR';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch (e) {
    console.error('Speech synthesis failed:', e);
  }
};

