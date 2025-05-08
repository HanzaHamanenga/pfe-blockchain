import React from 'react'
import NavBar from './NavBar'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import './Layout.css'


const Layout = () => {
  return (
    <div className='layout'>
        <NavBar />
        <Outlet />
        <ToastContainer />
      
    </div>
  )
}

export default Layout;
