'use client'
import supabase from '@/app/Config/supabase';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import DoctorList from './DoctorList';
import AppointmentForm from './AppointmentForm';

export default function PatientPortal() {
    const router = useRouter();

    useEffect(() => {
      const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/pages/Login');
        }
      };
  
      checkUser();
    }, [router]);
return (
<>

<div className="patient-portal">
      <h1 style={{maxWidth:'80rem',margin:'auto'}}>Patient Portal</h1>
      <DoctorList />
      <AppointmentForm />
    </div>
</>
)
}

