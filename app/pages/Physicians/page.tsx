import React from 'react'
import Physician from './Physician'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Doctor Care | Physicians',
    description: 'Find experienced and qualified physicians at Doctor Care. Get comprehensive information about our doctors, their specialties, and patient reviews.',
    keywords: 'doctors, physicians, healthcare, medical care, doctor profiles, patient reviews, healthcare services, medical specialists, find a doctor'
  };
  
export default function page() {
return (
<>
<Physician/>
</>
)
}
