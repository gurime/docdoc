'use client';
import supabase from '@/app/Config/supabase';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import registerimg from '../../img/doc_care.png';
import Link from 'next/link';
import { BeatLoader } from 'react-spinners';

export default function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!email || !password || !firstName || !lastName) {
            setError('All fields are required.');
            return;
        }

        if (isSubmitting) return;

        setIsSubmitting(true);
    
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });
    
        if (authError) {
            console.error('Registration error:', authError);
            setError(authError.message);
            setIsSubmitting(false);
        } else {
            const user = authData.user;
            if (user) {
                console.log('User registered:', user);
                const { error: insertError } = await supabase
                    .from('users')
                    .insert([
                        { id: user.id, first_name: firstName, last_name: lastName }
                    ]);
    
                if (insertError) {
                    console.error('Error inserting user into database:', insertError);
                    setError(insertError.message);
                    setIsSubmitting(false);
                } else {
                    localStorage.setItem('user', JSON.stringify(user));
                    router.push('/pages/PatientPortal');
                }
            }
        }
    };

    return (
        <div className="register-container">
       <div className="intro">
    <h1>Welcome to Doctor Care!</h1>
    <p>We're delighted to have you join our community. By registering with Doctor Care, you gain access to a range of features designed to help you manage your health effectively.</p>
    <p>As a registered user, you can:</p>
    <ul>
        <li>Manage your appointments easily with our intuitive scheduling system.</li>
        <li>Track your health history and receive personalized insights tailored to your needs.</li>
        <li>Access a wealth of resources including health tips, articles, and updates relevant to your wellness.</li>
        <li>Connect with healthcare professionals and receive guidance on your health journey.</li>
    </ul>
    <p>Rest assured, your privacy and security are our top priorities. Your personal information is securely stored and never shared without your explicit consent. We adhere to the highest standards of data protection to ensure your information remains confidential.</p>
    <p>Get started today and take the first step towards better health with Doctor Care!</p>
</div>
            <form onSubmit={handleRegister} className="register-form">
                <img src={registerimg.src} alt="Register"/>
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    aria-label="First Name"
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    aria-label="Last Name"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-label="Email"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-label="Password"
                />
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <BeatLoader/> : 'Register'}
                </button>
                <Link style={{ color:'#fff', textDecoration:'none' }} href='/pages/Login'>
                    Already have an account
                </Link>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
}
