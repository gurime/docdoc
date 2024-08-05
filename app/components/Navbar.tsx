'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import Footer from './Footer';
import Image from 'next/image';
import navlogo from '../img/doc_care.png';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import supabase from '../Config/supabase';

type SearchResult = {
  id: string;
  doctorname: string;
  role: string;
  created_at: string;
  coverimage: string;
};

type UserData = {
  id: string;
  first_name: string;
  last_name: string;
};

export default function Navbar() {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isOverlayActive, setIsOverlayActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Error fetching session:", sessionError);
        return;
      }
    
      if (session) {
        setIsSignedIn(true);
    
        const { data, error } = await supabase
          .from('users')
          .select('id, first_name, last_name')  
          .eq('id', session.user.id)
          .single();
    
        if (error) {
        } else if (data) {
          setUserData(data);
        } else {
        }
      } else {
        setIsSignedIn(false);
        setUserData(null);
      }
    };
    fetchUserData();
  }, []);

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: '#000',
    opacity: 0.6,
    display: isOverlayActive ? 'block' : 'none',
    pointerEvents: 'none',
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get('/api/search', {
        params: { term: searchTerm },
      });
      setSearchResults(response.data.results || []);
      setIsOverlayActive(true);
    } catch (error) {
      setSearchResults([]);
      setIsOverlayActive(false);
    }
  };

  const handleDocumentClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const searchContainer = document.querySelector('.search-results-container');
    const searchInput = document.querySelector('input[type="search"]');

    if (searchContainer && !searchContainer.contains(target) && target !== searchInput) {
      setIsOverlayActive(false);
      setSearchResults([]);
      setSearchTerm('');
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [handleDocumentClick]);

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    } else {
      setSearchResults([]);
      setIsOverlayActive(false);
    }
  }, [searchTerm]);

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setIsOverlayActive(event.target.value.trim().length > 0);
  };

  const toggleFooter = () => {
    setIsFooterVisible(!isFooterVisible);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setIsSignedIn(false);
      setUserData(null);
      router.push('/pages/Login');
    } catch (error) {
    }
  }
  return (
    <>
      <div className="nav">
        <Image
          onClick={() => router.push('/')}
          src={navlogo}
          width={140}
          alt="Doctor Care Logo"
        />
        <div style={overlayStyle}></div>

        <form style={{ width: '100%', position: 'relative' }} onSubmit={(e) => e.preventDefault()}>
          <input
            placeholder="Search Doctor Care"
            aria-label="Search Doctor Care"

            type="search"
            spellCheck={false}
            dir="auto"
            value={searchTerm}
            onChange={handleSearchInputChange}
          />
          {isOverlayActive && (
            <div className="search-results-container">
              <div className="search-results">
                {searchResults.length > 0 ? (
                  searchResults.map((doctor) => (
                    <div key={doctor.id || uuidv4()} className="search-result-item">
                      <Link href={`/pages/doctor/${doctor.id}`}>
                        <div className="doctorcard">
                         
                          <div className="doctorcard-info"> <img className="doctorcard-image" src={doctor.coverimage} alt={doctor.doctorname} />
                            <p className="doctorcard-name">{doctor.doctorname}</p>
                            <p className="doctorcard-role">{doctor.role}</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p>Searching...</p>
                )}
              </div>
            </div>
          )}
        </form>

        <div className="navlinks">
          <Link href="/">Home</Link>    <Link href="/pages/Physicians">Physicians</Link>
          <Link href="/pages/Donate">Donate</Link>
          {isSignedIn && userData ? (
           <>        
              <Link href="/pages/PatientPortal">Patient</Link>

           <span className="sm-name">{userData.first_name} </span>

           <span className='sm-name'>{userData.last_name}</span>
           <button onClick={handleLogout}>Logout</button>

         </>
          ) : (
            <>
              <Link href='/pages/Register' className="sm-name">Guest</Link>
              <Link href="/pages/Login">Login</Link>
            </>
          )}
      
          <Link href="#" onClick={toggleFooter}>More:</Link>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%' }}>
        <div style={{ position: 'absolute', width: '100%' }}>
          {isFooterVisible && <Footer />}
        </div>
      </div>
    </>
  );
}
