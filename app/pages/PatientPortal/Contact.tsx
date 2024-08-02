'use client'
import supabase from '@/app/Config/supabase';
import React, { useEffect, useState } from 'react'

interface ContactProps {
  isOpen?: boolean;
  onClose?: () => void;
  doctorId?: string;
}

interface Doctor {
  id: string;
  doctorname: string;
}

export default function Contact({ isOpen = true, onClose = () => {}, doctorId }: ContactProps) {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [subject, setSubject] = useState<string>('');
    const [textmessage, setTextMessage] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
    const [doctorName, setDoctorName] = useState<string>('');

    useEffect(() => {
        const fetchUserData = async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            setEmail(user.email || '');
            // Fetch the user's associated doctor
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('doctor_id')
              .eq('id', user.id)
              .single();
            
            if (userError) {
              console.error('Error fetching user data:', userError);
            } else if (userData?.doctor_id) {
              setSelectedDoctorId(userData.doctor_id);
              fetchDoctorName(userData.doctor_id);
            } else {
              // If no doctor is associated, fetch all doctors
              fetchDoctors();
            }
          }
        };
        fetchUserData();
      }, []);
      
    const fetchDoctors = async () => {
        const { data, error } = await supabase
          .from('users')
          .select('id, doctorname')
          .eq('role', 'doctor');
        
        if (error) {
          console.error('Error fetching doctors:', error);
        } else {
          setDoctors(data || []);
        }
      };
      const fetchDoctorName = async (doctorId: string) => {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('doctorname')
            .eq('doctor_id', doctorId);
      
          if (error) {
            console.error('Error fetching doctor name:', error);
            setError('Failed to fetch doctor name');
            return;
          }
      
          if (!data || data.length === 0) {
            console.log('No doctor found with the provided ID.');
            setError('No doctor found with the provided ID');
            return;
          }
      
          setDoctorName(data[0].doctorname);
        } catch (error) {
          console.error('Unexpected error:', error);
          setError('An unexpected error occurred while fetching doctor name');
        }
      };
  
    const handleContact = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError('');
      setSuccessMessage('');
  
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');
  
        const newContact = {
          user_id: user.id,
          doctor_id: selectedDoctorId || doctorId,
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          subject,
          message: textmessage
        };

        const { data, error } = await supabase
          .from('contacts')
          .insert([newContact]);
  
        if (error) {
          console.error('Supabase error:', error);
          throw new Error(error.message || 'An error occurred while sending the message.');
        }
  
        setSuccessMessage('Message sent successfully!');
        // Reset form fields
        setFirstName('');
        setLastName('');
        setPhone('');
        setSubject('');
        setTextMessage('');
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred while sending the message.");
      } finally {
        setIsSubmitting(false);
      }
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div style={{
            overflowY:'auto',
            background:'transparent'
        }} className="modal-content" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
          <form onSubmit={handleContact} className="register-form">
            {/* Form fields */}          <h2>Contact {doctorName ? doctorName : 'Your Doctor'}</h2>

            <label style={{ color: '#fff' }} className='form-label' htmlFor="fname">First Name</label>
            <input
              id="fname"
              name='fname'
              type="text"
              value={firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
              required
              aria-label="First Name"
            />
            
            <label style={{ color: '#fff' }} className='form-label' htmlFor="lname">Last Name</label>
            <input
              id="lname"
              type="text"
              name='lname'
              value={lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
              required
              aria-label="Last Name"
            />
            
            <label style={{ color: '#fff' }} className='form-label' htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name='email'
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
              aria-label="Email"
            />
            
            <label style={{ color: '#fff' }} className='form-label' htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              name='phone'
              value={phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
              aria-label="Phone Number"
            />
            
            <label style={{ color: '#fff' }} className='form-label' htmlFor="subject">Subject</label>
            <select
              id="subject"
              name='subject'
              value={subject}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSubject(e.target.value)}
              aria-label="Subject"
              required
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
            
            {doctors.length > 0 && (
              <>
                <label style={{ color: '#fff' }} className='form-label' htmlFor="doctor">Select Doctor</label>
                <select
                  id="doctor"
                  value={selectedDoctorId}
                  onChange={(e) => {
                    setSelectedDoctorId(e.target.value);
                    fetchDoctorName(e.target.value);
                  }}
                  required
                >
                  <option value="">Select a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.doctorname}
                    </option>
                  ))}
                </select>
              </>
            )}
            
            <label style={{ color: '#fff' }} className='form-label' htmlFor="tmessage">Type Your Message</label>
            <textarea
              id="tmessage"
              value={textmessage}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTextMessage(e.target.value)}
              rows={10}
              name="tmessage"
              aria-label="Message"
              required
            />
            
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Contact'}
            </button>
             
            {successMessage && <p className="message success-message">{successMessage}</p>}
            {error && <p style={{color:'#fff'}} className="error">{error}</p>}
          </form>
        </div>
      </div>
    );
}