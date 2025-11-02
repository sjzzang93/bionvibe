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
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setIsLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        // 로그인
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setMessage(`❌ ${error.message}`);
        } else {
          setMessage('✅ 로그인 성공!');
          onSuccess?.();
        }
      } else {
        // 회원가입
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setMessage(`❌ ${error.message}`);
        } else {
          setMessage('✅ 회원가입 성공! 이메일을 확인해주세요.');
        }
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
          {isLogin ? '🔐 로그인' : '✨ 회원가입'}
        </h2>
        <p className="text-white/80 text-sm">
          {isLogin ? '계정에 로그인하세요' : '새 계정을 만드세요'}
        </p>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label className="text-white font-medium mb-2 block text-sm">
            📧 이메일
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
            style={{ fontSize: '16px' }}
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
          />
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            message.startsWith('✅')
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
          icon={isLoading ? '⏳' : (isLogin ? '🔐' : '✨')}
        >
          {isLoading ? '처리 중...' : (isLogin ? '로그인' : '회원가입')}
        </PremiumButton>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage('');
          }}
          className="text-white/80 hover:text-white text-sm underline transition-colors"
        >
          {isLogin ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
        </button>
      </div>
    </PremiumCard>
  );
}
