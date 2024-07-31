import React, { useEffect, useState } from 'react';
import supabase from '@/app/Config/supabase';
import { FaCalendarAlt } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import { Calendar, Check } from 'lucide-react';

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

const AppointmentForm: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState("9:00 AM");
    const [doctorId, setDoctorId] = useState('');
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [appointmentSet, setAppointmentSet] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

    const openModal = () => setIsModalOpen(true);
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
        const fetchDoctorsAndUser = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch doctors
                const { data: doctorData, error: doctorError } = await supabase
                    .from('doctors')
                    .select('id, first_name, last_name');

                if (doctorError) throw doctorError;

                const doctorList = doctorData.map((doctor: any) => ({
                    id: doctor.id,
                    doctorname: `${doctor.first_name} ${doctor.last_name}`,
                }));
                setDoctors(doctorList);

                // Fetch current user
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                if (userError) throw userError;

                if (user) {
                    const { data: userData, error: userDataError } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', user.id)
                        .single();

                    if (userDataError) throw userDataError;

                    setCurrentUser(userData);
                    setFirstName(userData.first_name || '');
                    setLastName(userData.last_name || '');
                    setEmail(userData.email || '');
                    setDoctorId(userData.doctor_id || '');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('An error occurred while fetching data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorsAndUser();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!currentUser) {
            setError('No user logged in');
            return;
        }

        try {
            // Create appointment
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
                        appointment_date: appointmentDate,
                        appointment_time: appointmentTime,
                        doctor_id: doctorId,
                    },
                ]);

            if (appointmentError) throw appointmentError;

            // Update user's assigned doctor
            const { data: userData, error: userError } = await supabase
                .from('users')
                .update({ doctor_id: doctorId })
                .eq('id', currentUser.id);

            if (userError) throw userError;

            console.log('Appointment created and doctor assigned:', appointmentData);
            
            // Update local state immediately
            const updatedUser = { ...currentUser, doctor_id: doctorId };
            setCurrentUser(updatedUser);
            
            const selectedDoctor = doctors.find(d => d.id === doctorId);
            if (selectedDoctor) {
                setSelectedDoctor(selectedDoctor);
            }

            setSuccessMessage('Appointment scheduled successfully!');
            setAppointmentSet(true);
            setShowConfirmation(true);
            setTimeout(() => {
                setShowConfirmation(false);
                closeModal();
            }, 3000);
        } catch (error) {
            console.error('Error creating appointment or updating user:', error);
            setError('An error occurred while creating the appointment. Please try again.');
        }
    };




    if (error) {
        return <div className="error-message">{error}</div>;
    }
    return (
        <>
<button className='appointment-form book-appointment-button' onClick={openModal}>Make an Appointment</button>
{isModalOpen && (
<div className="modal-overlay">
<div className="modal-content" style={{background:'teal'}}>
{showConfirmation ? (
<div className="confirmation-message">
<Check size={48} color="white" />
<h2>Appointment Set!</h2>
<p>Your appointment has been successfully scheduled.</p>
<Calendar size={24} className="calendar-icon" />
<p>{appointmentDate} at {appointmentTime}</p>
</div>
) : (
<form className="appointment-form" onSubmit={handleSubmit}>
<h2>Make an Appointment <FaCalendarAlt /></h2>
<div className="form-grid">
<div className="form-group">
<label>First Name:</label>
<input
type="text"
value={firstName}
onChange={(e) => setFirstName(e.target.value)}
required/>
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
                                        <select 
                                            value={doctorId} 
                                            onChange={(e) => setDoctorId(e.target.value)} 
                                            required
                                        >
                                            <option value="">Select a Doctor</option>
{doctors.map((doctor) => (
<option key={doctor.id} value={doctor.id}>Dr. {doctor.doctorname}</option>
))}
</select>
</div>
<button type="submit" className="submit-button">Submit</button>
</div>
</form>
)}
{errorMessage && <p className={`message error-message`}>{errorMessage}</p>}
{successMessage && <p className={`message success-message`}>{successMessage}</p>}
<button onClick={closeModal} className="close-button">Close</button>
</div>
</div>
)}
</>
);
};

export default AppointmentForm;