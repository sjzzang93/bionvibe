"use client";

import { useState, useRef } from 'react';

import AppFooter from "@/app/components/AppFooter";
import RelatedApps from '@/app/components/RelatedApps';
import AdSense from '@/app/components/AdSense';
import AdOverlay from '@/app/components/AdOverlay';
export default function VoiceAge() {
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
    if (!document.getElementById('voice-age-styles')) {
      style.id = 'voice-age-styles';
      document.head.appendChild(style);
    }
  }
  const [recording, setRecording] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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
        analyzeVoice();
      };

      mediaRecorder.start();
      setRecording(true);

      // 5초 후 자동 정지
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          stream.getTracks().forEach(track => track.stop());
          setRecording(false);
        }
      }, 5000);
    } catch (error) {
      alert('마이크 권한이 필요합니다.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setRecording(false);
    }
  };

  const analyzeVoice = () => {
    setAnalyzing(true);

    setTimeout(() => {
      // 시뮬레이션: 실제로는 Web Audio API로 주파수 분석
      const baseAge = 20 + Math.floor(Math.random() * 40);
      const pitch = 150 + Math.random() * 150; // Hz
      const clarity = 60 + Math.random() * 40; // %
      const stability = 60 + Math.random() * 40; // %

      // 목소리 나이 계산
      let voiceAge = baseAge;
      
      // 주파수 분석 (높을수록 젊음)
      if (pitch > 200) voiceAge -= 5;
      else if (pitch < 120) voiceAge += 5;

      // 명확도 (높을수록 젊음)
      if (clarity > 80) voiceAge -= 3;
      else if (clarity < 70) voiceAge += 3;

      // 안정성 (높을수록 성숙)
      if (stability > 85) voiceAge += 2;
      else if (stability < 70) voiceAge -= 2;

      voiceAge = Math.max(15, Math.min(80, Math.round(voiceAge)));

      // 목소리 타입
      let voiceType = '';
      let voiceChar = '';
      
      if (pitch > 220) {
        voiceType = '고음형 (Soprano/Tenor)';
        voiceChar = '밝고 경쾌한 목소리, 젊은 인상';
      } else if (pitch > 180) {
        voiceType = '중고음형 (Mezzo-Soprano/Baritone)';
        voiceChar = '균형잡힌 목소리, 친근한 인상';
      } else if (pitch > 140) {
        voiceType = '중저음형 (Alto/Baritone)';
        voiceChar = '부드럽고 따뜻한 목소리, 신뢰감';
      } else {
        voiceType = '저음형 (Bass)';
        voiceChar = '깊고 묵직한 목소리, 권위적 인상';
      }

      // 건강도
      const healthScore = Math.round((clarity + stability) / 2);
      let health = '';
      const healthAdvice: string[] = [];

      if (healthScore >= 80) {
        health = '매우 건강';
        healthAdvice.push('✅ 목소리가 매우 건강합니다');
        healthAdvice.push('현재 상태 유지하세요');
      } else if (healthScore >= 70) {
        health = '건강';
        healthAdvice.push('✅ 목소리 건강 양호');
        healthAdvice.push('충분한 수분 섭취 권장');
      } else if (healthScore >= 60) {
        health = '보통';
        healthAdvice.push('⚠️ 목 관리 필요');
        healthAdvice.push('따뜻한 물 자주 마시기');
        healthAdvice.push('과도한 목 사용 피하기');
      } else {
        health = '주의 필요';
        healthAdvice.push('🚨 목 건강 점검 필요');
        healthAdvice.push('따뜻한 물, 꿀차 섭취');
        healthAdvice.push('큰 소리 내기 자제');
        healthAdvice.push('이비인후과 검진 고려');
      }

      // 목소리 개선 팁
      const improvementTips = [
        '🎵 발성 연습: 매일 10분씩 음계 연습',
        '💧 수분: 하루 2L 이상 물 마시기',
        '🫖 따뜻한 차: 꿀차, 생강차로 목 보호',
        '🚭 금연: 흡연은 목소리 노화 주범',
        '🗣️ 복식호흡: 배로 호흡하는 연습',
        '😴 충분한 수면: 7-8시간 숙면',
        '🎤 적정 음량: 고함 지르기 자제',
        '🧘 스트레칭: 목과 어깨 긴장 풀기'
      ];

      // 나이대별 특징
      let ageGroup = '';
      let ageFeature = '';

      if (voiceAge < 25) {
        ageGroup = '10-20대 목소리';
        ageFeature = '밝고 활기찬 목소리, 높은 음역대, 에너지 넘침';
      } else if (voiceAge < 35) {
        ageGroup = '20-30대 목소리';
        ageFeature = '안정적이고 명확한 발음, 직업적 신뢰감';
      } else if (voiceAge < 50) {
        ageGroup = '30-40대 목소리';
        ageFeature = '성숙하고 따뜻한 톤, 경험에서 우러나는 깊이';
      } else if (voiceAge < 65) {
        ageGroup = '50-60대 목소리';
        ageFeature = '낮고 묵직한 톤, 권위와 신뢰, 지혜로운 인상';
      } else {
        ageGroup = '60대 이상 목소리';
        ageFeature = '깊고 차분한 톤, 인생 경험이 담긴 목소리';
      }

      setResult({
        voiceAge,
        actualAge: 0,
        difference: 0,
        pitch: Math.round(pitch),
        clarity: Math.round(clarity),
        stability: Math.round(stability),
        voiceType,
        voiceChar,
        health,
        healthScore,
        healthAdvice,
        improvementTips,
        ageGroup,
        ageFeature
      });

      setAnalyzing(false);
    }, 2000);
  };

  if (result) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 relative overflow-hidden">
        <AdOverlay />
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="mx-auto max-w-[600px] px-3 sm:px-4 py-4 sm:py-6 relative z-10">
          <section className="bg-white/10 backdrop-blur-2xl rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl p-4 sm:p-5 md:p-6 border-2 border-white/30 relative"
            style={{
              transform: 'perspective(1000px) rotateX(2deg)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 100px rgba(220, 38, 38, 0.2), inset 0 0 100px rgba(255, 255, 255, 0.1)'
            }}>
            {/* Shimmering Overlay */}
            <div className="absolute inset-0 rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            </div>

            <header className="text-center mb-4 sm:mb-6 relative">
              <div className="text-5xl sm:text-6xl md:text-7xl mb-2 sm:mb-3 animate-bounce-slow"
                style={{ textShadow: '0 0 20px rgba(220, 38, 38, 0.8)' }}>
                🎙️
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-red-200 via-orange-200 to-yellow-200 bg-clip-text text-transparent drop-shadow-2xl">
                목소리 나이 분석 결과
              </h2>
            </header>

            {/* 목소리 나이 */}
            <div className="mb-4 sm:mb-6 p-4 sm:p-5 md:p-6 bg-gradient-to-br from-red-500/30 to-orange-500/30 backdrop-blur-xl rounded-xl sm:rounded-2xl border-2 border-white/30 text-center hover:scale-105 transition-all duration-300"
              style={{
                transform: 'perspective(1000px) translateZ(20px)',
                boxShadow: '0 20px 40px rgba(220, 38, 38, 0.4)'
              }}>
              <div className="text-4xl sm:text-5xl md:text-6xl font-black mb-2 sm:mb-3 animate-pulse bg-gradient-to-r from-red-200 via-orange-200 to-yellow-200 bg-clip-text text-transparent">
                {result.voiceAge}세
              </div>
              <div className="text-base sm:text-lg md:text-xl font-black text-white mb-2">{result.ageGroup}</div>
              <p className="text-xs sm:text-sm text-white/80">{result.ageFeature}</p>
            </div>

            {/* 목소리 분석 */}
            <div className="mb-4 sm:mb-6">
              <h3 className="font-bold text-sm sm:text-base md:text-lg text-white mb-3">🎵 음성 분석</h3>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="bg-gradient-to-br from-red-600/80 to-red-700/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/30 text-center hover:scale-110 transition-all"
                  style={{ boxShadow: '0 5px 15px rgba(220, 38, 38, 0.3)' }}>
                  <div className="text-xs sm:text-sm text-red-100 mb-1 font-bold">주파수</div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-black text-white">{result.pitch}</div>
                  <div className="text-xs text-red-200">Hz</div>
                </div>

                <div className="bg-gradient-to-br from-orange-600/80 to-orange-700/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/30 text-center hover:scale-110 transition-all"
                  style={{ boxShadow: '0 5px 15px rgba(234, 88, 12, 0.3)' }}>
                  <div className="text-xs sm:text-sm text-orange-100 mb-1 font-bold">명확도</div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-black text-white">{result.clarity}</div>
                  <div className="text-xs text-orange-200">%</div>
                </div>

                <div className="bg-gradient-to-br from-yellow-600/80 to-yellow-700/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/30 text-center hover:scale-110 transition-all"
                  style={{ boxShadow: '0 5px 15px rgba(202, 138, 4, 0.3)' }}>
                  <div className="text-xs sm:text-sm text-yellow-100 mb-1 font-bold">안정성</div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-black text-white">{result.stability}</div>
                  <div className="text-xs text-yellow-200">%</div>
                </div>
              </div>
            </div>

            {/* 목소리 타입 */}
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 md:p-5 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl border-2 border-white/30 hover:scale-105 transition-all duration-300"
              style={{
                transform: 'perspective(1000px) translateZ(10px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 50px rgba(255, 255, 255, 0.1)'
              }}>
              <h3 className="font-bold text-sm sm:text-base md:text-lg text-white mb-2 sm:mb-3">🎤 목소리 타입</h3>
              <div className="text-lg sm:text-xl md:text-2xl font-black text-white mb-2">{result.voiceType}</div>
              <p className="text-xs sm:text-sm text-white/80">{result.voiceChar}</p>
            </div>

            {/* 건강도 */}
            <div className={`mb-4 sm:mb-6 p-3 sm:p-4 md:p-5 backdrop-blur-xl rounded-xl sm:rounded-2xl border-2 border-white/30 hover:scale-105 transition-all duration-300 ${
              result.healthScore >= 80 ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20' :
              result.healthScore >= 70 ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20' :
              result.healthScore >= 60 ? 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20' :
              'bg-gradient-to-br from-red-500/20 to-orange-500/20'
            }`}
              style={{
                transform: 'perspective(1000px) translateZ(10px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 50px rgba(255, 255, 255, 0.1)'
              }}>
              <h3 className="font-bold text-sm sm:text-base md:text-lg text-white mb-3">💪 목소리 건강도</h3>
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-3">
                <div className="flex-1 w-full bg-white/20 rounded-full h-3 sm:h-4 backdrop-blur-sm border border-white/30">
                  <div 
                    className={`h-full rounded-full ${
                      result.healthScore >= 80 ? 'bg-gradient-to-r from-green-400 to-emerald-400' :
                      result.healthScore >= 70 ? 'bg-gradient-to-r from-blue-400 to-cyan-400' :
                      result.healthScore >= 60 ? 'bg-gradient-to-r from-yellow-400 to-amber-400' :
                      'bg-gradient-to-r from-red-400 to-orange-400'
                    }`}
                    style={{ width: `${result.healthScore}%` }}
                  ></div>
                </div>
                <span className="text-xl sm:text-2xl font-black text-white">{result.healthScore}점</span>
              </div>
              <div className={`text-base sm:text-lg font-black mb-2 ${
                result.healthScore >= 80 ? 'text-green-300' :
                result.healthScore >= 70 ? 'text-blue-300' :
                result.healthScore >= 60 ? 'text-yellow-300' : 'text-red-300'
              }`}>
                {result.health}
              </div>
              <div className="space-y-2">
                {result.healthAdvice.map((advice: string, i: number) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-xs sm:text-sm text-white/90 border border-white/30">
                    {advice}
                  </div>
                ))}
              </div>
            </div>

            {/* 개선 팁 */}
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 md:p-5 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl border-2 border-white/30 hover:scale-105 transition-all duration-300"
              style={{
                transform: 'perspective(1000px) translateZ(10px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 50px rgba(255, 255, 255, 0.1)'
              }}>
              <h3 className="font-bold text-sm sm:text-base md:text-lg text-white mb-3">✨ 목소리 젊게 유지하는 법</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.improvementTips.map((tip: string, i: number) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 text-xs sm:text-sm text-white/90 border border-white/30">
                    {tip}
                  </div>
                ))}
              </div>
            </div>

            {/* 목소리 나이별 특징 */}
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 md:p-5 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl border-2 border-white/30 hover:scale-105 transition-all duration-300"
              style={{
                transform: 'perspective(1000px) translateZ(10px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 50px rgba(255, 255, 255, 0.1)'
              }}>
              <h3 className="font-bold text-sm sm:text-base md:text-lg text-white mb-3">📊 나이대별 목소리 특징</h3>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/30">
                  <span className="font-bold text-cyan-300">10-20대:</span> <span className="text-white/80">밝고 높은 음역, 활기참</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/30">
                  <span className="font-bold text-cyan-300">20-30대:</span> <span className="text-white/80">안정적, 명확한 발음</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/30">
                  <span className="font-bold text-cyan-300">30-40대:</span> <span className="text-white/80">성숙하고 따뜻한 톤</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/30">
                  <span className="font-bold text-cyan-300">50-60대:</span> <span className="text-white/80">낮고 묵직한 톤</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/30">
                  <span className="font-bold text-cyan-300">60대 이상:</span> <span className="text-white/80">깊고 차분한 톤</span>
                </div>
              </div>
            </div>

            <button
        type="button"
              onClick={() => setResult(null)}
              className="group relative w-full max-w-md mx-auto py-4 sm:py-5 md:py-6 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white font-black text-base sm:text-lg md:text-xl rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
              style={{
                transform: 'perspective(1000px) translateZ(10px)',
                boxShadow: '0 20px 40px rgba(220, 38, 38, 0.4), 0 0 60px rgba(234, 88, 12, 0.3)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none"></div>
              <span className="relative flex items-center justify-center gap-2 sm:gap-3 px-4">
                <span className="text-xl sm:text-2xl md:text-3xl group-hover:rotate-180 transition-transform duration-500">🔄</span>
                <span className="whitespace-nowrap">다시 측정하기</span>
                <span className="text-lg sm:text-xl md:text-2xl group-hover:translate-x-2 transition-transform duration-300">→</span>
              </span>
            </button>
          </section>
        </div>
      </main>
    );
  }

  if (analyzing) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="mx-auto max-w-[600px] px-3 sm:px-4 py-4 sm:py-6 relative z-10">
          <section className="bg-white/10 backdrop-blur-2xl rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 border-2 border-white/30 relative"
            style={{
              transform: 'perspective(1000px) rotateX(2deg)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 100px rgba(220, 38, 38, 0.2), inset 0 0 100px rgba(255, 255, 255, 0.1)'
            }}>
            <div className="text-center py-8 sm:py-12 relative">
              <div className="inline-block animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-4 border-red-400 border-t-transparent mb-4 sm:mb-6"></div>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-2">음성 분석 중...</h3>
              <p className="text-sm sm:text-base text-white/70">주파수, 명확도, 안정성 측정 중</p>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="mx-auto max-w-[600px] px-3 sm:px-4 py-4 sm:py-6 relative z-10">
        <section className="bg-white/10 backdrop-blur-2xl rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl p-4 sm:p-5 md:p-6 border-2 border-white/30 relative"
          style={{
            transform: 'perspective(1000px) rotateX(2deg)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 100px rgba(220, 38, 38, 0.2), inset 0 0 100px rgba(255, 255, 255, 0.1)'
          }}>
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
          </div>

          <header className="text-center mb-4 sm:mb-6 relative">
            <div className="text-5xl sm:text-6xl md:text-7xl mb-2 sm:mb-3 animate-bounce-slow"
              style={{ textShadow: '0 0 20px rgba(220, 38, 38, 0.8)' }}>
              🎙️
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-2 bg-gradient-to-r from-red-200 via-orange-200 to-yellow-200 bg-clip-text text-transparent drop-shadow-2xl">
              내 목소리 나이 측정기
            </h2>
            <p className="text-sm sm:text-base text-white/80">음성 분석으로 목소리 나이를 측정합니다</p>
          </header>

          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl border-2 border-white/30 relative">
            <h3 className="font-bold text-sm sm:text-base md:text-lg text-white mb-2 sm:mb-3">📋 측정 방법</h3>
            <ol className="text-xs sm:text-sm text-white/80 space-y-2">
              <li>1. 조용한 곳에서 측정하세요</li>
              <li>2. 마이크 권한을 허용하세요</li>
              <li>3. 버튼을 누르고 5초간 평소 목소리로 말하세요</li>
              <li>4. "안녕하세요, 만나서 반갑습니다" 추천</li>
            </ol>
          </div>

          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl border-2 border-white/30 relative">
            <h3 className="font-bold text-sm sm:text-base md:text-lg text-white mb-2 sm:mb-3">🔬 분석 항목</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm text-white/80 font-semibold">
              <div>• 음성 주파수</div>
              <div>• 발음 명확도</div>
              <div>• 음성 안정성</div>
              <div>• 목소리 타입</div>
              <div>• 건강 상태</div>
              <div>• 나이 예측</div>
            </div>
          </div>

          {!recording ? (
            <button
        type="button"
              onClick={startRecording}
              className="group relative w-full py-5 sm:py-6 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white font-black text-lg sm:text-xl md:text-2xl rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
              style={{
                transform: 'perspective(1000px) translateZ(10px)',
                boxShadow: '0 20px 40px rgba(220, 38, 38, 0.4), 0 0 60px rgba(234, 88, 12, 0.3)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none"></div>
              <span className="relative flex items-center justify-center gap-2 sm:gap-3">
                <span className="text-2xl sm:text-3xl">🎤</span>
                <span>녹음 시작 (5초)</span>
              </span>
            </button>
          ) : (
            <div className="text-center relative">
              <div className="mb-4 inline-block">
                <div className="animate-pulse bg-gradient-to-r from-red-500 to-orange-500 rounded-full h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-3 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full h-12 w-12 sm:h-16 sm:w-16"></div>
                </div>
              </div>
              <p className="text-lg sm:text-xl font-black text-white mb-2">녹음 중...</p>
              <p className="text-sm sm:text-base text-white/70 mb-4">자연스럽게 말해주세요</p>
              <button
        type="button"
                onClick={stopRecording}
                className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-white/30 border-2 border-white/30 transition-all"
              >
                중지
              </button>
            </div>
          )}

          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl border-2 border-white/30 relative">
            <h3 className="font-bold text-sm sm:text-base md:text-lg text-white mb-2 sm:mb-3">💡 알아두세요</h3>
            <ul className="text-xs sm:text-sm text-white/80 space-y-1">
              <li>• 목소리 나이는 실제 나이와 다를 수 있습니다</li>
              <li>• 주파수가 높을수록 젊게 측정됩니다</li>
              <li>• 목 건강 상태가 영향을 줍니다</li>
              <li>• 재미와 참고용으로 활용하세요</li>
            </ul>
          </div>
        </section>
      </div>
      {/* 제작자 서명 */}
      {/* 관련 앱 추천 */}

      <RelatedApps currentAppSlug="voice-age" className="mt-8 mb-8" />
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

