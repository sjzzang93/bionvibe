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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    address: '',
    addressDetail: '',
    time: '',
    installationType: 'vertical',
    notes: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('installation-schedules');
    if (saved) {
      setSchedules(JSON.parse(saved));
    }
  }, []);

  const saveToLocalStorage = (newSchedules: Schedule[]) => {
    localStorage.setItem('installation-schedules', JSON.stringify(newSchedules));
    setSchedules(newSchedules);
  };

  const generateSMS = (schedule: Schedule) => {
    return `[설치 예약 확인]\n고객명: ${schedule.customerName}\n일시: ${schedule.date} ${schedule.time}\n주소: ${schedule.address} ${schedule.addressDetail}\n설치: ${getInstallationTypeName(schedule.installationType)}${schedule.notes ? `\n메모: ${schedule.notes}` : ''}`;
  };

  const sendSMS = (schedule: Schedule) => {
    const message = generateSMS(schedule);
    navigator.clipboard.writeText(message);
    alert(`문자 복사 완료!\n${schedule.customerPhone}`);
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setShowModal(true);
    setEditingSchedule(null);
    setFormData({
      customerName: '',
      customerPhone: '',
      address: '',
      addressDetail: '',
      time: '',
      installationType: 'aircon',
      notes: '',
    });
  };

  const changeSelectedDate = (newDate: string) => {
    setSelectedDate(newDate);
  };

  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const addDaysToDate = (dateStr: string, days: number) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleEditClick = (schedule: Schedule) => {
    setSelectedDate(schedule.date);
    setEditingSchedule(schedule);
    setFormData({
      customerName: schedule.customerName,
      customerPhone: schedule.customerPhone,
      address: schedule.address,
      addressDetail: schedule.addressDetail,
      time: schedule.time,
      installationType: schedule.installationType,
      notes: schedule.notes,
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingSchedule) {
      const updated = schedules.map(s =>
        s.id === editingSchedule.id
          ? { ...editingSchedule, ...formData, date: selectedDate! }
          : s
      );
      saveToLocalStorage(updated);
    } else {
      const newSchedule: Schedule = {
        id: Date.now().toString(),
        ...formData,
        date: selectedDate!,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      saveToLocalStorage([...schedules, newSchedule]);
      sendSMS(newSchedule);
    }

    setShowModal(false);
  };

  const deleteSchedule = (id: string) => {
    if (confirm('삭제하시겠습니까?')) {
      saveToLocalStorage(schedules.filter(s => s.id !== id));
    }
  };

  const getInstallationTypeName = (type: string) => {
    const types: { [key: string]: string } = {
      vertical: '버티컬 블라인드',
      roller: '롤러 블라인드',
      honeycomb: '허니콤 블라인드',
      roman: '로만 블라인드',
      venetian: '베네시안 블라인드',
      panel: '판넬 블라인드',
      other: '기타',
    };
    return types[type] || type;
  };

  // 달력 생성
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const formatDate = (day: number) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const getSchedulesForDate = (date: string) => {
    return schedules.filter(s => s.date === date);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              ◀
            </button>
            <h1 className="text-xl font-bold dark:text-white">
              {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded"
              >
                오늘로
              </button>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                ▶
              </button>
            </div>
          </div>
        </div>

        {/* 달력 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          {/* 요일 */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
              <div
                key={day}
                className={`text-center text-sm font-bold p-2 ${
                  i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 */}
          <div className="grid grid-cols-7 gap-2">
            {getDaysInMonth().map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const dateStr = formatDate(day);
              const daySchedules = getSchedulesForDate(dateStr);
              const isWeekend = index % 7 === 0 || index % 7 === 6;

              return (
                <div
                  key={day}
                  onClick={() => handleDateClick(dateStr)}
                  className={`aspect-square border-2 rounded-lg p-2 cursor-pointer hover:border-blue-500 transition-all ${
                    isToday(day)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className={`text-sm font-bold mb-1 ${
                    index % 7 === 0 ? 'text-red-500' : index % 7 === 6 ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {daySchedules.slice(0, 2).map(schedule => (
                      <div
                        key={schedule.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(schedule);
                        }}
                        className="text-xs bg-blue-500 text-white px-1 py-0.5 rounded truncate"
                      >
                        {schedule.time} {schedule.customerName}
                      </div>
                    ))}
                    {daySchedules.length > 2 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        +{daySchedules.length - 2}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold dark:text-white">
                {editingSchedule ? '수정' : '새 예약'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-2xl">&times;</button>
            </div>

            {/* 날짜 선택 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                예약 날짜
              </label>
              <input
                type="date"
                value={selectedDate || ''}
                onChange={(e) => changeSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white mb-2"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => changeSelectedDate(getTodayString())}
                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-sm"
                >
                  오늘
                </button>
                <button
                  type="button"
                  onClick={() => changeSelectedDate(addDaysToDate(getTodayString(), 1))}
                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-sm"
                >
                  내일
                </button>
                <button
                  type="button"
                  onClick={() => changeSelectedDate(addDaysToDate(getTodayString(), 2))}
                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-sm"
                >
                  모레
                </button>
              </div>
            </div>

            {editingSchedule && (
              <div className="mb-4 space-y-2">
                <button
                  onClick={() => sendSMS(editingSchedule)}
                  className="w-full py-2 bg-green-500 text-white rounded"
                >
                  📱 문자 전송
                </button>
                <button
                  onClick={() => { deleteSchedule(editingSchedule.id); setShowModal(false); }}
                  className="w-full py-2 bg-red-500 text-white rounded"
                >
                  🗑️ 삭제
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="고객명 *"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              />
              <input
                type="tel"
                placeholder="연락처 *"
                required
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                placeholder="주소 *"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                placeholder="상세주소"
                value={formData.addressDetail}
                onChange={(e) => setFormData({ ...formData, addressDetail: e.target.value })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              />
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              />
              <select
                value={formData.installationType}
                onChange={(e) => setFormData({ ...formData, installationType: e.target.value })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              >
                <option value="vertical">버티컬 블라인드</option>
                <option value="roller">롤러 블라인드</option>
                <option value="honeycomb">허니콤 블라인드</option>
                <option value="roman">로만 블라인드</option>
                <option value="venetian">베네시안 블라인드</option>
                <option value="panel">판넬 블라인드</option>
                <option value="other">기타</option>
              </select>
              <textarea
                placeholder="메모"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              />
              <button
                type="submit"
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded font-bold"
              >
                {editingSchedule ? '수정' : '추가'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
