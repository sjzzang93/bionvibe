"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, Share2, RefreshCw, Sparkles } from "lucide-react"
import dataset from "@/lib/draw-psychology/dataset.json"
import AdOverlay from '@/app/components/AdOverlay'

function ResultContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [imageData, setImageData] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const type = searchParams.get("type") as "house" | "tree" | "person" || "house"

  const titles = {
    house: "🏠 집 그림 분석 결과",
    tree: "🌳 나무 그림 분석 결과",
    person: "🧍 사람 그림 분석 결과"
  }

  useEffect(() => {
    // Load image
    const savedImage = localStorage.getItem(`draw_${type}`)
    if (savedImage) {
      setImageData(savedImage)
    }

    // Simulate AI analysis
    setTimeout(() => {
      const results = dataset[type as keyof typeof dataset]
      const resultsArray = Array.isArray(results) ? results : []
      const randomResults = [...resultsArray].sort(() => Math.random() - 0.5).slice(0, 3)

      const emotions = dataset.emotions
      const emotionKeys = Object.keys(emotions)
      const randomEmotion = emotions[emotionKeys[Math.floor(Math.random() * emotionKeys.length)] as keyof typeof emotions]

      const allTraits = randomResults.flatMap(r => r.traits)
      const uniqueTraits = [...new Set(allTraits)]

      const avgStressLevel = randomResults.reduce((acc, r) => {
        const level = r.stress_level === "높음" ? 3 : r.stress_level === "중간" ? 2 : 1
        return acc + level
      }, 0) / randomResults.length

      const stressLabel = avgStressLevel > 2.3 ? "높음" : avgStressLevel > 1.7 ? "중간" : "낮음"

      setAnalysis({
        features: randomResults,
        summary: {
          personality: uniqueTraits.slice(0, 5).join(", "),
          emotion_state: randomEmotion.meaning,
          stress_level: stressLabel,
          psychotype: `${uniqueTraits[0] || "균형잡힌"} ${uniqueTraits[1] || "안정적"}형`,
          recommendation: randomResults[0].recommendation
        }
      })

      setIsLoading(false)
    }, 2000)
  }, [type])

  const downloadImage = () => {
    if (!imageData) return
    const link = document.createElement("a")
    link.href = imageData
    link.download = `my-${type}-drawing.png`
    link.click()
  }

  const shareResult = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "그림 심리 테스트 결과",
          text: `나의 ${type === "house" ? "집" : type === "tree" ? "나무" : "사람"} 그림 분석 결과를 확인해보세요!`,
          url: window.location.href
        })
      } catch (err) {
        console.log("Share failed", err)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center">
        
      <AdOverlay /><div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-purple-500/30"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 animate-spin"></div>
            <Sparkles className="absolute inset-0 m-auto h-12 w-12 text-purple-400 animate-pulse" />
          </div>
          <p className="text-white text-2xl font-bold mb-2">그림 분석 중...</p>
          <p className="text-white/60">AI가 당신의 마음을 읽고 있습니다 ✨</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/apps/draw-psychology">
            <button className="p-3 rounded-full bg-white/10 backdrop-blur-lg hover:bg-white/20 border border-white/20 transition-all">
              <ArrowLeft className="h-6 w-6 text-white" />
            </button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {titles[type]}
          </h1>
        </div>

        {/* Your Drawing */}
        {imageData && (
          <div className="mb-8">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 transform hover:scale-[1.02] transition-all">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                당신의 그림
              </h2>
              <div className="bg-white rounded-2xl p-4 shadow-2xl">
                <img
                  src={imageData}
                  alt="Your drawing"
                  className="w-full h-auto max-h-[400px] object-contain"
                />
              </div>
              <div className="mt-4 flex gap-2 flex-wrap">
                <button
                  onClick={downloadImage}
                  className="flex-1 min-w-[120px] px-4 py-3 bg-white/20 backdrop-blur-lg text-white rounded-xl hover:bg-white/30 transition-all flex items-center justify-center gap-2 border border-white/30"
                >
                  <Download className="h-5 w-5" />
                  <span className="hidden sm:inline">다운로드</span>
                </button>
                <button
                  onClick={shareResult}
                  className="flex-1 min-w-[120px] px-4 py-3 bg-white/20 backdrop-blur-lg text-white rounded-xl hover:bg-white/30 transition-all flex items-center justify-center gap-2 border border-white/30"
                >
                  <Share2 className="h-5 w-5" />
                  <span className="hidden sm:inline">공유하기</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/30 rounded-3xl p-8 transform hover:scale-[1.02] transition-all shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-yellow-300" />
                종합 분석
              </h2>
              <div className="space-y-4">
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <p className="text-white/70 text-sm mb-1">성격 유형</p>
                  <p className="text-white text-xl font-bold">{analysis.summary.psychotype}</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <p className="text-white/70 text-sm mb-1">주요 성격 특성</p>
                  <p className="text-white text-lg">{analysis.summary.personality}</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <p className="text-white/70 text-sm mb-1">감정 상태</p>
                  <p className="text-white text-lg">{analysis.summary.emotion_state}</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <p className="text-white/70 text-sm mb-1">스트레스 수준</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          analysis.summary.stress_level === "높음"
                            ? "bg-red-500 w-[80%]"
                            : analysis.summary.stress_level === "중간"
                            ? "bg-yellow-500 w-[50%]"
                            : "bg-green-500 w-[20%]"
                        }`}
                      ></div>
                    </div>
                    <span className="text-white font-bold">{analysis.summary.stress_level}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {analysis.features.map((feature: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 transform hover:scale-105 hover:rotate-1 transition-all shadow-xl"
                  style={{
                    animationDelay: `${idx * 0.1}s`
                  }}
                >
                  <h3 className="text-lg font-bold text-white mb-3">{feature.feature}</h3>
                  <p className="text-white/80 text-sm mb-3">{feature.meaning}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {feature.traits.map((trait: string, tidx: number) => (
                      <span
                        key={tidx}
                        className="px-3 py-1 bg-purple-500/30 text-white text-xs rounded-full border border-purple-300/30"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                  <p className="text-white/60 text-xs italic">{feature.interpretation}</p>
                </div>
              ))}
            </div>

            {/* Recommendation */}
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-white/30 rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                💡 추천사항
              </h2>
              <p className="text-white/90 text-lg leading-relaxed">
                {analysis.summary.recommendation}
              </p>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/apps/draw-psychology">
            <button className="w-full sm:w-auto px-8 py-4 bg-white/20 backdrop-blur-xl text-white rounded-2xl hover:bg-white/30 transition-all flex items-center justify-center gap-2 border border-white/30 font-semibold">
              <RefreshCw className="h-5 w-5" />
              다른 그림 그리기
            </button>
          </Link>
          <Link href="/">
            <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:shadow-lg hover:shadow-purple-500/50 transition-all font-semibold">
              홈으로 돌아가기
            </button>
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-white/40 text-xs max-w-2xl mx-auto">
            이 분석은 AI 기반 재미있는 심리 테스트이며, 전문적인 심리 상담이나 진단을 대체하지 않습니다.
            정확한 심리 분석이 필요하다면 전문가와 상담하시기 바랍니다.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">로딩 중...</div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  )
}
