'use client';

import { useState } from 'react';
import { useSupabase } from '@/lib/supabase-provider';
import PremiumCard from './ui/PremiumCard';
import PremiumButton from './ui/PremiumButton';

interface SimpleAuthProps {
  onSuccess?: () => void;
}

export default function SimpleAuth({ onSuccess }: SimpleAuthProps) {
  const supabase = useSupabase();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setIsLoading(true);
    setMessage('');

    try {
      // 아이디를 이메일 형식으로 변환 (username@local.app)
      const email = `${username}@local.app`;

      // 먼저 로그인 시도
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        // 로그인 실패하면 자동으로 회원가입
        if (loginError.message.includes('Invalid') || loginError.message.includes('not found')) {
          setMessage('🔄 새 계정 생성 중...');

          const { data: signupData, error: signupError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: undefined, // 이메일 확인 불필요
            }
          });

          if (signupError) {
            setMessage(`❌ ${signupError.message}`);
          } else {
            setMessage('✅ 계정이 생성되었습니다!');
            onSuccess?.();
          }
        } else {
          setMessage(`❌ ${loginError.message}`);
        }
      } else {
        setMessage('✅ 로그인 성공!');
        onSuccess?.();
      }
    } catch (error: any) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PremiumCard hover gradient className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          🔐 로그인
        </h2>
        <p className="text-white/80 text-sm">
          아이디와 비밀번호를 입력하세요
        </p>
        <p className="text-white/60 text-xs mt-2">
          처음 입력하는 정보는 자동으로 저장됩니다
        </p>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label className="text-white font-medium mb-2 block text-sm">
            👤 아이디
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="나만의 아이디"
            required
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
            style={{ fontSize: '16px' }}
            autoComplete="username"
          />
        </div>

        <div>
          <label className="text-white font-medium mb-2 block text-sm">
            🔑 비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="최소 6자 이상"
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
            style={{ fontSize: '16px' }}
            autoComplete="current-password"
          />
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            message.startsWith('✅') || message.startsWith('🔄')
              ? 'bg-green-500/20 text-green-200 border border-green-500/30'
              : 'bg-red-500/20 text-red-200 border border-red-500/30'
          }`}>
            {message}
          </div>
        )}

        <PremiumButton
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={isLoading}
          icon={isLoading ? '⏳' : '🔐'}
        >
          {isLoading ? '처리 중...' : '로그인'}
        </PremiumButton>
      </form>

      <div className="mt-6 text-center">
        <p className="text-white/60 text-xs">
          💡 Tip: 처음 사용하는 아이디는 자동으로 계정이 생성됩니다
        </p>
      </div>
    </PremiumCard>
  );
}
