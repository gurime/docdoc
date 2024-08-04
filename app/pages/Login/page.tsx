import Navbar from '@/app/components/Navbar'
import React from 'react'
import LoginForm from './LoginForm'
import Footer from '@/app/components/Footer'
import { Metadata } from 'next'
export const metadata: Metadata = {
    title: ' Login | Doctor Care ',
    description: 'Log in to Doctor Care to access your personalized healthcare services and manage your appointments efficiently.',
    keywords: 'Doctor Care, Login, healthcare, patient login, medical services, appointments, health management'
}


export default function page() {
return (
<>
<Navbar/>
<LoginForm/>
<Footer/>
</>
)
}
