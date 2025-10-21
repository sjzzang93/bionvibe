import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "BION 소개 - 48개 무료 웹앱을 만든 이야기",
  description: "일상에 빛을 더하는 BION의 철학과 비전. 계산기, 운세, 게임 등 48개 웹앱을 무료로 제공하는 이유와 만든 사람을 소개합니다.",
  openGraph: {
    title: "BION 소개 - 48개 무료 웹앱을 만든 이야기",
    description: "일상에 빛을 더하는 BION의 철학과 비전",
    url: 'https://bionvibe.com/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link 
          href="/" 
          className="inline-flex items-center text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 mb-8 transition-colors"
        >
          ← 홈으로 돌아가기
        </Link>

        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">
          BION 소개
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              🌟 BION이란?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              BION은 <strong>"Creating light for everyday life"</strong>라는 철학 아래, 
              일상 속에서 빛을 만들어가는 웹 플랫폼입니다.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              복잡한 기술이 아닌, <strong>사람을 위한 공간</strong>을 만들어 
              누구나 쉽고 편리하게 다양한 웹 도구를 활용할 수 있도록 합니다.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              🎯 우리의 목표
            </h2>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-red-600 dark:text-red-400 mr-2">✓</span>
                <span>일상에 필요한 <strong>48개 이상의 실용적인 웹앱</strong> 제공</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 dark:text-red-400 mr-2">✓</span>
                <span>모바일 및 PC 모두에서 <strong>완벽하게 작동</strong>하는 반응형 디자인</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 dark:text-red-400 mr-2">✓</span>
                <span>라이트/다크 모드 지원으로 <strong>눈의 피로 최소화</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 dark:text-red-400 mr-2">✓</span>
                <span><strong>광고 없는 깔끔한 환경</strong> (일부 페이지 제외)</span>
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              🛠️ 제공하는 서비스
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">
                  💊 건강 & 웰니스
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  물 섭취량, 칼로리, 비타민 체크, 수면 분석 등
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">
                  💰 금융 & 계산기
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  복리 계산, 소득세, 대출 갈아타기, 전기요금 등
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">
                  🎮 재미 & 엔터테인먼트
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  운세, MBTI, IQ 테스트, 미니 게임 등
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">
                  📚 학습 & 생산성
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  플래시카드, 타이핑 테스트, 집중 타이머 등
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              👨‍💻 만든 사람
            </h2>
            <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl border-2 border-red-200 dark:border-red-900">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong className="text-red-600 dark:text-red-400">Kim Seu Jun</strong> (김서준)
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                일상에 작은 빛을 더하고, 사람들이 필요로 하는 도구를 만드는 것을 좋아합니다.
                <br />
                BION을 통해 더 많은 분들께 편리함과 즐거움을 전달하고자 합니다.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              📧 문의하기
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              궁금한 점이나 제안사항이 있으시다면 언제든 <Link href="/contact" className="text-red-600 dark:text-red-400 hover:underline">문의 페이지</Link>를 통해 연락해주세요!
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

