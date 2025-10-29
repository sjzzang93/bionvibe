import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">고깃집 경영 시뮬레이터</h1>
          <p className="text-lg text-muted-foreground">
            가격 전략과 손익분기점을 실시간으로 분석하세요
          </p>
        </div>

        {/* 가격 시뮬레이터 섹션 */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">📊 가격 시뮬레이터</h2>
            <p className="text-muted-foreground">가격 인하 및 회전율 전략 분석</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 간단 가격 시뮬레이터 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">간단 가격 시뮬레이터</CardTitle>
              <CardDescription>빠르고 쉬운 기본 계산</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  원가/판매가 입력
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  매출 믹스 비율 설정
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  할인 시나리오 비교
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  회전율/객단가 분석
                </li>
              </ul>
              <Link href="/pricing-sim">
                <Button className="w-full" size="lg">
                  시작하기
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* 고급 가격 시뮬레이터 */}
          <Card className="hover:shadow-lg transition-shadow border-2 border-orange-200">
            <CardHeader>
              <CardTitle className="text-xl">
                고급 가격 시뮬레이터
                <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">NEW</span>
              </CardTitle>
              <CardDescription>메뉴별 세밀한 관리</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-orange-600">★</span>
                  개별 메뉴 아이템 관리
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-600">★</span>
                  음료/주류 세부 설정
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-600">★</span>
                  CSV 가져오기/내보내기
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-600">★</span>
                  메뉴별 수익성 분석
                </li>
              </ul>
              <Link href="/bbq-sim-v3">
                <Button className="w-full bg-orange-600 hover:bg-orange-700" size="lg">
                  시작하기
                </Button>
              </Link>
            </CardContent>
          </Card>
          </div>
        </div>

        {/* 손익분기 계산기 섹션 */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">📈 손익분기 계산기</h2>
            <p className="text-muted-foreground">하루 손익분기점 및 목표 이익 분석</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 간단 손익분기 계산기 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">간단 손익분기 계산기</CardTitle>
              <CardDescription>쉬운 BEP 분석</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">◆</span>
                  쉬운 용어 설명
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">◆</span>
                  월 단위 입력
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">◆</span>
                  손익분기점 자동 계산
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">◆</span>
                  목표 이익 달성 분석
                </li>
              </ul>
              <Link href="/break-even">
                <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                  시작하기
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* 고급 손익분기 계산기 */}
          <Card className="hover:shadow-lg transition-shadow border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="text-xl">
                고급 손익분기 계산기
                <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">NEW</span>
              </CardTitle>
              <CardDescription>메뉴별 상세 BEP 분석</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-purple-600">★</span>
                  메뉴별 원가/판매가 관리
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-600">★</span>
                  대출 상환금 포함
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-600">★</span>
                  테이블별 손익 시뮬레이션
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-600">★</span>
                  CSV 가져오기/내보내기
                </li>
              </ul>
              <Link href="/break-even-advanced">
                <Button className="w-full bg-purple-600 hover:bg-purple-700" size="lg">
                  시작하기
                </Button>
              </Link>
            </CardContent>
          </Card>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground space-y-1">
          <p>💡 처음 사용하시나요? <strong>간단 가격 시뮬레이터</strong>와 <strong>간단 손익분기 계산기</strong>로 시작하세요.</p>
          <p>📊 메뉴별 세밀한 분석이 필요하다면 각 카테고리의 <strong>고급 버전</strong>을 이용하세요.</p>
        </div>
      </div>
    </div>
  )
}
