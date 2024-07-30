'use client'
import supabase from '@/app/Config/supabase';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import registerimg from '../../img/doc_care.png';
import Link from 'next/link';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
  
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (authError) {
      console.error('Login error:', authError);
      setError(authError.message);
    } else {
      console.log('Login successful:', authData);
      router.push('/pages/PatientPortal');
    }
  };
return (
<>
<div className="register-container">
<div className="intro">
    <h1>Welcome Back to Doctor Care!</h1>
    <p>We're excited to see you again. By logging in to Doctor Care, you can continue to access your personalized health management tools and resources.</p>
    <p>As a returning user, you can:</p>
    <ul>
        <li>Quickly view and manage your upcoming appointments.</li>
        <li>Access your health history and track your progress over time.</li>
        <li>Connect with your healthcare team and get the support you need.</li>
    </ul>
    <p>Your security is our priority. We ensure that your data is protected with advanced security measures and is never shared without your permission. Your privacy is important to us.</p>
  
    <p>Ready to get started? Log in below to access your account and continue your journey towards better health with Doctor Care!</p>
</div>

<form onSubmit={handleLogin} className="register-form">
        <img src={registerimg.src}/>
    
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <Link href='/pages/Register' style={{
            color:'#fff',
            textDecoration:'none'
        }} >Don't have an account</Link>  
         <p style={{
          textAlign:'start',
          color:'#fff',
          lineHeight:'2'
         }}>If you need assistance with your account or have any questions, feel free to <Link style={{color:'#fff'}} href="/pages/Contact">contact us</Link>. We’re here to help!</p>
              {error && <p style={{
                    color:'#fff'
                }} className="error">{error}</p>}

      </form>
    </div>
</>
)
}

