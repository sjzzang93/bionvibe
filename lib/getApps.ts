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

// 캐시 (클라이언트/서버 공용)
let appsCache: App[] | null = null;
let cacheTime = 0;
const CACHE_DURATION = 60000; // 1분

// 캐시 무효화 함수 (이미지 업데이트 후 호출)
export function invalidateAppsCache() {
  appsCache = null;
  cacheTime = 0;
}

// JSON 파일에서 모든 앱 가져오기
async function fetchAppsFromJSON(bypassCache = false): Promise<App[]> {
  // 캐시 확인 (bypassCache가 true면 무시)
  if (!bypassCache && appsCache && Date.now() - cacheTime < CACHE_DURATION) {
    return appsCache;
  }

  // JSON 데이터를 App 형식으로 변환
  const apps: App[] = (appsData.apps || []).map((app: any) => ({
    id: app.id,
    name: app.name,
    slug: app.slug,
    icon: app.icon,
    description: app.description || '',
    categoryId: app.categoryId,
    url: app.url,
    image: app.image || '',
    createdAt: app.createdAt,
    hidden: app.hidden || false,
  }));

  // 캐시 저장
  appsCache = apps;
  cacheTime = Date.now();

  return apps;
}

// 모든 카테고리 가져오기
export function getAllCategories(): Category[] {
  return categoriesData.categories.sort((a, b) => a.order - b.order);
}

// 모든 앱 가져오기 (숨김 앱 제외) - 동기 함수로 유지하되 빈 배열 반환
export function getAllApps(includeHidden: boolean = false): App[] {
  // 서버 컴포넌트나 비동기 환경에서는 getAllAppsAsync를 사용해야 함
  console.warn('getAllApps는 동기 함수입니다. getAllAppsAsync를 사용하세요.');
  return appsCache || [];
}

// 비동기 버전 (권장)
export async function getAllAppsAsync(includeHidden: boolean = false, bypassCache = false): Promise<App[]> {
  const apps = await fetchAppsFromJSON(bypassCache);
  if (includeHidden) {
    return apps;
  }
  return apps.filter(app => !app.hidden);
}

// 숨김 앱만 가져오기
export async function getHiddenAppsAsync(): Promise<App[]> {
  const apps = await fetchAppsFromJSON();
  return apps.filter(app => app.hidden === true);
}

// 카테고리별로 앱 그룹화 (숨김 앱 제외)
export async function getCategoriesWithAppsAsync(includeHidden: boolean = false): Promise<CategoryWithApps[]> {
  const categories = getAllCategories();
  const apps = await getAllAppsAsync(includeHidden);
  
  return categories.map(category => ({
    ...category,
    apps: apps.filter(app => app.categoryId === category.id)
  }));
}

// 특정 카테고리의 앱만 가져오기 (숨김 앱 제외)
export async function getAppsByCategoryAsync(categoryId: string, includeHidden: boolean = false): Promise<App[]> {
  const apps = await getAllAppsAsync(includeHidden);
  return apps.filter(app => app.categoryId === categoryId);
}

// ID로 앱 찾기
export async function getAppByIdAsync(id: string): Promise<App | undefined> {
  const apps = await getAllAppsAsync();
  return apps.find(app => app.id === id);
}

// Slug로 앱 찾기
export async function getAppBySlugAsync(slug: string): Promise<App | undefined> {
  const apps = await getAllAppsAsync();
  return apps.find(app => app.slug === slug);
}

// 총 앱 개수
export async function getTotalAppsCountAsync(): Promise<number> {
  const apps = await getAllAppsAsync();
  return apps.length;
}

// 카테고리별 앱 개수
export async function getAppCountByCategoryAsync(categoryId: string): Promise<number> {
  const apps = await getAppsByCategoryAsync(categoryId);
  return apps.length;
}

// 동기 버전 (하위 호환성) - 캐시된 데이터 사용
export function getHiddenApps(): App[] {
  return appsCache?.filter(app => app.hidden === true) || [];
}

export function getCategoriesWithApps(includeHidden: boolean = false): CategoryWithApps[] {
  const categories = getAllCategories();
  const apps = appsCache?.filter(app => includeHidden || !app.hidden) || [];
  
  return categories.map(category => ({
    ...category,
    apps: apps.filter(app => app.categoryId === category.id)
  }));
}

export function getAppsByCategory(categoryId: string, includeHidden: boolean = false): App[] {
  const apps = appsCache?.filter(app => includeHidden || !app.hidden) || [];
  return apps.filter(app => app.categoryId === categoryId);
}

export function getAppById(id: string): App | undefined {
  return appsCache?.find(app => app.id === id);
}

export function getAppBySlug(slug: string): App | undefined {
  return appsCache?.find(app => app.slug === slug);
}

export function getTotalAppsCount(): number {
  return appsCache?.length || 0;
}

export function getAppCountByCategory(categoryId: string): number {
  return getAppsByCategory(categoryId).length;
}
