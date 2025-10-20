import { getTotalAppsCount, getAllApps } from '@/lib/getApps';
import Link from 'next/link';

export default function Home() {
  const totalApps = getTotalAppsCount();
  const allApps = getAllApps();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 bg-clip-text text-transparent">
            일상을 특별하게
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            기술이 아닌 사람을 위한 공간
          </p>
        </div>
      </section>

      {/* Apps Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="w-[85.7%] mx-auto">
          {totalApps === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🎨</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">
                차근차근 만들어가는 중입니다
              </h3>
              <p className="text-gray-500">
                곧 멋진 웹앱들로 채워질 예정입니다
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {allApps.map((app) => (
                <Link
                  key={app.id}
                  href={app.url}
                  className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-red-200"
                >
                  {/* App Image */}
                  {app.image && (
                    <div className="relative h-32 overflow-hidden">
                      <img
                        src={app.image}
                        alt={app.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                  )}

                  {/* App Info */}
                  <div className="p-4 flex flex-col items-center text-center">
                    {/* App Name */}
                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
                      {app.name}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-base text-gray-600 mb-2 font-medium">
            Creating light for everyday life
          </p>
          <p className="text-sm text-gray-500 mb-3">
            Kim Seu Jun at BION
          </p>
          <p className="text-xs text-gray-400">
            BION · 2025
          </p>
        </div>
      </footer>
    </div>
  );
}
