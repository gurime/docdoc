'use client';

import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import supabase from "@/app/Config/supabase";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { MdReviews } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';
interface Doctor {
  id: string;
  doctorname: string;
  role: string;
  coverimage: string;
  content: string;
  commentscount: number;
  votecount: number;
  rating: number;
  review_count: number;
  average_rating: number;
}

interface Review {
  doctor_id: string;
  review_text: string;
  rating: number;
}

export default function Physician() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorsAndReviews = async () => {
      try {
        // Fetch doctors
        const { data: doctorsData, error: doctorsError } = await supabase
          .from('doctors')
          .select('*');

        if (doctorsError) throw doctorsError;

        // Fetch reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('doctor_id, review_text, rating');

        if (reviewsError) throw reviewsError;

        // Process and combine the data
        const processedDoctors = doctorsData.map((doctor: Doctor) => {
          const doctorReviews = reviewsData.filter((review: Review) => review.doctor_id === doctor.id);
          const review_count = doctorReviews.length;
          const average_rating = doctorReviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / review_count || 0;

          return {
            ...doctor,
            review_count,
            average_rating
          };
        });

        setDoctors(processedDoctors);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchDoctorsAndReviews();
  }, []);

  return (
    <>
      <Navbar />
      <div className="physiciansBG">
        <div className="jumbotron-content">
          <h1 className="jumbotron-title">Meet Our Physicians</h1>
          <p className="jumbotron-subtitle">Providing exceptional care and expertise to ensure your well-being.</p>
          <Link href="/pages/FindDocotor">
         <button className="jumbotron-button" >Find a Doctor</button> 
          </Link>
        </div>
      </div>
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
                <div>
                  <MdReviews color="blue"  />
                  <span >{doctor.review_count}</span>
                </div>
                <div>
                  <FaStar color="blue" />
                  <span>{doctor.average_rating.toFixed(1)} ({doctor.review_count})</span>
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