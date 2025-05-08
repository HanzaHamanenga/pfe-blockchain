import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Icon from './Icon.png';

const Footer = () => {
  return (
    <div>
      <footer>
        <div className='footer'>
          <div className='company'>
            <img src={Icon} alt="logo" />
            <span>Documents Certification With Blockchain Technology</span>
            <p>c/o Atlas Waves Solutions SARL
              24 Rue des Palmiers, Hay Salam, 80000 Agadir, Morocco</p>
            <h3>Follow Us</h3>
            <div className='social-Icons'>
              <a href="https://www.facebook.com/Elijah Ndyanga" target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
              <a href="https://www.instagram.com/Elijah Ndyanga" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="https://www.twitter.com/Elijah Ndyanga" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
              <a href="https://www.youtube.com/Elijah Ndyanga" target="_blank" rel="noopener noreferrer">
                <FaYoutube />
              </a>
            </div>
          </div>
          <div className='tmenu'>
            <h3>Company</h3>
            <Link to="/">Home</Link>
            <Link to="/features" >Features</Link>
            <Link to="/about-us" >About Us</Link>
            <Link to="/contact-us">Contact Us</Link>

          </div>
          <div className='links'>
            <h3>Quick Links</h3>
            <Link to="/about-us" >Privacy Policy</Link>
            <Link to="/contact-us">Terms of Use</Link>
            <Link to="/about-us" >FAQs</Link>


          </div>
          <hr />
          <div className='copy-right'>
            <p>{new Date().getFullYear()} CopyRight {'\u00A9'} .Documents Certification With Blockchain Technology </p>

          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer;
