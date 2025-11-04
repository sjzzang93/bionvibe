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
  const [incomingCall, setIncomingCall] = useState<{name: string, phone: string} | null>(null);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Check if mobile device
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
        const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
        setIsMobile(mobileRegex.test(userAgent.toLowerCase()) || window.innerWidth <= 768);
      };

      checkMobile();
      window.addEventListener('resize', checkMobile);

      const saved = localStorage.getItem('installation-schedules');
      if (saved) {
        setSchedules(JSON.parse(saved));
      }

      // Initialize speech recognition
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
          if (event.error === 'not-allowed') {
            alert('마이크 권한이 필요합니다.\n브라우저 설정에서 마이크 권한을 허용해주세요.');
          } else if (event.error === 'no-speech') {
            // 음성이 감지되지 않음 - 무시
          } else {
            console.error('Speech recognition error:', event.error);
          }
          setIsRecording(false);
        };

        recognitionInstance.onend = () => {
          setIsRecording(false);
        };

        setRecognition(recognitionInstance);
      }

      // Listen for incoming call data from Android
      const handleIncomingCall = (event: any) => {
        const { name, phone } = event.detail || {};
        if (phone) {
          setIncomingCall({ name: name || '', phone });
        }
      };

      window.addEventListener('androidIncomingCall', handleIncomingCall);

      // Also expose function for Android WebView to call directly
      (window as any).receiveIncomingCall = (name: string, phone: string) => {
        setIncomingCall({ name: name || '', phone });
      };

      // Expose function for Android to send calendar events (read-only import)
      (window as any).receiveCalendarEvents = (events: any[]) => {
        // events is an array of: { title, description, location, startDate, startTime, endDate, endTime }
        if (!events || !Array.isArray(events)) {
          alert('캘린더 일정을 가져올 수 없습니다.');
          return;
        }

        const imported: Schedule[] = events.map((event, index) => ({
          id: `cal-${Date.now()}-${index}`,
          customerName: event.title || '(제목 없음)',
          customerPhone: '',
          address: event.location || '',
          addressDetail: event.description || '',
          date: event.startDate || getTodayString(),
          time: event.startTime || '00:00',
          installationType: 'other',
          tvSize: '',
          drilling: 'none' as const,
          bracket: 'none' as const,
          cost: '',
          notes: `캘린더에서 가져옴${event.description ? ': ' + event.description : ''}`,
          status: 'pending' as const,
          createdAt: new Date().toISOString(),
        }));

        setSchedules(prev => {
          const newSchedules = [...prev, ...imported];
          saveToLocalStorage(newSchedules);
          return newSchedules;
        });

        alert(`${imported.length}개의 일정을 가져왔습니다!\n\n안드로이드 캘린더는 수정되지 않았습니다.`);
      };

      return () => {
        window.removeEventListener('resize', checkMobile);
        window.removeEventListener('androidIncomingCall', handleIncomingCall);
        delete (window as any).receiveIncomingCall;
        delete (window as any).receiveCalendarEvents;
      };
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

  const saveContact = (schedule: Schedule) => {
    // Create vCard format
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${schedule.customerName}
TEL;TYPE=CELL:${schedule.customerPhone}
ADR;TYPE=HOME:;;${schedule.address} ${schedule.addressDetail};;;
NOTE:TV 설치 - ${getInstallationTypeName(schedule.installationType)} ${schedule.tvSize}인치 (${schedule.date} ${schedule.time})
END:VCARD`;

    // Create blob and download
    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${schedule.customerName}_연락처.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    alert(`${schedule.customerName}님의 연락처가 다운로드되었습니다!\n파일을 열어서 연락처에 추가하세요.`);
  };

  const copyContactInfo = (schedule: Schedule) => {
    const contactInfo = `이름: ${schedule.customerName}\n연락처: ${schedule.customerPhone}\n주소: ${schedule.address} ${schedule.addressDetail}`;
    navigator.clipboard.writeText(contactInfo);
    alert('연락처 정보가 복사되었습니다!');
  };

  const acceptIncomingCall = () => {
    if (incomingCall) {
      setFormData(prev => ({
        ...prev,
        customerName: incomingCall.name,
        customerPhone: incomingCall.phone,
      }));
      setIncomingCall(null);
    }
  };

  const rejectIncomingCall = () => {
    setIncomingCall(null);
  };

  const importFromAndroidCalendar = () => {
    // Call Android function to request calendar events (read-only)
    // Android will call window.receiveCalendarEvents(events) with the data
    if ((window as any).AndroidCalendar && (window as any).AndroidCalendar.requestCalendarEvents) {
      (window as any).AndroidCalendar.requestCalendarEvents();
      alert('안드로이드 캘린더에서 일정을 가져오는 중입니다...\n\n주의: 안드로이드 캘린더의 내용은 절대 수정되지 않습니다.');
    } else {
      alert('안드로이드 캘린더 연동이 지원되지 않는 환경입니다.\n\n이 기능은 안드로이드 네이티브 앱에서만 사용 가능합니다.');
    }
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

  // Mobile-only check screen
  if (!isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
            <div className="text-6xl mb-4">📱</div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
              모바일 전용 앱
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              TV 설치 스케줄러는 안드로이드 모바일 전용 앱입니다.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-left">
              <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
                주요 기능:
              </p>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li>• 전화 수신 시 자동 연락처 입력</li>
                <li>• 음성 녹음 및 받아쓰기</li>
                <li>• 터치 최적화 UI</li>
                <li>• 모바일 알림</li>
              </ul>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              모바일 기기에서 접속해주세요
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-4 px-3">
      <div className="max-w-full mx-auto">
        {/* 타이틀 */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
            📺 TV 설치 스케줄러
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-xs">
            날짜를 탭하여 예약 등록
          </p>
        </div>

        {/* 월 네비게이션 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 mb-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="w-9 h-9 flex items-center justify-center active:bg-gray-100 dark:active:bg-gray-700 rounded-lg transition-colors text-lg"
            >
              ←
            </button>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
              </h2>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 active:from-blue-600 active:to-indigo-600 text-white text-xs font-medium rounded-lg shadow-sm transition-all"
                >
                  오늘
                </button>
                <button
                  onClick={importFromAndroidCalendar}
                  className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 active:from-green-600 active:to-emerald-600 text-white text-xs font-medium rounded-lg shadow-sm transition-all"
                  title="안드로이드 캘린더에서 일정 가져오기 (읽기 전용)"
                >
                  📅
                </button>
              </div>
            </div>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="w-9 h-9 flex items-center justify-center active:bg-gray-100 dark:active:bg-gray-700 rounded-lg transition-colors text-lg"
            >
              →
            </button>
          </div>
        </div>

        {/* 달력 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2">
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
              <div
                key={day}
                className={`text-center text-xs font-bold py-1.5 ${
                  i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7 gap-1">
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
                  className={`relative aspect-square border-2 rounded-lg p-1 active:scale-95 transition-all ${
                    isToday(day)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 active:border-blue-300 active:bg-gray-50 dark:active:bg-gray-700'
                  }`}
                >
                  {/* 날짜 숫자 */}
                  <div className={`text-xs font-bold mb-0.5 ${
                    index % 7 === 0 ? 'text-red-500' : index % 7 === 6 ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {day}
                  </div>

                  {/* 예약 표시 */}
                  <div className="space-y-0.5">
                    {daySchedules.slice(0, 1).map(schedule => (
                      <div
                        key={schedule.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(schedule);
                        }}
                        className="text-[9px] bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-1 py-0.5 rounded truncate active:from-blue-600 active:to-indigo-600 transition-all leading-tight"
                      >
                        {schedule.address || schedule.time.slice(0, 5)}
                      </div>
                    ))}
                    {daySchedules.length > 1 && (
                      <div className="text-[9px] text-center text-blue-600 dark:text-blue-400 font-medium">
                        +{daySchedules.length - 1}
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
              <div className="mb-5 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => sendSMS(editingSchedule)}
                    className="py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors shadow-sm"
                  >
                    📱 문자 복사
                  </button>
                  <button
                    type="button"
                    onClick={() => saveContact(editingSchedule)}
                    className="py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors shadow-sm"
                  >
                    👤 연락처 저장
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => copyContactInfo(editingSchedule)}
                    className="py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-colors shadow-sm"
                  >
                    📋 정보 복사
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSchedule(editingSchedule.id)}
                    className="py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors shadow-sm"
                  >
                    🗑️ 삭제
                  </button>
                </div>
              </div>
            )}

            {/* 수신 전화 알림 */}
            {incomingCall && (
              <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700 rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📞</span>
                    <div>
                      <p className="font-bold text-green-800 dark:text-green-300">
                        전화 수신
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        이 정보를 예약에 사용하시겠습니까?
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">고객명</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {incomingCall.name || '(이름 없음)'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">연락처</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {incomingCall.phone}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={acceptIncomingCall}
                    className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                  >
                    ✓ 정보 사용
                  </button>
                  <button
                    type="button"
                    onClick={rejectIncomingCall}
                    className="flex-1 py-2.5 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-medium rounded-lg transition-colors"
                  >
                    ✕ 무시
                  </button>
                </div>
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
