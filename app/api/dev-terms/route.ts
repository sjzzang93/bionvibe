import { NextResponse } from 'next/server';
import { DEV_TERMS } from '@/data/dev-terms';

export async function GET() {
  return NextResponse.json({ terms: DEV_TERMS });
}

