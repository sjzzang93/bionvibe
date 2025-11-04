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
  drilling: 'none' | 'required'; // 무타공/타공
  tvSize: string; // TV 인치
  bracket: 'included' | 'none'; // 브라켓 유무
  cost: string; // 설치 비용
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
    installationType: 'wallmount',
    drilling: 'none' as 'none' | 'required',
    tvSize: '',
    bracket: 'included' as 'included' | 'none',
    cost: '',
    notes: '',
  });
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('installation-schedules');
    if (saved) {
      setSchedules(JSON.parse(saved));
    }

    // Initialize speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'ko-KR';

        recognitionInstance.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptPart = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcriptPart + ' ';
            } else {
              interimTranscript += transcriptPart;
            }
          }

          setTranscript(prev => prev + finalTranscript);
        };

        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
        };

        recognitionInstance.onend = () => {
          setIsRecording(false);
        };

        setRecognition(recognitionInstance);
      }
    }
  }, []);

  const saveToLocalStorage = (newSchedules: Schedule[]) => {
    localStorage.setItem('installation-schedules', JSON.stringify(newSchedules));
    setSchedules(newSchedules);
  };

  const toggleRecording = () => {
    if (!recognition) {
      alert('음성 인식이 지원되지 않는 브라우저입니다.');
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
      // Add transcript to notes
      if (transcript.trim()) {
        setFormData(prev => ({
          ...prev,
          notes: prev.notes ? `${prev.notes}\n\n[통화 내용]\n${transcript}` : `[통화 내용]\n${transcript}`
        }));
        setTranscript('');
      }
    } else {
      setTranscript('');
      recognition.start();
      setIsRecording(true);
    }
  };

  const clearTranscript = () => {
    setTranscript('');
  };

  const generateSMS = (schedule: Schedule) => {
    const drillingText = schedule.drilling === 'none' ? '무타공' : '타공';
    const bracketText = schedule.bracket === 'included' ? '브라켓 포함' : '브라켓 별도';

    return `[TV 설치 예약]\n\n고객명: ${schedule.customerName}\n일시: ${schedule.date} ${schedule.time}\n주소: ${schedule.address} ${schedule.addressDetail}\n\n[설치 정보]\n종류: ${getInstallationTypeName(schedule.installationType)}\n${drillingText} / ${schedule.tvSize}인치\n${bracketText}\n설치비용: ${schedule.cost}원${schedule.notes ? `\n\n메모: ${schedule.notes}` : ''}`;
  };

  const sendSMS = (schedule: Schedule) => {
    const message = generateSMS(schedule);
    navigator.clipboard.writeText(message);
    alert(`문자 내용이 복사되었습니다!\n연락처: ${schedule.customerPhone}`);
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
      time: '09:00',
      installationType: 'wallmount',
      drilling: 'none',
      tvSize: '',
      bracket: 'included',
      cost: '',
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
      drilling: schedule.drilling,
      tvSize: schedule.tvSize,
      bracket: schedule.bracket,
      cost: schedule.cost,
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
      alert('예약이 수정되었습니다.');
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
    if (confirm('예약을 삭제하시겠습니까?')) {
      saveToLocalStorage(schedules.filter(s => s.id !== id));
      setShowModal(false);
    }
  };

  const getInstallationTypeName = (type: string) => {
    const types: { [key: string]: string } = {
      wallmount: '벽걸이형',
      stand: '스탠드형',
      ceiling: '천장형',
      frame: '액자형',
      outdoor: '야외형',
      builtin: '빌트인',
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 타이틀 */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            📺 TV 설치 스케줄러
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            날짜를 클릭하여 예약을 등록하세요
          </p>
        </div>

        {/* 월 네비게이션 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              ←
            </button>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
              </h2>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm transition-all"
              >
                오늘
              </button>
            </div>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              →
            </button>
          </div>
        </div>

        {/* 달력 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
              <div
                key={day}
                className={`text-center text-sm font-bold py-2 ${
                  i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7 gap-2">
            {getDaysInMonth().map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const dateStr = formatDate(day);
              const daySchedules = getSchedulesForDate(dateStr);

              return (
                <div
                  key={day}
                  onClick={() => handleDateClick(dateStr)}
                  className={`relative aspect-square border-2 rounded-xl p-2 cursor-pointer transition-all hover:shadow-md ${
                    isToday(day)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {/* 날짜 숫자 */}
                  <div className={`text-sm font-bold mb-1 ${
                    index % 7 === 0 ? 'text-red-500' : index % 7 === 6 ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {day}
                  </div>

                  {/* 예약 표시 */}
                  <div className="space-y-0.5">
                    {daySchedules.slice(0, 2).map(schedule => (
                      <div
                        key={schedule.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(schedule);
                        }}
                        className="text-xs bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-1.5 py-0.5 rounded truncate hover:from-blue-600 hover:to-indigo-600 transition-all"
                      >
                        {schedule.time.slice(0, 5)} {schedule.customerName}
                      </div>
                    ))}
                    {daySchedules.length > 2 && (
                      <div className="text-xs text-center text-blue-600 dark:text-blue-400 font-medium">
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

      {/* 예약 모달 */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b dark:border-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {editingSchedule ? '예약 수정' : '새 예약 등록'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  TV 설치 일정을 관리하세요
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500"
              >
                ✕
              </button>
            </div>

            {/* 날짜 선택 */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                📅 예약 날짜
              </label>
              <input
                type="date"
                value={selectedDate || ''}
                onChange={(e) => changeSelectedDate(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:outline-none transition-colors mb-2"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => changeSelectedDate(getTodayString())}
                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                >
                  오늘
                </button>
                <button
                  type="button"
                  onClick={() => changeSelectedDate(addDaysToDate(getTodayString(), 1))}
                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                >
                  내일
                </button>
                <button
                  type="button"
                  onClick={() => changeSelectedDate(addDaysToDate(getTodayString(), 2))}
                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                >
                  모레
                </button>
              </div>
            </div>

            {/* 수정/삭제 버튼 */}
            {editingSchedule && (
              <div className="mb-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => sendSMS(editingSchedule)}
                  className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors shadow-sm"
                >
                  📱 문자 복사
                </button>
                <button
                  type="button"
                  onClick={() => deleteSchedule(editingSchedule.id)}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors shadow-sm"
                >
                  🗑️ 삭제
                </button>
              </div>
            )}

            {/* 예약 폼 */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  👤 고객명 *
                </label>
                <input
                  type="text"
                  placeholder="이름을 입력하세요"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  📞 연락처 *
                </label>
                <input
                  type="tel"
                  placeholder="010-0000-0000"
                  required
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  📍 주소 *
                </label>
                <input
                  type="text"
                  placeholder="기본 주소"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:outline-none transition-colors mb-2"
                />
                <input
                  type="text"
                  placeholder="상세 주소 (선택)"
                  value={formData.addressDetail}
                  onChange={(e) => setFormData({ ...formData, addressDetail: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  ⏰ 시간 *
                </label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  📺 설치 종류
                </label>
                <select
                  value={formData.installationType}
                  onChange={(e) => setFormData({ ...formData, installationType: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="wallmount">벽걸이형</option>
                  <option value="stand">스탠드형</option>
                  <option value="ceiling">천장형</option>
                  <option value="frame">액자형</option>
                  <option value="outdoor">야외형</option>
                  <option value="builtin">빌트인</option>
                  <option value="other">기타</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    🔨 타공 여부
                  </label>
                  <select
                    value={formData.drilling}
                    onChange={(e) => setFormData({ ...formData, drilling: e.target.value as 'none' | 'required' })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:outline-none transition-colors"
                  >
                    <option value="none">무타공</option>
                    <option value="required">타공</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    📏 TV 인치 *
                  </label>
                  <input
                    type="text"
                    placeholder="예: 55"
                    required
                    value={formData.tvSize}
                    onChange={(e) => setFormData({ ...formData, tvSize: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    🔧 브라켓
                  </label>
                  <select
                    value={formData.bracket}
                    onChange={(e) => setFormData({ ...formData, bracket: e.target.value as 'included' | 'none' })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:outline-none transition-colors"
                  >
                    <option value="included">포함</option>
                    <option value="none">별도</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    💰 설치 비용 *
                  </label>
                  <input
                    type="text"
                    placeholder="예: 50000"
                    required
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value.replace(/[^0-9]/g, '') })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* 음성 녹음 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  🎤 통화 녹음 (음성 → 텍스트)
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={toggleRecording}
                      className={`flex-1 py-2.5 font-medium rounded-xl transition-all shadow-sm ${
                        isRecording
                          ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {isRecording ? '⏹ 녹음 중지' : '🎤 녹음 시작'}
                    </button>
                    {transcript && (
                      <button
                        type="button"
                        onClick={clearTranscript}
                        className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all"
                      >
                        지우기
                      </button>
                    )}
                  </div>

                  {isRecording && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl">
                      <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                        🔴 녹음 중... 말씀하세요
                      </p>
                    </div>
                  )}

                  {transcript && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                        📝 받아쓰기 내용:
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {transcript}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  📝 메모
                </label>
                <textarea
                  placeholder="추가 사항을 입력하세요 (선택)"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:outline-none transition-colors resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  녹음 중지 시 통화 내용이 자동으로 메모에 추가됩니다
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02]"
              >
                {editingSchedule ? '✓ 수정 완료' : '✓ 예약 등록'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
