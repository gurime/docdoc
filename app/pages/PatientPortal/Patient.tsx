
'use client'
import Footer from '@/app/components/Footer'
import Navbar from '@/app/components/Navbar'
import supabase from '@/app/Config/supabase';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

export default function PatientPortal() {
    const router = useRouter();

    useEffect(() => {
      const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/pages/Login');
        }
      };
  
      checkUser();
    }, [router]);
return (
<>
<Navbar/>
Patient Portal
<Footer/>
</>
)
}

