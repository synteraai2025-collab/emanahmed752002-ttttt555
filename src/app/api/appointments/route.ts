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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['patient_id', 'doctor_id', 'appointment_date', 'start_time', 'end_time'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate field types and formats
    const { 
      patient_id, 
      doctor_id, 
      appointment_date, 
      start_time, 
      end_time, 
      status = 'scheduled', 
      location, 
      notes 
    } = body;

    // Validate UUID format for patient_id and doctor_id
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!uuidRegex.test(patient_id)) {
      return NextResponse.json(
        { error: 'Invalid patient_id format. Must be a valid UUID.' },
        { status: 400 }
      );
    }

    if (!uuidRegex.test(doctor_id)) {
      return NextResponse.json(
        { error: 'Invalid doctor_id format. Must be a valid UUID.' },
        { status: 400 }
      );
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(appointment_date)) {
      return NextResponse.json(
        { error: 'Invalid appointment_date format. Must be YYYY-MM-DD.' },
        { status: 400 }
      );
    }

    // Validate time format (HH:MM:SS or HH:MM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
    if (!timeRegex.test(start_time)) {
      return NextResponse.json(
        { error: 'Invalid start_time format. Must be HH:MM or HH:MM:SS.' },
        { status: 400 }
      );
    }

    if (!timeRegex.test(end_time)) {
      return NextResponse.json(
        { error: 'Invalid end_time format. Must be HH:MM or HH:MM:SS.' },
        { status: 400 }
      );
    }

    // Validate that end_time is after start_time
    const startTime = new Date(`2000-01-01T${start_time}`);
    const endTime = new Date(`2000-01-01T${end_time}`);
    
    if (endTime <= startTime) {
      return NextResponse.json(
        { error: 'end_time must be after start_time.' },
        { status: 400 }
      );
    }

    // Validate status value
    const validStatuses = ['scheduled', 'completed', 'cancelled', 'pending'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate that patient_id and doctor_id exist and have correct roles
    const patientCheck = await query(
      'SELECT id, role FROM users WHERE id = $1 AND role = $2',
      [patient_id, 'patient']
    );

    if (patientCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Patient not found or invalid role.' },
        { status: 400 }
      );
    }

    const doctorCheck = await query(
      'SELECT id, role FROM users WHERE id = $1 AND role = $2',
      [doctor_id, 'doctor']
    );

    if (doctorCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Doctor not found or invalid role.' },
        { status: 400 }
      );
    }

    // Check for scheduling conflicts
    const conflictCheck = await query(
      `SELECT id FROM appointments 
       WHERE doctor_id = $1 
       AND appointment_date = $2 
       AND status != 'cancelled'
       AND (($3 >= start_time AND $3 < end_time) 
            OR ($4 > start_time AND $4 <= end_time)
            OR (start_time >= $3 AND end_time <= $4))`,
      [doctor_id, appointment_date, start_time, end_time]
    );

    if (conflictCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'Scheduling conflict: Doctor already has an appointment during this time slot.' },
        { status: 409 }
      );
    }

    // Insert the new appointment
    const insertSql = `
      INSERT INTO appointments (patient_id, doctor_id, appointment_date, start_time, end_time, status, location, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, patient_id, doctor_id, appointment_date, start_time, end_time, status, location, notes, created_at
    `;

    const result = await query(insertSql, [
      patient_id,
      doctor_id,
      appointment_date,
      start_time,
      end_time,
      status,
      location || null,
      notes || null
    ]);

    const newAppointment = result.rows[0];

    // Fetch complete appointment data with patient and doctor names
    const completeDataSql = `
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
      WHERE a.id = $1
    `;

    const completeResult = await query(completeDataSql, [newAppointment.id]);
    const completeAppointment = completeResult.rows[0];

    return NextResponse.json(
      {
        message: 'Appointment created successfully',
        appointment: {
          id: completeAppointment.id,
          patient_name: completeAppointment.patient_name,
          patient_email: completeAppointment.patient_email,
          doctor_name: completeAppointment.doctor_name,
          doctor_email: completeAppointment.doctor_email,
          appointment_date: completeAppointment.appointment_date,
          start_time: completeAppointment.start_time,
          end_time: completeAppointment.end_time,
          status: completeAppointment.status,
          location: completeAppointment.location,
          notes: completeAppointment.notes,
          created_at: completeAppointment.created_at
        }
      },
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}

