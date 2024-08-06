'use client';

import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import supabase from "@/app/Config/supabase";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { MdReviews } from "react-icons/md";
import { RiseLoader } from "react-spinners";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const checkAuthStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuthStatus();
  }, []);
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
  }, [isAuthenticated]);

  // if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />
      <div className="physiciansBG">
        <div className="jumbotron-content">
          <h1 className="jumbotron-title">Meet Our Physicians</h1>
          <p className="jumbotron-subtitle">Providing exceptional care and expertise to ensure your well-being.</p>
        </div>
      </div>
      {loading ? (
        <><div style={{display:'flex',placeContent:'center',height:'50svh',alignItems:'center'}}> <RiseLoader color="blue" /></div></>
  
) : (
  <div className="grid-container">
    {doctors.map((doctor) => (
      <div key={doctor.id || uuidv4()} className="card">
        <img src={doctor.coverimage} alt={`${doctor.doctorname}`} className="card-image" />
        <div className="card-content">
          <h2 className="card-title">{doctor.doctorname}</h2>
          <p className="card-role">{doctor.role}</p>
          <p className="card-description">{doctor.content && doctor.content.slice(0, 100)}...</p>
          <div className="card-footer">
            <Link href={`/pages/doctor/${doctor.id}`} className="hero-btn">
              Read More
            </Link>
            {isAuthenticated ? (
              <div className="card-stats">
                <div className="stat-item">
                  <MdReviews className="stat-icon" />
                  <span className="stat-value">{doctor.review_count || 0} reviews</span>
                </div>
                <div className="stat-item">
                  <FaStar className="stat-icon" />
                  <span className="stat-value">{doctor.average_rating ? doctor.average_rating.toFixed(1) : 'N/A'} average rating</span>
                </div>
              </div>
            ) : (
              <p className="login-prompt">Log in to see reviews and ratings</p>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
)}
      <Footer />
    </>
  );
}