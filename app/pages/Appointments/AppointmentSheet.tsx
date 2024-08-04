'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import { Loader } from 'lucide-react';
import supabase from '@/app/Config/supabase';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import { RiseLoader } from 'react-spinners';


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
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    const checkSessionAndFetchUser = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session) {
          router.push('/pages/Login');
          return;
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        if (user) {
          const { data, error: userDetailsError } = await supabase
            .from('users')
            .select('first_name, last_name')
            .eq('id', user.id)
            .single();
          
          if (userDetailsError) throw userDetailsError;

          setCurrentUser({
            id: user.id,
            email: user.email || '',
            first_name: data?.first_name || '',
            last_name: data?.last_name || '',
          });
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error(err);
      }
    };
    checkSessionAndFetchUser();
  }, [router]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!currentUser) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('appointment_date', { ascending: true })
          .order('appointment_time', { ascending: true });
        
        if (error) throw error;
        setAppointments(data || []);
      } catch (error) {
        setError('Failed to fetch appointments');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [currentUser]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!currentUser) {
return <div 
style={{
height:'50svh',
display:'flex',
justifyContent:'center',
alignItems:'center',
}}>
<RiseLoader color='teal'
/></div>;
  }

  return (
<div className="appointment-sheet">
<h2 className="sheet-title ">
{loading ? (
<Skeleton  />
) : (
`Appointments for ${currentUser.first_name} ${currentUser.last_name}`
)}
</h2>
<div className="sheet-grid">
<div className="header-row ">
<div className="header-cell">Patient Name</div>
<div className="header-cell">Doctor</div>
<div className="header-cell">Date</div>
<div className="header-cell">Time</div>
</div>

{loading
? Array.from({ length: 5 }).map((_, index) => (
<div className="appointment-row " key={index}>
<div className="cell"><Skeleton /></div>
<div className="cell"><Skeleton/></div>
<div className="cell"><Skeleton /></div>
<div className="cell"><Skeleton /></div>
</div>
))
: appointments.map((appointment) => (
<div className="appointment-row " key={appointment.id}>
<div className="cell">{`${appointment.first_name} ${appointment.last_name}`}</div>
<div className="cell">{appointment.doctorname || 'N/A'}</div>
<div className="cell">
{new Date(appointment.appointment_date).toLocaleDateString()}
</div>

<div className="cell">
{moment(appointment.appointment_time, 'HH:mm').format('h:mm A')}
</div>
</div>
))}

{!loading && appointments.length === 0 && (
<p className="text-center col-span-4 mt-4">No appointments scheduled.</p>
)}
</div>
</div>
);
}