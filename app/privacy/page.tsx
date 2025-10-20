import Link from 'next/link';

export default function PrivacyPage() {
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
          개인정보 보호정책
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              최종 업데이트: 2025년 1월
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              BION("우리", "당사", "저희")은 귀하의 개인정보를 소중히 여기며, 
              본 개인정보 보호정책을 통해 귀하의 정보가 어떻게 수집, 사용 및 보호되는지 설명합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              1. 수집하는 정보
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              BION은 다음과 같은 정보를 수집할 수 있습니다:
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                <span><strong>자동 수집 정보:</strong> IP 주소, 브라우저 유형, 장치 정보, 방문 페이지, 체류 시간 등</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                <span><strong>쿠키 및 유사 기술:</strong> 사용자 경험 개선 및 분석을 위해 쿠키를 사용합니다</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                <span><strong>로컬 스토리지:</strong> 즐겨찾기, 다크모드 설정 등 사용자 설정을 저장합니다 (기기에만 저장됨)</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              2. 정보 사용 목적
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              수집된 정보는 다음과 같은 목적으로 사용됩니다:
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                <span>서비스 제공 및 개선</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                <span>사용자 경험 최적화</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                <span>웹사이트 분석 및 통계</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                <span>법적 의무 준수</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              3. 제3자 서비스
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              본 웹사이트는 다음과 같은 제3자 서비스를 사용합니다:
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                <span><strong>Google AdSense:</strong> 광고 게재를 위해 쿠키 및 웹 비콘을 사용할 수 있습니다</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                <span><strong>Vercel:</strong> 호스팅 서비스 제공업체</span>
              </li>
            </ul>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-4">
              제3자 서비스는 자체 개인정보 보호정책에 따라 운영되며, 
              해당 서비스의 정책을 확인하시기 바랍니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              4. 정보 보안
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              당사는 귀하의 정보를 보호하기 위해 업계 표준 보안 조치를 시행하고 있습니다. 
              모든 데이터 전송은 HTTPS를 통해 암호화됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              5. 사용자 권리
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              귀하는 다음과 같은 권리를 가집니다:
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                <span>수집된 개인정보에 대한 접근 및 정정 요청</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                <span>개인정보 삭제 요청</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                <span>쿠키 사용 거부 (브라우저 설정을 통해)</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              6. 어린이 개인정보 보호
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              본 서비스는 13세 미만 어린이를 대상으로 하지 않으며, 
              의도적으로 어린이의 개인정보를 수집하지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              7. 정책 변경
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              본 개인정보 보호정책은 필요에 따라 업데이트될 수 있습니다. 
              변경 사항은 본 페이지에 게시되며, 중요한 변경 사항이 있을 경우 별도로 안내해드립니다.
            </p>
          </section>

          <section className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl border-2 border-red-200 dark:border-red-900">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              8. 문의하기
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              개인정보 보호와 관련하여 궁금한 점이나 우려 사항이 있으시면 
              언제든지 <Link href="/contact" className="text-red-600 dark:text-red-400 hover:underline font-semibold">문의 페이지</Link>를 통해 연락해주세요.
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              <strong>운영자:</strong> Kim Seu Jun<br />
              <strong>사이트:</strong> BION (bionvibe.com)
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

