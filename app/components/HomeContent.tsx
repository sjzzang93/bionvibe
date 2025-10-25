import appsData from '@/data/apps.json';
import { getAllCategories, type App, type Category } from '@/lib/getApps';

import HomeContentClient from './HomeContentClient';
import { applyCuratedApps } from './homeContentUtils';

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
  const initialApps = applyCuratedApps(normalizeApps());

  return <HomeContentClient initialApps={initialApps} categories={categories} />;
}
