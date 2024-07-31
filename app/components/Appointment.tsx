'use client'
import React, { useEffect, useState } from 'react';
import supabase from '../Config/supabase';
import { BeatLoader } from 'react-spinners';
import { Calendar, Check } from 'lucide-react';

interface AppointmentComponentProps {
  articleId: string;
}

const AppointmentComponent: React.FC<AppointmentComponentProps> = ({ articleId }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("9:00 AM");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [appointmentSet, setAppointmentSet] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [doctorName, setDoctorName] = useState<string | null>(null);
  const [isUserSignedIn, setIsUserSignedIn] = useState<boolean>(false);


  useEffect(() => {
    const fetchDoctorName = async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('doctorname')
        .eq('id', articleId)
        .single();

      if (error) {
        console.error('Error fetching doctor name:', error);
      } else {
        setDoctorName(data?.doctorname || null);
      }
    };

    fetchDoctorName();
  }, [articleId]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedDate(new Date());
    setSelectedTime("9:00 AM");
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhoneNumber('');
    setZipCode('');
    setErrorMessage('');
    setSuccessMessage('');
    setAppointmentSet(false);
  };

  const handleDateChange = (date: Date) => setSelectedDate(date);
  const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSelectedTime(event.target.value);

  const handleScheduleAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const appointmentData = {
        doctor_id: articleId, // Use articleId instead of doctor_name
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        zip_code: zipCode,
        appointment_date: selectedDate.toISOString(),
        appointment_time: selectedTime,
        email: email || null,
      };

      const { error } = await supabase.from('appointments').insert([appointmentData]);

      if (error) throw error;

      setSuccessMessage('Appointment scheduled successfully!');
      setAppointmentSet(true);
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
        closeModal();
      }, 3000);
    } catch (error: any) {
      console.error('Error scheduling appointment:', error);
      setErrorMessage(`Error scheduling appointment: ${error.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <button onClick={openModal} className="book-appointment-button">Book an Appointment</button>

{isModalOpen && (
<div className="modal-overlay">
<div className="modal-content">
{showConfirmation ? (
<div className="confirmation-message">
<Check size={48} color="green" />
<h2>Appointment Set!</h2>
<p>Your appointment has been successfully scheduled.</p>
<Calendar size={24} className="calendar-icon" />
<p>{selectedDate.toLocaleDateString()} at {selectedTime}</p>
</div>
) : (

<>
<h2 className="modal-title">Schedule an Appointment</h2>
<form onSubmit={handleScheduleAppointment} className="appointment-form">
<div className="form-group">
          

<p style={{
marginBottom:'0 0 20px 0',
borderBottom:'solid 1px #155e75',
lineHeight:'2'
}} className="form-label">{doctorName}</p>


<label style={{color:'#000'}} htmlFor="firstName" className="form-label">Patient First Name:</label>
<input
type="text"
id="firstName"
value={firstName}
onChange={(e) => setFirstName(e.target.value)}
required
className="form-input"/>
</div>

<div className="form-group">
<label style={{color:'#000'}} htmlFor="lastName" className="form-label">Patient Last Name:</label>
<input
type="text"
id="lastName"
value={lastName}
onChange={(e) => setLastName(e.target.value)}
required
className="form-input"/>
</div>

<div className="form-group">
              <label
               style={{color:'#000'}} htmlFor="email" className="form-label">Patient Email (optional):</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label style={{color:'#000'}} htmlFor="phoneNumber" className="form-label">Patient Phone Number:</label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label style={{color:'#000'}} htmlFor="zipCode" className="form-label">Patient Zip Code:</label>
              <input
                type="text"
                id="zipCode"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label style={{color:'#000'}} htmlFor="appointmentDate" className="form-label">Appointment Date:</label>
              <input
                type="date"
                id="appointmentDate"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => handleDateChange(new Date(e.target.value))}
                min={new Date().toISOString().split('T')[0]}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label style={{color:'#000'}} htmlFor="appointmentTime" className="form-label">Appointment Time:</label>
              <select
                id="appointmentTime"
                value={selectedTime}
                onChange={handleTimeChange}
                required
                className="form-select"
              >
                <option value="9:00 AM">9:00 AM</option>
                <option value="9:30 AM">9:30 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="12:30 PM">12:30 PM</option>
                <option value="1:00 PM">1:00 PM</option>
                <option value="1:30 PM">1:30 PM</option>
                <option value="2:00 PM">2:00 PM</option>
                <option value="2:30 PM">2:30 PM</option>
                <option value="3:00 PM">3:00 PM</option>
                <option value="3:30 PM">3:30 PM</option>
                <option value="4:00 PM">4:00 PM</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="submit-button"
            >
              {isLoading ? <BeatLoader size={8} color='#fff'/> : 'Schedule Appointment'}
            </button>
          </form>
          {errorMessage && <p className={`message error-message`}>{errorMessage}</p>}
          {successMessage && <p className={`message success-message`}>{successMessage}</p>}
          <button onClick={closeModal} className="close-button">Close</button>
        </>
      )}
    </div>
  </div>
)}
    </>
  );
};

export default AppointmentComponent;