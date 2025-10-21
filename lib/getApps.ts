import categoriesData from '@/data/categories.json';
import appsData from '@/data/apps.json';

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  bgImage: string;
  order: number;
}

export interface App {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  categoryId: string;
  url: string;
  image?: string;
  createdAt: string;
  hidden?: boolean;
}

export interface CategoryWithApps extends Category {
  apps: App[];
}

// 모든 카테고리 가져오기
export function getAllCategories(): Category[] {
  return categoriesData.categories.sort((a, b) => a.order - b.order);
}

// 모든 앱 가져오기 (숨김 앱 제외)
export function getAllApps(includeHidden: boolean = false): App[] {
  const apps = appsData.apps as App[];
  if (includeHidden) {
    return apps;
  }
  return apps.filter(app => !app.hidden);
}

// 숨김 앱만 가져오기
export function getHiddenApps(): App[] {
  const apps = appsData.apps as App[];
  return apps.filter(app => app.hidden === true);
}

// 카테고리별로 앱 그룹화 (숨김 앱 제외)
export function getCategoriesWithApps(includeHidden: boolean = false): CategoryWithApps[] {
  const categories = getAllCategories();
  const apps = getAllApps(includeHidden);
  
  return categories.map(category => ({
    ...category,
    apps: apps.filter(app => app.categoryId === category.id)
  }));
}

// 특정 카테고리의 앱만 가져오기 (숨김 앱 제외)
export function getAppsByCategory(categoryId: string, includeHidden: boolean = false): App[] {
  const apps = getAllApps(includeHidden);
  return apps.filter(app => app.categoryId === categoryId);
}

// ID로 앱 찾기
export function getAppById(id: string): App | undefined {
  const apps = getAllApps();
  return apps.find(app => app.id === id);
}

// Slug로 앱 찾기
export function getAppBySlug(slug: string): App | undefined {
  const apps = getAllApps();
  return apps.find(app => app.slug === slug);
}

// 총 앱 개수
export function getTotalAppsCount(): number {
  return getAllApps().length;
}

// 카테고리별 앱 개수
export function getAppCountByCategory(categoryId: string): number {
  return getAppsByCategory(categoryId).length;
}
