'use client'
import supabase from '@/app/Config/supabase';
import React, { useEffect, useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

interface Doctor {
    id: string;
    doctorname: string;
  }

  interface User {
    id: string;
    first_name: string;
    last_name: string;
    doctor: number;
  }
  
  
  const AppointmentForm: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
        const fetchDoctors = async () => {
          const { data, error } = await supabase.from('users').select('*').eq('doctor', 1);
          if (error) {
            console.error('Error fetching doctors:', error);
          } else {
            const doctorList = data.map((doctor: User) => ({
              id: doctor.id,
              name: `${doctor.first_name} ${doctor.last_name}`,
            }));
            setDoctors(doctorList);
          }
          setLoading(false);
        };
    
        fetchDoctors();
      }, []);
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const { data, error } = await supabase.from('appointments').insert([
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone_number: phoneNumber,
          zip_code: zipCode,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          doctor_id: doctorId,
        },
      ]);
  
      if (error) {
        console.error('Error creating appointment:', error);
      } else {
        console.log('Appointment created:', data);
      }
    };
  
    if (loading) {
      return <ClipLoader color="#0000ff" loading={loading} size={50} />;
    }
  
    return (
        <form className="appointment-form" onSubmit={handleSubmit}>
        <h2>Make an Appointment <FaCalendarAlt /></h2>
        <div className="form-grid">
          <div className="form-group">
            <label>First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Zip Code:</label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Appointment Date:</label>
            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Appointment Time:</label>
            <input
              type="time"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
          <label>Doctor:</label>
          <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required>
            <option value="">Select a Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>{doctor.doctorname}</option>
            ))}
          </select>
        </div>
          <button type="submit" className="submit-button">Submit</button>
        </div>
      </form>
    );
  };
  
  export default AppointmentForm;