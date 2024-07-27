'use client';

import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import supabase from "@/app/Config/supabase";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { MdReviews } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';

interface Doctor {
  id: string;
  doctorname: string;
  role: string;
  coverimage: string;
  content: string;
  commentscount: number;  // Changed to lowercase
  votecount: number;      // Changed to lowercase
  downcount: number;      // Changed to lowercase
}

export default function Physician() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data, error } = await supabase
          .from('doctors')
          .select('*');
        if (error) throw error;
        console.log('Fetched doctors:', data);
        setDoctors(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleVote = async (doctorId: string, voteType: 'up' | 'down') => {
    try {
      const { data, error } = await supabase
        .rpc('increment', { 
          row_id: doctorId,  // Changed to use string ID directly
          column_name: voteType === 'up' ? 'votecount' : 'downcount'  // Changed to lowercase
        });

      if (error) throw error;

      const { data: updatedDoctor, error: fetchError } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', doctorId)
        .single();

      if (fetchError) throw fetchError;

      console.log('Updated doctor:', updatedDoctor);

      setDoctors(prevDoctors => 
        prevDoctors.map(doctor => 
          doctor.id === doctorId ? updatedDoctor : doctor
        )
      );
    } catch (error) {
      console.error(`Error ${voteType}voting:`, error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="grid-container">
        {loading ? (
          <p>Loading...</p>
        ) : (
          doctors.map((doctor) => (
            <div key={doctor.id || uuidv4()} className="card">
              <img src={doctor.coverimage} alt="" />
              <h2 className="card-title">{doctor.doctorname}</h2>
              <div className="authflex">
                <p>{doctor.role}</p>
              </div>
              <div>
                <p className="card-content">{doctor.content && doctor.content.slice(0, 200)}...</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link href={`/pages/doctor/${doctor.id}`} className="hero-btn">
                  Read More
                </Link>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                <div>
                <MdReviews />
                <span style={{ padding: '0 5px' }}>{doctor.commentscount}</span>
                </div>
                <div onClick={() => handleVote(doctor.id, 'up')} style={{ cursor: 'pointer' }}>
                  <FaThumbsUp />
                  <span style={{ padding: '0 5px' }}>{doctor.votecount}</span>
                </div>
                <div onClick={() => handleVote(doctor.id, 'down')} style={{ cursor: 'pointer' }}>
                  <FaThumbsDown />
                  <span style={{ padding: '0 5px' }}>{doctor.downcount}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </>
  );
}