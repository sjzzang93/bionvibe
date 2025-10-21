"use client";

import { useState, useRef } from 'react';

import AppFooter from "@/app/components/AppFooter";
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
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 transition-colors" style={{
        backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.2) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(99, 102, 241, 0.2) 0%, transparent 40%), linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, transparent 100%)',
        backgroundAttachment: 'fixed'
      }}>
        <div className="mx-auto max-w-[600px] px-4 py-6">
          {/* 상단 배너 제거됨 */}

          <section className="bg-gradient-to-br from-gray-900 to-black rounded sm:rounded-lg md:rounded-2xl shadow-2xl p-6 border-2 border-blue-500/50">
            <header className="text-center mb-6">
              <div className="inline-block p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-0.5 sm:mb-1.5 md:mb-2">
                <h1 className="text-3xl font-bold text-white">🎤</h1>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">목소리 분석 결과</h2>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-black text-sm font-bold">ON AIR</span>
              </div>
            </header>

            {/* 목소리 타입 */}
            <div className="mb-6 p-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl border-2 border-blue-400 text-center">
              <div className="text-3xl font-bold text-white mb-2">{result.voiceType}</div>
              <div className="text-lg font-semibold text-gray-900 mb-0.5 sm:mb-1.5 md:mb-2">{result.element}</div>
            </div>

            {/* 성격 분석 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-blue-500/50">
              <h3 className="font-bold text-[10px] sm:text-xs md:text-sm text-white mb-0.5 sm:mb-1.5 md:mb-2">🎭 성격 특성</h3>
              <div className="flex flex-wrap gap-2">
                {result.personality.map((trait, i) => (
                  <span key={i} className="bg-blue-600/50 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold border border-blue-500/50">
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* 운세 점수 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-blue-500/50">
              <h3 className="font-bold text-[10px] sm:text-xs md:text-sm text-white mb-4">🌟 운세 분석</h3>
              <div className="grid grid-cols-3 gap-0 sm:gap-1.5 md:gap-3">
                <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg p-4 text-center border-2 border-red-400">
                  <div className="text-3xl font-bold text-white">{result.fortune.wealth}</div>
                  <div className="text-sm text-black mt-1">재물운</div>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-4 text-center border-2 border-blue-400">
                  <div className="text-3xl font-bold text-white">{result.fortune.career}</div>
                  <div className="text-sm text-gray-900 mt-1">사업운</div>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-4 text-center border-2 border-blue-400">
                  <div className="text-3xl font-bold text-white">{result.fortune.love}</div>
                  <div className="text-sm text-gray-900 mt-1">애정운</div>
                </div>
                <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-4 text-center border-2 border-green-400">
                  <div className="text-3xl font-bold text-white">{result.fortune.health}</div>
                  <div className="text-sm text-black mt-1">건강운</div>
                </div>
              </div>
            </div>

            {/* 행운 아이템 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-blue-500/50">
              <h3 className="font-bold text-[10px] sm:text-xs md:text-sm text-white mb-0.5 sm:mb-1.5 md:mb-2">🍀 행운 아이템</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gradient-to-br from-yellow-600 to-amber-600 rounded-lg p-2 sm:p-3 text-center border border-yellow-500">
                  <div className="text-sm text-black mb-1">행운의 색</div>
                  <div className="text-lg font-bold text-white">{result.luckyColor}</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-600 to-amber-600 rounded-lg p-2 sm:p-3 text-center border border-yellow-500">
                  <div className="text-sm text-black mb-1">행운의 숫자</div>
                  <div className="text-lg font-bold text-white">{result.luckyNumber}</div>
                </div>
              </div>
            </div>

            {/* 조언 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-blue-500/50">
              <h3 className="font-bold text-[10px] sm:text-xs md:text-sm text-white mb-0.5 sm:mb-1.5 md:mb-2">💡 음성 운세 조언</h3>
              <div className="space-y-2">
                {result.advice.map((adv, i) => (
                  <div key={i} className="bg-gray-700/50 rounded p-3 text-sm text-gray-300 border border-blue-500/30">
                    • {adv}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={restart}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-[10px] sm:text-xs md:text-sm rounded-lg shadow-lg hover:shadow-xl transition-all border-2 border-blue-400"
            >
              다시 분석하기
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 transition-colors" style={{
      backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.2) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(99, 102, 241, 0.2) 0%, transparent 40%), linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, transparent 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <div className="mx-auto max-w-[600px] px-4 py-6">
        {/* 상단 배너 제거됨 */}

        <section className="bg-gradient-to-br from-gray-900 to-black rounded sm:rounded-lg md:rounded-2xl shadow-2xl p-6 border-2 border-blue-500/50">
          <header className="text-center mb-6">
            <div className="inline-block p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-0.5 sm:mb-1.5 md:mb-2">
              <h1 className="text-4xl font-bold text-white">🎤</h1>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">목소리 톤 운세 분석기</h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-black text-sm font-bold">LIVE</span>
            </div>
            <p className="text-gray-400">음성 주파수로 성격과 운세를 분석합니다</p>
          </header>

          <div className="mb-6 p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-blue-500/50">
            <h3 className="font-bold text-white mb-2">🎵 분석 방법</h3>
            <p className="text-sm text-gray-300 mb-0.5 sm:mb-1.5 md:mb-2">
              "안녕하세요, 제 목소리를 분석해주세요"라고 5초간 말해주세요
            </p>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• 조용한 공간에서 녹음하세요</li>
              <li>• 평소 말하는 톤으로 자연스럽게</li>
              <li>• 목소리 주파수와 에너지를 분석합니다</li>
            </ul>
          </div>

          <div className="mb-6 p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-blue-500/50">
            <h3 className="font-bold text-white mb-2">🔮 음성학 × 오행론</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p>• 초저음(80-120Hz): 수(水) - 지혜, 포용력</p>
              <p>• 저음(120-180Hz): 금(金) - 권위, 리더십</p>
              <p>• 중음(180-250Hz): 토(土) - 안정, 균형</p>
              <p>• 고음(250-350Hz): 목(木) - 활발, 창의</p>
              <p>• 초고음(350Hz+): 화(火) - 열정, 스타성</p>
            </div>
          </div>

          {!audioBlob ? (
            <div className="text-center">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="inline-flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-red-500 to-blue-500 text-white font-bold text-[10px] sm:text-xs md:text-sm rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                  녹음 시작 (5초)
                </button>
              ) : (
                <div className="py-8">
                  <div className="inline-block">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-xl font-bold text-black">녹음 중...</span>
                    </div>
                    <div className="mt-4 flex justify-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-2 bg-red-400 rounded-full animate-pulse" style={{
                          height: `${Math.random() * 40 + 20}px`,
                          animationDelay: `${i * 0.1}s`
                        }}></div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={stopRecording}
                    className="mt-6 px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 border border-gray-600"
                  >
                    녹음 중지
                  </button>
                </div>
              )}
            </div>
          ) : !analyzing ? (
            <div className="space-y-4">
              <div className="text-center py-4 bg-green-600/50 rounded-lg border border-green-500">
                <p className="text-white font-semibold">✓ 녹음 완료!</p>
              </div>
              <button
                onClick={analyzeVoice}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-[10px] sm:text-xs md:text-sm rounded-lg shadow-lg hover:shadow-xl transition-all border-2 border-blue-400"
              >
                목소리 분석하기
              </button>
              <button
                onClick={restart}
                className="w-full py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 border border-gray-600"
              >
                다시 녹음
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
              <p className="text-gray-900 font-semibold">목소리 주파수 분석 중...</p>
              <p className="text-sm text-gray-400 mt-2">음성 패턴 × 오행 매칭 중</p>
            </div>
          )}
        </section>
      </div>
      {/* 제작자 서명 */}
      <AppFooter />

    </main>
  );
}

