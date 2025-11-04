'use client';

import { useState, useEffect } from 'react';

type Schedule = {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  addressDetail: string;
  date: string;
  time: string;
  installationType: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
};

export default function InstallationSchedulerPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    address: '',
    addressDetail: '',
    date: '',
    time: '',
    installationType: 'aircon',
    notes: '',
  });

  // 로컬 스토리지에서 일정 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('installation-schedules');
    if (saved) {
      setSchedules(JSON.parse(saved));
    }
  }, []);

  // 로컬 스토리지에 저장
  const saveToLocalStorage = (newSchedules: Schedule[]) => {
    localStorage.setItem('installation-schedules', JSON.stringify(newSchedules));
    setSchedules(newSchedules);
  };

  // 문자 메시지 생성
  const generateSMS = (schedule: Schedule) => {
    return `[설치 예약 확인]
고객명: ${schedule.customerName}
일시: ${schedule.date} ${schedule.time}
주소: ${schedule.address} ${schedule.addressDetail}
설치 종류: ${getInstallationTypeName(schedule.installationType)}
${schedule.notes ? `\n메모: ${schedule.notes}` : ''}

감사합니다.`;
  };

  // 문자 보내기 (실제로는 SMS API 연동 필요)
  const sendSMS = (schedule: Schedule) => {
    const message = generateSMS(schedule);

    // 실제 구현 시에는 SMS API (예: Twilio, 카카오 알림톡 등) 사용
    // 현재는 클립보드에 복사
    navigator.clipboard.writeText(message);
    alert(`문자 내용이 클립보드에 복사되었습니다!\n\n전화번호: ${schedule.customerPhone}\n\n${message}`);
  };

  // 예약 추가
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newSchedule: Schedule = {
      id: Date.now().toString(),
      ...formData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const newSchedules = [...schedules, newSchedule];
    saveToLocalStorage(newSchedules);

    // 자동으로 문자 전송
    sendSMS(newSchedule);

    // 폼 초기화
    setFormData({
      customerName: '',
      customerPhone: '',
      address: '',
      addressDetail: '',
      date: '',
      time: '',
      installationType: 'aircon',
      notes: '',
    });
    setShowForm(false);
  };

  // 상태 변경
  const updateStatus = (id: string, status: Schedule['status']) => {
    const newSchedules = schedules.map(s =>
      s.id === id ? { ...s, status } : s
    );
    saveToLocalStorage(newSchedules);
  };

  // 삭제
  const deleteSchedule = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const newSchedules = schedules.filter(s => s.id !== id);
      saveToLocalStorage(newSchedules);
    }
  };

  const getInstallationTypeName = (type: string) => {
    const types: { [key: string]: string } = {
      aircon: '에어컨',
      internet: '인터넷',
      tv: 'TV',
      appliance: '가전제품',
      furniture: '가구',
      other: '기타',
    };
    return types[type] || type;
  };

  const getStatusColor = (status: Schedule['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    };
    return colors[status];
  };

  const getStatusName = (status: Schedule['status']) => {
    const names = {
      pending: '대기중',
      confirmed: '확정',
      completed: '완료',
      cancelled: '취소',
    };
    return names[status];
  };

  // 날짜별로 정렬
  const sortedSchedules = [...schedules].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-4 shadow-lg">
            <span className="text-4xl">📅</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            설치 예약 스케줄러
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            예약 정보를 입력하면 자동으로 문자가 전송됩니다
          </p>
        </div>

        {/* 새 예약 버튼 */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full mb-6 py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
        >
          {showForm ? '❌ 취소' : '➕ 새 예약 추가'}
        </button>

        {/* 예약 폼 */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 고객 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    고객명 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 dark:text-white"
                    placeholder="홍길동"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    연락처 *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 dark:text-white"
                    placeholder="010-1234-5678"
                  />
                </div>
              </div>

              {/* 주소 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  주소 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 dark:text-white"
                  placeholder="서울시 강남구 테헤란로 123"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  상세 주소
                </label>
                <input
                  type="text"
                  value={formData.addressDetail}
                  onChange={(e) => setFormData({ ...formData, addressDetail: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 dark:text-white"
                  placeholder="101동 1001호"
                />
              </div>

              {/* 날짜 시간 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    설치 날짜 *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    설치 시간 *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 dark:text-white"
                  />
                </div>
              </div>

              {/* 설치 종류 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  설치 종류 *
                </label>
                <select
                  value={formData.installationType}
                  onChange={(e) => setFormData({ ...formData, installationType: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 dark:text-white"
                >
                  <option value="aircon">에어컨</option>
                  <option value="internet">인터넷</option>
                  <option value="tv">TV</option>
                  <option value="appliance">가전제품</option>
                  <option value="furniture">가구</option>
                  <option value="other">기타</option>
                </select>
              </div>

              {/* 메모 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  메모
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 dark:text-white"
                  placeholder="특이사항이나 요청사항을 입력하세요"
                />
              </div>

              {/* 제출 버튼 */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg transition-all"
              >
                📱 예약 추가 및 문자 전송
              </button>
            </form>
          </div>
        )}

        {/* 예약 목록 */}
        <div className="space-y-4">
          {sortedSchedules.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-lg">
              <span className="text-6xl mb-4 block">📭</span>
              <p className="text-gray-500 dark:text-gray-400">
                예약 내역이 없습니다
              </p>
            </div>
          ) : (
            sortedSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                      {schedule.customerName}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {schedule.customerPhone}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(schedule.status)}`}>
                    {getStatusName(schedule.status)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <span>📍</span>
                    <span>{schedule.address} {schedule.addressDetail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <span>📅</span>
                    <span>{schedule.date} {schedule.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <span>🔧</span>
                    <span>{getInstallationTypeName(schedule.installationType)}</span>
                  </div>
                  {schedule.notes && (
                    <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                      <span>📝</span>
                      <span>{schedule.notes}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => sendSMS(schedule)}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors"
                  >
                    📱 문자 재전송
                  </button>
                  <button
                    onClick={() => updateStatus(schedule.id, 'confirmed')}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                  >
                    ✓ 확정
                  </button>
                  <button
                    onClick={() => updateStatus(schedule.id, 'completed')}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                  >
                    ✓ 완료
                  </button>
                  <button
                    onClick={() => deleteSchedule(schedule.id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
                  >
                    🗑️ 삭제
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 안내 */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-900">
          <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-3">
            💡 사용 안내
          </h3>
          <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-200">
            <li>• 예약 추가 시 자동으로 문자 내용이 클립보드에 복사됩니다</li>
            <li>• 복사된 내용을 SMS 앱에 붙여넣어 전송하세요</li>
            <li>• 모든 데이터는 브라우저에 저장됩니다 (로컬 스토리지)</li>
            <li>• 실제 자동 문자 전송은 SMS API 연동이 필요합니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
