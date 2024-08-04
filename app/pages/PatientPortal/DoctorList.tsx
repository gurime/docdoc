'use client'
import supabase from '@/app/Config/supabase';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import {  RiseLoader } from 'react-spinners';

interface Doctor {
    id: string;
    doctorname: string;
    role: string;
    specialties: string;
    coverimage: string;
  }
  interface User {
    id: string; // uuid
    email: string; // text
    doctor_id: string | null; // uuid, can be null if not set
    // Add other fields that match your table structure
    // For example:
    first_name?: string; // text, optional
    last_name?: string; // text, optional
    created_at?: string; // timestamptz
    // Add any other fields that are present in your table
  }


const DoctorList: React.FC = () => {
const [doctor, setDoctor] = useState<Doctor | null>(null);
const [loading, setLoading] = useState(true);
const [user, setUser] = useState<User | null>(null);

useEffect(() => {
  const fetchCurrentUserDoctor = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch all user data from your custom users table
      const { data: userData, error: userDataError } = await supabase
        .from('users')
        .select('*')  // Select all fields
        .eq('id', user.id)
        .single();

      if (userDataError) throw userDataError;

      // Combine auth user data with custom user data
      const combinedUserData: User = {
        id: user.id,
        email: user.email,
        ...userData, // This spreads all fields from your custom users table
      };

      setUser(combinedUserData);

      if (!userData.doctor_id) {
        setLoading(false);
        return;
      }

      // Fetch doctor data if doctor_id exists
      const { data: doctorData, error: doctorError } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', userData.doctor_id)
        .single();

      if (doctorError) throw doctorError;

      setDoctor(doctorData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchCurrentUserDoctor();
}, []);
    
    
      if (!doctor) {
        return <div 
        style={{
        height:'50svh',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        }}>
        <RiseLoader color='#fff'
        /></div>
      }
  return (
<div className="doctor-list">
<div style={{
display:'flex',
justifyContent:'space-between'
}}> 
<h2 style={{fontWeight:'300'}}>Your Doctor</h2> 
<h2 style={{fontWeight:'300'}}>Patient</h2> 
</div> 



<div style={{
display:'flex',
justifyContent:'space-between'
}}>
<h2 style={{fontWeight:'300'}}>
{doctor.doctorname}</h2>
<h2 style={{fontWeight:'300'}}>
{user?.first_name} {user?.last_name}</h2>
</div>
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
