"use client";

import { useState, useRef } from 'react';

import AppFooter from "@/app/components/AppFooter";
import RelatedApps from '@/app/components/RelatedApps';
import AdSense from '@/app/components/AdSense';
import AdOverlay from '@/app/components/AdOverlay';
interface VoiceAnalysis {
  frequency: number; // 평균 주파수 (Hz)
  volume: number; // 평균 볼륨
  stability: number; // 안정도
  energy: number; // 에너지
}

interface FortuneResult {
  voiceType: string;
  personality: string[];
  fortune: {
    wealth: number;
    career: number;
    love: number;
    health: number;
  };
  element: string; // 오행
  advice: string[];
  luckyColor: string;
  luckyNumber: number;
}

// 목소리 주파수별 오행 및 성격
const VOICE_PROFILES: Record<string, { range: string; element: string; personality: string[]; fortune: string }> = {
  '초저음': { 
    range: '80-120Hz', 
    element: '수(水)', 
    personality: ['깊이 있는 사고', '신중함', '포용력', '지혜로움'],
    fortune: '큰 사업가나 학자의 목소리, 말년 대박'
  },
  '저음': { 
    range: '120-180Hz', 
    element: '금(金)', 
    personality: ['안정적', '신뢰감', '권위적', '리더십'],
    fortune: '관직운, 경영자 기질, 부와 권력'
  },
  '중음': { 
    range: '180-250Hz', 
    element: '토(土)', 
    personality: ['균형감', '실용적', '성실함', '조화로움'],
    fortune: '안정적 재물, 평탄한 인생'
  },
  '고음': { 
    range: '250-350Hz', 
    element: '목(木)', 
    personality: ['활발함', '사교적', '창의적', '긍정적'],
    fortune: '인기운, 예술가 기질, 사람 복'
  },
  '초고음': { 
    range: '350Hz+', 
    element: '화(火)', 
    personality: ['열정적', '적극적', '표현력', '감성적'],
    fortune: '연예인운, 스타성, 화려한 성공'
  }
};

export default function VoiceFortune() {
  // Add CSS animations
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes blob {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(20px, -50px) scale(1.1); }
        50% { transform: translate(-20px, 20px) scale(0.9); }
        75% { transform: translate(50px, 50px) scale(1.05); }
      }
      
      @keyframes bounce-slow {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      .animate-blob { animation: blob 7s infinite; }
      .animation-delay-2000 { animation-delay: 2s; }
      .animation-delay-4000 { animation-delay: 4s; }
      .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
      .animate-shimmer { animation: shimmer 3s infinite; }
    `;
    if (!document.getElementById('voice-fortune-styles')) {
      style.id = 'voice-fortune-styles';
      document.head.appendChild(style);
    }
  }
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // 5초 후 자동 중지
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          stopRecording();
        }
      }, 5000);
    } catch (error) {
      alert('마이크 접근 권한이 필요합니다.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const analyzeVoice = async () => {
    if (!audioBlob) return;

    setAnalyzing(true);

    // 오디오 분석 (간단한 시뮬레이션)
    const analysis: VoiceAnalysis = {
      frequency: 150 + Math.random() * 150, // 150-300Hz 랜덤
      volume: 50 + Math.random() * 50,
      stability: 60 + Math.random() * 40,
      energy: 50 + Math.random() * 50
    };

    setTimeout(() => {
      // 주파수로 목소리 타입 판단
      let voiceType = '중음';
      if (analysis.frequency < 120) voiceType = '초저음';
      else if (analysis.frequency < 180) voiceType = '저음';
      else if (analysis.frequency < 250) voiceType = '중음';
      else if (analysis.frequency < 350) voiceType = '고음';
      else voiceType = '초고음';

      const profile = VOICE_PROFILES[voiceType];

      // 운세 점수 계산
      const baseScore = Math.round(analysis.stability);
      const fortune = {
        wealth: Math.min(100, baseScore + (analysis.energy > 70 ? 15 : 5)),
        career: Math.min(100, baseScore + (analysis.volume > 70 ? 20 : 10)),
        love: Math.min(100, baseScore + (analysis.frequency > 200 ? 15 : 5)),
        health: Math.min(100, baseScore + (analysis.stability > 80 ? 15 : 0))
      };

      // 행운의 색상 (오행 기반)
      const luckyColors: Record<string, string> = {
        '수(水)': '검정, 파랑',
        '금(金)': '흰색, 금색',
        '토(土)': '노랑, 갈색',
        '목(木)': '초록, 청록',
        '화(火)': '빨강, 주황'
      };

      // 행운의 숫자
      const luckyNumber = Math.floor(analysis.frequency / 10) % 9 + 1;

      // 조언 생성
      const advice = [
        `${profile.element} 기운의 목소리로 ${profile.fortune}`,
        `목소리 안정도 ${Math.round(analysis.stability)}% - ${analysis.stability > 80 ? '매우 안정적' : '변화 많음'}`,
        `에너지 레벨 ${Math.round(analysis.energy)}% - ${analysis.energy > 70 ? '활발한 시기' : '휴식 필요'}`,
        `추천: 중요한 대화나 발표는 ${analysis.volume > 70 ? '지금' : '목소리 컨디션 회복 후'}에 하세요`
      ];

      setResult({
        voiceType,
        personality: profile.personality,
        fortune,
        element: profile.element,
        advice,
        luckyColor: luckyColors[profile.element],
        luckyNumber
      });

      setAnalyzing(false);
    }, 2500);
  };

  const restart = () => {
    setAudioBlob(null);
    setResult(null);
  };

  if (result) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 relative overflow-hidden">
        <AdOverlay />
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="mx-auto max-w-[600px] px-3 sm:px-4 py-4 sm:py-6 relative z-10">
          <section className="bg-white/10 backdrop-blur-2xl rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl p-4 sm:p-5 md:p-6 border-2 border-white/30 relative"
            style={{
              transform: 'perspective(1000px) rotateX(2deg)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 100px rgba(99, 102, 241, 0.2), inset 0 0 100px rgba(255, 255, 255, 0.1)'
            }}>
            {/* Shimmering Overlay */}
            <div className="absolute inset-0 rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            </div>

            <header className="text-center mb-4 sm:mb-6 relative">
              <div className="text-5xl sm:text-6xl md:text-7xl mb-2 sm:mb-3 animate-bounce-slow"
                style={{ textShadow: '0 0 20px rgba(99, 102, 241, 0.8)' }}>
                🎤
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-2 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
                목소리 분석 결과
              </h2>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-300 text-xs sm:text-sm font-bold">ON AIR</span>
              </div>
            </header>

            {/* 목소리 타입 */}
            <div className="mb-4 sm:mb-6 p-4 sm:p-5 md:p-6 bg-gradient-to-br from-blue-500/30 to-indigo-500/30 backdrop-blur-xl rounded-xl sm:rounded-2xl border-2 border-white/30 text-center hover:scale-105 transition-all duration-300"
              style={{
                transform: 'perspective(1000px) translateZ(20px)',
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)'
              }}>
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 sm:mb-3 animate-pulse">{result.voiceType}</div>
              <div className="text-base sm:text-lg md:text-xl font-black text-indigo-200">{result.element}</div>
            </div>

            {/* 성격 분석 */}
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 md:p-5 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl border-2 border-white/30 hover:scale-105 transition-all duration-300"
              style={{
                transform: 'perspective(1000px) translateZ(10px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 50px rgba(255, 255, 255, 0.1)'
              }}>
              <h3 className="font-bold text-sm sm:text-base md:text-lg text-white mb-3">🎭 성격 특성</h3>
              <div className="flex flex-wrap gap-2">
                {result.personality.map((trait, i) => (
                  <span key={i} className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold border border-white/30 hover:scale-110 transition-all">
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* 운세 점수 */}
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 md:p-5 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl border-2 border-white/30 hover:scale-105 transition-all duration-300"
              style={{
                transform: 'perspective(1000px) translateZ(10px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 50px rgba(255, 255, 255, 0.1)'
              }}>
              <h3 className="font-bold text-sm sm:text-base md:text-lg text-white mb-3 sm:mb-4">🌟 운세 분석</h3>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="bg-gradient-to-br from-red-600/80 to-red-700/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-white/30 hover:scale-110 transition-all"
                  style={{ boxShadow: '0 5px 15px rgba(220, 38, 38, 0.3)' }}>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white">{result.fortune.wealth}</div>
                  <div className="text-xs sm:text-sm text-red-100 mt-1 font-bold">재물운</div>
                </div>
                <div className="bg-gradient-to-br from-blue-600/80 to-blue-700/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-white/30 hover:scale-110 transition-all"
                  style={{ boxShadow: '0 5px 15px rgba(37, 99, 235, 0.3)' }}>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white">{result.fortune.career}</div>
                  <div className="text-xs sm:text-sm text-blue-100 mt-1 font-bold">사업운</div>
                </div>
                <div className="bg-gradient-to-br from-pink-600/80 to-pink-700/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-white/30 hover:scale-110 transition-all"
                  style={{ boxShadow: '0 5px 15px rgba(219, 39, 119, 0.3)' }}>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white">{result.fortune.love}</div>
                  <div className="text-xs sm:text-sm text-pink-100 mt-1 font-bold">애정운</div>
                </div>
                <div className="bg-gradient-to-br from-green-600/80 to-green-700/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-white/30 hover:scale-110 transition-all"
                  style={{ boxShadow: '0 5px 15px rgba(22, 163, 74, 0.3)' }}>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white">{result.fortune.health}</div>
                  <div className="text-xs sm:text-sm text-green-100 mt-1 font-bold">건강운</div>
                </div>
              </div>
            </div>

            {/* 행운 아이템 */}
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 md:p-5 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl border-2 border-white/30 hover:scale-105 transition-all duration-300"
              style={{
                transform: 'perspective(1000px) translateZ(10px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 50px rgba(255, 255, 255, 0.1)'
              }}>
              <h3 className="font-bold text-sm sm:text-base md:text-lg text-white mb-3">🍀 행운 아이템</h3>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="bg-gradient-to-br from-yellow-600/80 to-amber-600/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-white/30 hover:scale-110 transition-all"
                  style={{ boxShadow: '0 5px 15px rgba(217, 119, 6, 0.3)' }}>
                  <div className="text-xs sm:text-sm text-yellow-100 mb-1 font-bold">행운의 색</div>
                  <div className="text-base sm:text-lg md:text-xl font-black text-white">{result.luckyColor}</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-600/80 to-amber-600/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-white/30 hover:scale-110 transition-all"
                  style={{ boxShadow: '0 5px 15px rgba(217, 119, 6, 0.3)' }}>
                  <div className="text-xs sm:text-sm text-yellow-100 mb-1 font-bold">행운의 숫자</div>
                  <div className="text-base sm:text-lg md:text-xl font-black text-white">{result.luckyNumber}</div>
                </div>
              </div>
            </div>

            {/* 조언 */}
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 md:p-5 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl border-2 border-white/30 hover:scale-105 transition-all duration-300"
              style={{
                transform: 'perspective(1000px) translateZ(10px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 50px rgba(255, 255, 255, 0.1)'
              }}>
              <h3 className="font-bold text-sm sm:text-base md:text-lg text-white mb-3">💡 음성 운세 조언</h3>
              <div className="space-y-2">
                {result.advice.map((adv, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-xs sm:text-sm text-white/90 border border-white/30">
                    • {adv}
                  </div>
                ))}
              </div>
            </div>

            <button
        type="button"
              onClick={restart}
              className="group relative w-full max-w-md mx-auto py-4 sm:py-5 md:py-6 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white font-black text-base sm:text-lg md:text-xl rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
              style={{
                transform: 'perspective(1000px) translateZ(10px)',
                boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4), 0 0 60px rgba(168, 85, 247, 0.3)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none"></div>
              <span className="relative flex items-center justify-center gap-2 sm:gap-3 px-4">
                <span className="text-xl sm:text-2xl md:text-3xl group-hover:rotate-180 transition-transform duration-500">🔄</span>
                <span className="whitespace-nowrap">다시 분석하기</span>
                <span className="text-lg sm:text-xl md:text-2xl group-hover:translate-x-2 transition-transform duration-300">→</span>
              </span>
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="mx-auto max-w-[600px] px-3 sm:px-4 py-4 sm:py-6 relative z-10">
        <section className="bg-white/10 backdrop-blur-2xl rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl p-4 sm:p-5 md:p-6 border-2 border-white/30 relative"
          style={{
            transform: 'perspective(1000px) rotateX(2deg)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 100px rgba(99, 102, 241, 0.2), inset 0 0 100px rgba(255, 255, 255, 0.1)'
          }}>
          {/* Shimmering Overlay */}
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
          </div>

          <header className="text-center mb-4 sm:mb-6 relative">
            <div className="text-5xl sm:text-6xl md:text-7xl mb-2 sm:mb-3 animate-bounce-slow"
              style={{ textShadow: '0 0 20px rgba(99, 102, 241, 0.8)' }}>
              🎤
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-2 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
              목소리 톤 운세 분석기
            </h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-300 text-xs sm:text-sm font-bold">LIVE</span>
            </div>
            <p className="text-sm sm:text-base text-white/80">음성 주파수로 성격과 운세를 분석합니다</p>
          </header>

          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl border-2 border-white/30 relative">
            <h3 className="font-bold text-sm sm:text-base md:text-lg text-white mb-2 sm:mb-3">🎵 분석 방법</h3>
            <p className="text-xs sm:text-sm text-white/90 mb-2 sm:mb-3 font-semibold">
              "안녕하세요, 제 목소리를 분석해주세요"라고 5초간 말해주세요
            </p>
            <ul className="text-xs sm:text-sm text-white/80 space-y-1">
              <li>• 조용한 공간에서 녹음하세요</li>
              <li>• 평소 말하는 톤으로 자연스럽게</li>
              <li>• 목소리 주파수와 에너지를 분석합니다</li>
            </ul>
          </div>

          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl border-2 border-white/30 relative">
            <h3 className="font-bold text-sm sm:text-base md:text-lg text-white mb-2 sm:mb-3">🔮 음성학 × 오행론</h3>
            <div className="text-xs sm:text-sm text-white/80 space-y-1">
              <p>• 초저음(80-120Hz): 수(水) - 지혜, 포용력</p>
              <p>• 저음(120-180Hz): 금(金) - 권위, 리더십</p>
              <p>• 중음(180-250Hz): 토(土) - 안정, 균형</p>
              <p>• 고음(250-350Hz): 목(木) - 활발, 창의</p>
              <p>• 초고음(350Hz+): 화(火) - 열정, 스타성</p>
            </div>
          </div>

          {!audioBlob ? (
            <div className="text-center relative">
              {!isRecording ? (
                <button
        type="button"
                  onClick={startRecording}
                  className="group relative inline-flex items-center gap-3 px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-red-500 via-pink-500 to-blue-500 text-white font-black text-sm sm:text-base md:text-lg rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{
                    transform: 'perspective(1000px) translateZ(10px)',
                    boxShadow: '0 20px 40px rgba(239, 68, 68, 0.4), 0 0 60px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none"></div>
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                  녹음 시작 (5초)
                </button>
              ) : (
                <div className="py-6 sm:py-8">
                  <div className="inline-block">
                    <div className="flex items-center gap-3 justify-center mb-4">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-lg sm:text-xl font-black text-white">녹음 중...</span>
                    </div>
                    <div className="mt-4 flex justify-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-2 sm:w-3 bg-red-400 rounded-full animate-pulse" style={{
                          height: `${Math.random() * 40 + 20}px`,
                          animationDelay: `${i * 0.1}s`
                        }}></div>
                      ))}
                    </div>
                  </div>
                  <button
        type="button"
                    onClick={stopRecording}
                    className="mt-6 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/30 border-2 border-white/30 transition-all"
                  >
                    녹음 중지
                  </button>
                </div>
              )}
            </div>
          ) : !analyzing ? (
            <div className="space-y-3 sm:space-y-4 relative">
              <div className="text-center py-4 bg-gradient-to-r from-green-600/30 to-emerald-600/30 backdrop-blur-lg rounded-xl border-2 border-green-400/50">
                <p className="text-white font-black text-sm sm:text-base">✓ 녹음 완료!</p>
              </div>
              <button
        type="button"
                onClick={analyzeVoice}
                className="group relative w-full py-4 sm:py-5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white font-black text-sm sm:text-base md:text-lg rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  transform: 'perspective(1000px) translateZ(10px)',
                  boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none"></div>
                목소리 분석하기
              </button>
              <button
        type="button"
                onClick={restart}
                className="w-full py-3 bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-white/30 border-2 border-white/30 transition-all"
              >
                다시 녹음
              </button>
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 relative">
              <div className="inline-block animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-4 border-indigo-400 border-t-transparent mb-4"></div>
              <p className="text-white font-black text-base sm:text-lg">목소리 주파수 분석 중...</p>
              <p className="text-xs sm:text-sm text-white/70 mt-2">음성 패턴 × 오행 매칭 중</p>
            </div>
          )}
        </section>
      </div>
      {/* 제작자 서명 */}
      {/* 관련 앱 추천 */}

      <RelatedApps currentAppSlug="voice-fortune" className="mt-8 mb-8" />
        {/* 광고 */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <AdSense className="min-h-[250px]" />
          </div>
        </div>




      <AppFooter />

    </main>
  );
}

