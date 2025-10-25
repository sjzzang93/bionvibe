import type { App } from '@/lib/getApps';

export const HIDDEN_APP_SLUGS = ['study-cursor-prompts', 'dev-vocab-old'];

export const CURATED_NONSENSE_APP: App = {
  id: 'nonsense-escape',
  name: '넌센스 탈출 연구소',
  slug: 'nonsense-escape',
  icon: '🧪',
  description: '웃음 터지는 실험실에서 5연속 정답 미션에 도전하세요!',
  categoryId: 'learning-tools',
  url: '/apps/nonsense-escape',
  image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop',
  createdAt: '2025-01-25T00:00:00.000Z',
  hidden: false,
};

export const filterVisibleApps = (apps: App[]): App[] =>
  apps.filter((app) => !app.hidden && !HIDDEN_APP_SLUGS.includes(app.slug));

export const applyCuratedApps = (apps: App[]): App[] => {
  const filteredApps = filterVisibleApps(apps);
  const existing = filteredApps.find((app) => app.slug === CURATED_NONSENSE_APP.slug);

  if (existing) {
    return filteredApps.map((app) =>
      app.slug === CURATED_NONSENSE_APP.slug
        ? {
            ...app,
            name: CURATED_NONSENSE_APP.name,
            description: CURATED_NONSENSE_APP.description,
            icon: CURATED_NONSENSE_APP.icon,
            image: app.image || CURATED_NONSENSE_APP.image,
            hidden: false,
          }
        : app,
    );
  }

  return [CURATED_NONSENSE_APP, ...filteredApps];
};
