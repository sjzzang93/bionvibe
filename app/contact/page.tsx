'use client';

import Link from 'next/link';
import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { useSupabase } from '@/lib/supabase-provider';

export default function ContactPage() {
  const supabase = useSupabase();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError('현재 문의 접수가 잠시 중단되어 있습니다. 관리자에게 직접 연락해 주세요.');
      return;
    }
    setSending(true);
    setError('');

    try {
      // 1. Supabase에 저장 (먼저 DB에 저장)
      const { error: dbError } = await supabase
        .from('contacts')
        .insert({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          status: 'pending'
        });

      if (dbError) {
        console.error('DB 저장 실패:', dbError);
        // DB 저장 실패해도 이메일은 계속 시도
      }

      // 2. EmailJS로 이메일 전송
      try {
        await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID',
          {
            from_name: formData.name,
            from_email: formData.email,
            message: formData.message,
            to_email: 'wa8106@naver.com'
          },
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY'
        );
      } catch (emailError) {
        console.error('이메일 전송 실패:', emailError);
        // 이메일 실패해도 DB에는 저장됨
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 3000);
    } catch (err) {
      console.error('문의 전송 실패:', err);
      setError('메시지 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link 
          href="/" 
          className="inline-flex items-center text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 mb-8 transition-colors"
        >
          ← 홈으로 돌아가기
        </Link>

        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">
          🎉 이벤트 & 문의
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
          새로운 기능 요청부터 일반적인 문의까지 언제든 환영합니다. 아래 양식으로 신청하거나, 하단의
          연락처로 직접 메일을 보내주셔도 됩니다.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              요청하고 싶은 웹앱 또는 프로그램을 작성해주세요!<br />
              방명록을 남기신 후 아래 양식으로 신청하시면<br />
              원하시는 기능을 개발해드립니다. 🎯
            </p>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                📩 일반 문의 전용
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                서비스 이용 관련 질문이나 제휴·협업 문의는{' '}
                <a
                  href="mailto:wa8106@naver.com"
                  className="font-semibold text-red-600 dark:text-red-400 underline"
                >
                  wa8106@naver.com
                </a>
                으로 직접 메일을 보내주셔도 빠르게 답변드릴 수 있어요.
              </p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-300 dark:border-orange-700 rounded-xl p-4 mb-6">
              <p className="text-sm text-orange-800 dark:text-orange-200 leading-relaxed">
                💡 <strong>예시:</strong> 코인자동매매 프로그램, 주식 분석 도구, 식당 이벤트용 QR, 와이파이 QR, 네이버리뷰 QR 등
              </p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 dark:border-red-600 rounded-xl p-4 mb-4 text-center">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {submitted ? (
              <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-600 rounded-xl p-8 text-center">
                <div className="text-6xl mb-4">✓</div>
                <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">
                  메시지 전송 완료!
                </h3>
                <p className="text-green-600 dark:text-green-500">
                  빠른 시일 내에 답변드리겠습니다.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    이름
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-colors"
                    placeholder="홍길동"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    이메일
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    메시지
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-colors resize-none"
                    placeholder="문의하실 내용을 입력해주세요..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 dark:from-red-500 dark:to-rose-500 dark:hover:from-red-600 dark:hover:to-rose-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {sending ? '전송 중...' : '메시지 보내기'}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border-2 border-red-200 dark:border-red-900">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                📧 연락처 정보
              </h3>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <div className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                  <div>
                    <strong>운영자:</strong> Kim Seu Jun (김서준)
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                  <div>
                    <strong>웹사이트:</strong> bionvibe.com
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                  <div>
                    <strong>인스타그램:</strong>{' '}
                    <a 
                      href="https://www.instagram.com/BION_Vibe" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline"
                    >
                      @BION_Vibe
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                  <div>
                    <strong>응답 시간:</strong> 보통 1-2 영업일 이내
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-sky-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-900">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                💡 자주 묻는 질문
              </h3>
              <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                <div>
                  <strong className="text-blue-600 dark:text-blue-400">Q: BION은 무료인가요?</strong>
                  <p className="mt-1">A: 네, 모든 웹앱은 무료로 사용 가능합니다!</p>
                </div>
                <div>
                  <strong className="text-blue-600 dark:text-blue-400">Q: 새로운 기능을 제안할 수 있나요?</strong>
                  <p className="mt-1">A: 물론입니다! 언제든 문의해주세요.</p>
                </div>
                <div>
                  <strong className="text-blue-600 dark:text-blue-400">Q: 개인정보는 안전한가요?</strong>
                  <p className="mt-1">A: <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">개인정보 보호정책</Link>을 참고해주세요.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border-2 border-green-200 dark:border-green-900">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                🌟 피드백 환영!
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                BION을 더 나은 서비스로 만들기 위해 
                귀하의 의견을 소중히 여깁니다. 
                작은 제안이라도 큰 변화를 만들어낼 수 있습니다!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
