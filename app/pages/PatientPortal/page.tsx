import { Metadata } from 'next'
import React from 'react'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import Patient from './Patient'
export const metadata: Metadata = {
    title: 'Patient Portal | Doctor Care',
    description: 'Access your personal health information, manage appointments, and communicate with your healthcare team through the Doctor Care patient portal. Explore features designed to streamline your healthcare experience and keep you informed about your health.',
    keywords: 'patient portal, Doctor Care, health information, manage appointments, communicate with healthcare team, healthcare management, patient access'
};

export default function page() {
return (
<>
<Navbar/>
<Patient />
<Footer/>
</>
)
}
