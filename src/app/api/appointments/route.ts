import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const sql = `
      SELECT 
        a.id,
        a.appointment_date,
        a.start_time,
        a.end_time,
        a.status,
        a.location,
        a.notes,
        a.created_at,
        p.name as patient_name,
        p.email as patient_email,
        d.name as doctor_name,
        d.email as doctor_email
      FROM appointments a
      INNER JOIN users p ON a.patient_id = p.id
      INNER JOIN users d ON a.doctor_id = d.id
      ORDER BY a.appointment_date DESC, a.start_time ASC
    `;

    const result = await query(sql);
    
    const appointments = result.rows.map(row => ({
      id: row.id,
      patient_name: row.patient_name,
      patient_email: row.patient_email,
      doctor_name: row.doctor_name,
      doctor_email: row.doctor_email,
      appointment_date: row.appointment_date,
      start_time: row.start_time,
      end_time: row.end_time,
      status: row.status,
      location: row.location,
      notes: row.notes,
      created_at: row.created_at
    }));

    return NextResponse.json(appointments, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}
