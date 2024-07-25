'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import Footer from './Footer';
import Image from 'next/image';
import navlogo from '../img/doc_care.png';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

type SearchResult = {
  id: string;
  doctorname: string;
  role: string;
  created_at: string;
};

export default function Navbar() {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isOverlayActive, setIsOverlayActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [names, setNames] = useState<[string, string] | []>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

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
      if (response.data.results && response.data.results.length > 0) {
        setSearchResults(response.data.results);
        setIsOverlayActive(true);
      } else {
        setSearchResults([]);
        setIsOverlayActive(false);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
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

  return (
    <>
      <div className="nav">
        <Image placeholder="blur" onClick={() => router.push('/')} src={navlogo} width={140} alt='...' />
        <div style={overlayStyle}></div>

        <form style={{ width: '100%', position: 'relative' }} onSubmit={(e) => e.preventDefault()}>
          <input
            placeholder="Search Doctor Care"
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
                        <p>{doctor.doctorname}</p> | <p>{doctor.role}</p>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p>No results found</p>
                )}
              </div>
            </div>
          )}
        </form>

        <div className="navlinks">
          {isSignedIn ? (
            isAdmin ? (
              <span className="sm-name">Guest</span>
            ) : (
              <Link href='#!'>
                {names.length === 2 && (
                  <>
                    <span className="sm-name">{names[0]}</span>
                    <span className="sm-name">{names[1]}</span>
                  </>
                )}
              </Link>
            )
          ) : (
            <span className="sm-name">Guest</span>
          )}
          <Link href="/">Home</Link>
          <Link href="/pages/Physicians">Physicians</Link>
          <Link href="/pages/Login">Patient</Link>
          <Link href='#!' onClick={toggleFooter}>More:</Link>
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
