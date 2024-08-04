'use client'
import { Calendar, Check, Clock, FileText, MapPin, Phone, Stethoscope, Users } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import supabase from '../Config/supabase';
import { ClipLoader } from 'react-spinners';
import { FaCalendarAlt } from 'react-icons/fa';

interface Doctor {
  id: string;
  doctorname: string;
  }
  
  interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  doctor_id: string | null;
  }

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [appointmentTime, setAppointmentTime] = useState('9:00 AM');
  const [doctorId, setDoctorId] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentSet, setAppointmentSet] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('9:00 AM');

  const handleOpenModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhoneNumber('');
    setZipCode('');
    setErrorMessage('');
    setSuccessMessage('');
    setAppointmentSet(false);
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch user data
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
  
        if (user) {
          const { data: userData, error: userDataError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (userDataError) throw userDataError;
          setUser(userData);
          setCurrentUser(userData);
  
          // Fetch assigned doctor if there is one
          if (userData.doctor_id) {
            const { data: doctorData, error: doctorError } = await supabase
              .from('doctors')
              .select('id, first_name, last_name')
              .eq('id', userData.doctor_id)
              .single();
  
            if (doctorError) throw doctorError;
  
            if (doctorData) {
              const assignedDoctor = {
                id: doctorData.id,
                doctorname: `${doctorData.first_name} ${doctorData.last_name}`,
              };
              setDoctors([assignedDoctor]);
              setSelectedDoctor(assignedDoctor);
              setDoctorId(assignedDoctor.id);
            }
          } else {
            // If no assigned doctor, clear the doctor-related states
            setDoctors([]);
            setSelectedDoctor(null);
            setDoctorId('');
          }
        }
      } catch (error) {
        setError('An error occurred while fetching data. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  
    fetchData();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!currentUser) {
      setError('No user logged in');
      return;
    }
    try {
      const selectedDoctor = doctors.find(d => d.id === doctorId);
      if (!selectedDoctor) {
        setError('Doctor not found');
        return;
      }
      
      const { data: appointmentData, error: appointmentError } = await supabase
        .from('appointments')
        .insert([
          {
            user_id: currentUser.id,
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone_number: phoneNumber,
            zip_code: zipCode,
            appointment_date: appointmentDate.toISOString().split('T')[0],
            appointment_time: selectedTime, 
            doctor_id: doctorId,
            doctorname: selectedDoctor.doctorname, 
          },
        ]);
      if (appointmentError) throw appointmentError;
      
      const { data: userData, error: userError } = await supabase
        .from('users')
        .update({ doctor_id: doctorId })
        .eq('id', currentUser.id);
      if (userError) throw userError;
      
      // Update local state immediately
      const updatedUser = { ...currentUser, doctor_id: doctorId };
      setCurrentUser(updatedUser);
      setSelectedDoctor(selectedDoctor);
      setSuccessMessage('Appointment scheduled successfully!');
      setAppointmentSet(true);
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
        closeModal();
      }, 3000);
    } catch (error) {
      setError('An error occurred while creating the appointment. Please try again.');
    }
  };
    
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value));
    setAppointmentDate(new Date(e.target.value));
  };
    
  const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSelectedTime(event.target.value);

return (
<>

<section className="hero-section">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>Welcome to Doctor Care</h1>
        <p>Your health, our priority</p>
        <button onClick={() => router.push('/pages/About')}>More Info</button>
      </div>
    </section>

    <section className="services-section">
    <div className="service-cards-container">
    <div className="service-card">
        <Calendar className="card-icon" />
        <h3>Schedule an Appointment</h3>
        <div className="service-card-content">
          <p>Book your next visit with our expert medical team. We offer flexible scheduling to accommodate your needs.</p>
          <button onClick={handleOpenModal}>{user ? 'Book Now' : 'Log In'}
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ background: 'teal' }}>
            {showConfirmation ? (
              <div className="confirmation-message">
                <Check size={48} color="white" />
                <h2 style={{color:'#fff'}}>Appointment Set!</h2>
                <p style={{color:'#fff'}}>Your appointment has been successfully scheduled.</p>
                <Calendar style={{color:'#fff'}} size={24} className="calendar-icon" />
                <p style={{color:'#fff'}}>{appointmentDate.toISOString().split('T')[0]} at {selectedTime}</p>
              </div>
            ) : (
              <form className="appointment-form" onSubmit={handleSubmit}>
                <h2>Make an Appointment <FaCalendarAlt /></h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name:</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Last Name:</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Phone Number:</label>
                    <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Zip Code:</label>
                    <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Appointment Date:</label>
                    <input
                      type="date"
                      id="appointmentDate"
                      value={appointmentDate.toISOString().split('T')[0]}
                      onChange={handleDateChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Appointment Time:</label>
                    <select value={selectedTime} onChange={handleTimeChange} required>
                      <option value="9:00 AM">9:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="1:00 PM">1:00 PM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="3:00 PM">3:00 PM</option>
                      <option value="4:00 PM">4:00 PM</option>
                      <option value="5:00 PM">5:00 PM</option>
                      <option value="6:00 PM">6:00 PM</option>
                      <option value="7:00 PM">7:00 PM</option>
                      <option value="8:00 PM">8:00 PM</option>
                    </select>
                  </div>
<div className="form-group">
<label>Doctor:</label>
<select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required>
{doctors.map((doctor) => (
<option key={doctor.id} value={doctor.id}>
{doctor.doctorname}
</option>
))}
</select>
</div>
</div>
<button style={{width:'100%'}} type="submit" disabled={loading}>
{loading ? <ClipLoader size={20} color="white" /> : 'Submit'}

</button>
<button  className="modal-close-button" onClick={closeModal}>Close</button>
</form>
            )}
          </div>
        </div>
      )}

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
