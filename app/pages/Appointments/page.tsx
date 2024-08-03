import Footer from '@/app/components/Footer'
import Navbar from '@/app/components/Navbar'
import React from 'react'
import AppointmentSheet from './AppointmentSheet'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title:'Doctor Care | Appointent Sheet',
    description: 'Access your health information and manage your appointments with our Doctor Care patient portal.',
    keywords: 'Doctor Care, Patient Portal, Health Information, Appointments, Medical Services',
}


export default function page() {
return (
<>
<Navbar/>
<AppointmentSheet/>
<Footer/>
</>
)
}
