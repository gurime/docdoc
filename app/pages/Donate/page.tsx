import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Navbar';
import { Metadata } from 'next';
import React from 'react'
import DontateForm from './DontateForm';

export const metadata: Metadata = {
    title: 'Support Us | Doctor Care',
    description: 'Discover how you can support Doctor Care’s mission to provide exceptional healthcare services. Learn about our initiatives, the impact of your contributions, and how your donation helps connect patients with trusted medical professionals and vital resources.',
    keywords: 'donate, support us, Doctor Care, healthcare donations, impact, medical professionals, patient resources, charitable contributions'
};


export default function page() {
return (
<>
<Navbar/>
<DontateForm/>
<Footer/>
</>
)
}
