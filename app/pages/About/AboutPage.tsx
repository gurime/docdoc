'use client'
import React from 'react';

const AboutPage = () => {

  return (
    <div className="AboutContainer">
    
      <section className="AboutMission">
        <h2>Our Mission</h2>
        <p>
          At Doctor Care, part of CommonSpirit Health, our mission is to bring
          the healing presence of God into our world by enhancing the health of
          those we serve, with a special focus on the vulnerable, while advancing
          social justice for all.
        </p>
      </section>

      <section className="AboutVision">
        <h2>Our Vision</h2>
        <p>
          We strive for a healthier future for everyone, guided by faith,
          driven by innovation, and inspired by our shared humanity.
        </p>
      </section>

      <section className="AboutValues">
        <h2>Our Values</h2>
        <ul>
          <li><strong>Compassion:</strong> We offer care with empathy and love, supporting and comforting those in need of healing.</li>
          <li><strong>Inclusion:</strong> We celebrate each person's unique gifts and voice, respecting the dignity of all individuals.</li>
          <li><strong>Integrity:</strong> We foster trust through honesty and demonstrate courage in confronting inequities.</li>
          <li><strong>Excellence:</strong> We approach our work with passion, creativity, and dedication, aiming to surpass both our own and others' expectations.</li>
          <li><strong>Collaboration:</strong> We believe in the power of working together and focus on building and nurturing meaningful relationships.</li>
        </ul>
      </section>

      <section className="AboutServices">
        <h2>Our Services</h2>
        <p>
          Doctor Care offers a comprehensive range of specialties, including bariatric
          surgery, breast surgery, endocrinology, family practice, general surgery,
          geriatrics, infectious disease, internal medicine, pediatrics, pulmonology,
          rheumatology, thoracic surgery, surgical oncology, urology, and vascular surgery.
          We integrate medical excellence with a holistic approach to ensure the highest quality of care.
        </p>
      </section>
    </div>
  );
};

export default AboutPage;
