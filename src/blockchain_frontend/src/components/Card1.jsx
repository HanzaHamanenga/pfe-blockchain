import React from 'react'
import { FaCheck, FaFile, FaShare, FaUpload } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Card1.css';


const Card1 = () => {
  return (
    <div className='card1'>
      <h1>How it works</h1>
      <div className='card1-grid'>


        <div className='upload'>
          <Link to='/card0'>
            <FaUpload />
            <span>Upload</span>
          </Link>
          <br />
          <p>documents to our blockchain system using the authenticity admin account.</p>

        </div>

        <div className='issue'>
          <Link to='/card0'>
            <FaFile />
            <span>Issue</span>
          </Link>
          <br />
          <p>a copy of uploaded document to a recipient.</p>

        </div>

        <div className='verify'>
          <Link to='/card0'>
            <FaShare />
            <span>Share</span>
          </Link>
          <br />
          <p>Recipients can share the document with other parties as needed.</p>

        </div>

        <div className='share'>
          <Link to='/card0'>
            <FaCheck />
            <span>Verify</span>
          </Link>
          <br />
          <p>Verification can be done instantly through the issuer’s website by anyone with a valid digital copy.</p>

        </div>

      </div>
    </div>
  )
}

export default Card1;
