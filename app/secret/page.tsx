'use client';

import { getHiddenApps } from '@/lib/getApps';
import Link from 'next/link';
import { useState } from 'react';

export default function SecretPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const hiddenApps = getHiddenApps();

  const handleUnlock = () => {
    if (password === '123!8314') {
      setUnlocked(true);
    } else {
      alert('❌ 비밀번호가 틀렸습니다!');
      setPassword('');
    }
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <div className="text-7xl mb-4 animate-pulse">🔐</div>
              <h1 className="text-4xl font-extrabold text-white mb-2">
                Secret Vault
              </h1>
              <p className="text-gray-300">
                비밀번호를 입력하세요
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                placeholder="비밀번호 입력"
                className="w-full px-4 py-3 rounded-xl bg-white/20 border-2 border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 text-center text-lg font-mono"
                autoFocus
              />
              
              <button
                onClick={handleUnlock}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                🔓 열기
              </button>

              <Link
                href="/"
                className="block w-full bg-white/10 text-white px-6 py-3 rounded-xl font-bold text-center hover:bg-white/20 transition-all"
              >
                ← 돌아가기
              </Link>
            </div>

            <div className="mt-6 text-center text-white/50 text-xs">
              💡 힌트: BION 로고를 1초에 7번 클릭하면 여기로 올 수 있어요!
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-7xl mb-4 animate-bounce">🔓</div>
          <h1 className="text-5xl font-extrabold text-white mb-4">
            Secret Vault
          </h1>
          <p className="text-gray-300 text-lg">
            특별한 웹앱들이 여기 숨어있어요 👀
          </p>
        </div>

        {/* Hidden Apps Grid */}
        {hiddenApps.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🎁</div>
            <h3 className="text-2xl font-bold text-white mb-4">
              아직 비밀 웹앱이 없어요
            </h3>
            <p className="text-gray-400">
              곧 특별한 기능들이 추가될 예정입니다!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-12">
            {hiddenApps.map((app) => (
              <Link
                key={app.id}
                href={app.url}
                className="group relative bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 border border-white/20 hover:border-purple-400"
              >
                {/* App Image */}
                {app.image && (
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={app.image}
                      alt={app.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute top-2 right-2">
                      <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        SECRET
                      </span>
                    </div>
                  </div>
                )}
                
                {/* App Info */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl">{app.icon}</span>
                    <h3 className="text-sm font-bold text-white truncate">
                      {app.name}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-300 line-clamp-2">
                    {app.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Admin Tools */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border-2 border-white/10 mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            🛠️ 관리 도구
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/secret/image-manager"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-xl font-bold text-center hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              🖼️ 이미지 관리 도구
            </Link>
            <div className="bg-white/10 text-white/30 px-6 py-4 rounded-xl font-bold text-center cursor-not-allowed">
              🔜 더 많은 도구 준비 중
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-block bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all border border-white/20"
          >
            ← 메인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
