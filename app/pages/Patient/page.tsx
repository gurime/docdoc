import { Metadata } from 'next'
import React from 'react'
import PatientPortal from './PatientPortal'


export const metadata: Metadata = {
    title:'Doctor Care | Patient Portal',
    description: 'Access your health information and manage your appointments with our Doctor Care patient portal.',
    keywords: 'Doctor Care, Patient Portal, Health Information, Appointments, Medical Services',
}
export default function page() {
return (
<>
<PatientPortal/>
</>
)
}
