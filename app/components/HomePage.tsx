'use client'
import { Calendar, Clock, FileText, MapPin, Phone, Stethoscope, Users } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import supabase from '../Config/supabase';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        return;
      }
      if (user) {
        const { data: userData, error: userDataError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (userDataError) {
          return;
        }
        setUser(userData);
      }
    }

    getUser();
  }, []);

return (
<>

<section className="hero-section">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>Welcome to Doctor Care</h1>
        <p>Your health, our priority</p>
        <button>More Info</button>
      </div>
    </section>

    <section className="services-section">
    <div className="service-cards-container">
  <div className="service-card">
    <Calendar className="card-icon" />
    <h3>Schedule an Appointment</h3>
    <div className="service-card-content">
      <p>Book your next visit with our expert medical team. We offer flexible scheduling to accommodate your needs.</p>
      <button onClick={() => router.push('/pages/PatientPortal')}>Book Now</button>
    </div>
  </div>

  <div className="service-card">
    <Stethoscope className="card-icon" />
    <h3>Our Services</h3>
    <div className="service-card-content">
      <p>Explore our comprehensive range of medical services, from preventive care to specialized treatments.</p>
      <button onClick={() => router.push('#!')}>View Services</button>
    </div>
  </div>

  <div className="service-card">
    <Users className="card-icon" />
    <h3>Find a Doctor</h3>
    <div className="service-card-content">
      <p>Search our directory of experienced physicians and specialists to find the right care for you.</p>
      <button onClick={() => router.push('/pages/Physicians')}>Search Doctors</button>
    </div>
  </div>

  <div className="service-card">
    <Clock className="card-icon" />
    <h3>Emergency Services</h3>
    <div className="service-card-content">
      <div className="emergency-contact">
        <Phone />
        <span>911</span>
      </div>
      <p>Our emergency department is open 24/7. For life-threatening emergencies, always call 911.</p>
      <button onClick={() => router.push('#!')}>Learn More</button>
    </div>
  </div>

  <div className="service-card">
    <FileText className="card-icon" />
    <h3>Patient Portal</h3>
    <div className="service-card-content">
      <p>Access your medical records, test results, and communicate with your healthcare team securely online.</p>
      <button onClick={() => router.push('/pages/PatientPortal')}>
                {user ? 'Patient Portal' : 'Log In'}
              </button>    </div>
  </div>

  <div className="service-card">
    <MapPin className="card-icon" />
    <h3>Locations</h3>
    <div className="service-card-content">
      <p>Find our hospitals, clinics, and specialized care centers conveniently located near you.</p>
      <button onClick={() => router.push('#!')}>Find Locations</button>
    </div>
  </div>
</div>
</section>
</>
)
}
