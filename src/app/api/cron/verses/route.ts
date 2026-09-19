import { distributeVerses } from '@/app/actions';
import { NextResponse } from 'next/server';

export const maxDuration = 60; // Allow max duration to handle batching delays

export async function GET(request: Request) {
  // Check authorization to ensure only Vercel Cron can trigger this
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Call our existing server action which automatically handles batching of 20
    await distributeVerses();
    return NextResponse.json({ success: true, message: 'Verse distribution batch executed successfully' });
  } catch (error: any) {
    console.error('Cron distribution error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
