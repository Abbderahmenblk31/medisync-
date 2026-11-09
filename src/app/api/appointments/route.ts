import { NextRequest, NextResponse } from 'next/server';
import { clinicStore } from '@/lib/store/clinic-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const department = searchParams.get('department') || undefined;
    const status = searchParams.get('status') || undefined;
    const doctorName = searchParams.get('doctorName') || undefined;

    const appointments = clinicStore.listAppointments({
      department,
      status,
      doctorName,
    });

    return NextResponse.json({ success: true, data: appointments });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      patientId,
      patientName,
      patientPhone,
      doctorName,
      department,
      scheduledTime,
      reasonForVisit,
      roomNumber,
      consultationFee,
    } = body;

    if (!patientName || !doctorName || !scheduledTime || !reasonForVisit) {
      return NextResponse.json(
        { success: false, error: 'Missing mandatory appointment parameters.' },
        { status: 400 }
      );
    }

    const appointment = clinicStore.bookAppointment({
      patientId: patientId || 'PT-GUEST',
      patientName,
      patientPhone: patientPhone || '+216 00 000 000',
      doctorName,
      department: department || 'General Medicine',
      scheduledTime,
      reasonForVisit,
      roomNumber,
      consultationFee,
    });

    return NextResponse.json({ success: true, data: appointment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to book appointment' },
      { status: 400 }
    );
  }
}
