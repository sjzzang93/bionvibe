import appsData from '@/data/apps.json';
import { getAllCategories, type App, type Category } from '@/lib/getApps';

import HomeContentClient from './HomeContentClient';
import { applyCuratedApps } from './homeContentUtils';
import RecentApps from './RecentApps';

const normalizeApps = (): App[] => {
  const rawApps = (appsData.apps ?? []) as App[];

  return rawApps.map((app) => ({
    id: app.id,
    name: app.name,
    slug: app.slug,
    icon: app.icon,
    description: app.description ?? '',
    categoryId: app.categoryId,
    url: app.url,
    image: app.image ?? '',
    createdAt: app.createdAt,
    hidden: app.hidden ?? false,
  }));
};

export default function HomeContent() {
  const categories: Category[] = getAllCategories();
  const allApps = normalizeApps();

  // 🚨 히든페이지 앱 제외 (hidden: true인 앱들은 /secret에서만 보임)
  const visibleApps = allApps.filter(app => !app.hidden);

  // visibleApps로 큐레이션 적용
  const initialApps = applyCuratedApps(visibleApps);

  return (
    <>
      {/* 최근 추가된 앱 */}
      <RecentApps apps={visibleApps} />

      {/* 카테고리별 앱 그리드 */}
      <HomeContentClient initialApps={initialApps} categories={categories} />
    </>
  );
}
