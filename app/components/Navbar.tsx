'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import Footer from './Footer';
import Image from 'next/image';
import navlogo from '../img/doc_care.png'
type SearchResult = {
    _id: any;
    title: string;
    collection: string;
    owner: string;
    id: string;
  };

  type Names = [string, string] | [];


export default function Navbar() {
    const router = useRouter();
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isFooterVisible, setIsFooterVisible] = useState(false);
    const [isOverlayActive, setIsOverlayActive] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [names, setNames] = useState<Names>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [displayCount, setDisplayCount] = useState(10);

  
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

    const handleSearch = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (searchTerm.trim().length === 0) {
          setSearchResults([]);
          return;
        }
    
        try {
          const response = await fetch(`/api/search?term=${searchTerm}`);
          const data = await response.json();
          setSearchResults(data.results);
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      };
    const toggleFooter = () => {
        setIsFooterVisible(!isFooterVisible);
        };
return (
<>
<div className="nav">
<Image placeholder="blur" onClick={() => router.push('/')} src={navlogo} width={140} alt='...' />
<div style={overlayStyle}></div>
<form style={{ width: '100%', position: 'relative' }} onSubmit={handleSearch}>
      <input
        placeholder="Search Doctor Care"
        type="search"
        spellCheck="false"
        dir="auto"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOverlayActive(e.target.value.trim().length > 0);
        }}
      />
      {searchResults.length > 0 && searchTerm && (
        <div className="search-results-container">
          <div className="search-results">
            {searchResults.slice(0, displayCount).map((result, index) => (
              <div key={`${result._id}_${index}`} className="search-result-item">
                <Link href={`/doctor/${result._id}`}>
                  <p>{result.title.slice(0, 50)}{result.title.length > 50 ? '...' : ''}</p>
                </Link>
              </div>
            ))}
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
<Link href="/pages/DoctorInfo">Doctor </Link>
<Link href="/pages/Login">Patient </Link>
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
