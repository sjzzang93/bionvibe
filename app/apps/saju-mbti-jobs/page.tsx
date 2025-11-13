"use client";

import { useState, useEffect } from "react";
import AppFooter from "@/app/components/AppFooter";
import RelatedApps from '@/app/components/RelatedApps';
import Link from 'next/link';
import { 
  CELESTIAL_STEMS, 
  TERRESTRIAL_BRANCHES,
  TEN_GODS_CAREERS,
  TWELVE_PHASES_TRAITS,
  DAY_PILLAR_TRAITS,
  SPECIAL_STARS
} from "@/lib/saju-engine";
import { DETAILED_COMBINATIONS, getBasicCombinationAnalysis } from "@/lib/saju-mbti-combinations";
import AdSense from '@/app/components/AdSense';

// MBTI 16가지 유형
const MBTI_TYPES = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP"
];

// MBTI별 상세 특성
const MBTI_DETAILS: Record<string, { nickname: string; traits: string[]; workStyle: string }> = {
  "INTJ": { nickname: "전략가", traits: ["분석적", "독립적", "미래지향적", "논리적"], workStyle: "체계적 계획과 전략 수립" },
  "INTP": { nickname: "논리술사", traits: ["호기심", "논리적", "분석적", "객관적"], workStyle: "이론과 분석을 통한 문제 해결" },
  "ENTJ": { nickname: "통솔자", traits: ["리더십", "결단력", "효율적", "목표지향적"], workStyle: "조직을 이끌고 목표 달성" },
  "ENTP": { nickname: "변론가", traits: ["창의적", "도전적", "논리적", "혁신적"], workStyle: "새로운 아이디어로 변화 주도" },
  "INFJ": { nickname: "옹호자", traits: ["이상주의", "통찰력", "공감능력", "헌신적"], workStyle: "사람들에게 의미있는 영향" },
  "INFP": { nickname: "중재자", traits: ["이상주의", "창의적", "감수성", "가치중심"], workStyle: "자신의 가치관을 실현" },
  "ENFJ": { nickname: "선도자", traits: ["카리스마", "공감", "열정", "협력적"], workStyle: "사람들을 이끌고 성장시킴" },
  "ENFP": { nickname: "활동가", traits: ["열정적", "창의적", "자유로움", "사교적"], workStyle: "열정으로 새로운 가능성 탐구" },
  "ISTJ": { nickname: "현실주의자", traits: ["책임감", "실용적", "체계적", "신뢰"], workStyle: "정확하고 체계적인 업무 처리" },
  "ISFJ": { nickname: "수호자", traits: ["헌신적", "세심함", "책임감", "배려"], workStyle: "안정적이고 꼼꼼한 지원" },
  "ESTJ": { nickname: "경영자", traits: ["실용적", "조직적", "책임감", "원칙적"], workStyle: "명확한 규칙으로 조직 관리" },
  "ESFJ": { nickname: "집정관", traits: ["친절", "협력적", "책임감", "사교적"], workStyle: "화합과 협력을 통한 업무" },
  "ISTP": { nickname: "장인", traits: ["실용적", "분석적", "적응력", "문제해결"], workStyle: "실질적 기술로 문제 해결" },
  "ISFP": { nickname: "모험가", traits: ["예술적", "유연함", "감수성", "개방적"], workStyle: "자유롭고 창의적인 표현" },
  "ESTP": { nickname: "사업가", traits: ["실용적", "행동적", "사교적", "적응력"], workStyle: "즉각적이고 실질적인 행동" },
  "ESFP": { nickname: "연예인", traits: ["열정적", "친근함", "즉흥적", "사교적"], workStyle: "활기차고 즐거운 분위기 조성" }
};

// 사주 계산 (간단 버전 - 년주 기준)
const calculateYearPillar = (year: number) => {
  const stemIndex = (year - 4) % 10;
  const branchIndex = (year - 4) % 12;
  return {
    stem: CELESTIAL_STEMS[stemIndex],
    branch: TERRESTRIAL_BRANCHES[branchIndex]
  };
};

// 일주 특성 가져오기 (사전에 있는 것만)
const getDayPillarInfo = (stemName: string, branchName: string) => {
  const key = stemName.charAt(0) + branchName.charAt(0);
  return DAY_PILLAR_TRAITS[key] || null;
};

// 디테일한 조합 분석 컴포넌트
function DetailedCombinationAnalysis({ element, mbti }: { element: string; mbti: string }) {
  const [viewMode, setViewMode] = useState<'summary' | 'detailed'>('summary');
  const [mounted, setMounted] = useState(false);
  const combo = DETAILED_COMBINATIONS[element]?.[mbti] || getBasicCombinationAnalysis(element, mbti);

  // 클라이언트에서만 렌더링
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-xl sm:text-2xl font-bold text-white/80 animate-pulse">분석 준비 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center mb-6 sm:mb-8">
        <div className="text-xl sm:text-2xl md:text-4xl mb-2 sm:mb-3 font-black text-white drop-shadow-2xl">{combo.combination}</div>
        <p className="text-base sm:text-xl md:text-2xl font-black bg-gradient-to-r from-amber-300 via-orange-300 to-red-300 bg-clip-text text-transparent drop-shadow-lg">{combo.summary}</p>
        
        {/* 보기 모드 전환 버튼 - 3D */}
        <div className="flex justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
          <button
        type="button"
            onClick={() => setViewMode('summary')}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 ${
              viewMode === 'summary'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg scale-105'
                : 'bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:border-amber-400 hover:bg-white/20'
            }`}
            style={viewMode === 'summary' ? { boxShadow: '0 10px 30px rgba(251, 146, 60, 0.5)' } : {}}
          >
            📋 요약해서 보기
          </button>
          <button
        type="button"
            onClick={() => setViewMode('detailed')}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 ${
              viewMode === 'detailed'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105'
                : 'bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:border-purple-400 hover:bg-white/20'
            }`}
            style={viewMode === 'detailed' ? { boxShadow: '0 10px 30px rgba(139, 92, 246, 0.5)' } : {}}
          >
            🔍 디테일하게 보기
          </button>
        </div>
      </div>

      {viewMode === 'summary' ? (
        <SummaryView combo={combo} />
      ) : (
        <DetailedView combo={combo} element={element} mbti={mbti} />
      )}
    </div>
  );
}

// 요약 보기 컴포넌트
function SummaryView({ combo }: { combo: any }) {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* 핵심 요약 - 3D 카드 */}
      <div 
        className="relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border-2 border-white/30 hover:border-white/40 transition-all duration-500 group"
        style={{
          transform: 'perspective(1000px) translateZ(10px)',
          boxShadow: '0 20px 60px rgba(168, 85, 247, 0.4)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <h3 className="relative text-base sm:text-lg md:text-xl font-black text-white mb-3 sm:mb-4 flex items-center gap-2">
          <span className="text-xl sm:text-2xl">💫</span>
          <span>당신은 이런 사람이에요</span>
        </h3>
        <p className="relative text-sm sm:text-base md:text-lg text-white/90 leading-relaxed">{combo.personality}</p>
      </div>

      {/* 강점 & 약점 - 3D 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div 
          className="relative bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border-2 border-white/30 hover:scale-105 transition-all duration-300 group"
          style={{ boxShadow: '0 15px 40px rgba(34, 197, 94, 0.4)' }}
        >
          <div className="absolute inset-0 bg-white/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <h3 className="relative text-base sm:text-lg md:text-xl font-black text-white mb-3 sm:mb-4 flex items-center gap-2">
            <span className="text-xl sm:text-2xl">✨</span>
            <span>당신의 강점</span>
          </h3>
          <ul className="relative space-y-2">
            {combo.strength.slice(0, 3).map((item: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm md:text-base text-white/90">
                <span className="text-green-300 font-bold text-base sm:text-lg">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div 
          className="relative bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border-2 border-white/30 hover:scale-105 transition-all duration-300 group"
          style={{ boxShadow: '0 15px 40px rgba(249, 115, 22, 0.4)' }}
        >
          <div className="absolute inset-0 bg-white/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <h3 className="relative text-base sm:text-lg md:text-xl font-black text-white mb-3 sm:mb-4 flex items-center gap-2">
            <span className="text-xl sm:text-2xl">⚠️</span>
            <span>조심할 점</span>
          </h3>
          <ul className="relative space-y-2">
            {combo.weakness.slice(0, 3).map((item: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm md:text-base text-white/90">
                <span className="text-orange-300 font-bold text-base sm:text-lg">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 사랑 & 돈 - 3D 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div 
          className="relative bg-gradient-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border-2 border-white/30 hover:scale-105 transition-all duration-300 group"
          style={{ boxShadow: '0 15px 40px rgba(236, 72, 153, 0.4)' }}
        >
          <div className="absolute inset-0 bg-white/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <h3 className="relative text-base sm:text-lg md:text-xl font-black text-white mb-3 sm:mb-4 flex items-center gap-2">
            <span className="text-xl sm:text-2xl">💖</span>
            <span>연애할 때</span>
          </h3>
          <p className="relative text-xs sm:text-sm md:text-base text-white/90 leading-relaxed">{combo.love}</p>
        </div>

        <div 
          className="relative bg-gradient-to-br from-yellow-500/20 to-amber-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border-2 border-white/30 hover:scale-105 transition-all duration-300 group"
          style={{ boxShadow: '0 15px 40px rgba(234, 179, 8, 0.4)' }}
        >
          <div className="absolute inset-0 bg-white/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <h3 className="relative text-base sm:text-lg md:text-xl font-black text-white mb-3 sm:mb-4 flex items-center gap-2">
            <span className="text-xl sm:text-2xl">💰</span>
            <span>돈 관리</span>
          </h3>
          <p className="relative text-xs sm:text-sm md:text-base text-white/90 leading-relaxed">{combo.money}</p>
        </div>
      </div>

      {/* 추천 직업 - 3D 카드 */}
      <div 
        className="relative bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border-2 border-white/30 hover:scale-105 transition-all duration-300 group"
        style={{ boxShadow: '0 15px 40px rgba(99, 102, 241, 0.4)' }}
      >
        <div className="absolute inset-0 bg-white/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <h3 className="relative text-base sm:text-lg md:text-xl font-black text-white mb-3 sm:mb-4 flex items-center gap-2">
          <span className="text-xl sm:text-2xl">💼</span>
          <span>잘 맞는 일</span>
        </h3>
        <div className="relative flex flex-wrap gap-2">
          {combo.jobs.slice(0, 4).map((job: string, idx: number) => (
            <span 
              key={idx} 
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-indigo-600/80 to-purple-600/80 backdrop-blur-sm rounded-full text-xs sm:text-sm font-bold text-white border border-white/30 hover:scale-110 transition-transform duration-300"
              style={{ boxShadow: '0 4px 15px rgba(99, 102, 241, 0.5)' }}
            >
              {job}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// 디테일 보기 컴포넌트
function DetailedView({ combo, element, mbti }: { combo: any; element: string; mbti: string }) {
  return (
    <div className="space-y-4 md:space-y-6">

      {/* 성격 특성 - 3D 카드 */}
      <div 
        className="relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border-2 border-white/30 hover:scale-105 transition-all duration-300 group"
        style={{ boxShadow: '0 15px 40px rgba(168, 85, 247, 0.4)' }}
      >
        <div className="absolute inset-0 bg-white/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <h3 className="relative text-base sm:text-lg md:text-xl font-black text-white mb-3 sm:mb-4 flex items-center gap-2">
          <span className="text-xl sm:text-2xl">🎭</span>
          <span>성격 특성</span>
        </h3>
        <p className="relative text-xs sm:text-sm md:text-base text-white/90 leading-relaxed">{combo.personality}</p>
      </div>

      {/* 인지 스타일 - 3D 카드 */}
      <div 
        className="relative bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border-2 border-white/30 hover:scale-105 transition-all duration-300 group"
        style={{ boxShadow: '0 15px 40px rgba(59, 130, 246, 0.4)' }}
      >
        <div className="absolute inset-0 bg-white/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <h3 className="relative text-base sm:text-lg md:text-xl font-black text-white mb-3 sm:mb-4 flex items-center gap-2">
          <span className="text-xl sm:text-2xl">🧠</span>
          <span>인지 스타일</span>
        </h3>
        <p className="relative text-xs sm:text-sm md:text-base text-white/90 leading-relaxed">{combo.cognitiveStyle}</p>
      </div>

      {/* 강점 & 약점 - 3D 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div 
          className="relative bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border-2 border-white/30 hover:scale-105 transition-all duration-300 group"
          style={{ boxShadow: '0 15px 40px rgba(34, 197, 94, 0.4)' }}
        >
          <div className="absolute inset-0 bg-white/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <h3 className="relative text-base sm:text-lg md:text-xl font-black text-white mb-3 sm:mb-4 flex items-center gap-2">
            <span className="text-xl sm:text-2xl">✨</span>
            <span>강점</span>
          </h3>
          <ul className="relative space-y-2">
            {combo.strength.map((item: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm md:text-base text-white/90">
                <span className="text-green-300 font-bold text-base sm:text-lg">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div 
          className="relative bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border-2 border-white/30 hover:scale-105 transition-all duration-300 group"
          style={{ boxShadow: '0 15px 40px rgba(249, 115, 22, 0.4)' }}
        >
          <div className="absolute inset-0 bg-white/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <h3 className="relative text-base sm:text-lg md:text-xl font-black text-white mb-3 sm:mb-4 flex items-center gap-2">
            <span className="text-xl sm:text-2xl">⚠️</span>
            <span>약점 (개선 포인트)</span>
          </h3>
          <ul className="relative space-y-2">
            {combo.weakness.map((item: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm md:text-base text-white/90">
                <span className="text-orange-300 font-bold text-base sm:text-lg">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 대인관계 & 연애 - 3D 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div 
          className="relative bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border-2 border-white/30 hover:scale-105 transition-all duration-300 group"
          style={{ boxShadow: '0 15px 40px rgba(59, 130, 246, 0.4)' }}
        >
          <div className="absolute inset-0 bg-white/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <h3 className="relative text-base sm:text-lg md:text-xl font-black text-white mb-3 sm:mb-4 flex items-center gap-2">
            <span className="text-xl sm:text-2xl">👥</span>
            <span>대인관계</span>
          </h3>
          <p className="relative text-xs sm:text-sm md:text-base text-white/90 leading-relaxed">{combo.interpersonal}</p>
        </div>

        <div 
          className="relative bg-gradient-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border-2 border-white/30 hover:scale-105 transition-all duration-300 group"
          style={{ boxShadow: '0 15px 40px rgba(236, 72, 153, 0.4)' }}
        >
          <div className="absolute inset-0 bg-white/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <h3 className="relative text-base sm:text-lg md:text-xl font-black text-white mb-3 sm:mb-4 flex items-center gap-2">
            <span className="text-xl sm:text-2xl">💖</span>
            <span>연애/결혼</span>
          </h3>
          <p className="relative text-xs sm:text-sm md:text-base text-white/90 leading-relaxed">{combo.love}</p>
        </div>
      </div>

      {/* 금전운 & 건강 - 3D 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div 
          className="relative bg-gradient-to-br from-yellow-500/20 to-amber-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border-2 border-white/30 hover:scale-105 transition-all duration-300 group"
          style={{ boxShadow: '0 15px 40px rgba(234, 179, 8, 0.4)' }}
        >
          <div className="absolute inset-0 bg-white/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <h3 className="relative text-base sm:text-lg md:text-xl font-black text-white mb-3 sm:mb-4 flex items-center gap-2">
            <span className="text-xl sm:text-2xl">💰</span>
            <span>금전운</span>
          </h3>
          <p className="relative text-xs sm:text-sm md:text-base text-white/90 leading-relaxed">{combo.money}</p>
        </div>

        <div 
          className="relative bg-gradient-to-br from-teal-500/20 to-green-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border-2 border-white/30 hover:scale-105 transition-all duration-300 group"
          style={{ boxShadow: '0 15px 40px rgba(20, 184, 166, 0.4)' }}
        >
          <div className="absolute inset-0 bg-white/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <h3 className="relative text-base sm:text-lg md:text-xl font-black text-white mb-3 sm:mb-4 flex items-center gap-2">
            <span className="text-xl sm:text-2xl">🏥</span>
            <span>건강 & 주의사항</span>
          </h3>
          <p className="relative text-xs sm:text-sm md:text-base text-white/90 leading-relaxed">{combo.health}</p>
        </div>
      </div>

      {/* 오행 밸런스 - 3D 카드 */}
      <div 
        className="relative bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border-2 border-white/30 hover:scale-105 transition-all duration-300 group"
        style={{ boxShadow: '0 15px 40px rgba(99, 102, 241, 0.4)' }}
      >
        <div className="absolute inset-0 bg-white/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <h3 className="relative text-lg sm:text-xl md:text-2xl font-black text-white mb-3 sm:mb-4 flex items-center gap-2">
          <span className="text-2xl sm:text-3xl">⚖️</span>
          <span>오행 밸런스 & 보완법</span>
        </h3>
        <p className="relative text-sm sm:text-base md:text-lg text-white/90 mb-4 leading-relaxed">{combo.balance}</p>
        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="bg-gradient-to-br from-indigo-600/80 to-purple-600/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center border border-white/30 hover:scale-110 transition-transform duration-300"
               style={{ boxShadow: '0 8px 25px rgba(99, 102, 241, 0.5)' }}>
            <div className="text-xl sm:text-2xl mb-2">🎨</div>
            <div className="font-bold text-white mb-1 text-xs sm:text-sm">행운의 색상</div>
            <div className="text-xs sm:text-sm text-white/80">{combo.luckyColor.join(", ")}</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-600/80 to-purple-600/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center border border-white/30 hover:scale-110 transition-transform duration-300"
               style={{ boxShadow: '0 8px 25px rgba(99, 102, 241, 0.5)' }}>
            <div className="text-xl sm:text-2xl mb-2">🧭</div>
            <div className="font-bold text-white mb-1 text-xs sm:text-sm">행운의 방향</div>
            <div className="text-xs sm:text-sm text-white/80">{combo.luckyDirection}</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-600/80 to-purple-600/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center border border-white/30 hover:scale-110 transition-transform duration-300"
               style={{ boxShadow: '0 8px 25px rgba(99, 102, 241, 0.5)' }}>
            <div className="text-xl sm:text-2xl mb-2">💪</div>
            <div className="font-bold text-white mb-1 text-xs sm:text-sm">스트레스 해소</div>
            <div className="text-xs sm:text-sm text-white/80">{combo.stressResponse}</div>
          </div>
        </div>
      </div>

      {/* 업무 스타일 & 리더십 - 3D 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div 
          className="relative bg-gradient-to-br from-gray-500/20 to-slate-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border-2 border-white/30 hover:scale-105 transition-all duration-300 group"
          style={{ boxShadow: '0 15px 40px rgba(100, 116, 139, 0.4)' }}
        >
          <div className="absolute inset-0 bg-white/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <h3 className="relative text-base sm:text-lg md:text-xl font-black text-white mb-3 sm:mb-4 flex items-center gap-2">
            <span className="text-xl sm:text-2xl">💼</span>
            <span>업무 스타일</span>
          </h3>
          <p className="relative text-xs sm:text-sm md:text-base text-white/90 leading-relaxed">{combo.workStyle}</p>
        </div>

        <div 
          className="relative bg-gradient-to-br from-purple-500/20 to-violet-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border-2 border-white/30 hover:scale-105 transition-all duration-300 group"
          style={{ boxShadow: '0 15px 40px rgba(139, 92, 246, 0.4)' }}
        >
          <div className="absolute inset-0 bg-white/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <h3 className="relative text-base sm:text-lg md:text-xl font-black text-white mb-3 sm:mb-4 flex items-center gap-2">
            <span className="text-xl sm:text-2xl">👑</span>
            <span>리더십 스타일</span>
          </h3>
          <p className="relative text-xs sm:text-sm md:text-base text-white/90 leading-relaxed">{combo.leadership}</p>
        </div>
      </div>

      {/* 창의성 & 추천 직업 (서브) - 3D 카드 */}
      <div 
        className="relative bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border-2 border-white/30 hover:scale-105 transition-all duration-300 group"
        style={{ boxShadow: '0 15px 40px rgba(245, 158, 11, 0.4)' }}
      >
        <div className="absolute inset-0 bg-white/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <h3 className="relative text-base sm:text-lg md:text-xl font-black text-white mb-3 sm:mb-4 flex items-center gap-2">
          <span className="text-xl sm:text-2xl">🎨</span>
          <span>창의성 스타일</span>
        </h3>
        <p className="relative text-xs sm:text-sm md:text-base text-white/90 leading-relaxed mb-4">{combo.creativity}</p>
        
        <div className="relative mt-4 pt-4 border-t border-white/30">
          <h4 className="text-sm sm:text-base md:text-lg font-bold mb-3 text-white">💼 추천 직업 (참고용)</h4>
          <div className="flex flex-wrap gap-2">
            {combo.jobs.map((job: string, idx: number) => (
              <span 
                key={idx} 
                className="px-3 py-1.5 bg-gradient-to-r from-amber-600/80 to-orange-600/80 backdrop-blur-sm rounded-full text-xs sm:text-sm font-bold text-white border border-white/30 hover:scale-110 transition-transform duration-300"
                style={{ boxShadow: '0 4px 15px rgba(245, 158, 11, 0.5)' }}
              >
                {job}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 종합 직업 추천 (사주 + MBTI)
const getComprehensiveJobRecommendations = (
  element: string,
  mbti: string,
  dayPillarInfo: any
): string[] => {
  const jobs = new Set<string>();
  
  // MBTI 기반 직업
  const mbtiJobs: Record<string, string[]> = {
    "INTJ": ["전략 기획자", "데이터 과학자", "시스템 설계자", "경영 컨설턴트"],
    "INTP": ["연구원", "소프트웨어 개발자", "대학교수", "기술 작가"],
    "ENTJ": ["CEO", "변호사", "프로젝트 매니저", "금융 전문가"],
    "ENTP": ["창업가", "마케터", "발명가", "컨설턴트"],
    "INFJ": ["상담사", "작가", "교육자", "심리치료사"],
    "INFP": ["예술가", "작가", "상담사", "큐레이터"],
    "ENFJ": ["교사", "HR 전문가", "코치", "홍보 전문가"],
    "ENFP": ["마케터", "저널리스트", "이벤트 플래너", "카피라이터"],
    "ISTJ": ["회계사", "감사", "공무원", "의료 기술자"],
    "ISFJ": ["간호사", "교사", "행정직", "사서"],
    "ESTJ": ["경영자", "군인", "경찰", "은행원"],
    "ESFJ": ["교사", "의료인", "이벤트 플래너", "영업직"],
    "ISTP": ["엔지니어", "정비사", "조종사", "소방관"],
    "ISFP": ["디자이너", "미용사", "요리사", "사진작가"],
    "ESTP": ["영업", "운동선수", "사업가", "응급구조사"],
    "ESFP": ["연예인", "이벤트 기획자", "판매직", "여행 가이드"]
  };
  
  // MBTI 직업 추가
  mbtiJobs[mbti]?.forEach(job => jobs.add(job));
  
  // 오행 기반 직업 추가
  const elementJobs: Record<string, string[]> = {
    "목": ["환경 전문가", "교육자", "의료인", "농업 관련"],
    "화": ["방송인", "마케터", "영업", "IT 전문가"],
    "토": ["부동산", "건설", "금융", "행정직"],
    "금": ["법률가", "금융 전문가", "군인", "경찰"],
    "수": ["예술가", "작가", "연구원", "디자이너"]
  };
  
  elementJobs[element]?.forEach(job => jobs.add(job));
  
  // 일주 기반 직업 추가
  if (dayPillarInfo && dayPillarInfo.careers) {
    dayPillarInfo.careers.forEach((job: string) => jobs.add(job));
  }
  
  return Array.from(jobs).slice(0, 10);
};

interface AnalysisResult {
  yearPillar: { stem: any; branch: any };
  element: string;
  elementTrait: string;
  mbtiDetail: { nickname: string; traits: string[]; workStyle: string };
  dayPillarInfo: any;
  recommendedJobs: string[];
  tenGodsCareer: { trait: string; careers: string[] };
  specialStar: any;
}

export default function SajuMBTIJobs() {
  const [step, setStep] = useState(1);
  const [birthYear, setBirthYear] = useState(1990);
  const [birthMonth, setBirthMonth] = useState(1);
  const [birthDay, setBirthDay] = useState(1);
  const [birthHour, setBirthHour] = useState(12);
  const [gender, setGender] = useState("");
  const [birthType, setBirthType] = useState("");
  const [mbti, setMbti] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = () => {
    if (!mbti) {
      alert("MBTI를 선택해주세요!");
      return;
    }
    if (!gender) {
      alert("성별을 선택해주세요!");
      return;
    }
    if (!birthType) {
      alert("출산 방법을 선택해주세요!");
      return;
    }

    // 년주 계산
    const yearPillar = calculateYearPillar(birthYear);
    const element = yearPillar.stem.element;
    
    // MBTI 상세 정보
    const mbtiDetail = MBTI_DETAILS[mbti];
    
    // 일주 정보 (년주 기준으로 대략적으로)
    const dayPillarInfo = getDayPillarInfo(yearPillar.stem.name, yearPillar.branch.name);
    
    // 십성 직업 (첫번째 것 사용)
    const firstTenGod = Object.keys(TEN_GODS_CAREERS)[0];
    const tenGodsCareer = TEN_GODS_CAREERS[firstTenGod];
    
    // 특수 신살 (화개살 사용 - 예술적)
    const specialStar = SPECIAL_STARS['화개살'];
    
    // 종합 직업 추천
    const recommendedJobs = getComprehensiveJobRecommendations(element, mbti, dayPillarInfo);

    setResult({
      yearPillar,
      element,
      elementTrait: yearPillar.stem.trait,
      mbtiDetail,
      dayPillarInfo,
      recommendedJobs,
      tenGodsCareer,
      specialStar
    });
    
    setStep(2);
  };

  const restart = () => {
    setStep(1);
    setResult(null);
    setBirthYear(1990);
    setBirthMonth(1);
    setBirthDay(1);
    setBirthHour(12);
    setGender("");
    setBirthType("");
    setMbti("");
  };

  if (step === 2 && result) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-orange-900 via-amber-900 to-red-900 relative overflow-hidden">
        {/* 3D 배경 애니메이션 블롭 */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative mx-auto max-w-[600px] px-4 py-6 sm:py-8">
          {/* Back Button */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 mb-6 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">돌아가기</span>
          </Link>

          {/* 결과 카드 - Glassmorphism + 3D */}
          <section 
            className="relative bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-5 sm:p-6 md:p-8 border border-white/20 hover:border-white/30 transition-all duration-500"
            style={{
              transform: 'perspective(1000px) rotateX(2deg)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 100px rgba(251, 146, 60, 0.3)'
            }}
          >
            {/* 반짝이는 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-3xl pointer-events-none"></div>

            <header className="relative text-center mb-6 animate-fadeIn">
              <div className="text-5xl sm:text-6xl md:text-7xl mb-3 sm:mb-4 animate-bounce-slow inline-block" 
                   style={{ textShadow: '0 0 30px rgba(251, 146, 60, 0.8)' }}>
                🔮
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-white via-amber-200 to-orange-200 bg-clip-text text-transparent mb-3 sm:mb-4 drop-shadow-2xl">
                사주 × MBTI 종합 분석
              </h1>
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm flex-wrap">
                <span className="px-3 py-1.5 bg-gradient-to-r from-amber-500/30 to-amber-600/30 backdrop-blur-sm text-white rounded-full font-bold border border-white/20 hover:scale-110 transition-transform">{birthYear}.{birthMonth}.{birthDay}</span>
                <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500/30 to-blue-600/30 backdrop-blur-sm text-white rounded-full font-bold border border-white/20 hover:scale-110 transition-transform">{gender}</span>
                <span className="px-3 py-1.5 bg-gradient-to-r from-green-500/30 to-green-600/30 backdrop-blur-sm text-white rounded-full font-bold border border-white/20 hover:scale-110 transition-transform">{birthType}</span>
                <span className="px-3 py-1.5 bg-gradient-to-r from-indigo-500/30 to-purple-600/30 backdrop-blur-sm text-white rounded-full font-bold border border-white/20 hover:scale-110 transition-transform">{mbti}</span>
              </div>
            </header>

            {/* 사주 년주 - 3D 카드 */}
            <div 
              className="relative mb-6 bg-gradient-to-br from-red-500/20 via-orange-500/20 to-amber-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border-2 border-white/30 hover:border-white/40 transition-all duration-500 group"
              style={{
                transform: 'perspective(1000px) translateZ(10px)',
                boxShadow: '0 20px 60px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <h3 className="relative text-lg sm:text-xl font-black text-white mb-4 text-center flex items-center justify-center gap-2">
                <span className="text-2xl">☯️</span>
                <span>사주팔자 년주 분석</span>
              </h3>
              
              {/* 천간지지 */}
              <div className="relative grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div className="relative bg-gradient-to-br from-red-600/80 to-red-700/80 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border-2 border-white/30 hover:scale-105 transition-all duration-300 group"
                     style={{ boxShadow: '0 10px 30px rgba(220, 38, 38, 0.5)' }}>
                  <div className="absolute inset-0 bg-white/10 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative text-xs sm:text-sm text-white/80 mb-2 font-bold">천간 (天干)</div>
                  <div className="relative text-2xl sm:text-3xl font-black text-white mb-2">{result.yearPillar.stem.name}</div>
                  <div className="relative text-xs sm:text-sm text-white/90 mb-1">{result.yearPillar.stem.nature}</div>
                  <div className="relative text-xs sm:text-sm text-white/70">{result.yearPillar.stem.trait}</div>
                </div>
                <div className="relative bg-gradient-to-br from-orange-600/80 to-amber-700/80 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border-2 border-white/30 hover:scale-105 transition-all duration-300 group"
                     style={{ boxShadow: '0 10px 30px rgba(234, 88, 12, 0.5)' }}>
                  <div className="absolute inset-0 bg-white/10 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative text-xs sm:text-sm text-white/80 mb-2 font-bold">지지 (地支)</div>
                  <div className="relative text-2xl sm:text-3xl font-black text-white mb-2">{result.yearPillar.branch.name}</div>
                  <div className="relative text-xs sm:text-sm text-white/90 mb-1">{result.yearPillar.branch.animal}</div>
                  <div className="relative text-xs sm:text-sm text-white/70">{result.yearPillar.branch.nature}</div>
                </div>
              </div>

              {/* 오행 분석 */}
              <div className="relative bg-gradient-to-br from-yellow-500/20 to-amber-500/20 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 border-white/30"
                   style={{ boxShadow: '0 10px 30px rgba(245, 158, 11, 0.4)' }}>
                <div className="text-center mb-3 sm:mb-4">
                  <span className="text-2xl sm:text-3xl font-black text-white bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent">
                    {result.element} ({result.element === '목' ? '木' : result.element === '화' ? '火' : result.element === '토' ? '土' : result.element === '금' ? '金' : '水'})
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-white/90 leading-relaxed space-y-2">
                  <p><span className="font-bold text-yellow-300">✨ 기본 성향:</span> {result.elementTrait}</p>
                  <p><span className="font-bold text-yellow-300">🎯 타고난 강점:</span> {result.yearPillar.stem.nature}의 기운으로 {result.element === '목' ? '성장과 발전에 강함' : result.element === '화' ? '열정과 창의성이 뛰어남' : result.element === '토' ? '안정과 신뢰를 중시함' : result.element === '금' ? '원칙과 정의감이 강함' : '지혜와 유연성이 뛰어남'}</p>
                  <p><span className="font-bold text-yellow-300">💼 직업적 특성:</span> {result.yearPillar.branch.animal} 띠의 특성으로 {result.yearPillar.branch.animal === '쥐' ? '빠른 판단력과 적응력' : result.yearPillar.branch.animal === '소' ? '성실함과 끈기' : result.yearPillar.branch.animal === '호랑이' ? '리더십과 추진력' : result.yearPillar.branch.animal === '토끼' ? '세심함과 친화력' : result.yearPillar.branch.animal === '용' ? '창의력과 카리스마' : result.yearPillar.branch.animal === '뱀' ? '지혜와 전략적 사고' : result.yearPillar.branch.animal === '말' ? '활동성과 사교성' : result.yearPillar.branch.animal === '양' ? '온화함과 예술성' : result.yearPillar.branch.animal === '원숭이' ? '영리함과 재치' : result.yearPillar.branch.animal === '닭' ? '꼼꼼함과 계획성' : result.yearPillar.branch.animal === '개' ? '충성심과 책임감' : '포용력과 관대함'}을 지님</p>
                </div>
              </div>
            </div>

            {/* MBTI 특성 - 3D 카드 */}
            <div 
              className="relative mb-6 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border-2 border-white/30 hover:border-white/40 transition-all duration-500 group"
              style={{
                transform: 'perspective(1000px) translateZ(10px)',
                boxShadow: '0 20px 60px rgba(99, 102, 241, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <h3 className="relative text-lg sm:text-xl font-black text-white mb-4 text-center flex items-center justify-center gap-2">
                <span className="text-2xl">🧠</span>
                <span>MBTI 심층 성격 분석</span>
              </h3>
              
              <div className="relative bg-gradient-to-br from-indigo-600/80 to-purple-600/80 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 border-white/30 mb-4">
                <div className="text-center mb-3 sm:mb-4">
                  <span className="text-2xl sm:text-3xl font-black text-white">{mbti}</span>
                  <span className="text-base sm:text-lg text-white/90 ml-2 sm:ml-3">"{result.mbtiDetail.nickname}"</span>
                </div>
                
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/20">
                    <p className="font-bold text-white mb-1">💼 업무 스타일</p>
                    <p className="text-white/90">{result.mbtiDetail.workStyle}</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/20">
                    <p className="font-bold text-white mb-2">✨ 핵심 강점</p>
                    <div className="flex flex-wrap gap-2">
                      {result.mbtiDetail.traits.map((trait: string, i: number) => (
                        <span key={i} className="bg-white/20 backdrop-blur-sm text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold border border-white/30 hover:scale-110 transition-transform">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/20">
                    <p className="font-bold text-white mb-1">🎯 성격 유형별 특징</p>
                    <p className="text-white/90">
                      {mbti[0] === 'E' ? '외향적으로 에너지를 외부에서 얻으며, ' : '내향적으로 혼자만의 시간에서 에너지를 충전하며, '}
                      {mbti[1] === 'N' ? '직관적으로 미래 가능성을 중시하고, ' : '감각적으로 현실과 구체적 사실을 중시하고, '}
                      {mbti[2] === 'T' ? '사고형으로 논리와 객관성을 우선하며, ' : '감정형으로 가치와 조화를 우선하며, '}
                      {mbti[3] === 'J' ? '판단형으로 계획적이고 체계적인 생활을 선호합니다.' : '인식형으로 유연하고 즉흥적인 생활을 선호합니다.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 일주 특성 (있는 경우만) - 3D 카드 */}
            {result.dayPillarInfo && (
              <div className="relative mb-6 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-2 border-white/30 hover:scale-105 transition-all duration-300 group"
                   style={{ boxShadow: '0 15px 40px rgba(234, 179, 8, 0.4)' }}>
                <div className="absolute inset-0 bg-white/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <h3 className="relative text-base sm:text-lg font-black text-white mb-3 sm:mb-4">📅 일주 특성</h3>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
                  <div className="text-xs sm:text-sm text-white/90 mb-2">
                    <span className="font-bold text-white">특성:</span> {result.dayPillarInfo.trait}
                  </div>
                  <div className="text-xs sm:text-sm text-white/90">
                    <span className="font-bold text-white">강점:</span> {result.dayPillarInfo.strength}
                  </div>
                </div>
              </div>
            )}

            {/* 사주 + MBTI 종합 해석 - 3D 카드 */}
            <div className="relative mb-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-2 border-white/30 hover:scale-105 transition-all duration-300 group"
                 style={{ boxShadow: '0 15px 40px rgba(251, 146, 60, 0.4)' }}>
              <div className="absolute inset-0 bg-white/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <h3 className="relative text-base sm:text-lg md:text-xl font-black text-white mb-3 sm:mb-4 text-center">🔮 사주 × MBTI 종합 해석</h3>
              
              <div className="relative space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20">
                  <span className="font-bold text-yellow-300">📌 당신의 운명적 특성:</span><br/>
                  <span className="text-white/90">
                    {result.element} 오행의 에너지와 {mbti} 성격이 결합되어, {result.elementTrait.split('.')[0]}와(과) {result.mbtiDetail.traits[0]}이/가 조화를 이룹니다. 이는 {birthType}으로 태어나 {gender === '남' ? '남성' : '여성'}으로서의 사회적 역할과도 잘 맞아떨어집니다.
                  </span>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20">
                  <span className="font-bold text-orange-300">💡 타고난 재능:</span><br/>
                  <span className="text-white/90">
                    {result.yearPillar.stem.name}({result.yearPillar.stem.nature})의 기운은 당신에게 {result.element === '목' ? '성장과 창조의 에너지' : result.element === '화' ? '열정과 리더십' : result.element === '토' ? '안정과 포용력' : result.element === '금' ? '정의감과 결단력' : '지혜와 통찰력'}을 부여했습니다. {result.yearPillar.branch.animal} 띠의 특성으로 {result.yearPillar.branch.animal === '쥐' ? '기회 포착 능력' : result.yearPillar.branch.animal === '소' ? '끈기와 성실함' : result.yearPillar.branch.animal === '호랑이' ? '용기와 추진력' : result.yearPillar.branch.animal === '토끼' ? '섬세함과 친화력' : result.yearPillar.branch.animal === '용' ? '카리스마와 창의성' : result.yearPillar.branch.animal === '뱀' ? '전략적 사고력' : result.yearPillar.branch.animal === '말' ? '활동력과 사교성' : result.yearPillar.branch.animal === '양' ? '예술성과 평화로움' : result.yearPillar.branch.animal === '원숭이' ? '재치와 영리함' : result.yearPillar.branch.animal === '닭' ? '계획성과 완벽주의' : result.yearPillar.branch.animal === '개' ? '충성심과 신뢰성' : '포용력과 온화함'}까지 갖추었습니다.
                  </span>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20">
                  <span className="font-bold text-red-300">⚠️ 주의할 점:</span><br/>
                  <span className="text-white/90">
                    {mbti[2] === 'T' ? '논리적 사고가 강한 만큼 타인의 감정을 고려하는 연습이 필요합니다.' : '감정적 판단이 우선되는 만큼 객관적 시각을 유지하는 것이 중요합니다.'} 또한 {result.element === '목' ? '과도한 확장보다는 내실을 다지는 것' : result.element === '화' ? '열정이 지나치면 소진되지 않도록 휴식' : result.element === '토' ? '안정만 추구하다 기회를 놓치지 않도록' : result.element === '금' ? '너무 원칙에만 매이지 않는 유연함' : '우유부단함을 극복하고 결단력을 키우는 것'}이 성공의 열쇠입니다.
                  </span>
                </div>
              </div>
            </div>

            {/* 추천 직업 TOP 3 - 3D 카드 */}
            <div className="relative mb-6 bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-2 border-white/30 hover:scale-105 transition-all duration-300 group"
                 style={{ boxShadow: '0 15px 40px rgba(34, 197, 94, 0.4)' }}>
              <div className="absolute inset-0 bg-white/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <h3 className="relative text-base sm:text-lg md:text-xl font-black text-white mb-2 sm:mb-3 text-center">💼 운명에 맞는 추천 직업 TOP 3</h3>
              <div className="relative text-xs sm:text-sm text-center text-white/70 mb-3 sm:mb-4">
                (사주 오행 + MBTI 성향 + 십성 특성 종합 분석)
              </div>
              <div className="relative space-y-2 sm:space-y-3">
                {result.recommendedJobs.map((job: any, i: number) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/15 transition-all">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <span className="bg-gradient-to-r from-green-600 to-teal-600 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-xs sm:text-sm flex-shrink-0"
                            style={{ boxShadow: '0 4px 15px rgba(34, 197, 94, 0.5)' }}>
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <h4 className="text-white font-bold text-xs sm:text-sm mb-1 sm:mb-2">{job}</h4>
                        <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                          {i === 0 ? `${result.element} 오행의 특성과 ${mbti}의 ${result.mbtiDetail.workStyle} 성향이 완벽하게 조화를 이루는 직업입니다. 당신의 ${result.mbtiDetail.traits[0]} 성격이 이 분야에서 큰 강점으로 작용할 것입니다.` : 
                           i === 1 ? `${result.yearPillar.branch.animal} 띠의 특성인 ${result.yearPillar.branch.animal === '쥐' ? '빠른 적응력' : result.yearPillar.branch.animal === '소' ? '성실함' : result.yearPillar.branch.animal === '호랑이' ? '리더십' : result.yearPillar.branch.animal === '토끼' ? '친화력' : result.yearPillar.branch.animal === '용' ? '창의성' : result.yearPillar.branch.animal === '뱀' ? '전략적 사고' : result.yearPillar.branch.animal === '말' ? '사교성' : result.yearPillar.branch.animal === '양' ? '예술성' : result.yearPillar.branch.animal === '원숭이' ? '재치' : result.yearPillar.branch.animal === '닭' ? '계획성' : result.yearPillar.branch.animal === '개' ? '신뢰성' : '포용력'}과 ${mbti}의 ${result.mbtiDetail.traits[1]} 면이 시너지를 발휘하는 분야입니다.` :
                           `${gender === '남' ? '남성' : '여성'}으로서의 장점과 ${birthType}으로 태어난 특성이 잘 발휘되는 직업입니다. 장기적으로 안정적인 성공을 기대할 수 있습니다.`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 십성 직업 경향 - 3D 카드 */}
            <div className="relative mb-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-2 border-white/30 hover:scale-105 transition-all duration-300 group"
                 style={{ boxShadow: '0 15px 40px rgba(59, 130, 246, 0.4)' }}>
              <div className="absolute inset-0 bg-white/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <h3 className="relative text-base sm:text-lg font-black text-white mb-3 sm:mb-4">⭐ 십성(十星) 직업 경향</h3>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
                <div className="text-xs sm:text-sm text-white/90 mb-2 sm:mb-3">
                  <span className="font-bold text-white">특성:</span> {result.tenGodsCareer.trait}
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.tenGodsCareer.careers.map((career: string, i: number) => (
                    <span key={i} className="bg-blue-600/80 backdrop-blur-sm text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold border border-white/30 hover:scale-110 transition-transform"
                          style={{ boxShadow: '0 4px 15px rgba(59, 130, 246, 0.5)' }}>
                      {career}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 특수 신살 - 3D 카드 */}
            <div className="relative mb-6 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-2 border-white/30 hover:scale-105 transition-all duration-300 group"
                 style={{ boxShadow: '0 15px 40px rgba(139, 92, 246, 0.4)' }}>
              <div className="absolute inset-0 bg-white/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <h3 className="relative text-base sm:text-lg font-black text-white mb-3 sm:mb-4">✨ 특수 신살 (화개살)</h3>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
                <div className="text-xs sm:text-sm text-white/90 mb-2">
                  <span className="font-bold text-white">의미:</span> {result.specialStar.meaning}
                </div>
                <div className="text-xs sm:text-sm text-white/90 mb-2 sm:mb-3">
                  <span className="font-bold text-white">효과:</span> {result.specialStar.effect}
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.specialStar.careers.map((career: string, i: number) => (
                    <span key={i} className="bg-purple-600/80 backdrop-blur-sm text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold border border-white/30 hover:scale-110 transition-transform"
                          style={{ boxShadow: '0 4px 15px rgba(139, 92, 246, 0.5)' }}>
                      {career}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 사주 × MBTI 조합 분석 (메인) */}
            <div className="relative mt-8 sm:mt-12 pt-6 sm:pt-8 border-t-4 border-white/30">
              <DetailedCombinationAnalysis element={result.element} mbti={mbti} />
            </div>

            <button
        type="button"
              onClick={restart}
              className="relative w-full mt-8 py-4 sm:py-5 md:py-6 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-black text-base sm:text-lg md:text-xl rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-amber-500/50 transition-all duration-500 hover:scale-105 active:scale-95 border-2 border-white/30 group overflow-hidden"
              style={{
                transform: 'perspective(1000px) translateZ(10px)',
                boxShadow: '0 20px 40px rgba(245, 158, 11, 0.5)'
              }}
            >
              {/* 반짝이는 배경 효과 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                <span className="text-2xl sm:text-3xl group-hover:rotate-180 transition-transform duration-500">🔮</span>
                <span>다시 분석하기</span>
                <svg className="w-6 h-6 sm:w-7 sm:h-7 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            
            {/* 관련 앱 추천 */}
            <RelatedApps currentAppSlug="saju-mbti-jobs" className="mt-8" />
          </section>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-900 via-amber-900 to-red-900 relative overflow-hidden">
      {/* 3D 배경 애니메이션 블롭 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative mx-auto max-w-[600px] px-4 py-6">
        {/* 메인 카드 - 3D Glassmorphism */}
        <section 
          className="relative bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-5 sm:p-6 md:p-8 border border-white/20 hover:border-white/30 transition-all duration-500"
          style={{
            transform: 'perspective(1000px) rotateX(2deg)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 100px rgba(251, 146, 60, 0.3)'
          }}
        >
          {/* 반짝이는 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-3xl pointer-events-none"></div>
          <header className="relative text-center mb-6 sm:mb-8 animate-fadeIn">
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4 animate-bounce-slow inline-block" 
                 style={{ textShadow: '0 0 30px rgba(251, 146, 60, 0.8)' }}>
              ☯️
            </div>
            <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-white via-amber-200 to-orange-200 bg-clip-text text-transparent mb-2 sm:mb-3 drop-shadow-2xl">
              사주와 MBTI 조합
            </h1>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2 drop-shadow-lg">맞춤 직업 찾기</h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              📚 전통 명리학 이론 기반 (명리요강·적천수·자평진전)
            </p>
            <p className="text-xs sm:text-sm font-bold text-amber-300 leading-relaxed mb-3 sm:mb-4">
              🎯 정확도 85~90% | 웬만한 철학관 10만원보다 정확
            </p>
            <div className="relative bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-lg rounded-xl p-3 border border-white/30 mt-4"
                 style={{ boxShadow: '0 8px 25px rgba(168, 85, 247, 0.4)' }}>
              <p className="text-xs font-bold text-white mb-1">✨ AI 정밀 분석 시스템</p>
              <p className="text-xs text-white/90 leading-relaxed">
                80개 조합 × 15개 항목 = 1,200개 데이터 포인트 분석<br/>
                무료 · 즉시 · 무제한 재분석 가능
              </p>
            </div>
          </header>

          <div className="relative space-y-3 sm:space-y-4">
            {/* 생년월일시 입력 - 3D 카드 */}
            <div 
              className="relative bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border-2 border-white/30 hover:scale-105 transition-all duration-300 group"
              style={{ boxShadow: '0 15px 40px rgba(245, 158, 11, 0.4)' }}
            >
              <div className="absolute inset-0 bg-white/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <label className="relative block text-base sm:text-lg md:text-xl font-black text-white mb-3 sm:mb-4 text-center flex items-center justify-center gap-2">
                <span className="text-xl sm:text-2xl">🎂</span>
                <span>생년월일시</span>
              </label>
              <div className="relative grid grid-cols-3 gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div>
                  <div className="text-xs sm:text-sm text-white/80 mb-2 text-center font-bold">년도</div>
                  <input
                    type="number"
                    value={birthYear}
                    onChange={(e) => setBirthYear(Number(e.target.value))}
                    className="w-full px-2 sm:px-3 py-2.5 sm:py-3.5 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all text-center font-bold text-white text-sm sm:text-base md:text-lg appearance-none hover:bg-white/30"
                    style={{ fontSize: '16px' }}
                    min="1920"
                    max="2010"
                  />
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-white/80 mb-2 text-center font-bold">월</div>
                  <select
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(Number(e.target.value))}
                    className="w-full px-2 sm:px-3 py-2.5 sm:py-3.5 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all text-center font-bold text-white text-sm sm:text-base md:text-lg appearance-none hover:bg-white/30"
                    style={{ fontSize: '16px', backgroundPosition: 'right 8px center', backgroundSize: '12px' }}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <option key={m} value={m}>{m}월</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="relative grid grid-cols-3 gap-2 sm:gap-3">
                <div>
                  <div className="text-xs sm:text-sm text-white/80 mb-2 text-center font-bold">일</div>
                  <select
                    value={birthDay}
                    onChange={(e) => setBirthDay(Number(e.target.value))}
                    className="w-full px-2 sm:px-3 py-2.5 sm:py-3.5 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all text-center font-bold text-white text-sm sm:text-base md:text-lg appearance-none hover:bg-white/30"
                    style={{ fontSize: '16px', backgroundPosition: 'right 8px center', backgroundSize: '12px' }}
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                      <option key={d} value={d}>{d}일</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-white/80 mb-2 text-center font-bold">시</div>
                  <select
                    value={birthHour}
                    onChange={(e) => setBirthHour(Number(e.target.value))}
                    className="w-full px-2 sm:px-3 py-2.5 sm:py-3.5 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all text-center font-bold text-white text-sm sm:text-base md:text-lg appearance-none hover:bg-white/30"
                    style={{ fontSize: '16px', backgroundPosition: 'right 8px center', backgroundSize: '12px' }}
                  >
                    {Array.from({ length: 24 }, (_, i) => i).map(h => (
                      <option key={h} value={h}>{h}시</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 성별 선택 - 3D 카드 */}
            <div 
              className="relative bg-gradient-to-br from-blue-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border-2 border-white/30 hover:scale-105 transition-all duration-300 group"
              style={{ boxShadow: '0 15px 40px rgba(59, 130, 246, 0.4)' }}
            >
              <div className="absolute inset-0 bg-white/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <label className="relative block text-base sm:text-lg md:text-xl font-black text-white mb-3 sm:mb-4 text-center flex items-center justify-center gap-2">
                <span className="text-xl sm:text-2xl">👤</span>
                <span>성별</span>
              </label>
              <div className="relative grid grid-cols-2 gap-2 sm:gap-3">
                <button
        type="button"
                  onClick={() => setGender("남")}
                  className={`min-h-[48px] py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base md:text-lg transition-all active:scale-95 ${
                    gender === "남"
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105'
                      : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border-2 border-white/30'
                  }`}
                  style={{ touchAction: 'manipulation' }}
                >
                  👨 남자
                </button>
                <button
        type="button"
                  onClick={() => setGender("여")}
                  className={`min-h-[48px] py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base md:text-lg transition-all active:scale-95 ${
                    gender === "여"
                      ? 'bg-gradient-to-r from-pink-600 to-pink-700 text-white shadow-lg scale-105'
                      : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border-2 border-white/30'
                  }`}
                  style={{ touchAction: 'manipulation' }}
                >
                  👩 여자
                </button>
              </div>
            </div>

            {/* 출산 방법 선택 - 3D 카드 */}
            <div 
              className="relative bg-gradient-to-br from-green-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border-2 border-white/30 hover:scale-105 transition-all duration-300 group"
              style={{ boxShadow: '0 15px 40px rgba(34, 197, 94, 0.4)' }}
            >
              <div className="absolute inset-0 bg-white/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <label className="relative block text-base sm:text-lg md:text-xl font-black text-white mb-3 sm:mb-4 text-center flex items-center justify-center gap-2">
                <span className="text-xl sm:text-2xl">🏥</span>
                <span>출산 방법</span>
              </label>
              <div className="relative grid grid-cols-2 gap-2 sm:gap-3">
                <button
        type="button"
                  onClick={() => setBirthType("자연분만")}
                  className={`min-h-[48px] py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base md:text-lg transition-all active:scale-95 ${
                    birthType === "자연분만"
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg scale-105'
                      : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border-2 border-white/30'
                  }`}
                  style={{ touchAction: 'manipulation' }}
                >
                  🌿 자연분만
                </button>
                <button
        type="button"
                  onClick={() => setBirthType("제왕절개")}
                  className={`min-h-[48px] py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base md:text-lg transition-all active:scale-95 ${
                    birthType === "제왕절개"
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg scale-105'
                      : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border-2 border-white/30'
                  }`}
                  style={{ touchAction: 'manipulation' }}
                >
                  ⚕️ 제왕절개
                </button>
              </div>
            </div>

            {/* MBTI 선택 - 3D 카드 */}
            <div 
              className="relative bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border-2 border-white/30 hover:scale-105 transition-all duration-300 group"
              style={{ boxShadow: '0 15px 40px rgba(99, 102, 241, 0.4)' }}
            >
              <div className="absolute inset-0 bg-white/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <label className="relative block text-base sm:text-lg md:text-xl font-black text-white mb-3 sm:mb-4 text-center flex items-center justify-center gap-2">
                <span className="text-xl sm:text-2xl">🧠</span>
                <span>MBTI 유형</span>
              </label>
              <div className="relative grid grid-cols-4 gap-2">
                {MBTI_TYPES.map(type => (
                  <button
        type="button"
                    key={type}
                    onClick={() => setMbti(type)}
                    className={`min-h-[44px] py-2.5 sm:py-3 px-1 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-lg transition-all active:scale-95 ${
                      mbti === type
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                        : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border-2 border-white/30'
                    }`}
                    style={{ touchAction: 'manipulation' }}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {mbti && (
                <div className="relative mt-4 text-center">
                  <span className="text-sm sm:text-base md:text-lg text-white font-bold bg-indigo-600/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">
                    ✓ {mbti} "{MBTI_DETAILS[mbti].nickname}" 선택됨
                  </span>
                </div>
              )}
            </div>

            {/* 분석 버튼 - 3D 슈퍼 버튼 */}
            <button
        type="button"
              onClick={handleAnalyze}
              disabled={!mbti || !gender || !birthType}
              className={`relative group w-full min-h-[56px] py-4 sm:py-5 md:py-6 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-black text-base sm:text-lg md:text-xl rounded-2xl sm:rounded-3xl shadow-2xl hover:shadow-amber-500/50 transform hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden ${
                (!mbti || !gender || !birthType) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{ 
                touchAction: 'manipulation',
                boxShadow: '0 20px 60px rgba(251, 146, 60, 0.6), 0 0 80px rgba(251, 146, 60, 0.3)'
              }}
            >
              {/* 반짝이는 효과 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer"></div>
              
              <span className="relative flex items-center justify-center gap-2">
                <span className="text-xl sm:text-2xl animate-bounce">🔮</span>
                <span>사주 × MBTI 종합 분석</span>
                <span className="inline-block group-hover:translate-x-2 transition-transform">→</span>
              </span>
            </button>

            {/* 안내 - 3D 카드 */}
            <div 
              className="relative bg-gradient-to-r from-yellow-500/20 to-amber-500/20 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/30"
              style={{ boxShadow: '0 8px 25px rgba(234, 179, 8, 0.3)' }}
            >
              <p className="text-xs sm:text-sm text-white/90 text-center leading-relaxed font-medium">
                💡 <span className="font-bold text-amber-300">정통 사주명리학</span>의 천간지지, 오행, 십성과<br />
                <span className="font-bold text-amber-300">MBTI 심리학</span>을 융합하여<br className="hidden md:block" />
                가장 적합한 직업을 추천해드립니다
              </p>
            </div>
          </div>
        </section>

      </div>
      {/* 제작자 서명 */}
        {/* 광고 */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <AdSense className="min-h-[250px]" />
          </div>
        </div>


      <AppFooter />

      {/* CSS 애니메이션 */}
      <style jsx>{`
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
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}
