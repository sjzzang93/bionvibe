'use client';

import { useState } from 'react';
import PremiumLayout from '@/app/components/ui/PremiumLayout';
import PremiumCard from '@/app/components/ui/PremiumCard';
import PremiumHeader from '@/app/components/ui/PremiumHeader';
import PremiumButton from '@/app/components/ui/PremiumButton';
import RelatedApps from '@/app/components/RelatedApps';
import { SUPPLEMENT_DATA } from '@/lib/group2-data';

export default function HealthSupplementRecommend() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [result, setResult] = useState<any[]>([]);
  const [showResult, setShowResult] = useState(false);

  const symptoms = SUPPLEMENT_DATA.symptomMatching.slice(0, 12); // 상위 12개만 표시

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const generateRecommendation = () => {
    if (selectedSymptoms.length === 0) {
      alert('증상을 최소 1개 이상 선택해주세요!');
      return;
    }

    // 선택된 증상에 맞는 영양제 추천
    const recommendations = selectedSymptoms.map(symptom => {
      return SUPPLEMENT_DATA.symptomMatching.find(s => s.symptom === symptom);
    }).filter(Boolean);

    setResult(recommendations);
    setShowResult(true);
  };

  const reset = () => {
    setSelectedSymptoms([]);
    setResult([]);
    setShowResult(false);
  };

  // 심각도별 색상
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case '경미': return 'bg-green-500';
      case '보통': return 'bg-yellow-500';
      case '심각': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // 우선순위별 색상
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case '필수': return 'bg-red-500';
      case '권장': return 'bg-orange-500';
      case '선택': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <PremiumLayout theme="purple">
      <div className="py-8 px-2 sm:px-4 md:py-12">
        <div className="max-w-6xl mx-auto">
          <PremiumHeader 
            icon="💊"
            title="영양제 추천"
            subtitle="증상과 생활습관에 맞는 맞춤형 영양제 추천"
            gradient="from-purple-200 via-pink-200 to-rose-200"
          />

          {!showResult ? (
            <PremiumCard gradient className="animate-slideUp">
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-bold text-2xl mb-4 text-center">
                    💊 현재 겪고 있는 증상을 선택하세요
                  </h3>
                  <p className="text-white/80 text-center mb-6">
                    여러 개 선택 가능합니다 (최대 5개 권장)
                  </p>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  {symptoms.map((symptomData) => (
                    <button
        type="button"
                      key={symptomData.symptom}
                      onClick={() => toggleSymptom(symptomData.symptom)}
                      disabled={selectedSymptoms.length >= 5 && !selectedSymptoms.includes(symptomData.symptom)}
                      className={`p-2 md:p-4 rounded-xl font-bold transition-all text-sm ${
                        selectedSymptoms.includes(symptomData.symptom)
                          ? 'bg-white text-purple-600 scale-105 shadow-xl'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <div className="text-2xl mb-2">
                        {symptomData.severity === '경미' ? '🟢' : 
                         symptomData.severity === '보통' ? '🟡' : '🔴'}
                      </div>
                      <div>{symptomData.symptom}</div>
                      <div className="text-xs mt-1 opacity-70">{symptomData.severity}</div>
                    </button>
                  ))}
                </div>

                {selectedSymptoms.length > 0 && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 sm:p-3 md:p-4 border border-white/30">
                    <h4 className="text-white font-bold mb-2">선택된 증상 ({selectedSymptoms.length}/5)</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSymptoms.map((symptom) => (
                        <span 
                          key={symptom}
                          className="px-3 py-1 bg-white text-purple-600 rounded-full text-sm font-bold flex items-center gap-2"
                        >
                          {symptom}
                          <button
        type="button"
                            onClick={() => toggleSymptom(symptom)}
                            className="hover:text-red-600 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <PremiumButton
                  onClick={generateRecommendation}
                  variant="success"
                  size="lg"
                  icon="💊"
                  fullWidth
                  disabled={selectedSymptoms.length === 0}
                >
                  맞춤 영양제 추천받기
                </PremiumButton>
              </div>
            </PremiumCard>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-2">🎯 맞춤 영양제 추천</h2>
                <p className="text-white/80">선택하신 증상에 맞는 영양제입니다</p>
              </div>

              {result.map((symptomData, idx) => (
                <PremiumCard 
                  key={idx} 
                  hover 
                  className="animate-fadeIn" 
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="space-y-6">
                    {/* 증상 헤더 */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-bold text-2xl mb-2">
                          {symptomData.symptom}
                        </h3>
                        <span className={`${getSeverityColor(symptomData.severity)} text-white px-4 py-1 rounded-full text-sm font-bold`}>
                          {symptomData.severity}
                        </span>
                      </div>
                    </div>

                    {/* 연관 증상 */}
                    {symptomData.relatedSymptoms && symptomData.relatedSymptoms.length > 0 && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 sm:p-3 md:p-4 border border-white/20">
                        <h4 className="text-white font-bold mb-2">🔗 연관 증상</h4>
                        <div className="flex flex-wrap gap-2">
                          {symptomData.relatedSymptoms.map((related: string, i: number) => (
                            <span key={i} className="text-white/80 text-sm">{related}</span>
                          )).reduce((prev: any, curr: any) => [prev, ' • ', curr])}
                        </div>
                      </div>
                    )}

                    {/* 추천 영양제 */}
                    <div>
                      <h4 className="text-white font-bold text-xl mb-4">💊 추천 영양제</h4>
                      <div className="space-y-4">
                        {symptomData.recommendedSupplements.map((supp: any, suppIdx: number) => (
                          <div 
                            key={suppIdx}
                            className="bg-white/10 backdrop-blur-sm rounded-xl p-2 sm:p-3 md:p-4 border border-white/20"
                          >
                            <div className="flex items-start justify-between mb-0.5 sm:mb-1.5 md:mb-2">
                              <div className="flex-1">
                                <h5 className="text-white font-bold text-[10px] sm:text-xs md:text-sm mb-2">{supp.name}</h5>
                                <div className="flex gap-2 flex-wrap">
                                  <span className={`${getPriorityColor(supp.priority)} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                                    {supp.priority}
                                  </span>
                                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                    {supp.duration}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-0.5 sm:mb-1.5 md:mb-2">
                              <div>
                                <p className="text-white/70 text-sm mb-1">💊 복용량</p>
                                <p className="text-white font-bold">{supp.dosage}</p>
                              </div>
                              <div>
                                <p className="text-white/70 text-sm mb-1">⏰ 복용 시간</p>
                                <p className="text-white font-bold">{supp.timing}</p>
                              </div>
                            </div>

                            <div className="bg-green-500/20 rounded-lg p-2 sm:p-3 mb-0.5 sm:mb-1.5 md:mb-2 border border-green-400/30">
                              <p className="text-white/90 text-sm">
                                <span className="font-bold">✨ 기대 효과:</span> {supp.expectedEffect}
                              </p>
                            </div>

                            {supp.caution && supp.caution.length > 0 && (
                              <div className="bg-red-500/20 rounded-lg p-2 sm:p-3 border border-red-400/30">
                                <p className="text-white font-bold text-sm mb-2">⚠️ 주의사항</p>
                                <ul className="space-y-1">
                                  {supp.caution.map((caution: string, cIdx: number) => (
                                    <li key={cIdx} className="text-white/80 text-xs flex items-start gap-2">
                                      <span>•</span>
                                      <span>{caution}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 생활습관 조언 */}
                    {symptomData.lifestyleAdvice && symptomData.lifestyleAdvice.length > 0 && (
                      <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl p-2 sm:p-3 md:p-4 border border-blue-400/30">
                        <h4 className="text-white font-bold mb-0.5 sm:mb-1.5 md:mb-2">💡 생활습관 개선 팁</h4>
                        <ul className="space-y-2">
                          {symptomData.lifestyleAdvice.map((advice: string, aIdx: number) => (
                            <li key={aIdx} className="text-white/90 text-sm flex items-start gap-2">
                              <span className="text-blue-300">✓</span>
                              <span>{advice}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </PremiumCard>
              ))}

              {/* 주의사항 */}
              <PremiumCard className="bg-yellow-500/20 border-2 border-yellow-400/30">
                <h4 className="text-white font-bold text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1.5 md:mb-2">⚠️ 중요 안내사항</h4>
                <ul className="space-y-2 text-white/90 text-sm">
                  <li>• 이 추천은 일반적인 정보 제공 목적이며 의학적 조언이 아닙니다</li>
                  <li>• 기저질환이 있거나 약물을 복용 중인 경우 반드시 전문의와 상담하세요</li>
                  <li>• 임신·수유 중이거나 계획 중인 경우 복용 전 의사와 상담하세요</li>
                  <li>• 권장 복용량을 초과하지 마세요</li>
                  <li>• 알레르기 반응이 있다면 즉시 중단하고 의사와 상담하세요</li>
                </ul>
              </PremiumCard>

              <PremiumButton
                onClick={reset}
                variant="secondary"
                size="lg"
                icon="🔄"
                fullWidth
              >
                다시 진단받기
              </PremiumButton>
            </div>
          )}

          {/* Related Apps */}
          <div className="mt-12 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <RelatedApps currentAppSlug="health-supplement-recommend" className="mt-8" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }
      `}</style>
    </PremiumLayout>
  );
}

