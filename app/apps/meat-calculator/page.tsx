'use client'

/**
 * 🥩 고기집 가격 계산기
 * 5가지 계산 모드를 지원하는 전문 계산기
 */

import { useState, useEffect } from 'react'
import type { CalculationMode, MenuInput, CalculationResult, SavedMenu, MeatCategory } from '@/types/meat'
import {
  convertServings,
  calculatePrice,
  calculateCost,
  calculateGrams,
  analyzeMargin,
  formatNumber,
  formatPercent,
  validateInput
} from '@/lib/meat-calculations'
import { saveMenu, getSavedMenus, deleteMenu } from '@/lib/meat-storage'

export default function MeatCalculatorPage() {
  
  // 입력 폼 데이터
  const [input, setInput] = useState<MenuInput>({
    name: '',
    category: '돼지고기',
    costPerGram: 0,
    gramsPerServing: 0,
    pricePerServing: 0,
    originalMinServings: 5,
    newMinServings: 3,
    targetMarginAmount: 0,
    targetPrice: 0,
    fixedTotalGrams: 0
  })
  
  // 계산 결과
  const [result, setResult] = useState<CalculationResult | null>(null)
  
  // 저장된 메뉴들
  const [savedMenus, setSavedMenus] = useState<SavedMenu[]>([])
  
  // 컴포넌트 마운트 시 저장된 메뉴 불러오기
  useEffect(() => {
    setSavedMenus(getSavedMenus())
  }, [])
  
  // 입력값 변경 핸들러
  const handleInputChange = (field: keyof MenuInput, value: string | number) => {
    setInput(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  // 계산 실행
  const handleCalculate = () => {
    try {
      // 인분 변환 계산
      if (!validateInput(input.costPerGram) || 
          !validateInput(input.gramsPerServing) || 
          !validateInput(input.pricePerServing)) {
        alert('모든 값을 입력해주세요.')
        return
      }
      
      const calculatedResult = convertServings(input)
      setResult(calculatedResult)
    } catch (error) {
      console.error('계산 오류:', error)
      alert('계산 중 오류가 발생했습니다.')
    }
  }
  
  // 저장 핸들러
  const handleSave = () => {
    if (!input.name.trim()) {
      alert('메뉴명을 입력해주세요.')
      return
    }
    
    if (!validateInput(input.costPerGram) || 
        !validateInput(input.gramsPerServing) || 
        !validateInput(input.pricePerServing)) {
      alert('모든 값을 입력해주세요.')
      return
    }
    
    saveMenu(input)
    setSavedMenus(getSavedMenus())
    alert('메뉴가 저장되었습니다!')
  }
  
  // 초기화 핸들러
  const handleReset = () => {
    setInput({
      name: '',
      category: '돼지고기',
      costPerGram: 0,
      gramsPerServing: 0,
      pricePerServing: 0,
      originalMinServings: 5,
      newMinServings: 3,
      targetMarginAmount: 0,
      targetPrice: 0,
      fixedTotalGrams: 0
    })
    setResult(null)
  }
  
  // 저장된 메뉴 불러오기
  const handleLoadMenu = (menu: SavedMenu) => {
    setInput({
      name: menu.name,
      category: menu.category,
      costPerGram: menu.costPerGram,
      gramsPerServing: menu.gramsPerServing,
      pricePerServing: menu.pricePerServing,
      originalMinServings: menu.originalMinServings,
      newMinServings: menu.newMinServings,
      targetMarginAmount: menu.targetMarginAmount,
      targetPrice: menu.targetPrice,
      fixedTotalGrams: menu.fixedTotalGrams
    })
    setResult(null)
  }
  
  // 메뉴 삭제
  const handleDeleteMenu = (id: string) => {
    if (confirm('이 메뉴를 삭제하시겠습니까?')) {
      deleteMenu(id)
      setSavedMenus(getSavedMenus())
    }
  }
  
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-4 md:py-8 px-3 md:px-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-5xl font-black text-red-700 mb-2">
            🥩 인분 변환기
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            최소주문 인분수를 변경하고 가격을 계산하세요
          </p>
        </div>
        
        {/* 메인 카드 */}
        <div className="bg-white rounded-xl shadow-2xl p-4 md:p-8 mb-6 md:mb-8">
          {/* 입력 폼 */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 메뉴명 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  메뉴명
                </label>
                <input
                  type="text"
                  value={input.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="예: 삼겹살"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-gray-800"
                />
              </div>
              
              {/* 카테고리 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  카테고리
                </label>
                <select
                  value={input.category}
                  onChange={(e) => handleInputChange('category', e.target.value as MeatCategory)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-gray-800"
                >
                  <option value="돼지고기">🐷 돼지고기</option>
                  <option value="소고기">🐮 소고기</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 원가 */}
              <div>
                <label className="block text-sm md:text-base font-semibold text-gray-700 mb-2">
                  💰 원가 (g당)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={input.costPerGram || ''}
                    onChange={(e) => handleInputChange('costPerGram', Number(e.target.value))}
                    placeholder="8"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-gray-800 bg-white text-base md:text-lg"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    원/g
                  </span>
                </div>
              </div>
              
              {/* 그람수 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📏 1인분 그람
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={input.gramsPerServing || ''}
                    onChange={(e) => handleInputChange('gramsPerServing', Number(e.target.value))}
                    placeholder="100"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-gray-800 bg-white"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    g
                  </span>
                </div>
              </div>
              
              {/* 판매가 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  💵 1인분 가격
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={input.pricePerServing || ''}
                    onChange={(e) => handleInputChange('pricePerServing', Number(e.target.value))}
                    placeholder="5500"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-gray-800 bg-white"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    원
                  </span>
                </div>
              </div>
            </div>
            
            {/* 최소 주문 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  👥 기존 최소주문
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={input.originalMinServings || ''}
                    onChange={(e) => handleInputChange('originalMinServings', Number(e.target.value))}
                    placeholder="5"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-gray-800"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    인분
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  👥 신규 최소주문
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={input.newMinServings || ''}
                    onChange={(e) => handleInputChange('newMinServings', Number(e.target.value))}
                    placeholder="3"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-gray-800"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    인분
                  </span>
                </div>
              </div>
            </div>
            
            {/* 고정 총 그람수 */}
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">⚖️</span>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">고정 총 그람수 (선택)</h3>
                    <p className="text-sm text-gray-600">
                      최소주문 총 그람수를 고정하면, 인분수와 상관없이 총량을 유지합니다.
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ⚖️ 고정 총 그람수
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={input.fixedTotalGrams || ''}
                      onChange={(e) => handleInputChange('fixedTotalGrams', Number(e.target.value))}
                      placeholder="예: 500 (비우면 적용 안 됨)"
                      className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-800 bg-white"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                      g
                    </span>
                  </div>
                </div>
              </div>
            
            {/* 목표 가격 */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">목표 가격 설정 (선택)</h3>
                    <p className="text-sm text-gray-600">
                      원하는 1인분 판매가를 지정하면, 해당 가격에 맞춰 그람수가 자동 조정됩니다.
                      비워두면 비율을 유지하며 계산합니다.
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🎯 신규 1인분 목표 가격
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={input.targetPrice || ''}
                      onChange={(e) => handleInputChange('targetPrice', Number(e.target.value))}
                      placeholder="예: 9000 (비우면 자동계산)"
                      className="w-full px-4 py-3 border-2 border-yellow-300 rounded-lg focus:border-yellow-500 focus:outline-none text-gray-800 bg-white"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                      원
                    </span>
                  </div>
                </div>
              </div>
          </div>
          
          {/* 버튼 */}
          <div className="flex flex-col md:flex-row gap-3 mt-6">
            <button
              onClick={handleCalculate}
              className="w-full md:flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition shadow-lg hover:shadow-xl"
            >
              🔄 계산하기
            </button>
            <button
              onClick={handleSave}
              className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition shadow-lg hover:shadow-xl"
            >
              💾 저장
            </button>
            <button
              onClick={handleReset}
              className="w-full md:w-auto bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg transition shadow-lg hover:shadow-xl"
            >
              🗑️ 초기화
            </button>
          </div>
        </div>
        
        {/* 계산 결과 */}
        {result && (
          <div className="bg-white rounded-xl shadow-2xl p-4 md:p-8 mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
              <span>📊</span> 계산 결과
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* 기존 체계 */}
              <div className="bg-gray-50 rounded-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4 border-b-2 border-gray-300 pb-2">
                  기존 {input.originalMinServings}인분
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">1인분:</span>
                    <span className="font-bold text-lg text-gray-900">
                      {result.original.gramsPerServing}g × {formatNumber(result.original.pricePerServing)}원
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">원가:</span>
                    <span className="text-orange-600 font-semibold">
                      {formatNumber(result.original.costPerServing)}원
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">이익:</span>
                    <span className="text-green-600 font-semibold">
                      {formatNumber(result.original.profit)}원
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">최소주문:</span>
                    <span className="font-bold text-lg text-gray-900">
                      {result.original.totalGrams}g × {formatNumber(result.original.totalPrice)}원
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                    <span className="text-gray-700 font-bold">마진율:</span>
                    <span className="text-2xl font-black text-red-600">
                      {formatPercent(result.original.marginPercent)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* 신규 체계 */}
              <div className="bg-red-50 rounded-lg p-4 md:p-6 border-2 border-red-200">
                <h3 className="text-lg md:text-xl font-bold text-red-800 mb-3 md:mb-4 border-b-2 border-red-300 pb-2">
                  새 {input.newMinServings}인분
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">1인분:</span>
                    <span className="font-bold text-lg text-red-900">
                      {result.new.gramsPerServing}g × {formatNumber(result.new.pricePerServing)}원
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">원가:</span>
                    <span className="text-orange-600 font-semibold">
                      {formatNumber(result.new.costPerServing)}원
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">이익:</span>
                    <span className="text-green-600 font-semibold">
                      {formatNumber(result.new.profit)}원
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">최소주문:</span>
                    <span className="font-bold text-lg text-red-900">
                      {result.new.totalGrams}g × {formatNumber(result.new.totalPrice)}원
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-red-300">
                    <span className="text-gray-700 font-bold">마진율:</span>
                    <span className="text-2xl font-black text-red-600">
                      {formatPercent(result.new.marginPercent)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 변화 요약 */}
            <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border-2 border-yellow-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>💡</span> 변화 요약
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✅</span>
                  <div>
                    <span className="text-gray-700">그람: </span>
                    <span className="font-bold text-gray-900">
                      {result.original.gramsPerServing}g → {result.new.gramsPerServing}g
                    </span>
                    <span className={`ml-2 font-bold ${result.changes.gramsPercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ({result.changes.gramsPercent > 0 ? '+' : ''}{formatPercent(result.changes.gramsPercent)})
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✅</span>
                  <div>
                    <span className="text-gray-700">가격: </span>
                    <span className="font-bold text-gray-900">
                      {formatNumber(result.original.pricePerServing)}원 → {formatNumber(result.new.pricePerServing)}원
                    </span>
                    <span className={`ml-2 font-bold ${result.changes.pricePercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ({result.changes.pricePercent > 0 ? '+' : ''}{formatPercent(result.changes.pricePercent)})
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✅</span>
                  <div>
                    <span className="text-gray-700">최소주문: </span>
                    <span className="font-bold text-gray-900">
                      {input.originalMinServings}인분 → {input.newMinServings}인분
                    </span>
                    <span className={`ml-2 font-bold ${result.changes.servingsPercent < 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ({formatPercent(result.changes.servingsPercent)})
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✅</span>
                  <div>
                    <span className="text-gray-700">총액 유지: </span>
                    <span className="font-bold text-green-600">
                      {formatNumber(result.original.totalPrice)}원 (동일)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 저장된 메뉴 */}
        {savedMenus.length > 0 && (
          <div className="bg-white rounded-xl shadow-2xl p-4 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>💾</span> 저장된 메뉴
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {savedMenus.map((menu) => (
                <div
                  key={menu.id}
                  className={`relative p-4 rounded-lg border-2 transition hover:shadow-lg cursor-pointer ${
                    menu.category === '돼지고기'
                      ? 'border-pink-200 bg-pink-50 hover:border-pink-400'
                      : 'border-amber-200 bg-amber-50 hover:border-amber-400'
                  }`}
                  onClick={() => handleLoadMenu(menu)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteMenu(menu.id)
                    }}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
                  >
                    ✕
                  </button>
                  <div className="text-2xl mb-2">
                    {menu.category === '돼지고기' ? '🐷' : '🐮'}
                  </div>
                  <div className="font-bold text-gray-800 mb-1">{menu.name}</div>
                  <div className="text-sm text-gray-600">{menu.gramsPerServing}g</div>
                  <div className="text-sm font-semibold text-red-600">
                    {formatNumber(menu.pricePerServing)}원
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

