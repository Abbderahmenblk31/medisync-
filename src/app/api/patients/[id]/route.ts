import { NextRequest, NextResponse } from 'next/server';
import { clinicStore } from '@/lib/store/clinic-store';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const patient = clinicStore.getPatientById(id);
    if (!patient) {
      return NextResponse.json({ success: false, error: 'Patient not found' }, { status: 404 });
    }
    const medicalHistory = clinicStore.getRecordsByPatient(id);
    return NextResponse.json({
      success: true,
      data: {
        ...patient,
        medicalHistory,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
