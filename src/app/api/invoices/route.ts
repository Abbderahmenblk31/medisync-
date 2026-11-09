import { NextRequest, NextResponse } from 'next/server';
import { clinicStore } from '@/lib/store/clinic-store';

export async function GET() {
  try {
    const invoices = clinicStore.listInvoices();
    return NextResponse.json({ success: true, count: invoices.length, data: invoices });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.appointmentId || !body.patientId || !body.items || !body.totalAmount) {
      return NextResponse.json(
        { success: false, error: 'appointmentId, patientId, items, and totalAmount are required.' },
        { status: 400 }
      );
    }
    const invoice = clinicStore.createInvoice(body);
    return NextResponse.json({ success: true, data: invoice }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Invoice ID is required' }, { status: 400 });
    }
    const updated = clinicStore.payInvoice(body.id);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
