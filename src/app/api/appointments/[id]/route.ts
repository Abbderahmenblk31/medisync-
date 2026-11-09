import { NextRequest, NextResponse } from 'next/server';
import { clinicStore } from '@/lib/store/clinic-store';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const appointment = clinicStore.getAppointmentById(id);

    if (!appointment) {
      return NextResponse.json(
        { success: false, error: `Appointment ${id} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: appointment });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error fetching appointment' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      );
    }

    const updated = clinicStore.updateAppointmentStatus(id, status);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update status' },
      { status: 400 }
    );
  }
}
