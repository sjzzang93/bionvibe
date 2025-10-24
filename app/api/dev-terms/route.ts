import { NextResponse } from 'next/server';
import { DEV_TERMS } from '@/data/dev-terms';
import { CURSOR_PROMPT_TERMS } from '@/data/dev-terms-cursor';
import part1Json from '@/data/dev-terms-part1.json';
import part2Json from '@/data/dev-terms-part2.json';
import part3Json from '@/data/dev-terms-part3.json';
import fullJson from '@/data/dev-terms-full.json';

export async function GET() {
  // 모든 용어 로드
  const allTerms = [
    ...DEV_TERMS,
    ...CURSOR_PROMPT_TERMS,
    ...part1Json.terms,
    ...part2Json.terms,
    ...part3Json.terms,
    ...fullJson.terms
  ];
  
  // 중복 제거 (id 기준으로 마지막 항목만 유지)
  const uniqueTermsMap = new Map();
  allTerms.forEach(term => {
    uniqueTermsMap.set(term.id, term);
  });
  const uniqueTerms = Array.from(uniqueTermsMap.values());
  
  return NextResponse.json({ terms: uniqueTerms });
}

