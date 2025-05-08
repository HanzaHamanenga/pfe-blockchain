import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import Icon from './Icon.png';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for: ${searchQuery}`); 
  };

  return (
    <div className='navbar'>
      <nav>
        <div className='logo'>
          <Link to='/'><img src={Icon} alt="Website Logo" /></Link><span>DocSecurity With <br />
           Blockchain Technology </span>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button 
          className="mobile-menu-btn" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <div className='menu'>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/features" onClick={() => setIsMenuOpen(false)}>Features</Link>
            <Link to="/about-us" onClick={() => setIsMenuOpen(false)}>About Us</Link>
            <Link to="/contact-us" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
          </div>

          <div className='search'>
            <form onSubmit={handleSearch}>
              <label htmlFor="search" className="sr-only">Search</label>
              <input 
                id="search"
                type="text" 
                placeholder="Search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" aria-label="Search">
                <FaSearch />
              </button>
            </form>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;