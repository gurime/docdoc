import { Phone } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function HomePage() {
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
      <div className="grid-container">
          <div className="service-card">
  <h3>Schedule Your Appointment</h3>
  <p>Ready to take the next step in your health journey? Book an appointment with our expert team today. We offer personalized care and flexible scheduling to fit your needs. Don’t wait—secure your spot and start your path to better health.</p>
  <button>Set Appointment</button>
</div>
<div className="service-card">
  <h3>Emergency Services</h3>
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
    <Phone style={{ marginRight: '1rem', fontSize: '1.5rem', color: '#fff' }} />
    <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fff' }}>123-456-7890</p>
  </div>
  <p style={{ marginBottom: '2rem' }}>In case of an emergency, please call us immediately. Our dedicated team is available 24/7 to provide urgent care and support. Your health and safety are our top priorities.</p>
  <button>Contact Us</button>
</div>

</div>
</section>
</>
)
}
