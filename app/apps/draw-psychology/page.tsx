"use client"

import RelatedApps from '@/app/components/RelatedApps';
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Home, TreePine, User } from "lucide-react"
import { Button } from "@/components/ui/button"

type DrawType = "house" | "tree" | "person"

export default function DrawPsychologyPage() {
  const [selectedType, setSelectedType] = useState<DrawType | null>(null)
  const [isHovering, setIsHovering] = useState<DrawType | null>(null)

  const cards = [
    {
      type: "house" as DrawType,
      icon: Home,
      title: "집 그리기",
      emoji: "🏠",
      description: "당신의 내면 세계와 가정환경을 분석합니다",
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      shadowColor: "shadow-blue-500/50"
    },
    {
      type: "tree" as DrawType,
      icon: TreePine,
      title: "나무 그리기",
      emoji: "🌳",
      description: "당신의 성장과 생명력을 살펴봅니다",
      gradient: "from-green-500 via-emerald-500 to-lime-500",
      shadowColor: "shadow-green-500/50"
    },
    {
      type: "person" as DrawType,
      icon: User,
      title: "사람 그리기",
      emoji: "🧍",
      description: "당신의 자아와 대인관계를 분석합니다",
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      shadowColor: "shadow-purple-500/50"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 sm:mb-12">
          <Link href="/">
            <Button
              variant="ghost"
              className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-lg hover:bg-white/20 border border-white/20 transition-all"
            >
              <ArrowLeft className="h-6 w-6 text-white" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
              그림 심리 테스트
            </h1>
            <p className="text-white/80 text-sm sm:text-base">
              당신의 그림 속 숨겨진 마음을 들여다보세요 ✨
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-12 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-6 py-4">
            <p className="text-white/90 text-lg mb-2">
              <span className="font-bold">HTP 그림 심리 테스트</span>
            </p>
            <p className="text-white/70 text-sm">
              집(House), 나무(Tree), 사람(Person)을 그려 심리 상태를 분석합니다
            </p>
          </div>
        </div>

        {/* 3D Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {cards.map((card) => (
            <div
              key={card.type}
              className="perspective-1000"
              onMouseEnter={() => setIsHovering(card.type)}
              onMouseLeave={() => setIsHovering(null)}
            >
              <Link href={`/apps/draw-psychology/draw?type=${card.type}`}>
                <div
                  className={`
                    relative h-[400px] sm:h-[450px] rounded-3xl
                    transform transition-all duration-500 ease-out
                    ${isHovering === card.type ? 'scale-105 -translate-y-4' : 'scale-100'}
                    ${isHovering === card.type ? card.shadowColor : 'shadow-xl'}
                    ${isHovering === card.type ? 'shadow-2xl' : ''}
                    cursor-pointer
                    bg-gradient-to-br ${card.gradient}
                    border-2 border-white/20
                    backdrop-blur-xl
                    overflow-hidden
                    group
                  `}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isHovering === card.type
                      ? 'rotateY(5deg) rotateX(5deg)'
                      : 'rotateY(0deg) rotateX(0deg)'
                  }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Content */}
                  <div className="relative h-full p-8 flex flex-col justify-between">
                    {/* Icon */}
                    <div className="flex justify-center">
                      <div className="text-8xl sm:text-9xl filter drop-shadow-2xl animate-bounce-slow">
                        {card.emoji}
                      </div>
                    </div>

                    {/* Text */}
                    <div className="text-center">
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 drop-shadow-lg">
                        {card.title}
                      </h3>
                      <p className="text-white/90 text-sm sm:text-base mb-6">
                        {card.description}
                      </p>

                      {/* Button */}
                      <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full border border-white/30 text-white font-semibold group-hover:bg-white/30 transition-all">
                        <span>시작하기</span>
                        <ArrowLeft className="h-4 w-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Corner decoration */}
                    <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white/30 rounded-tr-2xl"></div>
                    <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-white/30 rounded-bl-2xl"></div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-16 text-center">
          <p className="text-white/60 text-sm">
            💡 각 그림은 약 2-3분 정도 소요됩니다
          </p>
          <p className="text-white/40 text-xs mt-2">
            이 테스트는 재미와 자기이해를 위한 것이며, 전문적인 심리 진단을 대체하지 않습니다
          </p>
        </div>
      </div>

        <RelatedApps currentAppSlug="draw-psychology" />
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  )
}
