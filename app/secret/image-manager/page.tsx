'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getBrowserSupabase } from '@/lib/supabase';

interface App {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  description: string;
}

export default function ImageManagerPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('file');
  const uploadFormRef = useRef<HTMLDivElement>(null);

  const loadApps = async () => {
    try {
      const supabase = getBrowserSupabase();
      const { data, error } = await supabase
        .from('apps')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return;
      }

      const appsData: App[] = (data || []).map((row: any) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        icon: row.icon,
        image: row.image || '',
        description: row.description || '',
      }));

      setApps(appsData);
    } catch (err) {
      console.error('Error loading apps:', err);
    }
  };

  useEffect(() => {
    loadApps();
  }, []);

  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedApp) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('slug', selectedApp.slug);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setNewImageUrl(result.imageUrl);
        alert('✅ 파일이 업로드되었습니다!');
      } else {
        alert(`❌ ${result.error}`);
      }
    } catch (error) {
      alert('❌ 파일 업로드 중 오류가 발생했습니다.');
      console.error(error);
    }

    setUploading(false);
  };

  const handleUpdateImage = async () => {
    if (!selectedApp || !newImageUrl) {
      alert('⚠️ 앱을 선택하고 이미지를 업로드하거나 URL을 입력해주세요!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/update-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: selectedApp.slug,
          imageUrl: newImageUrl,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('✅ 이미지가 업데이트되었습니다!');
        
        // Supabase에서 최신 데이터 다시 가져오기
        await loadApps();
        
        setSelectedApp(null);
        setNewImageUrl('');
      } else {
        alert(`❌ ${result.error}`);
      }
    } catch (error) {
      alert('❌ 업데이트 중 오류가 발생했습니다.');
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-7xl mb-4">🖼️</div>
          <h1 className="text-5xl font-extrabold text-white mb-4">
            이미지 관리 도구
          </h1>
          <p className="text-gray-300 text-lg">
            모든 웹앱의 이미지를 관리할 수 있습니다
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 앱 이름 검색..."
            className="w-full px-6 py-4 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 text-lg backdrop-blur-lg"
          />
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
          {filteredApps.map((app) => (
            <button
        type="button"
              key={app.id}
              onClick={() => {
                setSelectedApp(app);
                setNewImageUrl(app.image);
                // 업로드 폼으로 스크롤
                setTimeout(() => {
                  uploadFormRef.current?.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                  });
                }, 100);
              }}
              className={`p-4 rounded-xl transition-all ${
                selectedApp?.slug === app.slug
                  ? 'bg-purple-500 border-2 border-white'
                  : 'bg-white/10 border-2 border-white/20 hover:border-purple-400'
              }`}
            >
              <div className="text-white text-sm font-bold truncate mb-2">{app.name}</div>
              {app.image && (
                <img
                  src={app.image}
                  alt={app.name}
                  className="w-full h-20 object-cover rounded-lg"
                  loading="lazy"
                />
              )}
            </button>
          ))}
        </div>

        {/* Update Form */}
        {selectedApp && (
          <div ref={uploadFormRef} className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border-2 border-white/20">
            <h2 className="text-3xl font-bold text-white mb-6">
              🖼️ {selectedApp.name} 이미지 변경
            </h2>

            <div className="space-y-6">
              {/* Current Image */}
              <div>
                <label className="block text-white font-bold mb-2">현재 이미지</label>
                {selectedApp.image && (
                  <img
                    src={selectedApp.image}
                    alt={selectedApp.name}
                    className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-white/30"
                  />
                )}
              </div>

              {/* Upload Method Toggle */}
              <div>
                <label className="block text-white font-bold mb-3">업로드 방식</label>
                <div className="flex gap-4">
                  <button
        type="button"
                    onClick={() => setUploadMethod('file')}
                    className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
                      uploadMethod === 'file'
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/20 text-white/70 hover:bg-white/30'
                    }`}
                  >
                    📁 파일 업로드
                  </button>
                  <button
        type="button"
                    onClick={() => setUploadMethod('url')}
                    className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
                      uploadMethod === 'url'
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/20 text-white/70 hover:bg-white/30'
                    }`}
                  >
                    🔗 URL 입력
                  </button>
                </div>
              </div>

              {/* File Upload */}
              {uploadMethod === 'file' && (
                <div>
                  <label className="block text-white font-bold mb-2">이미지 파일 선택</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/heic,image/heif"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border-2 border-white/30 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-500 file:text-white file:font-bold hover:file:bg-purple-600 cursor-pointer disabled:opacity-50"
                  />
                  <p className="text-white/50 text-sm mt-2">
                    📌 JPG, PNG, WebP, GIF, HEIC 지원 (최대 10MB)
                  </p>
                  <p className="text-yellow-300 text-sm mt-1">
                    📱 아이폰 HEIC 이미지 자동 변환 지원!
                  </p>
                  <p className="text-green-300 text-sm mt-1">
                    ✨ 자동 최적화: 800x600 WebP 고품질로 변환됩니다!
                  </p>
                  <p className="text-blue-300 text-sm mt-1">
                    🌍 Supabase Storage CDN: 전세계 모든 사용자가 빠르게 접근!
                  </p>
                  {uploading && (
                    <div className="mt-3 text-yellow-300 font-bold animate-pulse">
                      ⏳ 이미지 최적화 중...
                    </div>
                  )}
                </div>
              )}

              {/* URL Input */}
              {uploadMethod === 'url' && (
                <div>
                  <label className="block text-white font-bold mb-2">새 이미지 URL</label>
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border-2 border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                  />
                  <p className="text-white/50 text-sm mt-2">
                    💡 Unsplash: <code className="bg-white/10 px-2 py-1 rounded">?w=800&auto=format&fit=crop</code> 추가 권장
                  </p>
                </div>
              )}

              {/* Preview */}
              {newImageUrl && newImageUrl !== selectedApp.image && (
                <div>
                  <label className="block text-white font-bold mb-2">미리보기</label>
                  <img
                    src={newImageUrl}
                    alt="Preview"
                    className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-green-400"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '';
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-4">
                <button
        type="button"
                  onClick={handleUpdateImage}
                  disabled={loading || !newImageUrl || newImageUrl === selectedApp.image}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '⏳ 업데이트 중...' : '✅ 이미지 업데이트'}
                </button>
                <button
        type="button"
                  onClick={() => {
                    setSelectedApp(null);
                    setNewImageUrl('');
                  }}
                  className="flex-1 bg-white/20 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-white/30 transition-all"
                >
                  ❌ 취소
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            href="/secret"
            className="inline-block bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all border border-white/20"
          >
            ← Secret Vault로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
