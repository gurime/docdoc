import Footer from '@/app/components/Footer'
import Navbar from '@/app/components/Navbar'
import { Metadata } from 'next'
import React from 'react'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
    title: 'Contact Us | Doctor Care',
    description: 'Get in touch with Doctor Care for any inquiries, support, or feedback. Find contact details, office hours, and a contact form to reach our team directly.',
    keywords: 'contact us, Doctor Care, support, inquiries, feedback, contact details, office hours'
};

export default function page() {
return (
<>
<Navbar/>
<ContactForm/>
<Footer/>
</>
)
}
