import React from 'react'
import { Link, Links } from 'react-router-dom'
import './navbar.css';

function navbar() {
  return (
    
     <nav>
            <ul>
                <li><Link to = "/">Homa</Link></li>
                <li><Link to = "/Verify">Verify</Link></li>
                <li><Link to = "/Admin">Admin</Link></li>
            </ul>
    </nav>
    
  )
}

export default navbar