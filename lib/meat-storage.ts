/**
 * 고기집 가격 계산기 - localStorage 관리
 */

import type { MenuInput, SavedMenu } from '@/types/meat'

const STORAGE_KEY = 'meat-calculator-menus'

/**
 * 메뉴 저장
 * 
 * @param menu - 저장할 메뉴 데이터
 */
export function saveMenu(menu: MenuInput): void {
  if (typeof window === 'undefined') return
  
  try {
    const menus = getSavedMenus()
    const newMenu: SavedMenu = {
      ...menu,
      id: generateId(),
      createdAt: Date.now()
    }
    
    menus.push(newMenu)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(menus))
  } catch (error) {
    console.error('메뉴 저장 실패:', error)
  }
}

/**
 * 저장된 메뉴 전체 불러오기
 * 
 * @returns 저장된 메뉴 배열 (최신순)
 */
export function getSavedMenus(): SavedMenu[] {
  if (typeof window === 'undefined') return []
  
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    
    const menus = JSON.parse(data) as SavedMenu[]
    // 최신순 정렬
    return menus.sort((a, b) => b.createdAt - a.createdAt)
  } catch (error) {
    console.error('메뉴 불러오기 실패:', error)
    return []
  }
}

/**
 * 특정 메뉴 삭제
 * 
 * @param id - 삭제할 메뉴 ID
 */
export function deleteMenu(id: string): void {
  if (typeof window === 'undefined') return
  
  try {
    const menus = getSavedMenus()
    const filtered = menus.filter(menu => menu.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('메뉴 삭제 실패:', error)
  }
}

/**
 * 전체 메뉴 삭제
 */
export function clearAllMenus(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('전체 메뉴 삭제 실패:', error)
  }
}

/**
 * 고유 ID 생성
 * 
 * @returns 랜덤 ID 문자열
 */
function generateId(): string {
  return `menu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

