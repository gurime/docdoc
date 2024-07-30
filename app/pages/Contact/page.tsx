import Footer from '@/app/components/Footer'
import Navbar from '@/app/components/Navbar'
import { Metadata } from 'next'
import React from 'react'
import ContactForm from './ContactForm'

export const metadata:Metadata = {
    title:'Contact Doctor Care '
}

export default function page() {
return (
<>
<Navbar/>
<ContactForm/>
<Footer/>
</>
)
}
