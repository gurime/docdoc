'use client'
import supabase from '@/app/Config/supabase';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface Doctor {
    id: string;
    doctorname: string;
    role:string;
    specialties:string;
    coverimage:string;
  }



const DoctorList: React.FC = () => {
    const [doctorId, setDoctorId] = useState('');
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
  

    useEffect(() => {
        const fetchDoctors = async () => {
          const { data, error } = await supabase.from('doctors').select('*');
          if (error) {
            console.error('Error fetching doctors:', error);
          } else {
            setDoctors(data);
          }
          setLoading(false);
        };
    
        fetchDoctors();
      }, []);
  return (
    <div className="doctor-list">
      <h2>Your Doctors</h2>
      <ul>
        {doctors.map((doctor) => (
          <li key={doctor.id} className="doctor-card" style={{
            backgroundColor:'transparent'
          }}>
            <img  width={140} src={doctor.coverimage} alt='...'/>
            <h3>{doctor.doctorname}</h3>
            <p>{doctor.role}</p>
            <p>{doctor.specialties}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorList;
