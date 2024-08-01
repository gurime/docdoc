'use client'
import supabase from '@/app/Config/supabase';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';

interface Doctor {
    id: string;
    doctorname: string;
    role: string;
    specialties: string;
    coverimage: string;
  }
  
  interface User {
    id: string;
    doctor_id: string;
  }


const DoctorList: React.FC = () => {
    const [doctorId, setDoctorId] = useState('');
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
        const fetchCurrentUserDoctor = async () => {
          try {
            // First, get the current user
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            
            if (userError) throw userError;
            
            if (!user) {
              setLoading(false);
              return;
            }
    
            // Then, get the user's details including their doctor_id
            const { data: userData, error: userDataError } = await supabase
              .from('users')
              .select('doctor_id')
              .eq('id', user.id)
              .single();
    
            if (userDataError) throw userDataError;
    
            if (!userData.doctor_id) {
              setLoading(false);
              return;
            }
    
            // Finally, fetch the doctor's information
            const { data: doctorData, error: doctorError } = await supabase
              .from('doctors')
              .select('*')
              .eq('id', userData.doctor_id)
              .single();
    
            if (doctorError) throw doctorError;
    
            setDoctor(doctorData);
          } catch (error) {
          } finally {
            setLoading(false);
          }
        };
    
        fetchCurrentUserDoctor();
      }, []);
    
    
    
      if (!doctor) {
        return <div style={{
            color:'#fff',
            display:'flex',
            alignItems:'center',
            flexDirection:'column',
            justifyContent:'center',
        }}>No doctor assigned 
        <ClipLoader color="#fff" loading={loading} size={50} /></div>;
      }
  return (
    <div className="doctor-list">
      <h2>Your Doctor</h2>
      <div className="doctor-card">
  <Link href={`/pages/doctor/${doctor.id}`}>
  <img width={350} src={doctor.coverimage} alt={doctor.doctorname} /></Link>
        <h3>{doctor.doctorname}</h3>
        <p>{doctor.role}</p>
        <p>{doctor.specialties}</p>
      </div>
    </div>
  );
};

export default DoctorList;
