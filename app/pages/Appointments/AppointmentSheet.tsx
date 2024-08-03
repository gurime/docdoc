'use client'
import supabase from '@/app/Config/supabase';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import moment from 'moment';

interface Appointment {
  id: string;
  user_id: string;
  doctor_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  appointment_date: string;
  appointment_time: string;
  created_at: string;
  doctorname?: string;
}

interface CurrentUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export default function AppointmentSheet() {
const [appointments, setAppointments] = useState<Appointment[]>([]);
const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
const [error, setError] = useState<string | null>(null);
const router = useRouter();

useEffect(() => {
const checkSessionAndFetchUser = async () => {
try {
// Check the session
const { data: { session }, error: sessionError } = await supabase.auth.getSession();
if (sessionError) {
throw sessionError;
}
if (!session) {
router.push('/pages/Login'); 
return;
}

// Fetch user details if session exists
const { data: { user }, error: userError } = await supabase.auth.getUser();
if (userError) {
setError('Failed to fetch current user');
} else if (user) {
const { data, error: userDetailsError } = await supabase
.from('users')
.select('first_name, last_name')
.eq('id', user.id)
.single();
if (userDetailsError) {
setError('Failed to fetch user details');
} else {
setCurrentUser({
id: user.id,
email: user.email || '',
first_name: data.first_name || '', 
last_name: data.last_name || '', 
});
}
}
} catch (err) {
setError('An unexpected error occurred');
}
};
checkSessionAndFetchUser();
}, [router]);

useEffect(() => {
const fetchAppointments = async () => {
if (!currentUser) return;
try {
let { data, error } = await supabase
.from('appointments')
.select('*')
.eq('user_id', currentUser.id)
.order('appointment_date', { ascending: true })
.order('appointment_time', { ascending: true });       
if (error) {
throw error;
}        
if (data && data.length > 0) {
setAppointments(data);
} else {
setAppointments([]);
}
} catch (error) {
setError('Failed to fetch appointments');
}
};
fetchAppointments();
}, [currentUser]);
if (error) {
return <div>{error}</div>; // Display the error message to the user
}

if (!currentUser) {
return <div>Loading...</div>;
}

return (
<div className="appointment-sheet">
<h2 className="sheet-title">Appointments for {currentUser.first_name} {currentUser.last_name}</h2>
<div className="sheet-grid">
<div className="header-row">
<div className="header-cell">Patient Name</div>
<div className="header-cell">Doctor</div>
<div className="header-cell">Date</div>
<div className="header-cell">Time</div>
</div>

{appointments.map((appointment) => (
<div className="appointment-row" key={appointment.id}>
<div className="cell">{`${appointment.first_name} ${appointment.last_name}`}</div>
<div className="cell">{appointment.doctorname || 'N/A'}</div>
<div className="cell">{new Date(appointment.appointment_date).toLocaleDateString()}</div>
<div className="cell">
  {moment(appointment.appointment_time, 'HH:mm').format('h:mm A')}
</div>
</div>
))}
</div>

{appointments.length === 0 && <p style={{textAlign:'center'}}>No appointments scheduled.</p>}
</div>
  );
}
