import { NextRequest, NextResponse } from 'next/server';
import { clinicStore } from '@/lib/store/clinic-store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get('appointmentId');
    const patientId = searchParams.get('patientId');

    if (appointmentId) {
      const record = clinicStore.getRecordByAppointment(appointmentId);
      return NextResponse.json({ success: true, data: record });
    }

    if (patientId) {
      const records = clinicStore.getRecordsByPatient(patientId);
      return NextResponse.json({ success: true, count: records.length, data: records });
    }

    return NextResponse.json(
      { success: false, error: 'Provide appointmentId or patientId' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.appointmentId || !body.patientId || !body.clinicalDiagnosis) {
      return NextResponse.json(
        { success: false, error: 'appointmentId, patientId, and clinicalDiagnosis are required.' },
        { status: 400 }
      );
    }
    const record = clinicStore.saveMedicalRecord(body);

    // Automatically generate an invoice for the consultation if not already billed
    clinicStore.createInvoice({
      appointmentId: body.appointmentId,
      patientId: body.patientId,
      patientName: body.patientName || 'Clinical Patient',
      items: [
        {
          description: `Consultation - ${body.clinicalDiagnosis}`,
          quantity: 1,
          unitPrice: 80.0,
          totalPrice: 80.0,
        },
        ...(body.prescriptions?.length > 0
          ? [
              {
                description: `e-Prescription & Pharmacy Dispense (${body.prescriptions.length} items)`,
                quantity: 1,
                unitPrice: 25.0,
                totalPrice: 25.0,
              },
            ]
          : []),
      ],
      subtotal: body.prescriptions?.length > 0 ? 105.0 : 80.0,
      discount: 0,
      tax: body.prescriptions?.length > 0 ? 5.25 : 4.0,
      totalAmount: body.prescriptions?.length > 0 ? 110.25 : 84.0,
      paymentMethod: 'CASH',
      paymentStatus: 'PENDING',
    });

    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
