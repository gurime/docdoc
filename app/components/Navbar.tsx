'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import Footer from './Footer';
import Image from 'next/image';
import navlogo from '../img/doc_care.png'
import axios from 'axios';

type SearchResult = {
    id: string;
    title: string;
};

export default function Navbar() {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isOverlayActive, setIsOverlayActive] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [names, setNames] = useState<[string, string] | []>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const overlayStyle: React.CSSProperties = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: '#000',
      opacity: '.6',
      display: isOverlayActive ? 'block' : 'none',
      pointerEvents: 'none',
  };

  const handleSearch = async () => {
      if (searchTerm.trim().length === 0) {
          setSearchResults([]);
          return;
      }

      try {
          const response = await axios.get(`/api/search`, {
              params: { term: searchTerm },
          });
          console.log('Search response:', response.data); // Debug log
          setSearchResults(response.data.results);
          setIsOverlayActive(true); // Ensure overlay is active when results are available
      } catch (error) {
          console.error('Error fetching search results:', error);
          setSearchResults([]); // Clear results on error
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

  console.log('Current state:', { // Debug log
      searchTerm,
      isOverlayActive,
      searchResults
  });
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
              searchResults.map((result) => (
                <div key={result.id} className="search-result-item">
                  <Link href={`/doctor/${result.id}`}>
                    <p>{result.title}</p>
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
            <>
              {isAdmin ? (
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
              )}
            </>
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
    )
}