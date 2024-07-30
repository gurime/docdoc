'use client'
import React, { useState } from 'react'
import { BeatLoader } from 'react-spinners'
import registerimg from '../../img/doc_care.png';
import supabase from '@/app/Config/supabase';

export default function ContactForm() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [phone, setPhone] = useState('');
    const [textmessage, settextMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState('');
  
    const handleContact = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      // Validate inputs
      if (!firstName || !lastName || !email || !subject || !phone || !textmessage) {
        setError('All fields are required.');
        setIsSubmitting(false);
        return;
      }
    
      try {
        // Insert contact form data into Supabase
        const { error } = await supabase
          .from('contacts') // Replace 'contacts' with your table name
          .insert([{ first_name: firstName, last_name: lastName, email, textmessage, subject, phone }]);
        
        if (error) throw error;
        
        // Reset form and handle success
        setFirstName('');
        setLastName('');
        setEmail('');
        setSubject('');
        setPhone('');
        settextMessage('');
        setError(null);
        setSuccessMessage('Your message has been sent successfully!');

        setTimeout(() => {
          setSuccessMessage('');

        }, 3000); 
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsSubmitting(false);
      }
    };
return (
<>
<div className="register-container">
   
<form onSubmit={handleContact} className="register-form">
    <img src={registerimg.src} alt="Register" />
    
    <label style={{
                    color:'#fff'
                }} className='form-label' htmlFor="fname">First Name</label>
    <input
        name='fname'
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
        aria-label="First Name"
    />
    
    <label style={{
                    color:'#fff'
                }} className='form-label' htmlFor="lname">Last Name</label>
    <input
        type="text"
        name='lname'
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
        aria-label="Last Name"
    />
    
    <label style={{
                    color:'#fff'
                }} className='form-label' htmlFor="email">Email</label>
    <input
        type="email"
        name='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        aria-label="Email"
    />
    
    <label style={{
                    color:'#fff'
                }} className='form-label' htmlFor="phone">Phone Number</label>
    <input
        type="tel"
        name='phone'
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        aria-label="Phone Number"
    />
    
    <label style={{
                    color:'#fff'
                }} className='form-label' htmlFor="subject">Subject</label>
    <select
        name='subject'
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        aria-label="Subject"

        style={{
          padding:'0.5rem',
          outline:'none',
          marginBottom:'1rem'
        }}
    >
        <option value="">Select a subject</option>
        <option value="General Inquiry">General Inquiry</option>
        <option value="Technical Support">Technical Support</option>
        <option value="Feedback">Feedback</option>
    </select>
    
    <label  style={{
                    color:'#fff'
                }} className='form-label' htmlFor="tmessage">Type Your Message</label>
    <textarea 
        value={textmessage}
        onChange={(e) => settextMessage(e.target.value)}
        rows={10}
        name="tmessage"
        aria-label="Message"
    />
    
    <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <BeatLoader /> : 'Contact'}
    </button>
    
    {successMessage && <p className="message success-message">{successMessage}</p>}
    {error && <p style={{color:'#fff'}} className="error">{error}</p>}
</form>
        </div>
</>
)
}
