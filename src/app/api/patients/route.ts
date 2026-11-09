import { NextRequest, NextResponse } from 'next/server';
import { clinicStore } from '@/lib/store/clinic-store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || undefined;
    const patients = clinicStore.listPatients(q);
    return NextResponse.json({ success: true, count: patients.length, data: patients });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.fullName || !body.phone) {
      return NextResponse.json(
        { success: false, error: 'Full name and phone are required.' },
        { status: 400 }
      );
    }
    const patient = clinicStore.registerPatient(body);
    return NextResponse.json({ success: true, data: patient }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
