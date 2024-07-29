'use client'
import React, { useState } from 'react'
import { BeatLoader } from 'react-spinners'
import registerimg from '../../img/doc_care.png';
import supabase from '@/app/Config/supabase';

export default function ContactForm() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [textmessage, settextMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState('');
  
    const handleContact = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      // Validate inputs
      if (!firstName || !lastName || !email) {
        setError('All fields are required.');
        setIsSubmitting(false);
        return;
      }
  
      try {
        // Insert contact form data into Supabase
        const { error } = await supabase
          .from('contacts') // Replace 'contacts' with your table name
          .insert([{ first_name: firstName, last_name: lastName, email, textmessage }]);
        
        if (error) throw error;
        
        // Reset form and handle success
        setFirstName('');
        setLastName('');
        setEmail('');
        settextMessage('');
        setError(null);
        setSuccessMessage('');
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
                <img src={registerimg.src} alt="Register"/>
                <label style={{
                    color:'#fff'
                }}className='form-label' htmlFor="fname">First Name</label>

                <input
                
                name='fname'
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    aria-label="First Name"
                />
                                <label style={{
                    color:'#fff'
                }}className='form-label' htmlFor="lname">Last Name</label>

                <input
                 
                    type="text"
                    name='lname'
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    aria-label="Last Name"
                />
                <label  style={{
                    color:'#fff'
                }}className='form-label' htmlFor="email">Email</label>
                <input
                 
                    type="email"
                    name='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-label="Email"
                />
<label htmlFor="tmessage"  style={{
                    color:'#fff'
                }}>Type Your Message</label>
                <textarea 
                value={textmessage}
                onChange={(e) => settextMessage(e.target.value)}
                rows={10}  name="tmessage" id="">

                </textarea>
           
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <BeatLoader/>: 'Contact'}
                </button>
                {successMessage && <p className="message success-message">{successMessage}</p>}
                {error && <p className="error">{error}</p>}
            </form>
        </div>
</>
)
}
