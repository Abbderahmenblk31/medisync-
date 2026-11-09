import { NextResponse } from 'next/server';
import { clinicStore } from '@/lib/store/clinic-store';

export async function GET() {
  try {
    const metrics = clinicStore.getMetrics();
    return NextResponse.json({ success: true, data: metrics });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
