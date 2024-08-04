import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Navbar';
import { Metadata } from 'next';
import React from 'react'
import AboutPage from './AboutPage';



export const metadata: Metadata = {
    title: 'About Us | Doctor Care',
    description: 'Learn more about Doctor Care, our mission, values, and the team dedicated to providing exceptional healthcare services. Discover how we connect patients with trusted medical professionals and resources.',
    keywords: 'about us, Doctor Care, mission, values, healthcare team, medical professionals, patient resources, healthcare services'
};


export default function page() {
return (
<>
<Navbar/>
<AboutPage/>
<Footer/>
</>
)
}
