import React from 'react';
import { getDoctor } from '../lib';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export async function generateMetadata({ params }: { params: { _id: string } }): Promise<{ title: string }> {
const articleId: string | undefined = params._id;

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

export default async function DoctorDetailsPage({ params }: { params: { _id: string } }): Promise<JSX.Element> {
  const articleId: string | undefined = params._id;

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
      <div>
        <h1>{doctor.doctorname}</h1>
        <h1>{doctor.role}</h1>
       
      </div>
      <Footer />
    </>
  );
}