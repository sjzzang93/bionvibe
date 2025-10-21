import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "이용약관",
  description: "BION 웹사이트 이용에 관한 약관입니다. 서비스 이용 전 반드시 확인해주세요.",
};

export default function TermsPage() {
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
          이용약관
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              최종 업데이트: 2025년 1월
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              본 이용약관("약관")은 BION("우리", "당사", "저희")이 제공하는 웹사이트 및 서비스("서비스") 이용에 관한 
              조건을 규정합니다. 본 서비스를 이용함으로써 귀하는 본 약관에 동의하는 것으로 간주됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              1. 서비스 제공
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              BION은 다음과 같은 무료 웹 기반 도구 및 서비스를 제공합니다:
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                <span>건강 및 웰니스 도구 (물 섭취량, 칼로리 계산기 등)</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                <span>금융 계산기 (복리 계산, 소득세 계산 등)</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                <span>엔터테인먼트 도구 (운세, 테스트, 게임 등)</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                <span>생산성 및 학습 도구</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              2. 사용자 책임
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              본 서비스를 이용함에 있어 귀하는 다음 사항을 준수해야 합니다:
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                <span>법률 및 규정 준수</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                <span>다른 사용자의 권리 존중</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                <span>서비스의 무단 복제, 수정, 배포 금지</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                <span>악의적인 목적의 사용 금지 (해킹, 스팸 등)</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              3. 지적재산권
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              본 웹사이트의 모든 콘텐츠, 디자인, 코드, 로고 등은 BION의 지적재산이며, 
              저작권법 및 기타 지적재산권법에 의해 보호됩니다. 
              무단 사용, 복제, 배포는 법적 조치의 대상이 될 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              4. 면책조항
            </h2>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 dark:border-yellow-600 rounded-xl p-6">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong>중요:</strong> 본 서비스는 "있는 그대로" 제공되며, 다음 사항에 대해 책임을 지지 않습니다:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-yellow-600 dark:text-yellow-400 mr-2">⚠</span>
                  <span><strong>정확성:</strong> 계산 결과 및 정보의 정확성은 보장되지 않습니다</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 dark:text-yellow-400 mr-2">⚠</span>
                  <span><strong>의료/법률/금융 조언:</strong> 본 서비스는 전문가의 조언을 대체하지 않습니다</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 dark:text-yellow-400 mr-2">⚠</span>
                  <span><strong>손실 및 손해:</strong> 서비스 사용으로 인한 직간접적 손실에 대해 책임지지 않습니다</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 dark:text-yellow-400 mr-2">⚠</span>
                  <span><strong>서비스 중단:</strong> 예고 없이 서비스가 중단되거나 변경될 수 있습니다</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              5. 제3자 링크 및 광고
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              본 웹사이트는 제3자 광고(Google AdSense 등) 및 외부 링크를 포함할 수 있습니다. 
              이러한 제3자 서비스는 자체 이용약관 및 개인정보 보호정책을 가지고 있으며, 
              당사는 제3자 웹사이트 또는 서비스에 대해 책임을 지지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              6. 서비스 변경 및 종료
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              당사는 사전 통지 없이 서비스의 전부 또는 일부를 변경, 중단, 종료할 수 있는 권리를 보유합니다. 
              서비스 변경으로 인한 손실이나 불편에 대해 당사는 책임을 지지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              7. 개인정보 보호
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              귀하의 개인정보 처리 방법에 대해서는 별도의 <Link href="/privacy" className="text-red-600 dark:text-red-400 hover:underline font-semibold">개인정보 보호정책</Link>을 참조하시기 바랍니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              8. 약관 변경
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              당사는 필요에 따라 본 약관을 변경할 수 있습니다. 
              변경된 약관은 본 페이지에 게시되며, 중요한 변경 사항이 있을 경우 별도로 공지합니다. 
              변경 후 서비스를 계속 이용하시면 변경된 약관에 동의하는 것으로 간주됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              9. 준거법 및 관할
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              본 약관은 대한민국 법률에 따라 해석되고 적용됩니다. 
              본 서비스와 관련된 분쟁은 관할 법원의 전속 관할에 따릅니다.
            </p>
          </section>

          <section className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl border-2 border-red-200 dark:border-red-900">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              10. 문의하기
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              본 이용약관과 관련하여 궁금한 점이 있으시면 
              언제든지 <Link href="/contact" className="text-red-600 dark:text-red-400 hover:underline font-semibold">문의 페이지</Link>를 통해 연락해주세요.
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              <strong>운영자:</strong> Kim Seu Jun (김서준)<br />
              <strong>사이트:</strong> BION (bionvibe.com)
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

