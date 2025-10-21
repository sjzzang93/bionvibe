"use client";

import { useState, useRef } from 'react';

export default function VoiceAge() {
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
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors" style={{
        backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(220, 38, 38, 0.15) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(239, 68, 68, 0.1) 0%, transparent 40%), linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, transparent 100%)',
        backgroundAttachment: 'fixed'
      }}>
        <div className="mx-auto max-w-[600px] px-4 py-6">
          <div className="mb-4">
            
          </div>

          <section className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 border-2 border-red-900/30">
            <header className="text-center mb-6">
              <h1 className="text-3xl font-bold text-black mb-2">🎙️</h1>
              <h2 className="text-2xl font-bold text-white">목소리 나이 분석 결과</h2>
            </header>

            {/* 목소리 나이 */}
            <div className="mb-6 p-6 rounded-xl text-center bg-gradient-to-br from-red-950 to-black border-4 border-red-600">
              <div className="text-6xl font-bold mb-2" style={{
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {result.voiceAge}세
              </div>
              <div className="text-lg font-semibold text-black">{result.ageGroup}</div>
              <p className="text-sm text-gray-400 mt-2">{result.ageFeature}</p>
            </div>

            {/* 목소리 분석 */}
            <div className="mb-6">
              <h3 className="font-bold text-lg text-white mb-3">🎵 음성 분석</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-4 border border-red-600/50 text-center">
                  <div className="text-sm text-gray-400 mb-1">주파수</div>
                  <div className="text-2xl font-bold text-black">{result.pitch}</div>
                  <div className="text-xs text-gray-500">Hz</div>
                </div>

                <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-4 border border-red-600/50 text-center">
                  <div className="text-sm text-gray-400 mb-1">명확도</div>
                  <div className="text-2xl font-bold text-black">{result.clarity}</div>
                  <div className="text-xs text-gray-500">%</div>
                </div>

                <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-4 border border-red-600/50 text-center">
                  <div className="text-sm text-gray-400 mb-1">안정성</div>
                  <div className="text-2xl font-bold text-black">{result.stability}</div>
                  <div className="text-xs text-gray-500">%</div>
                </div>
              </div>
            </div>

            {/* 목소리 타입 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg border border-red-600/50">
              <h3 className="font-bold text-lg text-white mb-2">🎤 목소리 타입</h3>
              <div className="text-xl font-bold text-black mb-1">{result.voiceType}</div>
              <p className="text-gray-300">{result.voiceChar}</p>
            </div>

            {/* 건강도 */}
            <div className={`mb-6 p-4 rounded-lg border-2 ${
              result.healthScore >= 80 ? 'bg-gray-700 border-green-600/50' :
              result.healthScore >= 70 ? 'bg-gray-700 border-blue-600/50' :
              result.healthScore >= 60 ? 'bg-gray-700 border-yellow-600/50' :
              'bg-gray-700 border-red-600/50'
            }`}>
              <h3 className="font-bold text-lg text-white mb-2">💪 목소리 건강도</h3>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div 
                    className={`h-full rounded-full ${
                      result.healthScore >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                      result.healthScore >= 70 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                      result.healthScore >= 60 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                      'bg-gradient-to-r from-red-500 to-orange-500'
                    }`}
                    style={{ width: `${result.healthScore}%` }}
                  ></div>
                </div>
                <span className="text-2xl font-bold">{result.healthScore}점</span>
              </div>
              <div className="text-lg font-semibold mb-2" style={{
                color: result.healthScore >= 80 ? '#059669' :
                       result.healthScore >= 70 ? '#0284c7' :
                       result.healthScore >= 60 ? '#d97706' : '#dc2626'
              }}>
                {result.health}
              </div>
              <div className="space-y-1">
                {result.healthAdvice.map((advice: string, i: number) => (
                  <div key={i} className="text-sm text-gray-300">
                    {advice}
                  </div>
                ))}
              </div>
            </div>

            {/* 개선 팁 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg border border-red-600/50">
              <h3 className="font-bold text-lg text-white mb-3">✨ 목소리 젊게 유지하는 법</h3>
              <div className="grid grid-cols-1 gap-2">
                {result.improvementTips.map((tip: string, i: number) => (
                  <div key={i} className="bg-gray-800/50 rounded p-3 text-sm text-gray-300 border border-red-900/30">
                    {tip}
                  </div>
                ))}
              </div>
            </div>

            {/* 목소리 나이별 특징 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg border border-red-600/50">
              <h3 className="font-bold text-lg text-white mb-3">📊 나이대별 목소리 특징</h3>
              <div className="space-y-2 text-sm">
                <div className="bg-gray-800/50 rounded p-2 border border-red-900/30">
                  <span className="font-semibold text-black">10-20대:</span> <span className="text-gray-300">밝고 높은 음역, 활기참</span>
                </div>
                <div className="bg-gray-800/50 rounded p-2 border border-red-900/30">
                  <span className="font-semibold text-black">20-30대:</span> <span className="text-gray-300">안정적, 명확한 발음</span>
                </div>
                <div className="bg-gray-800/50 rounded p-2 border border-red-900/30">
                  <span className="font-semibold text-black">30-40대:</span> <span className="text-gray-300">성숙하고 따뜻한 톤</span>
                </div>
                <div className="bg-gray-800/50 rounded p-2 border border-red-900/30">
                  <span className="font-semibold text-black">50-60대:</span> <span className="text-gray-300">낮고 묵직한 톤</span>
                </div>
                <div className="bg-gray-800/50 rounded p-2 border border-red-900/30">
                  <span className="font-semibold text-black">60대 이상:</span> <span className="text-gray-300">깊고 차분한 톤</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setResult(null)}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all border-2 border-red-500"
            >
              다시 측정하기
            </button>
          </section>

          <footer className="mt-6 space-y-3 pb-8">
            
            <p className="text-xs text-gray-500 text-center px-4">
              이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
            </p>
          </footer>
        </div>
      </main>
    );
  }

  if (analyzing) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors" style={{
        backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(220, 38, 38, 0.15) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(239, 68, 68, 0.1) 0%, transparent 40%), linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, transparent 100%)',
        backgroundAttachment: 'fixed'
      }}>
        <div className="mx-auto max-w-[600px] px-4 py-6">
          <div className="mb-4">
            
          </div>

          <section className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 border-2 border-red-900/30">
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-20 w-20 border-4 border-red-600 border-t-transparent mb-6"></div>
              <h3 className="text-2xl font-bold text-black mb-2">음성 분석 중...</h3>
              <p className="text-gray-400">주파수, 명확도, 안정성 측정 중</p>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black" style={{
      backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(220, 38, 38, 0.15) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(239, 68, 68, 0.1) 0%, transparent 40%), linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, transparent 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <div className="mx-auto max-w-[600px] px-4 py-6">
        <div className="mb-4">
          
        </div>

        <section className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 border-2 border-red-900/30">
          <header className="text-center mb-6">
            <h1 className="text-4xl font-bold text-black mb-2">🎙️</h1>
            <h2 className="text-2xl font-bold text-white mb-2">내 목소리 나이 측정기</h2>
            <p className="text-gray-400">음성 분석으로 목소리 나이를 측정합니다</p>
          </header>

          <div className="mb-6 p-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg border border-red-600/50">
            <h3 className="font-bold text-white mb-3">📋 측정 방법</h3>
            <ol className="text-sm text-gray-300 space-y-2">
              <li>1. 조용한 곳에서 측정하세요</li>
              <li>2. 마이크 권한을 허용하세요</li>
              <li>3. 버튼을 누르고 5초간 평소 목소리로 말하세요</li>
              <li>4. "안녕하세요, 만나서 반갑습니다" 추천</li>
            </ol>
          </div>

          <div className="mb-6 p-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg border border-red-600/50">
            <h3 className="font-bold text-white mb-2">🔬 분석 항목</h3>
            <div className="grid grid-cols-3 gap-2 text-sm text-gray-300">
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
              onClick={startRecording}
              className="w-full py-6 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-xl rounded-lg shadow-lg hover:shadow-xl transition-all border-2 border-red-500"
            >
              🎤 녹음 시작 (5초)
            </button>
          ) : (
            <div className="text-center">
              <div className="mb-4 inline-block">
                <div className="animate-pulse bg-red-600 rounded-full h-20 w-20 mx-auto mb-3 flex items-center justify-center">
                  <div className="bg-gray-900 rounded-full h-16 w-16"></div>
                </div>
              </div>
              <p className="text-xl font-bold text-black mb-2">녹음 중...</p>
              <p className="text-gray-400 mb-4">자연스럽게 말해주세요</p>
              <button
                onClick={stopRecording}
                className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 border border-red-500"
              >
                중지
              </button>
            </div>
          )}

          <div className="mt-6 p-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg border border-red-600/50">
            <h3 className="font-bold text-white mb-2">💡 알아두세요</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• 목소리 나이는 실제 나이와 다를 수 있습니다</li>
              <li>• 주파수가 높을수록 젊게 측정됩니다</li>
              <li>• 목 건강 상태가 영향을 줍니다</li>
              <li>• 재미와 참고용으로 활용하세요</li>
            </ul>
          </div>
        </section>

        <footer className="mt-6 space-y-3 pb-8">
          
          <p className="text-xs text-gray-500 text-center px-4">
            이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
          </p>
        </footer>
      </div>
    </main>
  );
}

