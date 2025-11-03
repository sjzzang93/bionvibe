'use client';

import { useState } from 'react';
import { Metadata } from 'next';

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState<'weak' | 'medium' | 'strong' | ''>('');

  const generatePassword = () => {
    let charset = '';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (includeUppercase) charset += uppercase;
    if (includeLowercase) charset += lowercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    if (charset === '') {
      alert('최소 한 가지 옵션을 선택해주세요!');
      return;
    }

    let newPassword = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    // 각 카테고리에서 최소 1개씩 포함
    if (includeUppercase) newPassword += uppercase[array[0] % uppercase.length];
    if (includeLowercase) newPassword += lowercase[array[1] % lowercase.length];
    if (includeNumbers) newPassword += numbers[array[2] % numbers.length];
    if (includeSymbols) newPassword += symbols[array[3] % symbols.length];

    // 나머지 길이만큼 랜덤 생성
    for (let i = newPassword.length; i < length; i++) {
      newPassword += charset[array[i] % charset.length];
    }

    // 섞기
    newPassword = newPassword.split('').sort(() => Math.random() - 0.5).join('');

    setPassword(newPassword);
    calculateStrength(newPassword);
  };

  const calculateStrength = (pwd: string) => {
    let score = 0;

    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (pwd.length >= 16) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(pwd)) score++;

    if (score <= 3) setStrength('weak');
    else if (score <= 5) setStrength('medium');
    else setStrength('strong');
  };

  const copyToClipboard = async () => {
    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('복사에 실패했습니다.');
    }
  };

  const getStrengthColor = () => {
    switch (strength) {
      case 'weak': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'strong': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getStrengthText = () => {
    switch (strength) {
      case 'weak': return '약함 😰';
      case 'medium': return '보통 😐';
      case 'strong': return '강력함 💪';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-4 shadow-lg">
            <span className="text-4xl">🔐</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            비밀번호 생성기
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            암호학적으로 안전한 비밀번호를 생성하세요
          </p>
        </div>

        {/* 생성된 비밀번호 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              생성된 비밀번호
            </label>
            <div className="relative">
              <input
                type="text"
                value={password}
                readOnly
                placeholder="생성 버튼을 눌러주세요"
                className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-lg font-mono focus:outline-none focus:border-purple-500 dark:text-white"
              />
              <button
                onClick={copyToClipboard}
                disabled={!password}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
                title="복사"
              >
                {copied ? '✓' : '📋'}
              </button>
            </div>
          </div>

          {strength && (
            <div className={`text-center font-semibold ${getStrengthColor()}`}>
              보안 강도: {getStrengthText()}
            </div>
          )}
        </div>

        {/* 옵션 설정 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            설정
          </h2>

          {/* 길이 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              길이: {length}자
            </label>
            <input
              type="range"
              min="4"
              max="64"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>4</span>
              <span>64</span>
            </div>
          </div>

          {/* 체크박스 옵션 */}
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-gray-700 dark:text-gray-300">
                대문자 포함 (A-Z)
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-gray-700 dark:text-gray-300">
                소문자 포함 (a-z)
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-gray-700 dark:text-gray-300">
                숫자 포함 (0-9)
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-gray-700 dark:text-gray-300">
                특수문자 포함 (!@#$%...)
              </span>
            </label>
          </div>
        </div>

        {/* 생성 버튼 */}
        <button
          onClick={generatePassword}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
        >
          🔐 비밀번호 생성하기
        </button>

        {/* 보안 팁 */}
        <div className="mt-8 bg-blue-50 dark:bg-gray-800 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-900">
          <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
            <span>🛡️</span>
            <span>보안 팁</span>
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>• 최소 12자 이상의 비밀번호를 사용하세요</li>
            <li>• 대문자, 소문자, 숫자, 특수문자를 모두 포함하세요</li>
            <li>• 사이트마다 다른 비밀번호를 사용하세요</li>
            <li>• 비밀번호 관리자를 사용하여 안전하게 저장하세요</li>
            <li>• 정기적으로 비밀번호를 변경하세요</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
