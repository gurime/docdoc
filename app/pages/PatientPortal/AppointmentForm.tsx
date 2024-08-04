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
const [appointmentDate, setAppointmentDate] = useState(new Date()); // Initialize as Date object
const [appointmentTime, setAppointmentTime] = useState('9:00 AM');
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
const [selectedDate, setSelectedDate] = useState(new Date());
const [selectedTime, setSelectedTime] = useState('9:00 AM');

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
// Fetch the assigned doctor by ID
const { data: doctorData, error: doctorError } =await supabase
.from('doctors')
.select('id, first_name, last_name')
.eq('id', userData.doctor_id); // Only fetch  assigned doctor
if (doctorError) throw doctorError;

const doctorList = doctorData.map((doctor: any) => ({
id: doctor.id,
doctorname: `${doctor.first_name} ${doctor.last_name}`,
}));
setDoctors(doctorList);

if (doctorList.length > 0) {
setSelectedDoctor(doctorList[0]);
}
}
} catch (error) {
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
setAppointmentDate(new Date(e.target.value)); // Update appointmentDate as Date object
};

const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSelectedTime(event.target.value);

if (error) {
return <div className="error-message">{error}</div>;
}

return (
<>
<button className='appointment-form book-appointment-button' onClick={openModal}>Make an Appointment</button>
{isModalOpen && (

<div className="modal-overlay">
<div className="modal-content" style={{ background: 'teal' }}>
{showConfirmation ? (
<div className="confirmation-message">
<Check size={48} color="white" />
<h2>Appointment Set!</h2>
<p>Your appointment has been successfully scheduled.</p>
<Calendar size={24} className="calendar-icon" />
<p>{appointmentDate.toISOString().split('T')[0]} at {selectedTime}</p>
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
required />
</div>

<div className="form-group">
<label>Last Name:</label>
<input
type="text"
value={lastName}
onChange={(e) => setLastName(e.target.value)}
required />
</div>

<div className="form-group">
<label>Email:</label>
<input
type="email"
value={email}
onChange={(e) => setEmail(e.target.value)}
required />
</div>

<div className="form-group">
<label>Phone Number:</label>
<input
type="tel"
value={phoneNumber}
onChange={(e) => setPhoneNumber(e.target.value)}
required />
</div>

<div className="form-group">
<label>Zip Code:</label>
<input
type="text"
value={zipCode}
onChange={(e) => setZipCode(e.target.value)}
required />
</div>

<div className="form-group">
<label>Appointment Date:</label>
<input
type="date"
id="appointmentDate"
value={appointmentDate.toISOString().split('T')[0]} // Convert Date object to string
onChange={handleDateChange}
min={new Date().toISOString().split('T')[0]}
required />
</div>

<div className="form-group">
<label>Appointment Time:</label>
<select value={selectedTime} onChange={handleTimeChange} required>
{/* Add your time options here */}
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
<button className="modal-close-button" onClick={closeModal}>Close</button>

</form>
)}
</div>
</div>
)}
</>
);
};

export default AppointmentForm;
