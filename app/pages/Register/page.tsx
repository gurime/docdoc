import Footer from '@/app/components/Footer'
import Navbar from '@/app/components/Navbar'
import React from 'react'
import RegisterForm from './RegisterForm'
import { Metadata } from 'next'


export const metadata: Metadata = {
    title: 'Doctor Care | Register',
    description: 'Register for Doctor Care to access personalized healthcare services and manage your appointments efficiently.',
    keywords: 'Doctor Care, Register, healthcare, patient registration, medical services, appointments, health management'
}

export default function page() {
return (
<>
<Navbar/>
<RegisterForm/>
<Footer/>
</>
)
}
