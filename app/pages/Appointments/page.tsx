import Footer from '@/app/components/Footer'
import Navbar from '@/app/components/Navbar'
import React from 'react'
import AppointmentSheet from './AppointmentSheet'
import { Metadata } from 'next'
import { SkeletonTheme } from 'react-loading-skeleton'

export const metadata: Metadata = {
    title: 'Appointment Sheet | Doctor Care',
    description: 'View and manage your scheduled appointments with Doctor Care. Access detailed information about your appointments and stay organized with our user-friendly appointment sheet.',
    keywords: 'appointment sheet, Doctor Care, manage appointments, scheduled appointments, patient portal, healthcare management'
};


export default function page() {
return (
<>
<Navbar/>
<SkeletonTheme baseColor="grey" highlightColor="#e6e6e6">
      <AppointmentSheet />
    </SkeletonTheme><Footer/>
</>
)
}
