"use client"

import { useEffect, useRef, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Eraser, Palette, Trash2, Check, Undo2 } from "lucide-react"
import { Button } from "@/components/ui/card"

function DrawCanvas() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState("#000000")
  const [brushSize, setBrushSize] = useState(3)
  const [isEraser, setIsEraser] = useState(false)
  const [history, setHistory] = useState<ImageData[]>([])
  const [historyStep, setHistoryStep] = useState(-1)

  const type = searchParams.get("type") as "house" | "tree" | "person" || "house"

  const titles = {
    house: "🏠 집을 그려주세요",
    tree: "🌳 나무를 그려주세요",
    person: "🧍 사람을 그려주세요"
  }

  const hints = {
    house: "지붕, 벽, 창문, 문 등을 자유롭게 그려보세요",
    tree: "뿌리, 줄기, 가지, 잎 등을 표현해주세요",
    person: "머리, 몸, 팔, 다리 등을 그려주세요"
  }

  const colors = [
    "#000000", // 검정
    "#FF0000", // 빨강
    "#0000FF", // 파랑
    "#00FF00", // 초록
    "#FFFF00", // 노랑
    "#FF00FF", // 보라
    "#FFA500", // 주황
    "#8B4513"  // 갈색
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resize = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Save initial state
        if (history.length === 0) {
          saveToHistory()
        }
      }
    }

    resize()
    window.addEventListener("resize", resize)

    return () => window.removeEventListener("resize", resize)
  }, [])

  const saveToHistory = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const newHistory = history.slice(0, historyStep + 1)
    newHistory.push(imageData)
    setHistory(newHistory)
    setHistoryStep(newHistory.length - 1)
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    setIsDrawing(true)

    const rect = canvas.getBoundingClientRect()
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    ctx.strokeStyle = isEraser ? "#ffffff" : color
    ctx.lineWidth = isEraser ? brushSize * 3 : brushSize
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
      saveToHistory()
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    saveToHistory()
  }

  const undo = () => {
    if (historyStep > 0) {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")
      if (!canvas || !ctx) return

      const newStep = historyStep - 1
      setHistoryStep(newStep)
      ctx.putImageData(history[newStep], 0, 0)
    }
  }

  const saveAndAnalyze = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dataURL = canvas.toDataURL("image/png")
    localStorage.setItem(`draw_${type}`, dataURL)

    router.push(`/apps/draw-psychology/result?type=${type}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-6 h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link href="/apps/draw-psychology">
              <button className="p-2 rounded-full bg-white/10 backdrop-blur-lg hover:bg-white/20 border border-white/20 transition-all">
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                {titles[type]}
              </h1>
              <p className="text-white/60 text-sm hidden sm:block">
                {hints[type]}
              </p>
            </div>
          </div>
        </div>

        {/* Canvas Container */}
        <div className="flex-1 relative bg-white rounded-3xl shadow-2xl overflow-hidden mb-4">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full touch-none cursor-crosshair"
          />
        </div>

        {/* Tools */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
          {/* Color Palette */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Palette className="h-5 w-5 text-white" />
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setColor(c)
                  setIsEraser(false)
                }}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  color === c && !isEraser
                    ? "border-white scale-110 shadow-lg"
                    : "border-white/30 hover:scale-105"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Brush Size */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-white text-sm min-w-[80px]">브러시 크기</span>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-white text-sm w-8 text-right">{brushSize}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setIsEraser(!isEraser)}
              className={`flex-1 min-w-[100px] px-4 py-3 rounded-xl font-semibold transition-all ${
                isEraser
                  ? "bg-white text-purple-900"
                  : "bg-white/20 text-white hover:bg-white/30"
              } border border-white/30`}
            >
              <Eraser className="h-5 w-5 mx-auto" />
            </button>
            <button
              onClick={undo}
              disabled={historyStep <= 0}
              className="flex-1 min-w-[100px] px-4 py-3 rounded-xl font-semibold bg-white/20 text-white hover:bg-white/30 border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Undo2 className="h-5 w-5 mx-auto" />
            </button>
            <button
              onClick={clearCanvas}
              className="flex-1 min-w-[100px] px-4 py-3 rounded-xl font-semibold bg-white/20 text-white hover:bg-white/30 border border-white/30 transition-all"
            >
              <Trash2 className="h-5 w-5 mx-auto" />
            </button>
            <button
              onClick={saveAndAnalyze}
              className="flex-1 min-w-[120px] px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center justify-center gap-2"
            >
              <Check className="h-5 w-5" />
              <span className="hidden sm:inline">분석하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DrawPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center text-white">로딩 중...</div>}>
      <DrawCanvas />
    </Suspense>
  )
}
