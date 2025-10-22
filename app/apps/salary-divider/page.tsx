"use client";

import { useState } from 'react';

import AppFooter from "@/app/components/AppFooter";
interface Expense {
  id: string;
  name: string;
  amount: number;
  type: 'fixed' | 'variable';
}

const FIXED_EXPENSE_TEMPLATES = [
  '월세/전세 대출', '관리비', '통신비', '보험료', '구독료 (넷플릭스 등)',
  '헬스장', '학원비', '교통비 (정기권)', '대출 상환', '적금/예금'
];

const VARIABLE_EXPENSE_TEMPLATES = [
  '식비', '외식비', '카페/음료', '쇼핑', '문화생활', 
  '교통비', '경조사비', '미용', '병원비', '기타'
];

export default function SalaryDivider() {
  const [salary, setSalary] = useState(3000000);
  const [method, setMethod] = useState<'503020' | '622010' | 'custom'>('503020');
  const [customRatios, setCustomRatios] = useState({ needs: 50, wants: 30, savings: 20 });
  const [fixedExpenses, setFixedExpenses] = useState<Expense[]>([]);
  const [variableExpenses, setVariableExpenses] = useState<Expense[]>([]);
  const [showAddExpense, setShowAddExpense] = useState<'fixed' | 'variable' | null>(null);
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState(0);

  const getRatios = () => {
    if (method === '503020') return { needs: 50, wants: 30, savings: 20 };
    if (method === '622010') return { needs: 60, wants: 20, savings: 20 };
    return customRatios;
  };

  const ratios = getRatios();
  const amounts = {
    needs: Math.round(salary * ratios.needs / 100),
    wants: Math.round(salary * ratios.wants / 100),
    savings: Math.round(salary * ratios.savings / 100)
  };

  const totalFixed = fixedExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalVariable = variableExpenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingNeeds = amounts.needs - totalFixed;
  const remainingWants = amounts.wants - totalVariable;

  const addExpense = (type: 'fixed' | 'variable') => {
    if (!newExpenseName || newExpenseAmount <= 0) return;

    const newExpense: Expense = {
      id: Date.now().toString(),
      name: newExpenseName,
      amount: newExpenseAmount,
      type
    };

    if (type === 'fixed') {
      setFixedExpenses([...fixedExpenses, newExpense]);
    } else {
      setVariableExpenses([...variableExpenses, newExpense]);
    }

    setNewExpenseName('');
    setNewExpenseAmount(0);
    setShowAddExpense(null);
  };

  const deleteExpense = (id: string, type: 'fixed' | 'variable') => {
    if (type === 'fixed') {
      setFixedExpenses(fixedExpenses.filter(e => e.id !== id));
    } else {
      setVariableExpenses(variableExpenses.filter(e => e.id !== id));
    }
  };

  const getSavingsGoal = () => {
    const monthly = amounts.savings;
    return {
      month1: monthly,
      month3: monthly * 3,
      month6: monthly * 6,
      year1: monthly * 12,
      year3: monthly * 36,
      year5: monthly * 60
    };
  };

  const savingsGoal = getSavingsGoal();

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900 dark:via-green-900 dark:to-teal-900 text-black dark:text-white placeholder-gray-500 transition-colors">
      <div className="mx-auto max-w-[800px] px-4 py-6 text-black placeholder-gray-500">
        <div className="mb-4 text-black placeholder-gray-500">
          
        </div>

        <section className="bg-white rounded sm:rounded-lg md:rounded-2xl shadow-xl p-6 mb-6 text-black placeholder-gray-500">
          <header className="text-center mb-6 text-black placeholder-gray-500">
            <h1 className="text-4xl font-bold mb-2 text-black placeholder-gray-500">💰</h1>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2 text-black placeholder-gray-500">
              월급 자동 배분 계산기
            </h2>
            <p className="text-gray-600 text-black placeholder-gray-500">똑똑한 재테크의 시작</p>
          </header>

          {/* 월급 입력 */}
          <div className="mb-6 text-black placeholder-gray-500">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-black placeholder-gray-500">월 수입 (세후)</label>
            <div className="flex items-center gap-2 text-black placeholder-gray-500">
              <input
                type="number"
                step="100000"
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              />
              <span className="text-xl font-bold text-gray-700 text-black placeholder-gray-500">원</span>
            </div>
          </div>

          {/* 배분 방식 선택 */}
          <div className="mb-6 text-black placeholder-gray-500">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-black placeholder-gray-500">배분 방식</label>
            <div className="grid grid-cols-3 gap-3 text-black placeholder-gray-500">
              <button
        type="button"
                onClick={() => setMethod('503020')}
                className={`p-2 md:p-4 rounded-xl font-semibold transition-all border-2 ${
                  method === '503020'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-transparent shadow-lg'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                <div className="text-sm mb-1 text-black placeholder-gray-500">50-30-20</div>
                <div className="text-xs opacity-80 text-black placeholder-gray-500">균형잡힌</div>
              </button>
              <button
        type="button"
                onClick={() => setMethod('622010')}
                className={`p-2 md:p-4 rounded-xl font-semibold transition-all border-2 ${
                  method === '622010'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-transparent shadow-lg'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                <div className="text-sm mb-1 text-black placeholder-gray-500">60-20-20</div>
                <div className="text-xs opacity-80 text-black placeholder-gray-500">안정적</div>
              </button>
              <button
        type="button"
                onClick={() => setMethod('custom')}
                className={`p-2 md:p-4 rounded-xl font-semibold transition-all border-2 ${
                  method === 'custom'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white border-transparent shadow-lg'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                <div className="text-sm mb-1 text-black placeholder-gray-500">커스텀</div>
                <div className="text-xs opacity-80 text-black placeholder-gray-500">맞춤 설정</div>
              </button>
            </div>
          </div>

          {/* 커스텀 비율 */}
          {method === 'custom' && (
            <div className="mb-6 p-4 bg-purple-50 rounded-xl border-2 border-purple-300 text-black placeholder-gray-500">
              <h3 className="font-semibold text-black mb-0.5 sm:mb-1.5 md:mb-2 text-black placeholder-gray-500">비율 직접 설정</h3>
              <div className="space-y-3 text-black placeholder-gray-500">
                {[
                  { key: 'needs', label: '필수지출' },
                  { key: 'wants', label: '여유자금' },
                  { key: 'savings', label: '저축' }
                ].map(item => (
                  <div key={item.key}>
                    <div className="flex justify-between text-sm mb-1 text-black placeholder-gray-500">
                      <span>{item.label}</span>
                      <span className="font-bold text-black placeholder-gray-500">{customRatios[item.key as keyof typeof customRatios]}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={customRatios[item.key as keyof typeof customRatios]}
                      onChange={(e) => setCustomRatios({...customRatios, [item.key]: Number(e.target.value)})}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                ))}
                <div className="text-xs text-black text-center text-black placeholder-gray-500">
                  합계: {customRatios.needs + customRatios.wants + customRatios.savings}% (100%가 되도록 조정하세요)
                </div>
              </div>
            </div>
          )}

          {/* 배분 결과 */}
          <div className="mb-6 space-y-4 text-black placeholder-gray-500">
            {/* 필수지출 */}
            <div className="p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-300 text-black placeholder-gray-500">
              <div className="flex justify-between items-center mb-0.5 sm:mb-1.5 md:mb-2 text-black placeholder-gray-500">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 text-black placeholder-gray-500">🏠 필수지출 (고정지출)</h3>
                  <p className="text-xs text-gray-600 text-black placeholder-gray-500">월세, 관리비, 통신비, 보험 등</p>
                </div>
                <div className="text-right text-black placeholder-gray-500">
                  <div className="text-3xl font-bold text-black text-black placeholder-gray-500">
                    {(amounts.needs / 10000).toFixed(0)}만
                  </div>
                  <div className="text-xs text-gray-600 text-black placeholder-gray-500">{ratios.needs}%</div>
                </div>
              </div>

              {fixedExpenses.length > 0 && (
                <div className="mb-0.5 sm:mb-1.5 md:mb-2 space-y-2 text-black placeholder-gray-500">
                  {fixedExpenses.map(exp => (
                    <div key={exp.id} className="flex justify-between items-center p-2 bg-white rounded text-black placeholder-gray-500">
                      <span className="text-sm text-gray-700 text-black placeholder-gray-500">{exp.name}</span>
                      <div className="flex items-center gap-2 text-black placeholder-gray-500">
                        <span className="font-bold text-gray-800 text-black placeholder-gray-500">{(exp.amount / 10000).toFixed(0)}만</span>
                        <button
        type="button"
                          onClick={() => deleteExpense(exp.id, 'fixed')}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
        type="button"
                onClick={() => setShowAddExpense(showAddExpense === 'fixed' ? null : 'fixed')}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              >
                + 고정지출 추가
              </button>

              {showAddExpense === 'fixed' && (
                <div className="mt-3 p-3 bg-white rounded-lg space-y-2 text-black placeholder-gray-500">
                  <select
                    value={newExpenseName}
                    onChange={(e) => setNewExpenseName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                  >
                    <option value="">항목 선택</option>
                    {FIXED_EXPENSE_TEMPLATES.map((item, i) => (
                      <option key={i} value={item}>{item}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="10000"
                    value={newExpenseAmount}
                    onChange={(e) => setNewExpenseAmount(Number(e.target.value))}
                    placeholder="금액 (원)"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                  />
                  <button
        type="button"
                    onClick={() => addExpense('fixed')}
                    disabled={!newExpenseName || newExpenseAmount <= 0}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                  >
                    추가
                  </button>
                </div>
              )}

              {remainingNeeds !== amounts.needs && (
                <div className="mt-3 p-3 bg-white rounded-lg text-center text-black placeholder-gray-500">
                  <div className="text-sm text-gray-600 text-black placeholder-gray-500">남은 예산</div>
                  <div className={`text-xl font-bold ${remainingNeeds >= 0 ? 'text-black' : 'text-black'}`}>
                    {(remainingNeeds / 10000).toFixed(0)}만원
                  </div>
                </div>
              )}
            </div>

            {/* 여유자금 */}
            <div className="p-5 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-purple-300 text-black placeholder-gray-500">
              <div className="flex justify-between items-center mb-0.5 sm:mb-1.5 md:mb-2 text-black placeholder-gray-500">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 text-black placeholder-gray-500">🎉 여유자금 (변동지출)</h3>
                  <p className="text-xs text-gray-600 text-black placeholder-gray-500">식비, 쇼핑, 문화생활 등</p>
                </div>
                <div className="text-right text-black placeholder-gray-500">
                  <div className="text-3xl font-bold text-black text-black placeholder-gray-500">
                    {(amounts.wants / 10000).toFixed(0)}만
                  </div>
                  <div className="text-xs text-gray-600 text-black placeholder-gray-500">{ratios.wants}%</div>
                </div>
              </div>

              {variableExpenses.length > 0 && (
                <div className="mb-0.5 sm:mb-1.5 md:mb-2 space-y-2 text-black placeholder-gray-500">
                  {variableExpenses.map(exp => (
                    <div key={exp.id} className="flex justify-between items-center p-2 bg-white rounded text-black placeholder-gray-500">
                      <span className="text-sm text-gray-700 text-black placeholder-gray-500">{exp.name}</span>
                      <div className="flex items-center gap-2 text-black placeholder-gray-500">
                        <span className="font-bold text-gray-800 text-black placeholder-gray-500">{(exp.amount / 10000).toFixed(0)}만</span>
                        <button
        type="button"
                          onClick={() => deleteExpense(exp.id, 'variable')}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
        type="button"
                onClick={() => setShowAddExpense(showAddExpense === 'variable' ? null : 'variable')}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              >
                + 변동지출 추가
              </button>

              {showAddExpense === 'variable' && (
                <div className="mt-3 p-3 bg-white rounded-lg space-y-2 text-black placeholder-gray-500">
                  <select
                    value={newExpenseName}
                    onChange={(e) => setNewExpenseName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                  >
                    <option value="">항목 선택</option>
                    {VARIABLE_EXPENSE_TEMPLATES.map((item, i) => (
                      <option key={i} value={item}>{item}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="10000"
                    value={newExpenseAmount}
                    onChange={(e) => setNewExpenseAmount(Number(e.target.value))}
                    placeholder="금액 (원)"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                  />
                  <button
        type="button"
                    onClick={() => addExpense('variable')}
                    disabled={!newExpenseName || newExpenseAmount <= 0}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                  >
                    추가
                  </button>
                </div>
              )}

              {remainingWants !== amounts.wants && (
                <div className="mt-3 p-3 bg-white rounded-lg text-center text-black placeholder-gray-500">
                  <div className="text-sm text-gray-600 text-black placeholder-gray-500">남은 예산</div>
                  <div className={`text-xl font-bold ${remainingWants >= 0 ? 'text-black' : 'text-black'}`}>
                    {(remainingWants / 10000).toFixed(0)}만원
                  </div>
                </div>
              )}
            </div>

            {/* 저축 */}
            <div className="p-5 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border-2 border-yellow-400 text-black placeholder-gray-500">
              <div className="flex justify-between items-center text-black placeholder-gray-500">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 text-black placeholder-gray-500">💎 저축</h3>
                  <p className="text-xs text-gray-600 text-black placeholder-gray-500">미래를 위한 투자</p>
                </div>
                <div className="text-right text-black placeholder-gray-500">
                  <div className="text-3xl font-bold text-black text-black placeholder-gray-500">
                    {(amounts.savings / 10000).toFixed(0)}만
                  </div>
                  <div className="text-xs text-gray-600 text-black placeholder-gray-500">{ratios.savings}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* 저축 시뮬레이션 */}
          <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-300 text-black placeholder-gray-500">
            <h3 className="font-bold text-[10px] sm:text-xs md:text-sm text-gray-800 mb-4 text-black placeholder-gray-500">📊 저축 목표 달성 시뮬레이션</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 text-black placeholder-gray-500">
              <div className="bg-white rounded-lg p-2 sm:p-3 text-center text-black placeholder-gray-500">
                <div className="text-xs text-gray-600 mb-1 text-black placeholder-gray-500">1개월</div>
                <div className="text-lg font-bold text-black text-black placeholder-gray-500">{(savingsGoal.month1 / 10000).toFixed(0)}만</div>
              </div>
              <div className="bg-white rounded-lg p-2 sm:p-3 text-center text-black placeholder-gray-500">
                <div className="text-xs text-gray-600 mb-1 text-black placeholder-gray-500">3개월</div>
                <div className="text-lg font-bold text-black text-black placeholder-gray-500">{(savingsGoal.month3 / 10000).toFixed(0)}만</div>
              </div>
              <div className="bg-white rounded-lg p-2 sm:p-3 text-center text-black placeholder-gray-500">
                <div className="text-xs text-gray-600 mb-1 text-black placeholder-gray-500">6개월</div>
                <div className="text-lg font-bold text-black text-black placeholder-gray-500">{(savingsGoal.month6 / 10000).toFixed(0)}만</div>
              </div>
              <div className="bg-white rounded-lg p-2 sm:p-3 text-center text-black placeholder-gray-500">
                <div className="text-xs text-gray-600 mb-1 text-black placeholder-gray-500">1년</div>
                <div className="text-lg font-bold text-black text-black placeholder-gray-500">{(savingsGoal.year1 / 10000).toFixed(0)}만</div>
              </div>
              <div className="bg-white rounded-lg p-2 sm:p-3 text-center text-black placeholder-gray-500">
                <div className="text-xs text-gray-600 mb-1 text-black placeholder-gray-500">3년</div>
                <div className="text-lg font-bold text-black text-black placeholder-gray-500">{(savingsGoal.year3 / 10000).toFixed(0)}만</div>
              </div>
              <div className="bg-white rounded-lg p-2 sm:p-3 text-center text-black placeholder-gray-500">
                <div className="text-xs text-gray-600 mb-1 text-black placeholder-gray-500">5년</div>
                <div className="text-lg font-bold text-black text-black placeholder-gray-500">{(savingsGoal.year5 / 10000).toFixed(0)}만</div>
              </div>
            </div>
          </div>
        </section>

        {/* 재테크 팁 */}
        <div className="bg-white rounded sm:rounded-lg md:rounded-2xl shadow-lg p-6 text-black placeholder-gray-500">
          <h3 className="font-bold text-xl text-gray-800 mb-4 text-black placeholder-gray-500">💡 재테크 꿀팁</h3>
          <div className="space-y-3 text-sm text-black placeholder-gray-500">
            <div className="p-3 bg-green-50 rounded-lg text-black placeholder-gray-500">
              <span className="font-semibold text-black text-black placeholder-gray-500">🏆 50-30-20 법칙:</span>
              <span className="text-black text-black placeholder-gray-500"> 필수 50% / 여유 30% / 저축 20% (가장 균형잡힌 방식)</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-black placeholder-gray-500">
              <span className="font-semibold text-black text-black placeholder-gray-500">💪 60-20-20 법칙:</span>
              <span className="text-black text-black placeholder-gray-500"> 필수 60% / 여유 20% / 저축 20% (안정 중시)</span>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-black placeholder-gray-500">
              <span className="font-semibold text-black text-black placeholder-gray-500">🎯 저축 먼저:</span>
              <span className="text-black text-black placeholder-gray-500"> 월급 받으면 저축부터! (자동이체 설정)</span>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg text-black placeholder-gray-500">
              <span className="font-semibold text-black text-black placeholder-gray-500">📱 가계부:</span>
              <span className="text-black text-black placeholder-gray-500"> 지출 내역 기록으로 낭비 줄이기</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-black placeholder-gray-500">
              <span className="font-semibold text-black placeholder-gray-500">🚫 충동구매 방지:</span>
              <span className="text-black text-black placeholder-gray-500"> 24시간 법칙 (하루 지나서 사기)</span>
            </div>
          </div>
        </div>
      </div>
      {/* 제작자 서명 */}
      <AppFooter />

    </main>
  );
}

