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
  drilling: 'none' | 'required';
  tvSize: string;
  bracket: 'included' | 'none';
  cost: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
};

export default function InstallationSchedulerPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showDateDetail, setShowDateDetail] = useState(false);
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
  const [incomingCall, setIncomingCall] = useState<{name: string, phone: string} | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentDate(new Date());
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        // 화면 크기만으로 판단 (768px 이하면 모바일 뷰)
        setIsMobile(window.innerWidth <= 768);
      };

      checkMobile();
      window.addEventListener('resize', checkMobile);

      const loadSchedules = async () => {
        let loaded = false;

        try {
          const saved = localStorage.getItem('installation-schedules');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setSchedules(parsed);
              console.log('✅ localStorage에서 불러오기 성공:', parsed.length, '개');
              loaded = true;
              return;
            }
          }
        } catch (error) {
          console.error('❌ localStorage 불러오기 오류:', error);
        }

        if (!loaded) {
          try {
            const backup = localStorage.getItem('installation-schedules-backup');
            if (backup) {
              const parsed = JSON.parse(backup);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setSchedules(parsed);
                localStorage.setItem('installation-schedules', backup);
                console.log('✅ localStorage 백업에서 복구 성공:', parsed.length, '개');
                loaded = true;
                return;
              }
            }
          } catch (backupError) {
            console.error('❌ localStorage 백업 복구 실패:', backupError);
          }
        }

        if (!loaded) {
          if ((window as any).AndroidStorage && (window as any).AndroidStorage.loadSchedules) {
            try {
              const androidData = (window as any).AndroidStorage.loadSchedules();
              if (androidData) {
                const parsed = JSON.parse(androidData);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  setSchedules(parsed);
                  localStorage.setItem('installation-schedules', androidData);
                  localStorage.setItem('installation-schedules-backup', androidData);
                  console.log('✅ Android 네이티브 저장소에서 복구 성공:', parsed.length, '개');
                  loaded = true;
                  return;
                }
              }
            } catch (androidError) {
              console.error('❌ Android 복구 실패:', androidError);
            }
          }

          if (!loaded && (window as any).webkit?.messageHandlers?.iOSStorage) {
            try {
              (window as any).webkit.messageHandlers.iOSStorage.postMessage({
                action: 'load'
              });

              (window as any).receiveIOSSchedules = (iosData: string) => {
                if (iosData) {
                  const parsed = JSON.parse(iosData);
                  if (Array.isArray(parsed) && parsed.length > 0) {
                    setSchedules(parsed);
                    localStorage.setItem('installation-schedules', iosData);
                    localStorage.setItem('installation-schedules-backup', iosData);
                    console.log('✅ iOS 네이티브 저장소에서 복구 성공:', parsed.length, '개');
                    loaded = true;
                  }
                }
              };
            } catch (iosError) {
              console.error('❌ iOS 복구 실패:', iosError);
            }
          }
        }

        if (!loaded && typeof indexedDB !== 'undefined') {
          try {
            const request = indexedDB.open('installation-scheduler', 1);
            request.onupgradeneeded = (e: any) => {
              const db = e.target.result;
              if (!db.objectStoreNames.contains('schedules')) {
                db.createObjectStore('schedules');
              }
            };
            request.onsuccess = (e: any) => {
              try {
                const db = e.target.result;
                if (db.objectStoreNames.contains('schedules')) {
                  const transaction = db.transaction(['schedules'], 'readonly');
                  const store = transaction.objectStore('schedules');
                  const getRequest = store.get('current');
                  getRequest.onsuccess = () => {
                    const data = getRequest.result;
                    if (Array.isArray(data) && data.length > 0) {
                      setSchedules(data);
                      const jsonData = JSON.stringify(data);
                      localStorage.setItem('installation-schedules', jsonData);
                      localStorage.setItem('installation-schedules-backup', jsonData);
                      console.log('✅ IndexedDB에서 복구 성공:', data.length, '개');
                    }
                  };
                  getRequest.onerror = () => {
                    console.warn('⚠️ IndexedDB 데이터 읽기 실패');
                  };
                }
              } catch (txError) {
                console.warn('⚠️ IndexedDB 트랜잭션 실패:', txError);
              }
            };
            request.onerror = () => {
              console.warn('⚠️ IndexedDB 열기 실패');
            };
          } catch (idbError) {
            console.error('❌ IndexedDB 복구 실패:', idbError);
          }
        }
      };

      loadSchedules();

      const handleIncomingCall = (event: any) => {
        const { name, phone } = event.detail || {};
        if (phone) {
          setIncomingCall({ name: name || '', phone });
        }
      };

      window.addEventListener('androidIncomingCall', handleIncomingCall);

      (window as any).receiveIncomingCall = (name: string, phone: string) => {
        setIncomingCall({ name: name || '', phone });
      };

      (window as any).receiveCalendarEvents = (events: any[]) => {
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

  useEffect(() => {
    if (schedules.length > 0) {
      try {
        const data = JSON.stringify(schedules);
        localStorage.setItem('installation-schedules', data);
        localStorage.setItem('installation-schedules-backup', data);
        localStorage.setItem('installation-schedules-updated', new Date().toISOString());
      } catch (error) {
        console.error('❌ 자동 저장 오류:', error);
      }
    }
  }, [schedules]);

  const saveToLocalStorage = (newSchedules: Schedule[]) => {
    try {
      const data = JSON.stringify(newSchedules);

      localStorage.setItem('installation-schedules', data);
      localStorage.setItem('installation-schedules-backup', data);
      localStorage.setItem('installation-schedules-updated', new Date().toISOString());

      if ((window as any).AndroidStorage && (window as any).AndroidStorage.saveSchedules) {
        try {
          (window as any).AndroidStorage.saveSchedules(data);
          console.log('✅ Android 네이티브 저장 완료');
        } catch (androidError) {
          console.warn('⚠️ Android 저장 실패:', androidError);
        }
      }

      if ((window as any).webkit?.messageHandlers?.iOSStorage) {
        try {
          (window as any).webkit.messageHandlers.iOSStorage.postMessage({
            action: 'save',
            data: data
          });
          console.log('✅ iOS 네이티브 저장 완료');
        } catch (iosError) {
          console.warn('⚠️ iOS 저장 실패:', iosError);
        }
      }

      if (typeof indexedDB !== 'undefined') {
        try {
          const request = indexedDB.open('installation-scheduler', 1);
          request.onupgradeneeded = (e: any) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('schedules')) {
              db.createObjectStore('schedules');
            }
          };
          request.onsuccess = (e: any) => {
            try {
              const db = e.target.result;
              if (db.objectStoreNames.contains('schedules')) {
                const transaction = db.transaction(['schedules'], 'readwrite');
                const store = transaction.objectStore('schedules');
                store.put(newSchedules, 'current');
                console.log('✅ IndexedDB 백업 완료');
              }
            } catch (txError) {
              console.warn('⚠️ IndexedDB 저장 트랜잭션 실패:', txError);
            }
          };
          request.onerror = () => {
            console.warn('⚠️ IndexedDB 열기 실패');
          };
        } catch (idbError) {
          console.warn('⚠️ IndexedDB 저장 실패:', idbError);
        }
      }

      console.log('✅ 스케줄 저장 완료:', newSchedules.length, '개');

      setSchedules(newSchedules);
    } catch (error) {
      console.error('❌ 스케줄 저장 오류:', error);
      alert('스케줄 저장에 실패했습니다.\n저장 공간이 부족하거나 브라우저 설정을 확인해주세요.');
    }
  };

  const generateSMS = (schedule: Schedule) => {
    const drillingText = schedule.drilling === 'none' ? '무타공' : '타공';
    const bracketText = schedule.bracket === 'included' ? '브라켓 포함' : '브라켓 별도';

    return `[TV 설치 예약]\n\n고객명: ${schedule.customerName}\n일시: ${schedule.date} ${schedule.time}\n주소: ${schedule.address} ${schedule.addressDetail}\n\n[설치 정보]\n종류: ${getInstallationTypeName(schedule.installationType)}\n${drillingText} / ${schedule.tvSize}인치\n${bracketText}\n설치비용: ${schedule.cost}원${schedule.notes ? `\n\n메모: ${schedule.notes}` : ''}`;
  };

  const sendSMS = (schedule: Schedule) => {
    const message = generateSMS(schedule);

    // Safari 호환성을 위한 clipboard fallback
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(message)
        .then(() => {
          alert(`문자 내용이 복사되었습니다!\n연락처: ${schedule.customerPhone}`);
        })
        .catch(() => {
          // fallback to textarea method
          fallbackCopyText(message);
          alert(`문자 내용이 복사되었습니다!\n연락처: ${schedule.customerPhone}`);
        });
    } else {
      // fallback for older browsers
      fallbackCopyText(message);
      alert(`문자 내용이 복사되었습니다!\n연락처: ${schedule.customerPhone}`);
    }
  };

  const fallbackCopyText = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('복사 실패:', err);
    }
    document.body.removeChild(textarea);
  };

  const saveContact = (schedule: Schedule) => {
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${schedule.customerName}
TEL;TYPE=CELL:${schedule.customerPhone}
ADR;TYPE=HOME:;;${schedule.address} ${schedule.addressDetail};;;
NOTE:TV 설치 - ${getInstallationTypeName(schedule.installationType)} ${schedule.tvSize}인치 (${schedule.date} ${schedule.time})
END:VCARD`;

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

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(contactInfo)
        .then(() => {
          alert('연락처 정보가 복사되었습니다!');
        })
        .catch(() => {
          fallbackCopyText(contactInfo);
          alert('연락처 정보가 복사되었습니다!');
        });
    } else {
      fallbackCopyText(contactInfo);
      alert('연락처 정보가 복사되었습니다!');
    }
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
    if ((window as any).AndroidCalendar && (window as any).AndroidCalendar.requestCalendarEvents) {
      (window as any).AndroidCalendar.requestCalendarEvents();
      alert('안드로이드 캘린더에서 일정을 가져오는 중입니다...\n\n주의: 안드로이드 캘린더의 내용은 절대 수정되지 않습니다.');
      return;
    }

    if ((window as any).webkit?.messageHandlers?.iOSCalendar) {
      (window as any).webkit.messageHandlers.iOSCalendar.postMessage({
        action: 'import'
      });
      alert('iOS 캘린더에서 일정을 가져오는 중입니다...\n\n주의: iOS 캘린더의 내용은 절대 수정되지 않습니다.');
      return;
    }

    alert(`📱 캘린더 연동 기능 안내\n\n현재 웹 브라우저에서는 캘린더 연동이 지원되지 않습니다.\n\n✅ 사용 가능한 환경:\n• 안드로이드 네이티브 앱\n• iOS 네이티브 앱 (iPhone/iPad)\n\n💡 대신 다음 기능을 사용하세요:\n• 캘린더에서 날짜를 클릭하여 수동으로 일정 추가\n• 고객 정보를 직접 입력하여 저장\n\n📋 자세한 정보는 ANDROID_INTEGRATION.md 파일을 참고하세요.`);
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setShowDateDetail(true);
  };

  const handleAddSchedule = () => {
    setShowDateDetail(false);
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

    if (!selectedDate) {
      alert('날짜를 선택해주세요.');
      return;
    }

    if (!formData.customerName.trim()) {
      alert('고객명을 입력해주세요.');
      return;
    }

    if (!formData.customerPhone.trim()) {
      alert('연락처를 입력해주세요.');
      return;
    }

    if (editingSchedule) {
      const updated = schedules.map(s =>
        s.id === editingSchedule.id
          ? { ...editingSchedule, ...formData, date: selectedDate }
          : s
      );
      saveToLocalStorage(updated);
      alert('예약이 수정되었습니다.');
    } else {
      const newSchedule: Schedule = {
        id: Date.now().toString(),
        ...formData,
        date: selectedDate,
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

  if (!mounted || !currentDate) {
    return null;
  }

  return (
    <>
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl relative">
        {/* 갤럭시 캘린더 스타일 헤더 */}
        <div className="bg-white border-b border-gray-100 px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-[28px] font-normal text-black tracking-tight">
              {currentDate.getMonth() + 1}월
            </h1>
            <div className="flex gap-2">
              <button
                onClick={importFromAndroidCalendar}
                className="w-9 h-9 flex items-center justify-center active:bg-gray-100 rounded-full transition-colors"
                title="캘린더 가져오기">
                <span className="text-lg">📅</span>
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 h-9 flex items-center justify-center bg-black active:bg-gray-800 text-white text-sm font-medium rounded-full transition-colors">
                오늘
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="w-8 h-8 flex items-center justify-center active:bg-gray-100 rounded-full transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <span className="text-sm font-medium flex-1 text-center text-black">
              {currentDate.getFullYear()}년
            </span>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="w-8 h-8 flex items-center justify-center active:bg-gray-100 rounded-full transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>

        {/* 갤럭시 캘린더 스타일 달력 */}
        <div className="bg-white">
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 border-b border-gray-100">
            {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
              <div
                key={day}
                className={`text-center text-[11px] font-medium py-2 ${
                  i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-500'
                }`}>
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7">
            {getDaysInMonth().map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square border-b border-r border-gray-50" />;
              }

              const dateStr = formatDate(day);
              const daySchedules = getSchedulesForDate(dateStr);
              const hasSchedules = daySchedules.length > 0;

              return (
                <div
                  key={day}
                  onClick={() => handleDateClick(dateStr)}
                  className="relative aspect-square border-b border-r border-gray-50 active:bg-gray-50 transition-colors">
                  <div className="h-full flex flex-col items-center justify-start pt-1.5">
                    {/* 날짜 숫자 */}
                    <div className={`relative w-7 h-7 flex items-center justify-center rounded-full ${
                      isToday(day)
                        ? 'bg-black text-white font-semibold'
                        : hasSchedules
                        ? 'font-semibold'
                        : ''
                    }`}>
                      <span className={`text-sm ${
                        isToday(day)
                          ? 'text-white'
                          : index % 7 === 0
                          ? 'text-red-500'
                          : index % 7 === 6
                          ? 'text-blue-500'
                          : 'text-black'
                      }`}>
                        {day}
                      </span>
                    </div>

                    {/* 예약 표시 - 점으로 표시 */}
                    {hasSchedules && (
                      <div className="flex gap-0.5 mt-0.5">
                        {daySchedules.slice(0, 3).map((schedule) => (
                          <div
                            key={schedule.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(schedule);
                            }}
                            className="w-1 h-1 rounded-full bg-black"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>

    {/* 날짜 세부정보 모달 */}
    {showDateDetail && selectedDate && (
      <div
        className="absolute inset-0 bg-black/40 z-50 animate-fadeIn"
        onClick={() => setShowDateDetail(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            {/* 드래그 핸들 */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* 모달 헤더 */}
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-black">
                    {new Date(selectedDate).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    일정 {getSchedulesForDate(selectedDate).length}개
                  </p>
                </div>
                <button
                  onClick={handleAddSchedule}
                  className="px-4 py-2 bg-black text-white text-sm font-medium rounded-full active:bg-gray-800 transition-colors">
                  + 추가
                </button>
              </div>
            </div>

            {/* 일정 목록 */}
            <div className="px-5 py-4">
              {getSchedulesForDate(selectedDate).length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-2">📅</div>
                  <p className="text-gray-500">등록된 일정이 없습니다</p>
                  <button
                    onClick={handleAddSchedule}
                    className="mt-4 px-6 py-2 bg-black text-white text-sm font-medium rounded-full active:bg-gray-800 transition-colors">
                    일정 추가하기
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {getSchedulesForDate(selectedDate).map((schedule) => (
                    <div
                      key={schedule.id}
                      onClick={() => {
                        setShowDateDetail(false);
                        handleEditClick(schedule);
                      }}
                      className="bg-gray-50 p-4 rounded-xl active:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-base font-bold text-black">{schedule.time}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              schedule.status === 'completed' ? 'bg-green-100 text-green-700' :
                              schedule.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                              schedule.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {schedule.status === 'completed' ? '완료' :
                               schedule.status === 'confirmed' ? '확정' :
                               schedule.status === 'cancelled' ? '취소' : '대기'}
                            </span>
                          </div>
                          <p className="font-semibold text-black">{schedule.customerName}</p>
                          <p className="text-sm text-gray-600 mt-1">{schedule.address}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <span>{getInstallationTypeName(schedule.installationType)}</span>
                            <span>•</span>
                            <span>{schedule.tvSize}인치</span>
                            <span>•</span>
                            <span>{schedule.drilling === 'none' ? '무타공' : '타공'}</span>
                          </div>
                        </div>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-400 flex-shrink-0 mt-1">
                          <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
      </div>
    )}

    {/* 갤럭시 캘린더 스타일 바텀 시트 */}
    {showModal && (
      <div
        className="absolute inset-0 bg-black/40 z-50 animate-fadeIn"
        onClick={() => setShowModal(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            {/* 드래그 핸들 */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* 모달 헤더 */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-black">
                  {editingSchedule ? '일정 수정' : '새 일정'}
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 flex items-center justify-center active:bg-gray-100 rounded-full transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="px-5 py-4">

            {/* 날짜 선택 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                날짜
              </label>
              <input
                type="date"
                value={selectedDate || ''}
                onChange={(e) => changeSelectedDate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:border-gray-400 focus:outline-none transition-colors text-base"
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    changeSelectedDate(getTodayString());
                  }}
                  className="flex-1 py-2 bg-gray-100 active:bg-gray-200 rounded text-sm font-medium transition-colors text-black">
                  오늘
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    changeSelectedDate(addDaysToDate(getTodayString(), 1));
                  }}
                  className="flex-1 py-2 bg-gray-100 active:bg-gray-200 rounded text-sm font-medium transition-colors text-black">
                  내일
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    changeSelectedDate(addDaysToDate(getTodayString(), 2));
                  }}
                  className="flex-1 py-2 bg-gray-100 active:bg-gray-200 rounded text-sm font-medium transition-colors text-black">
                  모레
                </button>
              </div>
            </div>

            {/* 수정/삭제 버튼 */}
            {editingSchedule && (
              <div className="mb-4 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => sendSMS(editingSchedule)}
                    className="py-3 bg-black active:bg-gray-800 text-white font-medium rounded transition-colors">
                    📱 문자 복사
                  </button>
                  <button
                    type="button"
                    onClick={() => saveContact(editingSchedule)}
                    className="py-3 bg-black active:bg-gray-800 text-white font-medium rounded transition-colors">
                    👤 연락처 저장
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => copyContactInfo(editingSchedule)}
                    className="py-3 bg-gray-100 active:bg-gray-200 text-black font-medium rounded transition-colors">
                    📋 정보 복사
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSchedule(editingSchedule.id)}
                    className="py-3 bg-red-500 active:bg-red-600 text-white font-medium rounded transition-colors">
                    🗑️ 삭제
                  </button>
                </div>
              </div>
            )}

            {/* 수신 전화 알림 */}
            {incomingCall && (
              <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg">📞</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-black mb-1">
                      전화 수신
                    </p>
                    <p className="text-sm text-gray-600">
                      이 정보를 일정에 사용하시겠습니까?
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded p-3 mb-3 space-y-2 border border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500">이름</p>
                    <p className="font-medium text-black">
                      {incomingCall.name || '(이름 없음)'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">전화번호</p>
                    <p className="font-medium text-black">
                      {incomingCall.phone}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={acceptIncomingCall}
                    className="flex-1 py-3 bg-black active:bg-gray-800 text-white font-medium rounded transition-colors">
                    정보 사용
                  </button>
                  <button
                    type="button"
                    onClick={rejectIncomingCall}
                    className="flex-1 py-3 bg-gray-100 active:bg-gray-200 text-black font-medium rounded transition-colors">
                    무시
                  </button>
                </div>
              </div>
            )}

            {/* 예약 폼 */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  고객명
                </label>
                <input
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:border-gray-400 focus:outline-none transition-colors text-base text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  연락처
                </label>
                <input
                  type="tel"
                  placeholder="010-0000-0000"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:border-gray-400 focus:outline-none transition-colors text-base text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  주소
                </label>
                <input
                  type="text"
                  placeholder="기본 주소"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:border-gray-400 focus:outline-none transition-colors text-base mb-2 text-black"
                />
                <input
                  type="text"
                  placeholder="상세 주소 (선택)"
                  value={formData.addressDetail}
                  onChange={(e) => setFormData({ ...formData, addressDetail: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:border-gray-400 focus:outline-none transition-colors text-base text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  시간
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:border-gray-400 focus:outline-none transition-colors text-base text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  설치 종류
                </label>
                <select
                  value={formData.installationType}
                  onChange={(e) => setFormData({ ...formData, installationType: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:border-gray-400 focus:outline-none transition-colors text-base text-black">
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
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    타공 여부
                  </label>
                  <select
                    value={formData.drilling}
                    onChange={(e) => setFormData({ ...formData, drilling: e.target.value as 'none' | 'required' })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:border-gray-400 focus:outline-none transition-colors text-base text-black">
                    <option value="none">무타공</option>
                    <option value="required">타공</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    TV 인치
                  </label>
                  <input
                    type="text"
                    placeholder="예: 55"
                    value={formData.tvSize}
                    onChange={(e) => setFormData({ ...formData, tvSize: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:border-gray-400 focus:outline-none transition-colors text-base text-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    브라켓
                  </label>
                  <select
                    value={formData.bracket}
                    onChange={(e) => setFormData({ ...formData, bracket: e.target.value as 'included' | 'none' })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:border-gray-400 focus:outline-none transition-colors text-base text-black">
                    <option value="included">포함</option>
                    <option value="none">별도</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    설치 비용
                  </label>
                  <input
                    type="text"
                    placeholder="예: 50000"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value.replace(/[^0-9]/g, '') })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:border-gray-400 focus:outline-none transition-colors text-base text-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  메모
                </label>
                <textarea
                  placeholder="추가 사항을 입력하세요 (선택)"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:border-gray-400 focus:outline-none transition-colors resize-none text-base text-black"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-black active:bg-gray-800 text-white font-semibold rounded transition-colors text-base">
                {editingSchedule ? '저장' : '일정 추가'}
              </button>
            </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
