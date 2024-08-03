'use client'
import supabase from '@/app/Config/supabase';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import DoctorList from './DoctorList';
import AppointmentForm from './AppointmentForm';
import MedicalRecords from './MedicalRecords';
import Contact from './Contact';

interface PatientPortalProps {
  doctorId?: string;
}

export default function PatientPortal({ doctorId }: PatientPortalProps) {
  const router = useRouter();
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/pages/Login');
      }
    };

    checkUser();
  }, [router]);

  function handleOpenContact() {
    setIsContactOpen(true);
  }

  function handleCloseContact() {
    setIsContactOpen(false);
  }

  return (
    <>
      <div className="patient-portal">
        <h1 style={{maxWidth:'80rem',margin:'auto'}}>Patient Portal</h1>
        <DoctorList />
        <MedicalRecords/>
        <div className='grid-container'>
          <AppointmentForm />
          <button className='book-appointment-button' onClick={handleOpenContact}>Open Contact Form</button>
          <Contact
            isOpen={isContactOpen}
            onClose={handleCloseContact}
            doctorId={doctorId}
          />
        </div>
      </div>
    </>
  )
}