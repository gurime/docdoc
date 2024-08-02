import React from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { getDoctor } from '../lib';
import ReviewComponent from '@/app/components/Review';
import AppointmentComponent from '@/app/components/Appointment';
import LeaveReviewComponent from '@/app/components/LeaveReview';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<{ title: string }> {
const articleId: string | undefined = params.id;

try {
const DoctorDetails = await getDoctor(articleId);
if (DoctorDetails) {
return {
    title: `Doctor care | ${DoctorDetails.doctorname || 'Doctor Details'}`,
};
} else {
return {
    title: 'Doctor care | Doctor Not Found',
};
}
} catch (error) {
return {
title: 'Doctor care | Error',
};
}
}

export default async function DoctorDetailsPage({ params }: { params: { id: string } }): Promise<JSX.Element> {
  const articleId: string | undefined = params.id;

  // Fetch doctor details
  const doctor = await getDoctor(articleId);

  if (!doctor) {
    return (
      <>
        <Navbar />
        <div>Doctor not found</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="DoctorProfileContainer">
  <div className="profileImgBackground">
    <LeaveReviewComponent articleId={articleId}/>
    <h2 className="doctorName">{doctor.doctorname}</h2>
    <h2 className="doctorRole">{doctor.role}</h2>
        

  </div>
  
  <img src={doctor.coverimage} alt={`${doctor.doctorname}`} className="doctorImage" />
  
  <div className="doctorContent">
    <h3>About {doctor.doctorname}</h3>
    <p>{doctor.content}</p>
    <div className="doctorDetails">
      <h4>Specialties:</h4>
      <p>{doctor.specialties}</p>
      
      <h4>Education:</h4>
      <p>{doctor.education}</p>
      
      <h4>Experience:</h4>
      <p>{doctor.experience}</p>
      
      <h4>Contact Information:</h4>
      <p>Email: {doctor.email}</p>
      <p>Phone: {doctor.phone}</p>
      <p>Address: {doctor.address}</p>
    </div>
    
    <div className="doctorFooter">
<AppointmentComponent articleId={articleId}/>
<ReviewComponent articleId={articleId}/>      
    </div>
  </div>
</div>

      <Footer />
    </>
  );
}